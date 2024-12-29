import * as vscode from 'vscode';

interface HighlightInfo {
  startLine: number;
  startChar: number;
  endLine: number;
  endChar: number;
  type: string;
  message: string;
}

export class CodeHighlighter {
  private decorationTypes: Map<string, vscode.TextEditorDecorationType>;
  private selectedDecorationType: vscode.TextEditorDecorationType;
  private currentHighlights: HighlightInfo[] = [];
  private selectedHighlight: HighlightInfo | null = null;

  constructor() {
    // Normal highlight decorations
    this.decorationTypes = new Map([
      ['error', vscode.window.createTextEditorDecorationType({
        backgroundColor: 'rgba(255, 0, 0, 0.2)',
        border: '1px solid red',
        cursor: 'pointer',
      })],
      ['warning', vscode.window.createTextEditorDecorationType({
        backgroundColor: 'rgba(255, 165, 0, 0.2)',
        border: '1px solid orange',
        cursor: 'pointer',
      })],
      ['info', vscode.window.createTextEditorDecorationType({
        backgroundColor: 'rgba(0, 0, 255, 0.2)',
        border: '1px solid blue',
        cursor: 'pointer',
      })]
    ]);

    // Selected highlight decoration
    this.selectedDecorationType = vscode.window.createTextEditorDecorationType({
      backgroundColor: 'rgba(65, 105, 225, 0.3)',
      border: '2px solid royalblue',
      cursor: 'pointer',
    });

    // Register event handlers for selection changes
    vscode.window.onDidChangeTextEditorSelection(e => {
      this.handleSelectionChange(e);
    });
  }

  private handleSelectionChange(e: vscode.TextEditorSelectionChangeEvent) {
    const position = e.selections[0].start;
    const clickedHighlight = this.currentHighlights.find(h => 
      position.line >= h.startLine && 
      position.line <= h.endLine &&
      position.character >= h.startChar &&
      position.character <= h.endChar
    );

    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    if (clickedHighlight) {
      // Clicked on a highlight
      if (this.selectedHighlight !== clickedHighlight) {
        // Remove previous selection decoration
        editor.setDecorations(this.selectedDecorationType, []);

        // Apply new selection decoration
        const range = new vscode.Range(
          new vscode.Position(clickedHighlight.startLine, clickedHighlight.startChar),
          new vscode.Position(clickedHighlight.endLine, clickedHighlight.endChar)
        );
        editor.setDecorations(this.selectedDecorationType, [{ range }]);
        this.selectedHighlight = clickedHighlight;

        // Get the highlighted text
        const highlightedText = editor.document.getText(range);

        // Show the chatbot view with the highlighted text
        vscode.commands.executeCommand('codeChatbot.openChat', {
          text: highlightedText,
          range: {
            startLine: clickedHighlight.startLine,
            startChar: clickedHighlight.startChar,
            endLine: clickedHighlight.endLine,
            endChar: clickedHighlight.endChar
          },
          message: clickedHighlight.message
        });
      }
    } else {
      // Clicked outside any highlight - clear selection
      if (this.selectedHighlight) {
        editor.setDecorations(this.selectedDecorationType, []);
        this.selectedHighlight = null;
        // Clear the chatbot selection
        vscode.commands.executeCommand('codeChatbot.clearSelection');
      }
    }
  }

  public async analyzeCurrentDocument() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    const document = editor.document;
    
    try {
      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: document.getText(),
          fileName: document.fileName,
          fileExtension: document.fileName.split('.').pop()
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const result = await response.json();
      this.applyHighlights(editor, result.highlights);
    } catch (error) {
      console.error('Error analyzing document:', error);
      vscode.window.showErrorMessage('Failed to analyze document');
    }
  }

  private applyHighlights(editor: vscode.TextEditor, highlights: HighlightInfo[]) {
    this.currentHighlights = highlights;
    
    // Clear any existing selection
    editor.setDecorations(this.selectedDecorationType, []);
    this.selectedHighlight = null;

    // Group highlights by type
    const decorationsMap = new Map<string, vscode.DecorationOptions[]>();

    highlights.forEach(highlight => {
      if (!decorationsMap.has(highlight.type)) {
        decorationsMap.set(highlight.type, []);
      }
      
      decorationsMap.get(highlight.type)?.push({
        range: new vscode.Range(
          new vscode.Position(highlight.startLine, highlight.startChar),
          new vscode.Position(highlight.endLine, highlight.endChar)
        ),
        hoverMessage: highlight.message
      });
    });

    // Apply decorations for each type
    for (const [type, decorations] of decorationsMap.entries()) {
      const decorationType = this.decorationTypes.get(type);
      if (decorationType) {
        editor.setDecorations(decorationType, decorations);
      }
    }
  }

  public clearHighlights() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    this.currentHighlights = [];
    this.selectedHighlight = null;
    
    // Clear all decorations
    this.decorationTypes.forEach(decorationType => {
      editor.setDecorations(decorationType, []);
    });
    editor.setDecorations(this.selectedDecorationType, []);
    
    // Clear the chatbot selection
    vscode.commands.executeCommand('codeChatbot.clearSelection');
  }

  public dispose() {
    this.decorationTypes.forEach(d => d.dispose());
    this.selectedDecorationType.dispose();
  }
}