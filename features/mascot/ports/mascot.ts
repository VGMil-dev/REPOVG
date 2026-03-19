import {
  MascotChatContext,
  GeminiMascotResponse
} from "../models/mascot";

export interface IMascotService {
  chatWithMascot(params: {
    userMsg: string;
    context: MascotChatContext;
    intentosFallidos: number;
    mascotName: string;
    userId: string;
  }): Promise<GeminiMascotResponse>;

  syncLearnedConcepts(userId: string,
    concepts: string[]
  ): Promise<void>;
}
