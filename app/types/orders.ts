export enum TradeType {
    LONG = "LONG",
    SHORT = "SHORT"
  }
  
  export enum TradeStatus {
    OPEN = "OPEN",
    CLOSED = "CLOSED"
  }
  
  export type Order = {
    id: string;
    tradeDate: Date;
    symbol: string;
    quantity: number;
    buyPrice: number;
    sellPrice: number | null;
    type: TradeType;
    status: TradeStatus;
    profitLoss: number | null;
    tradeAmount: number;
  };
  
  export type NewOrder = {
    symbol: string;
    quantity: number;
    buyPrice: number;
    sellPrice: number;
    tradeAmount: number;
    type: TradeType;
    status: TradeStatus;
  };