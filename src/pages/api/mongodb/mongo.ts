import mongoose from "mongoose";
const mongoDB = process.env.MONGO;

export function connectDB(){
    if(typeof mongoDB === 'string'){
        if (mongoose.connection.readyState >= 1) return;
        
        mongoose.connect(mongoDB).then(()=>{
            console.log('connect!!');
        });
    }
}