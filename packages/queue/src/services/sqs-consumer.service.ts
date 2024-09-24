import {AnyObject} from '@loopback/repository';
import {extensionPoint, extensions, Getter, inject} from '@loopback/core';
import {
  EventsInStream,
  IConsumer,
  IStreamDefinitionSQS,
  SqsConfig,
} from '../sqstypes';
import {ConsumerExtensionPoint, SqsClientBindings} from '../sqskeys';
import {
  ReceiveMessageCommand,
  DeleteMessageCommand,
  SQSClient,
} from '@aws-sdk/client-sqs';
import {ILogger, LOGGER} from '@sourceloop/core';
import {ErrorKeys} from '../error-keys';

@extensionPoint(ConsumerExtensionPoint.key)
/* It creates an SQS consumer client, polls messages from the queue, 
and processes them using registered consumers */
export class SqsConsumerService<T extends IStreamDefinitionSQS> {
  private isPolling = true;

  constructor(
    @extensions()
    private getConsumers: Getter<IConsumer<T, keyof T['messages']>[]>,
    @inject(SqsClientBindings.SqsClient)
    private client: SqsConfig,
    @inject(LOGGER.LOGGER_INJECT) private readonly logger: ILogger,
    private clientsqs = new SQSClient({}),
  ) {}

  async consume(): Promise<void> {
    const consumers = await this.getConsumers();
    const consumerMap = new Map<
      EventsInStream<T>,
      IConsumer<T, EventsInStream<T>>
    >();

    for (const consumer of consumers) {
      if (!consumer.event) {
        throw new Error(
          `${ErrorKeys.ConsumerWithoutEventType}: ${JSON.stringify(consumer)}`,
        );
      }
      consumerMap.set(consumer.event, consumer);
    }

    // eslint-disable-next-line no-void
    void this.pollMessages(consumerMap);
  }

  private async pollMessages(
    consumerMap: Map<EventsInStream<T>, IConsumer<T, EventsInStream<T>>>,
  ): Promise<void> {
    while (this.isPolling) {
      try {
        const data = await this.clientsqs.send(
          new ReceiveMessageCommand({
            QueueUrl: this.client.queueUrl,
            MaxNumberOfMessages: this.client.maxNumberOfMessages, // Adjust based on your needs
            WaitTimeSeconds: this.client.waitTimeSeconds,
          }),
        );

        if (data.Messages) {
          const messagePromises = data.Messages.map(
            async (message: AnyObject) => {
              if (message.Body) {
                const parsedMessage = JSON.parse(message.Body);
                const consumer = consumerMap.get(parsedMessage.event);
                if (consumer) {
                  await consumer.handler(parsedMessage.data);
                  // Delete the message after successful processing
                  await this.clientsqs.send(
                    new DeleteMessageCommand({
                      QueueUrl: this.client.queueUrl,
                      ReceiptHandle: message.ReceiptHandle,
                    }),
                  );
                } else {
                  this.logger.warn(
                    `${ErrorKeys.UnhandledEvent}: ${JSON.stringify(message)}`,
                  );
                }
              }
            },
          );

          // Process all messages concurrently
          await Promise.all(messagePromises);
        }
      } catch (e) {
        this.logger.error(`${ErrorKeys.PollingFailed}: ${JSON.stringify(e)}`);
      }
    }
  }

  async stop() {
    this.isPolling = false;
  }
}
