import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { success } from "zod";

// api writing
export async function POST(req: Request){
    await dbConnect()

    try {
        const {username, email, password} =  await req.json()

        const exsitingUserverifiedByUsername  = await  UserModel.findOne({
            username,
            isVerified: true, 

        })

        // write our developed algo
        if(exsitingUserverifiedByUsername){
            return Response.json(
                {
                    success: false,
                    message: "Username is already taken",
                },
                {
                    status: 400,
                }
            ) 
        }

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        const existingUserByEmail = await UserModel.findOne({email})

        if (existingUserByEmail) {
            if(existingUserByEmail.isVerified){
                return Response.json(
                    {
                        success: false,
                        message: "User is already registered",
                    },
                    {
                        status: 400,
                    }
                )
            }else{
                const hashedPass = await bcrypt.hash(password, 10)
                existingUserByEmail.pass = hashedPass;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyExpiry = new Date(Date.now() + 3600000); // 1 hour from now
                
                await existingUserByEmail.save();
            }
        }else{
            const hashedPass = await bcrypt.hash(password, 10)

            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1); // 1 hour from now

            const newUser = new UserModel({
                username,
                email,
                pass: hashedPass,
                verifyCode: verifyCode,
                verifyExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                message: [],
            })

            await newUser.save();
        }

        // send verofication email
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode,
        )

        if(!emailResponse.success){
            return Response.json({
                success: false,
                message: emailResponse.message,

            }, {status: 400})
        }

        return Response.json({
                success: true,
                message: "User Registered Successfully. Verification Email Sent",

            }, {status: 201})

        
    } catch (error) {
        console.error('Error Registering User', error);

        return Response.json(
            {
                success: false,
                message: "Error registering User",
            },
            {
                status: 404,
            }
        )
        
    }
}
