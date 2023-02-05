import mongoose from "mongoose";
const msgSchema = new mongoose.Schema({
    msg:{
        type:String,
        require:true,
    }
});

export const Msg = mongoose.model('msg',msgSchema);
