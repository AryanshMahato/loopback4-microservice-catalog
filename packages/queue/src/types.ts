/**
 * Interface defining the component's options object
 */
export interface MessageBusQueueConnectorsComponentOptions {
  // Add the definitions here
}

/**
 * Default options for the component
 */
export const DEFAULT_MESSAGE_BUS_QUEUE_CONNECTORS_OPTIONS: MessageBusQueueConnectorsComponentOptions =
  {
    // Specify the values here
  };

export interface IStreamDefinition {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  messages: Record<string, any>;
}
