/*!
 * Copyright (C) Microsoft Corporation. All rights reserved.
 */

import 'jest';

import * as Enzyme from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';

import { PowerFxFormulaEditorWithInitialFixup } from './PowerFxFormulaEditorWithInitialFixup';
import { IDisposable } from './PowerFxFormulaEditor.types';

const messageProcessor = {
  addListener: (listener: (data: string) => void): IDisposable => {
    return {
      dispose: () => null
    };
  },
  sendAsync: async (data: string): Promise<void> => {
    // do nothing
  }
};

it('basic test', () => {
  const element = Enzyme.shallow(
    <PowerFxFormulaEditorWithInitialFixup
      getDocumentUriAsync={async () => 'powerfx://demo?a=1&b=2'}
      defaultValue={''}
      messageProcessor={messageProcessor}
      maxLineCount={1}
      minLineCount={1}
      editorFocusOnMount={true}
    />
  );
  expect(toJson(element)).toMatchSnapshot();
});

it('with monacoEditorOptions test', () => {
  const element = Enzyme.shallow(
    <PowerFxFormulaEditorWithInitialFixup
      getDocumentUriAsync={async () => 'powerfx://demo?a=1&b=2'}
      defaultValue={''}
      monacoEditorOptions={{
        fontSize: 35,
        fixedOverflowWidgets: false
      }}
      messageProcessor={messageProcessor}
      maxLineCount={1}
      minLineCount={1}
      editorFocusOnMount={true}
    />
  );
  expect(toJson(element)).toMatchSnapshot();
});
