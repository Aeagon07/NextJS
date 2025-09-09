import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: Number
    // yeah hum chahte hai ki wo number aaye iss liye usse as number likh aap koi aur datatype bhi le sakte ho
}

const connection: ConnectionObject = {}

// db is in anothere contenant so you have to use the async functionality
async function dbConnect(): Promise<void>{
    if(connection.isConnected){
        console.log("Already Connected to DB")
        return
    }

    // if you have no db connection
    try{
        const db = await mongoose.connect(process.env.MONGODB_URL || '', {})

        connection.isConnected = db.connections[0].readyState
        // yeah bas dhyan mein rakhane ke liye ready state hai..cause readyState is number agar aap nahi bhi karte to bhi chalega..

        console.log("DB Connected Successfully")

    }catch(error){
        // iss case mein process ko gracefully exist karo
        console.log("DB Connection Failed!", error);
        process.exit(1)

    }
}

export default dbConnect;
