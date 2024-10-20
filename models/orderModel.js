import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    orderID:{
        type:String,
        required:[true,"Id is required"]
    }
})

export default mongoose.model("order",orderSchema)
