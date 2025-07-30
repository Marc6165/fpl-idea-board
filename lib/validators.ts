import { z } from 'zod';

export const ideaSchema = z.object({
  category: z.enum(['forfeit', 'reward', 'rule']),
  text: z.string().min(1).max(280)
}); 