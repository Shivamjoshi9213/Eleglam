import dotenv from "dotenv";
import Razorpay from "razorpay";
dotenv.config()


export const orderController = async (req,res)=>{

    const razorpay = new Razorpay({
        key_id:process.env.KEY_ID,
        key_secret: process.env.KEY_SECRET
    })

    const options = {
        amount: Number(req.body.amount)*100,
        currency:"INR",
  }

  try {
    const response = await razorpay.orders.create(options)

    res.json({
        order_id:response.id,
        response
    })
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error")
    
  }
}


export const paymentIdController = async(req,res)=>{
    const {paymentId} = req.params;

    const razorpay = new Razorpay({
        key_id:process.env.KEY_ID,
        key_secret: process.env.KEY_SECRET
    })

    try {
        const payment = await razorpay.payments.fetch(paymentId);
        if(!payment){
            return res.status(500).json("Error at razorpay loading")
        }

        res.json({
            status:payment.status,
            method:payment.method,
            amount:payment.amount
        })
    } catch (error) {
        res.status(500).send("failed to fetch")
        
    }
}