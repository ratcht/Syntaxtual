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
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const ChatViewProvider_1 = require("./ChatViewProvider");
const CodeHighlighter_1 = require("./features/CodeHighlighter");
function activate(context) {
    console.log('Extension "code-chatbot" is now active');
    // Initialize providers
    const chatProvider = new ChatViewProvider_1.ChatViewProvider(context.extensionUri);
    const highlighter = new CodeHighlighter_1.CodeHighlighter();
    // Register providers and commands
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(ChatViewProvider_1.ChatViewProvider.viewType, chatProvider), vscode.commands.registerCommand('codeChatbot.openChat', (params) => {
        chatProvider.showCodeContext(params.text, params.range, params.message);
    }), vscode.workspace.onDidOpenTextDocument(() => {
        highlighter.analyzeCurrentDocument();
    }), vscode.workspace.onDidChangeTextDocument(() => {
        highlighter.analyzeCurrentDocument();
    }), vscode.window.onDidChangeActiveTextEditor(() => {
        highlighter.analyzeCurrentDocument();
    }), 
    // Command to manually trigger analysis
    vscode.commands.registerCommand('codeChatbot.analyze', () => {
        highlighter.analyzeCurrentDocument();
    }), 
    // Command to clear all highlights
    vscode.commands.registerCommand('codeChatbot.clearHighlights', () => {
        highlighter.clearHighlights();
    }), vscode.commands.registerCommand('codeChatbot.clearSelection', () => {
        chatProvider.clearSelection();
    }), highlighter);
    // Analyze the current document if one is open
    if (vscode.window.activeTextEditor) {
        highlighter.analyzeCurrentDocument();
    }
}
function deactivate() { }
//# sourceMappingURL=extension.js.map