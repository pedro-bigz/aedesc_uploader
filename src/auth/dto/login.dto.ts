import { customCreateZodDto } from 'src/common';
import { z } from 'zod';

export const loginSchema = z.object({
  apiKey: z.string(),
});

export class LoginDto extends customCreateZodDto(loginSchema) {}
