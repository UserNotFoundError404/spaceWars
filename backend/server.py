from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")


class GameState(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    player_x: float
    player_y: float
    player_health: int
    score: int
    current_level: int
    enemies: List[Dict[str, Any]]
    bullets: List[Dict[str, Any]]


class SavedGame(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    game_name: str
    game_state: GameState
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class SaveGameRequest(BaseModel):
    game_name: str
    game_state: GameState


class HighScore(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    player_name: str
    score: int
    level_reached: int
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class HighScoreCreate(BaseModel):
    player_name: str
    score: int
    level_reached: int


class Level(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: int
    name: str
    difficulty: str
    enemy_count: int
    enemy_speed: float
    background: str


@api_router.get("/")
async def root():
    return {"message": "Space Shooter API"}


@api_router.post("/game/save", response_model=SavedGame)
async def save_game(save_request: SaveGameRequest):
    saved_game = SavedGame(
        game_name=save_request.game_name,
        game_state=save_request.game_state
    )
    
    doc = saved_game.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    doc['game_state']['enemies'] = save_request.game_state.enemies
    doc['game_state']['bullets'] = save_request.game_state.bullets
    
    await db.saved_games.insert_one(doc)
    return saved_game


@api_router.get("/game/saves", response_model=List[SavedGame])
async def get_saved_games():
    saved_games = await db.saved_games.find({}, {"_id": 0}).sort("timestamp", -1).to_list(100)
    
    for game in saved_games:
        if isinstance(game['timestamp'], str):
            game['timestamp'] = datetime.fromisoformat(game['timestamp'])
    
    return saved_games


@api_router.get("/game/load/{game_id}", response_model=SavedGame)
async def load_game(game_id: str):
    game = await db.saved_games.find_one({"id": game_id}, {"_id": 0})
    
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    
    if isinstance(game['timestamp'], str):
        game['timestamp'] = datetime.fromisoformat(game['timestamp'])
    
    return game


@api_router.delete("/game/delete/{game_id}")
async def delete_game(game_id: str):
    result = await db.saved_games.delete_one({"id": game_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Game not found")
    
    return {"message": "Game deleted successfully"}


@api_router.post("/leaderboard", response_model=HighScore)
async def submit_score(score_data: HighScoreCreate):
    high_score = HighScore(**score_data.model_dump())
    
    doc = high_score.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    await db.high_scores.insert_one(doc)
    return high_score


@api_router.get("/leaderboard", response_model=List[HighScore])
async def get_leaderboard(limit: int = 10):
    scores = await db.high_scores.find({}, {"_id": 0}).sort("score", -1).limit(limit).to_list(limit)
    
    for score in scores:
        if isinstance(score['timestamp'], str):
            score['timestamp'] = datetime.fromisoformat(score['timestamp'])
    
    return scores


@api_router.get("/levels", response_model=List[Level])
async def get_levels():
    levels = [
        Level(
            id=1,
            name="Asteroid Belt",
            difficulty="Easy",
            enemy_count=5,
            enemy_speed=1.0,
            background="#050505"
        ),
        Level(
            id=2,
            name="Nebula Storm",
            difficulty="Medium",
            enemy_count=8,
            enemy_speed=1.5,
            background="#0A0A0A"
        ),
        Level(
            id=3,
            name="Black Hole",
            difficulty="Hard",
            enemy_count=12,
            enemy_speed=2.0,
            background="#000000"
        ),
        Level(
            id=4,
            name="Supernova",
            difficulty="Expert",
            enemy_count=15,
            enemy_speed=2.5,
            background="#050505"
        ),
        Level(
            id=5,
            name="The Void",
            difficulty="Impossible",
            enemy_count=20,
            enemy_speed=3.0,
            background="#000000"
        )
    ]
    return levels


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()