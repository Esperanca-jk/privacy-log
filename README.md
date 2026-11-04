# privacy-log

A tiny, dependency-free local log redactor. Removes common secret assignments, Authorization credentials, email addresses, and international-format phone numbers before sharing diagnostic logs.

## Quick start

Node.js 20+.

```bash
git clone https://github.com/Esperanca-jk/privacy-log.git
cd privacy-log
node src/cli.js examples/application.log
cat examples/application.log | node src/cli.js -
node src/cli.js examples/application.log --no-email --no-phone
npm test
```

The command writes sanitized text to **stdout**, so you can redirect it to a new file. It does not modify the original log.

## Detection

- `Authorization: Bearer ...` and `Authorization: Basic ...`
- `password`, `api_key`, `token`, `access_token`, `refresh_token`, `client_secret`, and related assignment names
- Email addresses
- Phone numbers with explicit `+` international prefixes

Values become `[REDACTED]`. This is **best-effort pattern matching**. Custom secrets, nested structured content, stack traces, and unusual formats may still contain sensitive data. Do not use it as the sole data-loss prevention boundary; inspect output before publishing it. Rotate any credentials that have already leaked.

## Design choices

No dependencies, remote requests, persistence, or GitHub Actions workflows. Suitable for local debugging or integration into an existing pipeline.

## Contributing

Add a redacted fixture and a regression test for each new pattern. Never open issues with real secrets. See [CONTRIBUTING.md](CONTRIBUTING.md).

[MIT License](LICENSE).
