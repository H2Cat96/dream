import test from 'node:test';
import assert from 'node:assert/strict';

import { DEFAULT_DREAM_IMAGE_SRC, DEFAULT_PARTICLE_PARAMS } from '../src/defaultDreamScene';

test('uses the jellyfish dream image by default', () => {
  assert.equal(DEFAULT_DREAM_IMAGE_SRC, '/dream-jellyfish.jpg');
});

test('starts particle size at 4.6', () => {
  assert.equal(DEFAULT_PARTICLE_PARAMS.size, 4.6);
});
