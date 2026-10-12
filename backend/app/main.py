from fastapi import FastAPI

app = FastAPI(title="Orbit Soft · future API")

@app.get("/health")
def health():
    return {"status": "ok", "sync_enabled": False}
