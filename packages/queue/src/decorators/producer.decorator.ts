import {inject} from '@loopback/core';
import {producerKey} from '../sqskeys';

export function producer(topic: string) {
  // if (exists)
  return inject(producerKey(topic), {optional: true});

  // Return a no-op decorator if exists is false
  // return inject(producerKey('Transformed'), {optional: true});
}
