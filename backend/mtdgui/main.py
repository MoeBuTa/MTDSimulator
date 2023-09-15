from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Union, Optional, Dict, Any
import uvicorn
from models import formData
from routers import develop, network,config#, set_configs#, sim
from controllers import * 

app = FastAPI()

app.include_router(config.router)
app.include_router(network.router)
app.include_router(develop.router)



app.add_middleware(
    CORSMiddleware,    
    allow_origins= "http://localhost:5173",    
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],    
)

@app.get("/")
async def root():
    return {"message": "Hello Bigger Applications!"}


# if __name__ == "__main__":
#     config ={}
#     app.run(host="0.0.0.0", port=8000, debug=True)
#     # uvicorn.run(app,host="0.0.0.0", port=8000)

