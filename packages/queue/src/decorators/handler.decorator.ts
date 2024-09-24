import {inject} from '@loopback/core';
import {eventHandlerKey} from '../sqskeys';
import {IStreamDefinitionSQS} from '../sqstypes';

export function eventHandler<Stream extends IStreamDefinitionSQS>(
  event: keyof Stream['messages'],
) {
  return inject(eventHandlerKey<Stream, typeof event>(event));
}
