import {
  inject,
  lifeCycleObserver,
  LifeCycleObserver,
  service,
} from '@loopback/core';
import {ILogger, LOGGER} from '@sourceloop/core';
import {SqsConsumerService} from '../services';
import {IStreamDefinitionSQS} from '../sqstypes';

/* It's a LifeCycleObserver that starts the SqsConsumerService
 when the application starts and stops
it when the application stops */
@lifeCycleObserver()
export class SQSObserver<T extends IStreamDefinitionSQS>
  implements LifeCycleObserver
{
  constructor(
    @inject(LOGGER.LOGGER_INJECT) private readonly logger: ILogger,
    @service(SqsConsumerService) private consumer: SqsConsumerService<T>,
  ) {}

  async start(): Promise<void> {
    await this.consumer.consume();
    this.logger.debug('SQS Observer has started.');
  }

  async stop(): Promise<void> {
    await this.consumer.stop();
    this.logger.debug('SQS Observer has stopped!');
  }
}
