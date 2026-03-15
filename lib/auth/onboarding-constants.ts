export const MISION_1_REWARD = { xp: 50,  coins: 10 } as const;
export const MISION_2_REWARD = { xp: 100, coins: 20 } as const;
export const MISION_3_REWARD = { xp: 50,  coins: 15 } as const;

export const MASCOT_SPRITES = ["default", "fire", "ice", "dark"] as const;
export type MascotSpriteSlug = typeof MASCOT_SPRITES[number];
