import { MascotSpriteVariant } from "@/features/mascot/models/mascot";

export interface IOnboardingService {
  completarMision3(mascotName: string, selectedSprite: MascotSpriteVariant): Promise<{ success: boolean; error?: string }>;
}
