export type OrderStatus = "paid" | "finished" | "pending" | "notfound";

export interface OrderDetail {
  id: string;
  status: OrderStatus;
  amount: number;
}

export async function getOrderDetailMock(id: string): Promise<OrderDetail> {
  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 500));

  // 根据 ID 模拟不同的状态
  // id 包含 'p' -> pending
  // id 包含 's' -> paid (success)
  // id 包含 'f' -> finished
  // 其他 -> notfound (或者根据需要定义)

  let status: OrderStatus = "pending";
  if (id.includes("paid")) status = "paid";
  else if (id.includes("finish")) status = "finished";
  else if (id.includes("none")) status = "notfound";
  else status = "pending";

  return {
    id,
    status,
    amount: 1000, // 模拟金额
  };
}
