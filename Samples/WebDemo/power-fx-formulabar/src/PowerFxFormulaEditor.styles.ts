/*!
 * Copyright (C) Microsoft Corporation. All rights reserved.
 */

import { PowerFxFormulaEditorStyleProps, PowerFxFormulaEditorStyles } from './PowerFxFormulaEditor.types';

export function getStyles(props: PowerFxFormulaEditorStyleProps): PowerFxFormulaEditorStyles {
  const {
    theme: { fonts },
    showExpandEditorButton
  } = props;

  return {
    root: {
      border: '0',
      display: 'flex',
      width: '100%'
    },
    formulaEditor: {
      width: `calc(100% - ${showExpandEditorButton ? 35 : 0}px)`
    },
    subComponentStyles: {
      expandEditorIcon: {
        root: {
          fontSize: fonts?.xLarge.fontSize,
          width: 35
        }
      }
    }
  };
}
