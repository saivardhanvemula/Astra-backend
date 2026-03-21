import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { createOrder, verifyPayment, webhook, initiateJoinAndPay } from "../controllers/payment.controller";

const router = Router();

// POST /api/payments/webhook — public, raw body (handled in app.ts before express.json)
router.post("/webhook", webhook);

// POST /api/payments/initiate — public, landing page: create account + razorpay order in one step
router.post("/initiate", initiateJoinAndPay);

// POST /api/payments/verify — public, order_id identifies the payment (no JWT needed)
router.post("/verify", verifyPayment);

// POST /api/payments/create-order — logged-in member renews/upgrades plan
router.post("/create-order", authMiddleware, createOrder);

export default router;
