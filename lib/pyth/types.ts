export interface PythPriceResponse {
  [feedId: string]: {
    usdPrice: number;
    confidence: number;
    publishTime: number;
  };
}

/** Raw shape of Hermes' /v2/updates/price/latest?parsed=true response. */
export interface HermesLatestPriceResponse {
  parsed?: Array<{
    id: string;
    price: {
      price: string;
      conf: string;
      expo: number;
      publish_time: number;
    };
  }>;
}
