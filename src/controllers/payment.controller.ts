import { Request, Response, NextFunction } from "express";
import * as paymentService from "../services/payment.service";

// POST /api/payments/initiate — public, landing page join+pay flow
export async function initiateJoinAndPay(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, phone, plan_id, gender, date_of_birth } = req.body;
    if (!name || !email || !phone || !plan_id) {
      return res.status(400).json({ error: "name, email, phone, and plan_id are required" });
    }
    const data = await paymentService.initiateJoinAndPay(name, email, phone, plan_id, gender, date_of_birth);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

// POST /api/payments/create-order — member only
export async function createOrder(req: Request, res: Response, next: NextFunction) {
  try {
    const { plan_id } = req.body;
    if (!plan_id) return res.status(400).json({ error: "plan_id is required" });

    const email = (req as any).user?.email;
    if (!email) return res.status(401).json({ error: "Unauthorized" });

    const data = await paymentService.createOrder(email, plan_id);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

// POST /api/payments/verify — member only
export async function verifyPayment(req: Request, res: Response, next: NextFunction) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: "razorpay_order_id, razorpay_payment_id and razorpay_signature are required" });
    }

    const result = await paymentService.verifyPayment(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

// POST /api/payments/webhook — public, called by Razorpay
export async function webhook(req: Request, res: Response, next: NextFunction) {
  try {
    const signature = req.headers["x-razorpay-signature"] as string;
    if (!signature) return res.status(400).json({ error: "Missing signature" });

    await paymentService.handleWebhook(req.body, signature);
    res.json({ status: "ok" });
  } catch (err) {
    next(err);
  }
}
