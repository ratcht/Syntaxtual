import * as vscode from 'vscode';
import { sendToApi } from '../api/chatService';

export async function handleUserMessage(message: string): Promise<string> {
  try {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return 'No active editor found';
    }

    const document = editor.document;
    const code = document.getText();
    const fileName = document.fileName;
    const fileExtension = fileName.split('.').pop();

    const response = await sendToApi({
      message,
      code,
      fileName,
      fileExtension
    });

    return response;
  } catch (error) {
    console.error('Error processing message:', error);
    return 'Error processing your request';
  }
}