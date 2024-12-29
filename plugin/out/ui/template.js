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
exports.getWebviewContent = getWebviewContent;
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
function getWebviewContent() {
    // Get the path to the HTML file
    const htmlPath = path.join(__dirname, '..', '..', 'src', 'ui', 'chatbot.html');
    try {
        // Read the HTML file
        const htmlContent = fs.readFileSync(htmlPath, 'utf8');
        return htmlContent;
    }
    catch (error) {
        console.error('Error reading HTML file:', error);
        return getDefaultContent();
    }
}
// Fallback content in case the HTML file can't be loaded
function getDefaultContent() {
    return `
    <!DOCTYPE html>
    <html>
      <body>
        <p>Error loading chatbot interface</p>
      </body>
    </html>
  `;
}
//# sourceMappingURL=template.js.map