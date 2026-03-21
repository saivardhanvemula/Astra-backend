import crypto from "crypto";
import { AppError } from "../middlewares/errorMiddleware";
import razorpay from "../utils/razorpay";
import * as paymentDb from "../dbhelpers/payment.db";
import * as planDb from "../dbhelpers/plan.db";
import * as memberDb from "../dbhelpers/member.db";
import * as membershipDb from "../dbhelpers/membership.db";
import * as userDb from "../dbhelpers/user.db";
import { hashPassword } from "../utils/hash";

// Public onboarding flow — called from landing page before the user has an account
export async function initiateJoinAndPay(
  name: string,
  email: string,
  phone: string,
  plan_id: string,
  gender?: string,
  date_of_birth?: string
) {
  const plan = await planDb.getPlanById(plan_id);
  if (!plan) throw new AppError("Plan not found", 404);

  // Find or create member
  const existing = await memberDb.getMemberByEmail(email);
  let memberId: string;
  let default_password: string | null = null;

  if (!existing) {
    const created = await memberDb.createMember({
      name,
      email,
      phone,
      gender: gender ?? null,
      date_of_birth: date_of_birth ? new Date(date_of_birth) : null,
    });
    memberId = created.id;

    // Create login account
    default_password = phone || "Astra@1234";
    const hashed = await hashPassword(default_password);
    await userDb.createUser({ name, email, password: hashed, role: "member" });
  } else {
    memberId = existing.id;
  }

  // Create Razorpay order
  const order = await razorpay.orders.create({
    amount: Math.round((plan as any).price * 100),
    currency: "INR",
    receipt: "receipt_" + Date.now(),
  });

  await paymentDb.createPayment({
    member_id: memberId,
    plan_id: plan.id,
    razorpay_order_id: order.id,
    amount: order.amount as number,
  });

  return {
    order_id: order.id,
    amount: order.amount,
    currency: order.currency,
    key: process.env.RAZORPAY_KEY_ID,
    member_id: memberId,
    email,
    // Only set on first signup — FE should show "your default password is ..."
    ...(default_password ? { default_password } : {}),
  };
}

export async function createOrder(userEmail: string, plan_id: string) {
  const plan = await planDb.getPlanById(plan_id);
  if (!plan) throw new AppError("Plan not found", 404);

  const member = await memberDb.getMemberByEmail(userEmail);
  if (!member) throw new AppError("Member not found", 404);

  const order = await razorpay.orders.create({
    amount: Math.round((plan as any).price * 100), // paise
    currency: "INR",
    receipt: "receipt_" + Date.now(),
  });

  await paymentDb.createPayment({
    member_id: member.id,
    plan_id: plan.id,
    razorpay_order_id: order.id,
    amount: order.amount as number,
  });

  return {
    order_id: order.id,
    amount: order.amount,
    currency: order.currency,
    key: process.env.RAZORPAY_KEY_ID,
  };
}

export async function verifyPayment(
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string
) {
  // Verify signature
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest("hex");

  if (expected !== razorpay_signature) {
    throw new AppError("Invalid signature", 400);
  }

  // Fetch stored payment
  const payment = await paymentDb.getPaymentByOrderId(razorpay_order_id);
  if (!payment) throw new AppError("Payment not found", 404);

  // Idempotency — skip if already processed
  if (payment.status === "success") {
    return { message: "Payment already verified" };
  }

  // Update payment record
  await paymentDb.updatePaymentStatus(razorpay_order_id, "success", razorpay_payment_id);

  // Create membership
  await activateMembership(payment.member_id!, payment.plan_id!);

  return { message: "Payment verified successfully" };
}

export async function handleWebhook(body: any, signature: string) {
  // Verify webhook signature
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(JSON.stringify(body))
    .digest("hex");

  if (expected !== signature) {
    throw new AppError("Invalid webhook signature", 400);
  }

  if (body.event === "payment.captured") {
    const { order_id, id: payment_id } = body.payload.payment.entity;

    const payment = await paymentDb.getPaymentByOrderId(order_id);
    if (!payment || payment.status === "success") return; // idempotent

    await paymentDb.updatePaymentStatus(order_id, "success", payment_id);
    await activateMembership(payment.member_id!, payment.plan_id!);
  }

  if (body.event === "payment.failed") {
    const { order_id } = body.payload.payment.entity;
    await paymentDb.updatePaymentStatus(order_id, "failed");
  }
}

async function activateMembership(member_id: string, plan_id: string) {
  const plan = await planDb.getPlanById(plan_id);
  if (!plan) return;

  const start = new Date();
  const end = new Date(start);
  end.setDate(end.getDate() + ((plan as any).duration_days ?? 30));

  await membershipDb.createMembership({ member_id, plan_id, start_date: start, end_date: end });
}
