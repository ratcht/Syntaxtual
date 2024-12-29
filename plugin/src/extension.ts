import * as vscode from 'vscode';
import { ChatViewProvider } from './ChatViewProvider';
import { CodeHighlighter } from './features/CodeHighlighter';

export function activate(context: vscode.ExtensionContext) {
  console.log('Extension "code-chatbot" is now active');

  // Initialize providers
  const chatProvider = new ChatViewProvider(context.extensionUri);
  const highlighter = new CodeHighlighter();

  // Register providers and commands
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      ChatViewProvider.viewType,
      chatProvider
    ),
    
    vscode.commands.registerCommand('codeChatbot.openChat', (params) => {
      chatProvider.showCodeContext(params.text, params.range, params.message);
    }),

    vscode.workspace.onDidOpenTextDocument(() => {
      highlighter.analyzeCurrentDocument();
    }),

    vscode.workspace.onDidChangeTextDocument(() => {
      highlighter.analyzeCurrentDocument();
    }),

    vscode.window.onDidChangeActiveTextEditor(() => {
      highlighter.analyzeCurrentDocument();
    }),

    // Command to manually trigger analysis
    vscode.commands.registerCommand('codeChatbot.analyze', () => {
      highlighter.analyzeCurrentDocument();
    }),

    // Command to clear all highlights
    vscode.commands.registerCommand('codeChatbot.clearHighlights', () => {
      highlighter.clearHighlights();
    }),

    vscode.commands.registerCommand('codeChatbot.clearSelection', () => {
      chatProvider.clearSelection();
    }),

    highlighter
  );

  // Analyze the current document if one is open
  if (vscode.window.activeTextEditor) {
    highlighter.analyzeCurrentDocument();
  }
}

export function deactivate() {}