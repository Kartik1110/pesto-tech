import { z } from 'zod';

// schema for the User model
export const UserSchema = z.object({
    email: z.string().email(),
    name: z.string().min(8).max(255),
})

// schema for the Task model
export const TaskSchema = z.object({
    title: z.string().max(255),
    description: z.string().min(8).max(255),
    userId: z.string(),
})