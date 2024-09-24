import {
  Application,
  injectable,
  Component,
  config,
  ContextTags,
  CoreBindings,
  inject,
  BindingScope,
} from '@loopback/core';
import {MessageBusQueueConnectorsComponentBindings} from './keys';
import {
  DEFAULT_MESSAGE_BUS_QUEUE_CONNECTORS_OPTIONS,
  MessageBusQueueConnectorsComponentOptions,
} from './types';
import {producerKey, SqsClientBindings} from './sqskeys';
import {SqsProducerFactoryProvider} from './providers';
import {SqsConsumerService} from './services';
import {SqsConfig} from './sqstypes';
import {SQSObserver} from './observers';

// Configure the binding for MessageBusQueueConnectorsComponent
@injectable({
  tags: {
    [ContextTags.KEY]: MessageBusQueueConnectorsComponentBindings.COMPONENT,
  },
})
export class MessageBusQueueConnectorsComponent implements Component {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private application: Application,
    @config()
    private options: MessageBusQueueConnectorsComponentOptions = DEFAULT_MESSAGE_BUS_QUEUE_CONNECTORS_OPTIONS,
    @inject(SqsClientBindings.SqsClient)
    private client: SqsConfig,
  ) {
    this.application
      .bind(SqsClientBindings.ProducerFactory)
      .toProvider(SqsProducerFactoryProvider)
      .inScope(BindingScope.SINGLETON);

    this.application.service(SqsConsumerService);

    const producerFactory = this.application.getSync(
      SqsClientBindings.ProducerFactory,
    );

    this.client.topics.forEach(topic => {
      this.application
        .bind(producerKey(topic))
        .to(producerFactory(topic))
        .inScope(BindingScope.SINGLETON);
    });

    this.application.bind(SqsClientBindings.ConsumerConfiguration).to({});
    this.application
      .bind(SqsClientBindings.ProducerFactory)
      .toProvider(SqsProducerFactoryProvider)
      .inScope(BindingScope.SINGLETON);

    this.application.lifeCycleObserver(SQSObserver);
  }
}
