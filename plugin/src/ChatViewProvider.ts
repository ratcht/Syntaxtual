import * as vscode from 'vscode';
import { getWebviewContent } from './ui/template';

interface CodeRange {
  startLine: number;
  startChar: number;
  endLine: number;
  endChar: number;
}

export class ChatViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'codeChatbot.chatView';
  private _view?: vscode.WebviewView;
  private currentRange?: CodeRange;

  constructor(
    private readonly _extensionUri: vscode.Uri,
  ) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken,
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri]
    };

    webviewView.webview.html = getWebviewContent();

    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        case 'sendMessage':
          await this._handleUserMessage(data.message);
          break;
      }
    });
  }

  public showCodeContext(text: string, range: CodeRange, message: string) {
    if (this._view) {
      this.currentRange = range;
      this._view.webview.postMessage({
        type: 'setContext',
        text: text,
        message: message,
        range: range
      });
      this._view.show(true);
    }
  }

  public clearSelection() {
    if (this._view) {
      this.currentRange = undefined;
      this._view.webview.postMessage({
        type: 'clearContext'
      });
    }
  }

  private async _handleUserMessage(message: string) {
    try {
      if (message.startsWith('/replace') && this.currentRange) {
        const newCode = message.substring('/replace'.length).trim();
        await this._replaceCode(newCode);
        this._sendMessageToWebview('Code replaced successfully');
      } else {
        // Handle other messages...
        this._sendMessageToWebview(`Received: ${message}`);
      }
    } catch (error) {
      console.error('Error handling message:', error);
      this._sendMessageToWebview('Error processing your request');
    }
  }

  private async _replaceCode(newCode: string) {
    const editor = vscode.window.activeTextEditor;
    if (!editor || !this.currentRange) return;

    const range = new vscode.Range(
      new vscode.Position(this.currentRange.startLine, this.currentRange.startChar),
      new vscode.Position(this.currentRange.endLine, this.currentRange.endChar)
    );

    await editor.edit(editBuilder => {
      editBuilder.replace(range, newCode);
    });
  }

  private _sendMessageToWebview(message: string) {
    if (this._view) {
      this._view.webview.postMessage({
        type: 'response',
        message: message
      });
    }
  }
}