// Schemas
const mysterySchema = {
    victim: "string",
    killer: "string",
    motive: "string",
    weapon: "string",
    timeline: "object", // { "09:00": "Event", ... }
    suspects: "array", // Array of suspect objects
    clues: "array" // Array of clue objects
};

const roomSchema = {
    width: "number",
    depth: "number",
    walls: "array",
    furniture: "array"
};

export const validationService = {
    validateMystery(data) {
        const errors = [];
        if (!data) return { valid: false, errors: ["No data provided"] };

        for (const key in mysterySchema) {
            if (!data[key]) {
                errors.push(`Missing field: ${key}`);
            } else if (mysterySchema[key] === "array" && !Array.isArray(data[key])) {
                errors.push(`Field ${key} must be an array`);
            } else if (mysterySchema[key] === "object" && (typeof data[key] !== "object" || Array.isArray(data[key]))) {
                errors.push(`Field ${key} must be an object`);
            } else if (mysterySchema[key] === "string" && typeof data[key] !== "string") {
                errors.push(`Field ${key} must be a string`);
            }
        }

        return {
            valid: errors.length === 0,
            errors
        };
    },

    validateRoom(data) {
        const errors = [];
        if (!data) return { valid: false, errors: ["No data provided"] };

        for (const key in roomSchema) {
            if (!data[key]) {
                errors.push(`Missing field: ${key}`);
            }
        }

        // Fallback/Sanitization
        if (!data.walls) data.walls = [];
        if (!data.furniture) data.furniture = [];

        return {
            valid: errors.length === 0,
            errors,
            sanitizedData: data
        };
    },

    sanitizeDialogue(text) {
        // Basic safety filter (placeholder)
        // In a real app, this would check for PII or offensive content
        return text.replace(/<script>/g, "").trim();
    }
};
