import { Shop } from "@/app/types/cart.type";

export const MockShoppingCartData: Shop[] = [
  {
    id: "S001",
    name: "Apple 官方旗舰店",
    checked: 2,
    items: [
      {
        id: 101,
        name: "iPhone 15 Pro Max",
        price: 9999.0,
        discount: 500.0, // 立减 500
        count: 1,
        image:
          "https://img.alicdn.com/imgextra/i1/353571709/O1CN01lFrnso1OUlywtLjAB-353571709.jpg",
        description: "A17 仿生芯片，钛金属机身，全新影像系统。",
        created_at: "2025-11-20T10:00:00Z",
        checked: true,
        status: 1, // 正常
      },
      {
        id: 102,
        name: "AirPods Pro (第二代)",
        price: 1899.0,
        discount: 0.0,
        count: 2,
        image:
          "https://img.alicdn.com/imgextra/i1/353571709/O1CN01lHkVe51OUlt2FFv7N-353571709.jpg",
        description: "主动降噪功能，自适应通透模式。",
        created_at: "2025-11-15T14:30:00Z",
        checked: false, // 未选中
        status: 1, // 正常
      },
      {
        id: 103,
        name: "Apple Watch Series 9",
        price: 3199.0,
        discount: 100.0,
        count: 1,
        image:
          "https://img.alicdn.com/imgextra/i4/353571709/O1CN01spesSv1OUlt2NM9KW-353571709.jpg",
        description: "双击手势，更亮的显示屏。",
        created_at: "2025-12-01T09:15:00Z",
        checked: true,
        status: 2, // 缺货
      },
    ],
  },
  {
    id: "S002",
    name: "Sony 官方影音店",
    checked: 0,
    items: [
      {
        id: 201,
        name: "Sony WH-1000XM6 降噪耳机",
        price: 2499.0,
        discount: 200.0,
        count: 1,
        image:
          "https://img.alicdn.com/imgextra/i4/353571709/O1CN01spesSv1OUlt2NM9KW-353571709.jpg",
        description: "业界领先的降噪技术，高解析度音频。",
        created_at: "2025-10-10T11:20:00Z",
        checked: true,
        status: 1, // 正常
      },
      {
        id: 202,
        name: "PlayStation 5 标准版",
        price: 3899.0,
        discount: 0.0,
        count: 1,
        image:
          "https://img.alicdn.com/imgextra/i2/353571709/O1CN015pSDFZ1OUlt5Zz3HQ-353571709.jpg",
        description: "超高速 SSD，3D 音效，沉浸式游戏体验。",
        created_at: "2024-08-01T17:00:00Z",
        checked: true,
        status: 3, // 已下架
      },
    ],
  },
];
