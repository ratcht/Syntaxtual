"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendToApi = sendToApi;
async function sendToApi(request) {
    try {
        const response = await fetch('http://localhost:8000/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request)
        });
        if (!response.ok) {
            throw new Error(`API request failed: ${response.statusText}`);
        }
        const result = await response.json();
        return result.message;
    }
    catch (error) {
        console.error('API error:', error);
        throw error;
    }
}
//# sourceMappingURL=chatService.js.map