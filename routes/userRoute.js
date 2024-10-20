import express from "express";
import { addAddressController, sendOtpController, verifyOtpController } from "../controllers/userController.js";

const router = express.Router();

router.post("/send-otp",sendOtpController)
router.post("/verify-otp",verifyOtpController)
router.post("/add-address", addAddressController);


export default router;
