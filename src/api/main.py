import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.routes import router, init_db

def create_app(db_path: str) -> FastAPI:
    app = FastAPI(
        title="PhD-Level PCA Market Engine API",
        version="2.0.0"
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.on_event("startup")
    async def startup_event():
        try:
            init_db(db_path)
            logging.info("API Database initialized successfully.")
        except Exception as e:
            logging.error(f"Startup Failure: {e}")

    app.include_router(router)
    
    return app
