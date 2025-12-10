import { Product } from "@/app/[locale]/types/home.type";

export const TestData: Product[] = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    price: 9999,
    cover:
      "https://img.alicdn.com/imgextra/i1/353571709/O1CN01lFrnso1OUlywtLjAB-353571709.jpg",
    description:
      "搭载A17仿生芯片的旗舰机型，航空级钛金属机身，支持ProMotion技术，带来极致的摄影和游戏体验。",
    category: "手机",
    tags: ["旗舰", "拍照", "钛金属"],
    createdAt: new Date("2024-10-01T10:00:00Z"),
    updatedAt: new Date("2024-11-15T12:30:00Z"),
    imgs: [
      "https://img.alicdn.com/imgextra/i1/353571709/O1CN01lFrnso1OUlywtLjAB-353571709.jpg",
      "https://img.alicdn.com/imgextra/i1/353571709/O1CN01lHkVe51OUlt2FFv7N-353571709.jpg",
      "https://img.alicdn.com/imgextra/i4/353571709/O1CN01Apg4qM1OUlt2NMDTn-353571709.jpg",
      "https://img.alicdn.com/imgextra/i2/353571709/O1CN015pSDFZ1OUlt5Zz3HQ-353571709.jpg",
      "https://img.alicdn.com/imgextra/i4/353571709/O1CN01spesSv1OUlt2NM9KW-353571709.jpg",
    ],
  },
  {
    id: 2,
    name: "MacBook Pro M3",
    price: 13999,
    cover:
      "https://img.alicdn.com/imgextra/i1/353571709/O1CN01lHkVe51OUlt2FFv7N-353571709.jpg",
    description:
      "M3芯片的强大性能，适合专业人士进行视频编辑、编程和图形设计。Liquid Retina XDR显示屏。",
    category: "电脑",
    tags: ["生产力", "专业", "高性能"],
    createdAt: new Date("2024-09-05T09:15:00Z"),
    imgs: ["/mock/products/macbookpro_1.jpg"],
  },
  {
    id: 3,
    name: "Sony WH-1000XM6",
    price: 2499,
    cover:
      "https://img.alicdn.com/imgextra/i1/353571709/O1CN01lHkVe51OUlt2FFv7N-353571709.jpg",
    description:
      "业界领先的降噪技术，提供沉浸式聆听体验。超长续航，支持快充，佩戴舒适。",
    category: "影音设备",
    tags: ["降噪", "头戴式", "蓝牙"],
    updatedAt: new Date("2024-12-01T18:00:00Z"),
  },
  {
    id: 4,
    name: "小米手环 9",
    price: 299,
    cover:
      "https://img.alicdn.com/imgextra/i1/353571709/O1CN01lHkVe51OUlt2FFv7N-353571709.jpg",
    description:
      "经济实惠的健康追踪手环，支持血氧监测、心率监测和多种运动模式，续航可达14天。",
    category: "智能穿戴",
    tags: ["入门", "续航", "健康监测"],
  },
  {
    id: 5,
    name: "大疆 Mini 4 Pro",
    price: 4599,
    cover:
      "https://img.alicdn.com/imgextra/i1/353571709/O1CN01lHkVe51OUlt2FFv7N-353571709.jpg",
    description:
      "轻量级航拍无人机，4K高清视频拍摄，三向避障，非常适合旅行爱好者和初级飞手。",
    category: "数码配件",
    tags: ["无人机", "航拍", "轻量"],
    createdAt: new Date("2024-11-20T14:45:00Z"),
  },
  {
    id: 6,
    name: "Kindle Paperwhite 5",
    price: 1068,
    cover:
      "https://img.alicdn.com/imgextra/i1/353571709/O1CN01lHkVe51OUlt2FFv7N-353571709.jpg",
    description:
      "防水电子阅读器，300ppi高分辨率显示，暖光调节，给你纸质书般的阅读体验。",
    category: "电子书",
    tags: ["阅读", "护眼", "防水"],
    imgs: ["/mock/products/kindle_view.jpg"],
  },
  {
    id: 7,
    name: "罗技 MX Master 4",
    price: 699,
    cover:
      "https://img.alicdn.com/imgextra/i1/353571709/O1CN01lHkVe51OUlt2FFv7N-353571709.jpg",
    description:
      "高效办公鼠标，人体工学设计，支持跨设备控制，是程序员和设计师的首选。",
    category: "电脑配件",
    tags: ["办公", "人体工学", "无线"],
    updatedAt: new Date("2024-08-10T11:11:00Z"),
  },
  {
    id: 8,
    name: "Switch OLED 版",
    price: 2199,
    cover:
      "https://img.alicdn.com/imgextra/i1/353571709/O1CN01lHkVe51OUlt2FFv7N-353571709.jpg",
    description:
      "配备OLED屏幕的任天堂游戏主机，色彩更鲜艳，支架更稳定，带来全新的掌机体验。",
    category: "游戏设备",
    tags: ["游戏", "便携", "OLED"],
    createdAt: new Date("2023-05-01T08:00:00Z"),
  },
];
