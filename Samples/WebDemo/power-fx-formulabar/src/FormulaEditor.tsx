/*!
 * Copyright (C) Microsoft Corporation. All rights reserved.
 */

import { styled } from '@fluentui/react/lib/Utilities';

import { FormulaEditorBase } from './FormulaEditor.base';
import { getStyles } from './FormulaEditor.styles';
import { FormulaEditorProps, FormulaEditorStyleProps, FormulaEditorStyles } from './FormulaEditor.types';

export const FormulaEditor: React.SFC<FormulaEditorProps> = styled<
  FormulaEditorProps,
  FormulaEditorStyleProps,
  FormulaEditorStyles
>(FormulaEditorBase, getStyles);
