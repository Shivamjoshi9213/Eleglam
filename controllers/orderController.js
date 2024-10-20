import OrderModel from '../models/orderModel.js'

export const addOrderController = async(req,res)=>{
    try {
       const id = req.params.id;
       if(!id){
        return res.status(400).send({success:false,
            message:"Id is required"
        })
       }
       const orderId = new OrderModel({
        orderID:id
       }).save()

       res.status(201).send({
        message:"Id add successfully",
        success:true,
        id
       })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:"Internal server error"
        })
        
    }
}

// delete order 
export const deleteOrderController = async(req,res)=>{
    try {
        
    } catch (error) {
        res.status(500).send({
            success:false,
            message:"error in delete order controller"
        })
        
    }
}