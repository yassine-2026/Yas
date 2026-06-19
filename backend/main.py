from fastapi import FastAPI, BackgroundTasks, HTTPException
from pydantic import BaseModel
import uvicorn
import asyncio
from typing import Optional

from orchestrator import VideoOrchestrator

app = FastAPI(title="Nour Video Studio API", description="AI Quran Video Generator")

class GenerateRequest(BaseModel):
    surah: int
    ayah: int
    style: str
    voice: str

# In-memory queue / tasks state
tasks_db = {}

@app.post("/api/generate")
async def generate_video(req: GenerateRequest, background_tasks: BackgroundTasks):
    task_id = f"task_{len(tasks_db) + 1}"
    
    tasks_db[task_id] = {
        "status": "preparing",
        "progress": 0,
        "video_url": None
    }
    
    background_tasks.add_task(process_video_task, task_id, req)
    return {"task_id": task_id}

@app.get("/api/task/{task_id}")
async def get_task_status(task_id: str):
    if task_id not in tasks_db:
        raise HTTPException(status_code=404, detail="Task not found")
    return tasks_db[task_id]

async def process_video_task(task_id: str, req: GenerateRequest):
    try:
        orchestrator = VideoOrchestrator(
            update_callback=lambda status, progress: update_task(task_id, status, progress)
        )
        
        video_path = await orchestrator.run_pipeline(req)
        
        tasks_db[task_id]["status"] = "completed"
        tasks_db[task_id]["progress"] = 100
        tasks_db[task_id]["video_url"] = f"/static/{video_path}"
        
    except Exception as e:
        tasks_db[task_id]["status"] = "failed"
        tasks_db[task_id]["error"] = str(e)

def update_task(task_id: str, status: str, progress: int):
    if task_id in tasks_db:
        tasks_db[task_id]["status"] = status
        tasks_db[task_id]["progress"] = progress

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
