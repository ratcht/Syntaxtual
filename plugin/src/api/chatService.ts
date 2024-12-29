interface ApiRequest {
  message: string;
  code: string;
  fileName: string;
  fileExtension?: string;
}

interface ApiResponse {
  message: string;
}

export async function sendToApi(request: ApiRequest): Promise<string> {
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

    const result = await response.json() as ApiResponse;
    return result.message;
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
}