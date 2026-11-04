import assert from 'node:assert/strict';
import test from 'node:test';
import { DEFAULT_SCENARIO, simulate, validateScenario } from '../packages/simulator/src/index.mjs';

test('same seed and settings produce exactly the same trace', () => {
  assert.deepEqual(simulate(DEFAULT_SCENARIO), simulate(DEFAULT_SCENARIO));
});

test('zero failure and duplication deliver every logical message exactly once', () => {
  const { metrics, trace } = simulate({ messageCount: 7, failureProbability: 0, duplicateProbability: 0 });
  assert.equal(metrics.published, 7);
  assert.equal(metrics.enqueued, 7);
  assert.equal(metrics.attempts, 7);
  assert.equal(metrics.delivered, 7);
  assert.equal(metrics.uniqueDelivered, 7);
  assert.equal(metrics.deadLettered, 0);
  assert.equal(trace.filter((e) => e.kind === 'processed').length, 7);
});

test('100% failures with three attempts send every copy to DLQ', () => {
  const { metrics } = simulate({ messageCount: 4, maxAttempts: 3, failureProbability: 100, duplicateProbability: 0 });
  assert.equal(metrics.attempts, 12);
  assert.equal(metrics.retriesScheduled, 8);
  assert.equal(metrics.deadLettered, 4);
  assert.equal(metrics.delivered, 0);
});

test('100% duplication creates two deliveries per message without idempotency', () => {
  const { metrics } = simulate({ messageCount: 4, maxAttempts: 1, failureProbability: 0, duplicateProbability: 100 });
  assert.equal(metrics.duplicateCopies, 4);
  assert.equal(metrics.enqueued, 8);
  assert.equal(metrics.delivered, 8);
  assert.equal(metrics.uniqueDelivered, 4);
});

test('accounting invariant holds across different seeds and probabilities', () => {
  for (const seed of [0, 42, 123456, 0xffffffff]) {
    for (const failureProbability of [0, 15, 60, 100]) {
      const { metrics } = simulate({ seed, messageCount: 40, failureProbability, duplicateProbability: 35 });
      assert.equal(metrics.enqueued, metrics.delivered + metrics.deadLettered);
      assert.equal(metrics.attempts, metrics.delivered + metrics.failedAttempts);
      assert.equal(metrics.failedAttempts, metrics.retriesScheduled + metrics.deadLettered);
      assert.ok(metrics.uniqueDelivered <= metrics.published);
    }
  }
});

test('rejects malformed configuration and out-of-range values', () => {
  assert.throws(() => validateScenario(null), TypeError);
  assert.throws(() => validateScenario({ messageCount: 0 }), RangeError);
  assert.throws(() => validateScenario({ messageCount: 1001 }), RangeError);
  assert.throws(() => validateScenario({ failureProbability: 101 }), RangeError);
  assert.throws(() => validateScenario({ maxAttempts: -1 }), RangeError);
  assert.throws(() => validateScenario({ seed: 1.4 }), RangeError);
});
