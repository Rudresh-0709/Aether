export const INTENTS = {
    ASK_VICTIM: "AskAboutVictim",
    ASK_ALIBI: "AskAboutAlibi",
    ASK_TIMELINE: "AskAboutTimeline",
    ASK_LOCATION: "AskAboutLocation",
    ASK_RELATIONSHIP: "AskAboutRelationship",
    ASK_CLUE: "AskAboutClue",
    ASK_WEAPON: "AskAboutWeapon",
    ASK_MOTIVE: "AskAboutMotive",
    ACCUSE_SOFT: "SoftAccusation",
    ACCUSE_HARD: "HardAccusation",
    CONFRONT: "ConfrontWithEvidence"
};

export const INTENT_LABELS = {
    [INTENTS.ASK_VICTIM]: "Ask about Victim",
    [INTENTS.ASK_ALIBI]: "Ask about Alibi",
    [INTENTS.ASK_TIMELINE]: "Ask about Timeline",
    [INTENTS.ASK_LOCATION]: "Ask about Location",
    [INTENTS.ASK_RELATIONSHIP]: "Ask about Relationships",
    [INTENTS.ASK_CLUE]: "Ask about a Clue...",
    [INTENTS.ASK_WEAPON]: "Ask about Weapon",
    [INTENTS.ASK_MOTIVE]: "Ask about Motive",
    [INTENTS.ACCUSE_SOFT]: "Accuse (Soft)",
    [INTENTS.ACCUSE_HARD]: "Accuse (Hard)",
    [INTENTS.CONFRONT]: "Confront with Evidence..."
};

export const TONES = {
    NEUTRAL: "Neutral",
    FRIENDLY: "Friendly",
    AGGRESSIVE: "Aggressive",
    SUSPICIOUS: "Suspicious"
};

export const INTENT_PROMPTS = {
    [INTENTS.ASK_VICTIM]: "The player asks you about the victim and your relationship with them.",
    [INTENTS.ASK_ALIBI]: "The player asks where you were at the time of the murder.",
    [INTENTS.ASK_TIMELINE]: "The player asks what you remember about the events during the timeline.",
    [INTENTS.ASK_LOCATION]: "The player asks about the crime scene location.",
    [INTENTS.ASK_RELATIONSHIP]: "The player asks about your relationship with another suspect.",
    [INTENTS.ASK_CLUE]: "The player asks about this clue: {clueContext}",
    [INTENTS.ASK_WEAPON]: "The player asks about the possible murder weapon.",
    [INTENTS.ASK_MOTIVE]: "The player asks if anyone had a motive.",
    [INTENTS.ACCUSE_SOFT]: "The player is gently accusing you.",
    [INTENTS.ACCUSE_HARD]: "The player is directly accusing you.",
    [INTENTS.CONFRONT]: "The player presents evidence against you: {clueContext}"
};
