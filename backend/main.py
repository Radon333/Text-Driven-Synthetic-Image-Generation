from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import base64
import numpy as np
from PIL import Image
import io
import warnings
from PIL import Image
from stability_sdk import client
import stability_sdk.interfaces.gooseai.generation.generation_pb2 as generation
from pydantic import BaseModel
import random
from config import settings


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_credentials=True,
    allow_headers=["*"],
)

class UserPrompt(BaseModel):
    prompt: str
    height: int
    width: int
    steps: int

def PILImage_to_base64str(pilimg):
    buffered = io.BytesIO()
    pilimg.save(buffered, format="JPEG")
    img_str = base64.b64encode(buffered.getvalue())
    return img_str.decode('utf-8')

@app.get("/")
async def root():
    return {"message": "Text Driven Synthetic Image Generation"}

@app.post("/model")
async def getdata(userPrompt: UserPrompt):
    api = client.Inference(
    key=settings.key, 
    verbose=True,
    )
    answers = api.generate(
    prompt=userPrompt.prompt,
    height=userPrompt.height,
    width=userPrompt.width,
    cfg_scale=7.0,
    seed=random.randint(15000,35000),
    steps=userPrompt.steps, 
    )
    for resp in answers:
        for artifact in resp.artifacts:
            if artifact.finish_reason == generation.FILTER:
                warnings.warn(
                    "Your request activated the API's safety filters and could not be processed."
                    "Please modify the prompt and try again.")
            if artifact.type == generation.ARTIFACT_IMAGE:
                img = Image.open(io.BytesIO(artifact.binary))
                return PILImage_to_base64str(img)
