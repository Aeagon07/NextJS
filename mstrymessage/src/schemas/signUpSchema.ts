import {z} from 'zod'

// Yaha pe bas ham ik hi value ko check kar rahe hai..

export const usernameValidation = z
    .string()
    .min(4, "Username must be atleast of 2 Characters")
    .max(20, "Username must be no more than 20 Charaters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special Character")


export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.email({message: 'Invalid Email!'}),
    pass: z.string().min(6, {message: 'PassWord must have atleast 6 characters'})
})