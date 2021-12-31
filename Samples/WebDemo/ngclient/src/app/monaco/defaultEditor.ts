import { CompletionItemKind, CompletionTriggerKind, DiagnosticSeverity } from "vscode-languageserver-protocol";

export const editorFontFamily = "'Menlo', 'Consolas', monospace,sans-serif";
export const editorFontSize = 14;

/** The default option configuration that we use for all the Monaco code editors inside PowerFx. */
export const defaultEditorOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
//monaco.editor.IEditorConstructionOptions & monaco.editor.IGlobalEditorOptions = {
  fontSize: editorFontSize,
  lineDecorationsWidth: 4,
  scrollbar: {
    vertical: 'auto',
    verticalScrollbarSize: 8,
    horizontal: 'auto',
    horizontalScrollbarSize: 8
  },
  // This fixes the first time render bug, and handles additional resizes.
  automaticLayout: true,
  contextmenu: false,
  // Don't show a border above and below the current line in the editor.
  renderLineHighlight: 'none',
  lineNumbers: 'off',
  wordWrap: 'on',
  autoClosingBrackets: 'never',
  quickSuggestions: true,
  scrollBeyondLastLine: false,
  // Don't show the minimap (the scaled down thumbnail view of the code)
  minimap: { enabled: false },
  selectionClipboard: false,
  // Don't add a margin on the left to render special editor symbols
  glyphMargin: false,
  revealHorizontalRightPadding: 24,
  find: {
    seedSearchStringFromSelection: 'never',
    autoFindInSelection: 'never'
  },
  suggestOnTriggerCharacters: true,
  codeLens: false,
  // Don't allow the user to collapse the curly brace sections
  folding: false,
  formatOnType: true,
  fontFamily: editorFontFamily,
  wordBasedSuggestions: false,
  // This option helps to fix some of the overflow issues when using the suggestion widget in grid rows
  // NOTE: This doesn't work when it's hosted inside Fluent Callout control
  // More details in https://github.com/microsoft/monaco-editor/issues/2503
  fixedOverflowWidgets: true,
  language: 'powerfx'
};



export const _getCompletionTriggerKind = (
  kind: monaco.languages.CompletionTriggerKind
): CompletionTriggerKind => {
  switch (kind) {
    case monaco.languages.CompletionTriggerKind.Invoke:
      return CompletionTriggerKind.Invoked;
    case monaco.languages.CompletionTriggerKind.TriggerCharacter:
      return CompletionTriggerKind.TriggerCharacter;
    case monaco.languages.CompletionTriggerKind.TriggerForIncompleteCompletions:
      return CompletionTriggerKind.TriggerForIncompleteCompletions;
    default:
      throw new Error('Unknown trigger kind!');
  }
};

export const _getCompletionKind = (kind?: CompletionItemKind): monaco.languages.CompletionItemKind => {
  switch (kind) {
    case CompletionItemKind.Text:
      return monaco.languages.CompletionItemKind.Text;
    case CompletionItemKind.Method:
      return monaco.languages.CompletionItemKind.Method;
    case CompletionItemKind.Function:
      return monaco.languages.CompletionItemKind.Function;
    case CompletionItemKind.Constructor:
      return monaco.languages.CompletionItemKind.Constructor;
    case CompletionItemKind.Field:
      return monaco.languages.CompletionItemKind.Field;
    case CompletionItemKind.Variable:
      return monaco.languages.CompletionItemKind.Variable;
    case CompletionItemKind.Class:
      return monaco.languages.CompletionItemKind.Class;
    case CompletionItemKind.Interface:
      return monaco.languages.CompletionItemKind.Interface;
    case CompletionItemKind.Module:
      return monaco.languages.CompletionItemKind.Module;
    case CompletionItemKind.Property:
      return monaco.languages.CompletionItemKind.Property;
    case CompletionItemKind.Unit:
      return monaco.languages.CompletionItemKind.Unit;
    case CompletionItemKind.Value:
      return monaco.languages.CompletionItemKind.Value;
    case CompletionItemKind.Enum:
      return monaco.languages.CompletionItemKind.Enum;
    case CompletionItemKind.Keyword:
      return monaco.languages.CompletionItemKind.Keyword;
    case CompletionItemKind.Snippet:
      return monaco.languages.CompletionItemKind.Snippet;
    case CompletionItemKind.Color:
      return monaco.languages.CompletionItemKind.Color;
    case CompletionItemKind.File:
      return monaco.languages.CompletionItemKind.File;
    case CompletionItemKind.Reference:
      return monaco.languages.CompletionItemKind.Reference;
    case CompletionItemKind.Folder:
      return monaco.languages.CompletionItemKind.Folder;
    case CompletionItemKind.EnumMember:
      return monaco.languages.CompletionItemKind.EnumMember;
    case CompletionItemKind.Constant:
      return monaco.languages.CompletionItemKind.Constant;
    case CompletionItemKind.Struct:
      return monaco.languages.CompletionItemKind.Struct;
    case CompletionItemKind.Event:
      return monaco.languages.CompletionItemKind.Event;
    case CompletionItemKind.Operator:
      return monaco.languages.CompletionItemKind.Operator;
    case CompletionItemKind.TypeParameter:
      return monaco.languages.CompletionItemKind.TypeParameter;
    default:
      return monaco.languages.CompletionItemKind.Method;
  }
};

export const _getMarkerSeverity = (severity?: DiagnosticSeverity): monaco.MarkerSeverity => {
  switch (severity) {
    case DiagnosticSeverity.Error:
      return monaco.MarkerSeverity.Error;
    case DiagnosticSeverity.Hint:
      return monaco.MarkerSeverity.Hint;
    case DiagnosticSeverity.Information:
      return monaco.MarkerSeverity.Info;
    case DiagnosticSeverity.Warning:
      return monaco.MarkerSeverity.Warning;
    default:
      return monaco.MarkerSeverity.Error;
  }
};
