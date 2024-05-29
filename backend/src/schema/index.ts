import { z } from 'zod';

// schema for the User model
export const UserSchema = z.object({
    email: z.string().email(),
    name: z.string().min(8).max(255),
})