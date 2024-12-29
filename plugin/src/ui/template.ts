import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export function getWebviewContent(): string {
  // Get the path to the HTML file
  const htmlPath = path.join(__dirname, '..', '..', 'src', 'ui', 'chatbot.html');
  
  try {
    // Read the HTML file
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    return htmlContent;
  } catch (error) {
    console.error('Error reading HTML file:', error);
    return getDefaultContent();
  }
}

// Fallback content in case the HTML file can't be loaded
function getDefaultContent(): string {
  return `
    <!DOCTYPE html>
    <html>
      <body>
        <p>Error loading chatbot interface</p>
      </body>
    </html>
  `;
}