#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { stdin, stdout, stderr } from 'node:process';
import { redactLog } from './redact.js';

const args = process.argv.slice(2);
const usage = 'Usage: node src/cli.js [file.log|-] [--no-email] [--no-phone]';
if (args.includes('--help') || args.includes('-h')) {
  console.log(usage);
} else {
  const flags = new Set(['--no-email', '--no-phone']);
  const files = args.filter(arg => !arg.startsWith('--'));
  if (files.length > 1 || args.some(arg => arg.startsWith('--') && !flags.has(arg))) {
    console.error(usage);
    process.exitCode = 2;
  } else {
    try {
      let source;
      if (!files.length || files[0] === '-') {
        const chunks = [];
        for await (const chunk of stdin) chunks.push(chunk);
        source = Buffer.concat(chunks).toString('utf8');
      } else {
        source = await readFile(files[0], 'utf8');
      }
      stdout.write(redactLog(source, {
        emails: !args.includes('--no-email'),
        phones: !args.includes('--no-phone')
      }));
    } catch (error) {
      stderr.write('Unable to redact log: ' + error.message + '\n');
      process.exitCode = 2;
    }
  }
}
