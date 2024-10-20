import express from 'express'
import { addOrderController, deleteOrderController } from '../controllers/orderController.js';
const router = express.Router()

router.post('/addOrder/:id',addOrderController)
router.post('/deleteOrder/:id',deleteOrderController)


export default router;
