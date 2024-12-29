from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import json

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

    with open("test.json") as f:
      errors = json.load(f).get("violations")
    
    for error in errors:
      error_lines = error["code_block"].split('\n')
      first_word = error_lines[0].split(" ")[0]
      last_word = error_lines[-1].split(" ")[-1]

      start_line_number = next(i for i, line in enumerate(lines) if line.strip() == error_lines[0].strip())
      end_line_number = next(i for i, line in enumerate(lines[start_line_number:], start=start_line_number) if line.strip() == error_lines[-1].strip())

      print(f"start_line: {start_line_number}. Endline: {end_line_number}")

      print(f"lines[start_line]: {lines[start_line_number]}")
      print(f"lines[end_line]: {lines[end_line_number]}")
      print(f"last_line: {error_lines[-1]}")
      print(f"Len error_lines: {len(error_lines)}")

      highlights.append(HighlightInfo(
        startLine=start_line_number,
        startChar=lines[start_line_number].index(first_word),
        endLine=end_line_number,
        endChar=lines[end_line_number].index(last_word) + len(last_word),
        type='warning',
        message=error["issue"]
      ))

      print("loaded")
    

    # for i, line in enumerate(lines):
    #   if 'TODO' in line:
    #     highlights.append(HighlightInfo(
    #       startLine=i,
    #       startChar=line.index('TODO'),
    #       endLine=i,
    #       endChar=line.index('TODO') + 4,
    #       type='warning',
    #       message='TODO found: Consider implementing this'
    #     ))
      
    #   if len(line.strip()) > 80:
    #     highlights.append(HighlightInfo(
    #       startLine=i,
    #       startChar=0,
    #       endLine=i,
    #       endChar=len(line),
    #       type='warning',
    #       message='Line is too long'
    #     ))

    return CodeAnalysisResponse(highlights=highlights)
  
  except Exception as e:
    raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
  uvicorn.run(app, host="0.0.0.0", port=8000)