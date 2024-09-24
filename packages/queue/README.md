# message-bus-queue-connectors
This is the package for  message bus and queue connectors. SQS connector implementation is done here. 

[![LoopBack](https://github.com/loopbackio/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png)](http://loopback.io/)

## Installation

Install MessageBusQueueConnectorsComponent using `npm`;

```sh
$ [npm install | yarn add] message-bus-queue-connectors
```

## Basic Use

Configure and load MessageBusQueueConnectorsComponent in the application constructor
as shown below.

```ts
import {MessageBusQueueConnectorsComponent, MessageBusQueueConnectorsComponentOptions, DEFAULT_MESSAGE_BUS_QUEUE_CONNECTORS_OPTIONS} from 'message-bus-queue-connectors';
// ...
export class MyApplication extends BootMixin(ServiceMixin(RepositoryMixin(RestApplication))) {
  constructor(options: ApplicationConfig = {}) {
    const opts: MessageBusQueueConnectorsComponentOptions = DEFAULT_MESSAGE_BUS_QUEUE_CONNECTORS_OPTIONS;
    this.configure(MessageBusQueueConnectorsComponentBindings.COMPONENT).to(opts);
      // Put the configuration options here
    });
    this.component(MessageBusQueueConnectorsComponent);
    // ...
  }
  // ...
}
```
