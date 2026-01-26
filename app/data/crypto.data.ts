export interface ChainOption {
  id: string;
  name: string;
  nameZh: string;
  walletAddress: string;
}

export interface TokenOption {
  id: string;
  name: string;
  chains: ChainOption[];
}

export const tokens: TokenOption[] = [
  {
    id: "USDC",
    name: "USDC",
    chains: [
      {
        id: "ethereum",
        name: "Ethereum",
        nameZh: "以太坊",
        walletAddress: "0x83E648bc75e8cC0be604410EFF80Ed0aa9852357",
      },
      {
        id: "polygon",
        name: "Polygon",
        nameZh: "Polygon",
        walletAddress: "0x83E648bc75e8cC0be604410EFF80Ed0aa9852357",
      },
    ],
  },
  {
    id: "BTC",
    name: "BTC",
    chains: [
      {
        id: "bitcoin",
        name: "Bitcoin",
        nameZh: "比特币主网",
        walletAddress: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      },
    ],
  },
  {
    id: "ETH",
    name: "ETH",
    chains: [
      {
        id: "ethereum",
        name: "Ethereum",
        nameZh: "以太坊主网",
        walletAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
      },
    ],
  },
  {
    id: "USDT",
    name: "USDT",
    chains: [
      {
        id: "trc20",
        name: "TRC-20",
        nameZh: "TRC-20",
        walletAddress: "TQn9Y2khEsLMWDm3YF8Kj7vK8K8K8K8K8K8",
      },
      {
        id: "erc20",
        name: "ERC-20",
        nameZh: "以太坊 ERC-20",
        walletAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
      },
    ],
  },
];