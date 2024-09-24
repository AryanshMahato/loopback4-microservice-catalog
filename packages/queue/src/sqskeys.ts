import {BindingKey, BindingTemplate, extensionFor} from '@loopback/core';
import {SQSClientConfig as AWSSQSClientConfig} from '@aws-sdk/client-sqs';
import {MessageBusQueueConnectorsComponent} from './component';
import {SqsConsumerService} from './services/sqs-consumer.service';
import {
  IStreamDefinitionSQS,
  Producer,
  ProducerFactoryType,
  SqsConfig,
  StreamHandler,
} from './sqstypes';

export const QueueNamespace = 'arc.queue.sqs';

export namespace SqsClientBindings {
  export const Component =
    BindingKey.create<MessageBusQueueConnectorsComponent>(
      `${QueueNamespace}.MessageBusQueueConnectorsComponent`,
    );
  export const ConsumerService = BindingKey.create<
    SqsConsumerService<IStreamDefinitionSQS>
  >(`${QueueNamespace}.SqsConsumerService`);
  export const SqsClient = BindingKey.create<SqsConfig>(
    `${QueueNamespace}.SqsClient`,
  );

  export const SQSClientConfig = BindingKey.create<AWSSQSClientConfig>(
    `${QueueNamespace}.AWSSQSClientConfig`,
  );

  export const ConsumerConfiguration = BindingKey.create<AWSSQSClientConfig>(
    `${QueueNamespace}.ConsumerConfig`,
  );

  export const ProducerFactory = BindingKey.create<
    ProducerFactoryType<IStreamDefinitionSQS>
  >(`${QueueNamespace}.ProducerFactory`);

  export const LifeCycleGroup = `${QueueNamespace}.SQS_OBSERVER_GROUP`;
}

export const producerKey = (topic: string) => {
  return BindingKey.create<Producer<IStreamDefinitionSQS>>(
    `${QueueNamespace}.producer.${topic}`,
  );
};

export const eventHandlerKey = <
  Stream extends IStreamDefinitionSQS,
  K extends keyof Stream['messages'],
>(
  event: K,
) =>
  BindingKey.create<StreamHandler<Stream, K>>(
    `${QueueNamespace}.eventhandler.${event as string}`,
  );

export const ConsumerExtensionPoint = BindingKey.create<
  SqsConsumerService<never>
>(`${QueueNamespace}.ConsumerExtensionPoint`);

export const asConsumer: BindingTemplate = binding => {
  extensionFor(ConsumerExtensionPoint.key)(binding);
  binding.tag({namespace: ConsumerExtensionPoint.key});
};
