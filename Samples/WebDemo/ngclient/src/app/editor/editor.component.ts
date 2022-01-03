import {
  EventEmitter,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  NuMonacoEditorComponent,
  NuMonacoEditorEvent,
  NuMonacoEditorModel,
} from '@ng-util/monaco-editor';

import {
  Diagnostic,
  PublishDiagnosticsParams,
} from 'vscode-languageserver-protocol';
import { HttpService } from '../http.service';
import {
  defaultEditorOptions,
  _getCompletionKind,
  _getCompletionTriggerKind,
  _getMarkerSeverity,
} from '../monaco/defaultEditor';
import {
  PowerFxLanguageClient,
  PublishTokensParams,
  TokenResultType,
} from '../monaco/PowerFxLanguageClient';
import {
  addProvidersForModel,
  ensureLanguageRegistered,
} from '../monaco/PowerFxSyntax';
import { HighlightedName, NameKind } from '../monaco/PowerFxSyntaxTypes';
import { ensureThemeSetup } from '../monaco/PowerFxTheme';

// import * as monaco from 'monaco-editor'

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css'],
})
export class EditorComponent {
  @ViewChild('editor')
  public editor?: NuMonacoEditorComponent;

  editorOptions = defaultEditorOptions;
  model?: NuMonacoEditorModel;
  modelMonaco?: monaco.editor.ITextModel | null = null;
  languageClient?: PowerFxLanguageClient;
  _normalizedCompletionLookup: { [lowercase: string]: string } = {};
  private _version: number = 0;
  private _onNamesChanged: (names: HighlightedName[]) => void = () => null;
  @Output()
  public onChange = new EventEmitter<string>();

  constructor(private http: HttpService, private cdr: ChangeDetectorRef) {}

  showEvent(e: NuMonacoEditorEvent) {
    if (e.type === 'init') {
      const modelUri = monaco.Uri.parse('powerfx://demo');

      this.model = {
        language: 'powerfx',
        uri: modelUri,
        value: 'CountRows(Sequence(9))',
      };

      this.cdr.detectChanges();

      const model = monaco.editor.getModel(modelUri);
      this.modelMonaco = model;
      if (!this.modelMonaco) return;


      ensureThemeSetup(monaco);
      ensureLanguageRegistered(monaco, {
        useSemicolons: false,
        highlightedNames: [],
        subscribeToNames: (namesChanged) => {
          this._onNamesChanged = namesChanged;
        },
        getNormalizedCompletionLookup: () => this._normalizedCompletionLookup,
      });

      this.languageClient = new PowerFxLanguageClient(
        async () => 'powerfx://demo',
        async (payload: string) => {
          //TODO send server
          await this.sendAsync(payload);
        },
        (params: PublishDiagnosticsParams): void => {
          if (!monaco || !this.modelMonaco) {
            return;
          }

          const markers = params.diagnostics.map((error: Diagnostic) => {
            const { start, end } = error.range;
            return {
              severity: _getMarkerSeverity(error.severity),
              message: error.message,
              startLineNumber: start.line,
              startColumn: start.character,
              endLineNumber: end.line,
              endColumn: end.character + 1, // end character is included
            };
          });

          monaco.editor.setModelMarkers(this.modelMonaco, '', markers);
        },
        (params: PublishTokensParams): void => {

          if (!monaco || !this.modelMonaco) {
            return;
          }

          const names: HighlightedName[] = [];
          for (const [key, value] of Object.entries(params.tokens)) {
            this._normalizedCompletionLookup[key.toLowerCase()] = key;
            switch (value) {
              case TokenResultType.Function:
                names.push({ name: key, kind: NameKind.Function });
                break;

              case TokenResultType.Variable:
                names.push({ name: key, kind: NameKind.Variable });
                break;

              case TokenResultType.HostSymbol:
                names.push({ name: key, kind: NameKind.HostSymbol });
                break;

              default:
                break;
            }
          }

          this._onNamesChanged?.(names);
        }
      );

      addProvidersForModel(
        this.modelMonaco,
        this.provideCompletionItems,
        this.provideSignatureHelp
      );

      this.languageClient.notifyDidOpenAsync(this.modelMonaco.getValue());

      const monacoEditor = e.editor as monaco.editor.IStandaloneCodeEditor;
      if (!monacoEditor) return;

      this.modelMonaco.onDidChangeContent((e) => {
       const value = this.modelMonaco?.getValue();
        this.onChange.emit(value);
        this.languageClient?.notifyDidChangeAsync(value || "", this._version++);
      });

      // this._disposeEditorSubscriptions();

      // this._subscriptions.push(monacoEditor.onDidBlurEditorWidget(this._onBlur));
      // this._subscriptions.push(monacoEditor.onDidFocusEditorWidget(this._onFocus));
      // this._subscriptions.push(monacoEditor.onDidChangeCursorPosition(this._onDidChangeCursorPosition));
      // this._subscriptions.push(monacoEditor.onKeyDown(this._onKeyDown));
      // this._subscriptions.push(monacoEditor.onKeyUp(this._onKeyUp));
      // this._subscriptions.push(this.modelMonaco.onDidChangeContent(this._onChange));
    }
  }

  private async sendAsync(data: string) {
    // console.log('[LSP Client] Send: ' + data);

    try {
      const result = await this.http.sendDataAsync('lsp', data);
      if (!result.ok) {
        return;
      }

      const response = await result.text();
      if (response) {
        const responseArray = JSON.parse(response);
        responseArray.forEach((item: string) => {
          // console.log('[LSP Client] Receive: ' + item);
          this.languageClient?.onDataReceivedFromLanguageServer(item);
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  private provideCompletionItems = (
    model: monaco.editor.ITextModel,
    position: monaco.Position,
    context: monaco.languages.CompletionContext
  ) =>
    // Note: we call model methods up-front to avoid disposed model issue
    // since there are other async operations inside _provideCompletionAsync
    this._provideCompletionAsync(
      model.getValue(),
      position,
      model.getWordAtPosition(position),
      context.triggerKind,
      context.triggerCharacter
    );

  private _provideCompletionAsync = async (
    currentText: string,
    position: monaco.Position,
    currentWordPosition: monaco.editor.IWordAtPosition | null,
    triggerKind: monaco.languages.CompletionTriggerKind,
    triggerCharacter?: string
  ): Promise<monaco.languages.CompletionList> => {
    // const { lspConfig } = this.props;
    // if (lspConfig?.disableCompletionRequest) {
    //   return { suggestions: [] };
    // }

    const result =
      await this.languageClient?.requestProvideCompletionItemsAsync(
        currentText,
        position.lineNumber - 1,
        position.column - 1,
        _getCompletionTriggerKind(triggerKind),
        triggerCharacter
      );

    if (!result) {
      return { suggestions: [] };
    }

    const range = currentWordPosition
      ? {
          startColumn: currentWordPosition.startColumn,
          endColumn: currentWordPosition.endColumn,
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
        }
      : {
          startColumn: position.column,
          endColumn: position.column,
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
        };

    const suggestions: monaco.languages.CompletionItem[] = result.items.map(
      (item) => {
        const label = item.label;
        this._normalizedCompletionLookup[label.toLowerCase()] = label;
        return {
          label,
          documentation: item.documentation,
          detail: item.detail,
          kind: _getCompletionKind(item.kind),
          range,
          insertText: item.label,
        };
      }
    );

    return {
      incomplete: !currentWordPosition,
      suggestions,
    };
  };

  private provideSignatureHelp = (
    model: monaco.editor.ITextModel,
    position: monaco.Position,
    token: monaco.CancellationToken,
    context: monaco.languages.SignatureHelpContext
  ) => this._provideSignatureHelpAsync(model.getValue(), position, context);

  private _provideSignatureHelpAsync = async (
    currentText: string,
    position: monaco.Position,
    context: monaco.languages.SignatureHelpContext
  ): Promise<monaco.languages.SignatureHelpResult> => {
    const noResult: monaco.languages.SignatureHelpResult = {
      value: {
        signatures: [],
        activeSignature: 0,
        activeParameter: 0,
      },
      dispose: () => {
        return;
      },
    };

    // const { lspConfig } = this.props;
    // if (!lspConfig?.enableSignatureHelpRequest) {
    //   return noResult;
    // }

    const result = await this.languageClient?.requestProvideSignatureHelpAsync(
      currentText,
      position.lineNumber - 1,
      position.column - 1
    );

    if (!result || result.signatures.length === 0) {
      return noResult;
    }

    return {
      value: {
        signatures: result.signatures.map((item) => ({
          label: item.label,
          documentation: item.documentation,
          parameters: item.parameters || [],
          activeParameter: item.activeParameter,
        })),
        activeSignature: result.activeSignature || 0,
        activeParameter: result.activeParameter || 0,
      },
      dispose: () => {
        return;
      },
    };
  };
}
