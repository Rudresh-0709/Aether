from pydantic import BaseModel
from typing import List, Dict

class NPC(BaseModel):
    id: str
    name: str
    role: str
    personality: str
    motive: str
    alibi: str

class Clue(BaseModel):
    id: str
    description: str
    relates_to: List[str]
    location_hint: str

class Case(BaseModel):
    case_id: str
    crime: str
    victim: str
    location: str
    npcs: List[NPC]
    clues: List[Clue]
    solution: str
