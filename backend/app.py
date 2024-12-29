from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import uvicorn

app = FastAPI()

class CodeAnalysisRequest(BaseModel):
  code: str
  fileName: str
  fileExtension: Optional[str] = None

class HighlightInfo(BaseModel):
  startLine: int
  startChar: int
  endLine: int
  endChar: int
  type: str  # 'error', 'warning', or 'info'
  message: str

class CodeAnalysisResponse(BaseModel):
  highlights: List[HighlightInfo]

@app.post("/analyze", response_model=CodeAnalysisResponse)
async def analyze_code(request: CodeAnalysisRequest):
  try:
    # Example analysis - replace with your actual analysis logic
    highlights = []
    
    # For testing, let's highlight some patterns
    lines = request.code.split('\n')
    for i, line in enumerate(lines):
      if 'TODO' in line:
        highlights.append(HighlightInfo(
          startLine=i,
          startChar=line.index('TODO'),
          endLine=i,
          endChar=line.index('TODO') + 4,
          type='warning',
          message='TODO found: Consider implementing this'
        ))
      
      if len(line.strip()) > 80:
        highlights.append(HighlightInfo(
          startLine=i,
          startChar=0,
          endLine=i,
          endChar=len(line),
          type='warning',
          message='Line is too long'
        ))

    return CodeAnalysisResponse(highlights=highlights)
  
  except Exception as e:
    raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
  uvicorn.run(app, host="0.0.0.0", port=8000)