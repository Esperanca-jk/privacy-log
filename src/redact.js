const MASK = '[REDACTED]';

export function redactLog(input, options = {}) {
  if (typeof input !== 'string') throw new TypeError('Expected text input');
  const { emails = true, phones = true } = options;
  let output = input;

  // Authentication schemes in HTTP headers and log messages.
  output = output.replace(
    /(\bAuthorization\s*:\s*(?:Bearer|Basic)\s+)[A-Za-z0-9._~+\/-]+=*/gi,
    (_match, prefix) => prefix + MASK
  );

  // Simple KEY=value, key: value and quoted JSON-style key/value patterns.
  output = output.replace(
    /((?:["']?)(?:password|passwd|pwd|api[_-]?key|access[_-]?token|refresh[_-]?token|secret|client[_-]?secret|token)(?:["']?)\s*[:=]\s*)("[^"\r\n]*"|'[^'\r\n]*'|[^\s,;}\]]+)/gi,
    (_match, prefix, value) => {
      const quote = value[0] === '"' || value[0] === "'" ? value[0] : '';
      return prefix + (quote ? quote + MASK + quote : MASK);
    }
  );

  if (emails) {
    output = output.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, MASK);
  }
  if (phones) {
    // Only explicit international numbers; avoids changing timestamps/IDs.
    output = output.replace(/(?<![\w+])\+[1-9]\d{7,14}(?!\d)/g, MASK);
  }
  return output;
}
