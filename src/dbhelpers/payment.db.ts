import prisma from "../config/db";

export async function createPayment(data: {
  member_id: string;
  plan_id: string;
  razorpay_order_id: string;
  amount: number;
}) {
  return prisma.payment.create({
    data: {
      member_id: data.member_id,
      plan_id: data.plan_id,
      razorpay_order_id: data.razorpay_order_id,
      amount: data.amount,
      status: "pending",
    },
  });
}

export async function updatePaymentStatus(
  razorpay_order_id: string,
  status: string,
  razorpay_payment_id?: string
) {
  return prisma.payment.updateMany({
    where: { razorpay_order_id },
    data: {
      status,
      ...(razorpay_payment_id ? { razorpay_payment_id } : {}),
    },
  });
}

export async function getPaymentByOrderId(razorpay_order_id: string) {
  return prisma.payment.findFirst({ where: { razorpay_order_id } });
}
