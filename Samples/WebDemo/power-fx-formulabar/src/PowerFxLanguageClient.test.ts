/*!
 * Copyright (C) Microsoft Corporation. All rights reserved.
 */

import 'jest';

import { PowerFxLanguageClient } from './PowerFxLanguageClient';

it('verify notifyDidOpen payload', async () => {
  let sendToLanguageServerPayload: string = '';
  const client = new PowerFxLanguageClient(
    async (): Promise<string> => 'powerfx://test?a=notifyDidOpen',
    async (payload: string): Promise<void> => {
      sendToLanguageServerPayload = payload;
    },
    (): void => {
      // do nothing
    },
    (): void => {
      // do nothing
    }
  );

  await client.notifyDidOpenAsync('Formula');

  const json = JSON.parse(sendToLanguageServerPayload);
  expect(json.params.textDocument.uri).toBe('powerfx://test?a=notifyDidOpen&getTokensFlags=3');
  expect(json.params.textDocument.text).toBe('Formula');
});

it('verify notifyDidChange payload', async () => {
  let sendToLanguageServerPayload: string = '';
  const client = new PowerFxLanguageClient(
    async (): Promise<string> => 'powerfx://test?a=notifyDidChange',
    async (payload: string): Promise<void> => {
      sendToLanguageServerPayload = payload;
    },
    (): void => {
      // do nothing
    },
    (): void => {
      // do nothing
    }
  );

  await client.notifyDidChangeAsync('Formula', 2);

  const json = JSON.parse(sendToLanguageServerPayload);
  expect(json.params.textDocument.uri).toBe('powerfx://test?a=notifyDidChange&getTokensFlags=1');
  expect(json.params.textDocument.version).toBe(2);
  expect(json.params.contentChanges.length).toBe(1);
  expect(json.params.contentChanges[0].text).toBe('Formula');
});
