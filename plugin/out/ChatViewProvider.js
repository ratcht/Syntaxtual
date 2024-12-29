"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatViewProvider = void 0;
const vscode = __importStar(require("vscode"));
const template_1 = require("./ui/template");
class ChatViewProvider {
    _extensionUri;
    static viewType = 'codeChatbot.chatView';
    _view;
    currentRange;
    constructor(_extensionUri) {
        this._extensionUri = _extensionUri;
    }
    resolveWebviewView(webviewView, context, _token) {
        this._view = webviewView;
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };
        webviewView.webview.html = (0, template_1.getWebviewContent)();
        webviewView.webview.onDidReceiveMessage(async (data) => {
            switch (data.type) {
                case 'sendMessage':
                    await this._handleUserMessage(data.message);
                    break;
            }
        });
    }
    showCodeContext(text, range, message) {
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
    clearSelection() {
        if (this._view) {
            this.currentRange = undefined;
            this._view.webview.postMessage({
                type: 'clearContext'
            });
        }
    }
    async _handleUserMessage(message) {
        try {
            if (message.startsWith('/replace') && this.currentRange) {
                const newCode = message.substring('/replace'.length).trim();
                await this._replaceCode(newCode);
                this._sendMessageToWebview('Code replaced successfully');
            }
            else {
                // Handle other messages...
                this._sendMessageToWebview(`Received: ${message}`);
            }
        }
        catch (error) {
            console.error('Error handling message:', error);
            this._sendMessageToWebview('Error processing your request');
        }
    }
    async _replaceCode(newCode) {
        const editor = vscode.window.activeTextEditor;
        if (!editor || !this.currentRange)
            return;
        const range = new vscode.Range(new vscode.Position(this.currentRange.startLine, this.currentRange.startChar), new vscode.Position(this.currentRange.endLine, this.currentRange.endChar));
        await editor.edit(editBuilder => {
            editBuilder.replace(range, newCode);
        });
    }
    _sendMessageToWebview(message) {
        if (this._view) {
            this._view.webview.postMessage({
                type: 'response',
                message: message
            });
        }
    }
}
exports.ChatViewProvider = ChatViewProvider;
//# sourceMappingURL=ChatViewProvider.js.map