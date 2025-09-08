import mongoose, {Schema, Document} from "mongoose";

export interface Message extends Document{
    content: string;
    createdAt: Date;
}
// : {Type of } <Which Schema> => That's How we write the custome schema
// use of these which insure your typeSafty

const MessageSchema : Schema<Message> = new Schema({
    content: {
        type: String,
        required: true,
    },
    createdAt : {
        type: Date,
        required: true,
        default: Date.now
    }

})

export interface User extends Document{
    username: string;
    email: string;
    pass: string;
    verifyCode: string;
    verifyExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    message: Message[]
}

// Valid Email checks -> regex(regular Expression)
const regex = /^[\w.-]+@[\w.-]+\.\w{2,}$/;

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required : [true, "Username is required"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        mathch: [regex, "Please Enter Valid Email"]
    },
    pass: {
        type: String,
        required: true,
        unique: true
    },
    verifyCode: {
        type: String,
        required: true
    },
    verifyExpiry: {
        type: Date,
        required: true,
        default: Date.now,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true,
    },
    message: [MessageSchema] // is ka type hi alag hai so hame ne custome type bana ya hai wo use kare..
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema)

// TY Injection -> you also define the model datatype using providing schema
// that's how your type safty looks llike

// mongoose.models.User only this part is required but we adding the type safty of that model as User Schema so we add the as part 

export default UserModel;