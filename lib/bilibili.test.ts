export interface BilibiliAuthor {
  mid: number;
  name: string;
  face: string;
}

export interface BilibiliStat {
  view: number;
  danmaku: number;
  reply: number;
  favorite: number;
  coin: number;
  share: number;
  like: number;
}

export interface BilibiliVideoItem {
  aid: number;
  tname: string;
  title: string;
  pic: string;
  pubdate: number;
  duration: number;
  author: BilibiliAuthor;
  stat: BilibiliStat;
  hot_desc?: string;
  bvid: string;
}

export interface BilibiliResponse {
  code: number;
  message: string;
  data: BilibiliVideoItem[];
  page: {
    count: number;
    pn: number;
    ps: number;
  };
}
/**
 * 获取B站推荐视频
 * @param ps 每页数量 (默认 20)
 * @param pn 页码 (默认 1)
 */
export const getBilibiliRecommendList = async (
  ps: number = 20,
  pn: number = 1
): Promise<BilibiliResponse> => {
  // 1. 定义 Base URL 和 API 路径
  const BILIBILI_BASE_URL = "https://api.bilibili.com";
  const API_PATH = "/x/web-interface/wx/hot";

  // 2. 构造查询参数对象
  const params = {
    ps: ps.toString(), // URLSearchParams 需要字符串
    pn: pn.toString(),
    web_location: "333.403",
  };

  // 3. 使用 URLSearchParams 构造查询字符串 (?ps=20&pn=1...)
  const query = new URLSearchParams(params).toString();

  // 4. 构造完整的最终 URL
  const fullUrl = `${BILIBILI_BASE_URL}${API_PATH}?${query}`;

  console.log("B站请求 URL:", fullUrl);

  // 5. 使用 fetch 发送请求
  const res = await fetch(fullUrl, {
    // 默认是 GET 方法，这里可以省略 method: 'GET'
    // 可以在这里设置缓存策略等
    cache: "no-store",
  });

  // 6. 检查响应状态
  if (!res.ok) {
    // 抛出包含状态码和 URL 的错误，便于调试
    throw new Error(
      `Failed to fetch Bilibili data: ${res.status} from ${fullUrl}`
    );
  }

  // 7. 解析 JSON 响应
  const json = await res.json();

  // 假设 BilibiliResponse 就是解析后的 JSON 结构
  return json as BilibiliResponse;
};
