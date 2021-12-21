/*!
 * Copyright (C) Microsoft Corporation. All rights reserved.
 */

import { styled } from '@fluentui/react/lib/Utilities';
import * as React from 'react';

import { PowerFxFormulaEditorBase } from './PowerFxFormulaEditor.base';
import { getStyles } from './PowerFxFormulaEditor.styles';
import {
  PowerFxFormulaEditorProps,
  PowerFxFormulaEditorStyleProps,
  PowerFxFormulaEditorStyles
} from './PowerFxFormulaEditor.types';

export const PowerFxFormulaEditor: React.SFC<PowerFxFormulaEditorProps> = styled<
  PowerFxFormulaEditorProps,
  PowerFxFormulaEditorStyleProps,
  PowerFxFormulaEditorStyles
>(PowerFxFormulaEditorBase, getStyles);
