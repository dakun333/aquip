import { Product } from "@/app/types/home.type";
import { jsonResponse } from "../util";
export async function GET() {
  return jsonResponse<Product[]>({
    code: 0,
    data: [
      {
        id: 1,
        name: "iPhone 15",
        price: 6999,
        cover: "/mock/iphone.png",
      },
      {
        id: 2,
        name: "MacBook Pro",
        price: 13999,
        cover: "/mock/macbook.png",
      },
      {
        id: 3,
        name: "AirPods Pro",
        price: 1999,
        cover: "/mock/airpods.png",
      },
      {
        id: 4,
        name: "iPad Pro",
        price: 7999,
        cover: "/mock/ipad.png",
      },
      {
        id: 5,
        name: "Apple Watch Series 8",
        price: 3999,
        cover: "/mock/watch.png",
      },
      {
        id: 6,
        name: "Apple TV 4K",
        price: 2999,
        cover: "/mock/tv.png",
      },
      {
        id: 7,
        name: "Apple Fitness+",
        price: 99,
        cover: "/mock/fitness.png",
      },
      {
        id: 8,
        name: "Apple Arcade",
        price: 49,
        cover: "/mock/arcade.png",
      },
      {
        id: 9,
        name: "Apple Music",
        price: 0,
        cover: "/mock/music.png",
      },
      {
        id: 10,
        name: "Apple News+",
        price: 0,
        cover: "/mock/news.png",
      },
      {
        id: 11,
        name: "Apple Podcasts",
        price: 0,
        cover: "/mock/podcasts.png",
      },
      {
        id: 12,
        name: "Apple Books",
        price: 0,
        cover: "/mock/books.png",
      },
      {
        id: 13,
        name: "Apple Arcade",
        price: 49,
        cover: "/mock/arcade.png",
      },
    ],
  });
}
