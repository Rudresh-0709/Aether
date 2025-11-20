export const PALETTE = {
    background: "#1a1a2e", // Dark blue-ish background, not pure black
    grid: "#16213e",

    // Zones
    zone: {
        indoor: "#2a2a40",
        outdoor: "#253529",
        default: "#303040"
    },

    // Rooms
    room: {
        floor: "#4a4a6a",
        wall: "#6a6a8a",
        highlight: "#8a8aaa"
    },

    // Props
    prop: {
        furniture: "#8b5a2b", // Wood-ish
        decoration: "#c0a080",
        obstacle: "#505050",
        default: "#a0a0a0"
    },

    // Text
    text: {
        primary: "#ffffff",
        secondary: "#cccccc",
        accent: "#ffd700"
    }
};

export function getZoneColor(type: string): string {
    return (PALETTE.zone as any)[type] || PALETTE.zone.default;
}

export function getPropColor(type: string): string {
    return (PALETTE.prop as any)[type] || PALETTE.prop.default;
}
