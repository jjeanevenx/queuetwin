/**
 * QueueTwin v0.1 is a deterministic, technology-neutral teaching model.
 * It is NOT a faithful or complete AWS SNS/SQS/Kafka implementation.
 * No real messages, infrastructure, or cloud credentials are involved.
 */

export const DEFAULT_SCENARIO = Object.freeze({
  name: 'Basic retry and DLQ',
  messageCount: 10,
  maxAttempts: 3,
  failureProbability: 15,
  duplicateProbability: 10,
  seed: 42,
});

const MAX_MESSAGES = 1_000;

function integerInRange(value, field, min, max) {
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new RangeError(`${field} must be an integer between ${min} and ${max}`);
  }
  return value;
}

/** Normalize a scenario without interpreting invalid or missing data as success. */
export function validateScenario(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new TypeError('Scenario must be a JSON object');
  }
  const s = { ...DEFAULT_SCENARIO, ...input };
  if (typeof s.name !== 'string' || s.name.length < 1 || s.name.length > 120) {
    throw new RangeError('name must contain 1 to 120 characters');
  }
  return {
    name: s.name,
    messageCount: integerInRange(s.messageCount, 'messageCount', 1, MAX_MESSAGES),
    maxAttempts: integerInRange(s.maxAttempts, 'maxAttempts', 1, 10),
    failureProbability: integerInRange(s.failureProbability, 'failureProbability', 0, 100),
    duplicateProbability: integerInRange(s.duplicateProbability, 'duplicateProbability', 0, 100),
    seed: integerInRange(s.seed, 'seed', 0, 0xffffffff),
  };
}

/** Mulberry32 PRNG for reproducible simulation—not cryptographic randomness. */
function seededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let x = state;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Each logical message is published once. At most one duplicate delivery copy
 * may be created in this initial model. Each copy succeeds or eventually
 * reaches the DLQ after maxAttempts. Retries are immediate logical steps.
 *
 * metrics.delivered counts successful *copies*, not unique logical messages.
 * metrics.uniqueDelivered counts distinct logical IDs delivered at least once.
 * No implicit idempotency or ordering is assumed.
 */
export function simulate(input = DEFAULT_SCENARIO) {
  const scenario = validateScenario(input);
  const random = seededRandom(scenario.seed);
  const trace = [];
  const uniqueDeliveredIds = new Set();
  const metrics = {
    published: 0,
    enqueued: 0,
    duplicateCopies: 0,
    attempts: 0,
    delivered: 0,
    uniqueDelivered: 0,
    failedAttempts: 0,
    retriesScheduled: 0,
    deadLettered: 0,
  };
  let tick = 0;
  const record = (kind, messageId, copy, attempt, outcome, description) => {
    trace.push({
      sequence: ++tick,
      timeMs: (tick - 1) * 12,
      kind,
      messageId,
      copy,
      attempt,
      outcome,
      description,
    });
  };

  for (let index = 1; index <= scenario.messageCount; index++) {
    const id = `m-${String(index).padStart(3, '0')}`;
    metrics.published++;
    record('published', id, 1, 0, 'accepted', `Publish ${id} to topic`);
    metrics.enqueued++;
    record('enqueued', id, 1, 0, 'enqueued', `Enqueue ${id} to queue`);

    const copies = random() * 100 < scenario.duplicateProbability ? 2 : 1;
    if (copies === 2) {
      metrics.duplicateCopies++;
      metrics.enqueued++;
      record('duplicate', id, 2, 0, 'duplicated', `Enqueue duplicate copy of ${id}`);
    }

    for (let copy = 1; copy <= copies; copy++) {
      for (let attempt = 1; attempt <= scenario.maxAttempts; attempt++) {
        metrics.attempts++;
        const failed = random() * 100 < scenario.failureProbability;
        if (!failed) {
          metrics.delivered++;
          uniqueDeliveredIds.add(id);
          record('processed', id, copy, attempt, 'delivered', `Process ${id} (copy ${copy}, attempt ${attempt})`);
          break;
        }

        metrics.failedAttempts++;
        record('processed', id, copy, attempt, 'failed', `Process ${id} (copy ${copy}, attempt ${attempt})`);
        if (attempt < scenario.maxAttempts) {
          metrics.retriesScheduled++;
          record('retry', id, copy, attempt + 1, 'retry', `Schedule retry for ${id} (copy ${copy})`);
        } else {
          metrics.deadLettered++;
          record('dead-letter', id, copy, attempt, 'dead-lettered', `Move ${id} (copy ${copy}) to DLQ`);
        }
      }
    }
  }
  metrics.uniqueDelivered = uniqueDeliveredIds.size;

  return {
    modelVersion: '0.1.0',
    scenario,
    metrics,
    trace,
    assumptions: [
      'Technology-neutral event flow; not a substitute for AWS or Kafka integration tests.',
      'At most one duplicate copy per logical message; no FIFO ordering model.',
      'Retries are immediate logical steps; no visibility timeout or retry backoff.',
      'Delivery is counted per copy. Idempotency is not automatically enforced.',
    ],
  };
}
