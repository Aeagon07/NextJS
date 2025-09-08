import {z} from 'zod'

export const signInSchema = z.object({
    identifier: z.string(),
    pass: z.string(),
})