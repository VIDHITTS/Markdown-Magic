from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from authService.router import router as auth_router
from storageService.router import router as storage_router
from feedService.router import router as feed_router
from config.db import engine, Base

app = FastAPI(title="SnapCode API")

@app.on_event("startup")
def startup_event():
    """Create database tables on startup"""
    Base.metadata.create_all(bind=engine)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(storage_router)
app.include_router(feed_router)

@app.get("/")
def read_root():
    return {"message": "Hello World!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3000)
