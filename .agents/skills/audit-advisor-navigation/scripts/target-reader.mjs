#!/usr/bin/env node
import readline from 'node:readline';
import { createReader, toolDefinitions } from './reader.mjs';
const callTool = createReader(process.argv[2] ?? '.');
const input = readline.createInterface({ input: process.stdin, crlfDelay: Infinity });
input.on('line', line => {
  if (!line.trim()) return;
  let request;
  try {
    request = JSON.parse(line);
    let result;
    if (request.method === 'initialize') result = { protocolVersion: request.params?.protocolVersion ?? '2025-06-18', capabilities: { tools: {} }, serverInfo: { name: 'audit-target-reader', version: '2.0.0' } };
    else if (request.method === 'tools/list') result = { tools: toolDefinitions };
    else if (request.method === 'tools/call') result = callTool(request.params?.name, request.params?.arguments);
    else result = {};
    if (request.id !== undefined) process.stdout.write(`${JSON.stringify({ jsonrpc: '2.0', id: request.id, result })}\n`);
  } catch (error) {
    if (request?.id !== undefined) process.stdout.write(`${JSON.stringify({ jsonrpc: '2.0', id: request.id, error: { code: -32000, message: error.message } })}\n`);
  }
});
