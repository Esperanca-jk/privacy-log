import test from 'node:test';
import assert from 'node:assert/strict';
import { redactLog } from '../src/redact.js';

test('masks bearer and basic authorization values', () => {
  assert.equal(redactLog('Authorization: Bearer abc.123-X'), 'Authorization: Bearer [REDACTED]');
  assert.equal(redactLog('Authorization: Basic dXNlcjpwYXNz'), 'Authorization: Basic [REDACTED]');
});
test('masks common assignment names', () => {
  const value = redactLog('api_key=abcd token: xyz password="hello there"');
  assert.equal(value, 'api_key=[REDACTED] token: [REDACTED] password="[REDACTED]"');
});
test('preserves JSON-style quoted fields', () => {
  const result = redactLog('{"token":"abc","message":"ok"}');
  assert.deepEqual(JSON.parse(result), { token: '[REDACTED]', message: 'ok' });
});
test('masks email and international phone numbers', () => {
  assert.equal(redactLog('test@example.com +905321234567'), '[REDACTED] [REDACTED]');
});
test('honors optional categories', () => {
  assert.equal(redactLog('test@example.com +905321234567', { emails: false, phones: false }), 'test@example.com +905321234567');
});
test('leaves ordinary diagnostics untouched', () => {
  assert.equal(redactLog('status=200 elapsed=45ms trace_id=a123'), 'status=200 elapsed=45ms trace_id=a123');
});
test('rejects non-string input', () => {
  assert.throws(() => redactLog(null), /Expected text/);
});
