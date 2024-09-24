import {BindingKey, CoreBindings} from '@loopback/core';
import {MessageBusQueueConnectorsComponent} from './component';

/**
 * Binding keys used by this component.
 */
export namespace MessageBusQueueConnectorsComponentBindings {
  export const COMPONENT =
    BindingKey.create<MessageBusQueueConnectorsComponent>(
      `${CoreBindings.COMPONENTS}.MessageBusQueueConnectorsComponent`,
    );
}
