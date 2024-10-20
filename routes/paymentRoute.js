import express from "express"
import { orderController, paymentIdController } from "../controllers/paymentController.js";

const router = express.Router();

router.post('/order',orderController)
router.get('/payment/:paymentId',paymentIdController)

export default router;




