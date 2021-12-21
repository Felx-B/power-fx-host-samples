/*!
 * Copyright (C) Microsoft Corporation. All rights reserved.
 */

import * as React from 'react';

import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';

import { PowerFxFormulaEditor } from './PowerFxFormulaEditor';
import { oneLineHeight, PowerFxFormulaEditorProps } from './PowerFxFormulaEditor.types';
import { PowerFxLanguageClient } from './PowerFxLanguageClient';

/**
 * PowerFxFormulaEditorWithInitialFixup uses a custom LSP to fix the initial formula value
 * E.g. Converting logical name to display name for formula in Dataverse
 */
export const PowerFxFormulaEditorWithInitialFixup: React.FunctionComponent<PowerFxFormulaEditorProps> = (
  props: PowerFxFormulaEditorProps
) => {
  const { messageProcessor, getDocumentUriAsync, defaultValue } = props;

  // When formula is empty, don't need to do anything, it's already initialized
  const [isInitialized, setIsInitialized] = React.useState(!defaultValue);
  const [newValue, setNewValue] = React.useState(defaultValue);

  React.useEffect(() => {
    if (isInitialized) {
      return;
    }

    let isCancelled = false;

    const languageClient = new PowerFxLanguageClient(
      getDocumentUriAsync,
      messageProcessor.sendAsync,
      () => null,
      () => null
    );

    const listenerDisposable = messageProcessor.addListener((payload: string): void => {
      languageClient.onDataReceivedFromLanguageServer(payload);
    });

    languageClient
      .requestInitialFixupAsync(defaultValue)
      .then(result => {
        if (!isCancelled) {
          setNewValue(result);
        }
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.warn(error);
        // When error happens, it's ok. No fix-up will be done, original expression will be used
      })
      .finally(() => {
        if (!isCancelled) {
          setIsInitialized(true);
        }

        listenerDisposable.dispose();
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  if (!isInitialized) {
    const height = props.minLineCount * oneLineHeight;
    return <Spinner size={SpinnerSize.large} styles={{ root: { width: '100%', height } }} />;
  }

  return <PowerFxFormulaEditor {...props} defaultValue={newValue} />;
};
