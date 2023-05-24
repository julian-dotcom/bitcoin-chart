import axios from "axios";
import { BitcoinPrice } from "../types";

export const BITCOIN_COLOR = "#F7931A";
const BITCOIN_MARKET = "BTCUSDT";
const MAX_CANDLES = 400;
const BINANCE_RATE_LIMIT = 50;

export const TIMEWINDOWS = [
  { window: "6h", candle: "5m", candlesNeeded: 72 },
  { window: "1d", candle: "15m", candlesNeeded: 96 },
  { window: "1w", candle: "2h", candlesNeeded: 84 },
  { window: "1m", candle: "8h", candlesNeeded: 90 },
  { window: "1y", candle: "1d", candlesNeeded: 365 }, // 1y is filtered in function below
];
export const DEFAULT_WINDOW = "6h";

// Fetch data for all time windows, generate object as output
export const fetchAllBtcData = async () => {
  let sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  const data: Record<string, BitcoinPrice[]> = {};
  for (let window of TIMEWINDOWS) {
    const res = await fetchBitcoinDataForWindow(window.candle);
    let filtered = res.slice(-window.candlesNeeded);
    if (window.window === "1y") {
      filtered = filtered.filter((_, i) => i % 5 === 0); // remove every 5th candle
    }
    data[window.window] = filtered;
    sleep(BINANCE_RATE_LIMIT);
  }
  return data;
};

// Fetch price data for specific time window, e.g. 6 hours, or 1 year
const fetchBitcoinDataForWindow = async (window: string): Promise<BitcoinPrice[]> => {
  try {
    const res = await axios.get("https://api.binance.com/api/v3/klines", {
      params: {
        symbol: BITCOIN_MARKET,
        interval: window,
        limit: MAX_CANDLES,
      },
    });
    if (res.status === 200) {
      const data: any[] = res.data;
      const prices: BitcoinPrice[] = data.map((row: any) => {
        if (row.length !== 12) throw new Error("Malformatted candle");
        if (typeof row[0] !== "number") throw new Error("Missing timestamp");
        if (typeof row[4] !== "string") throw new Error("Malformatted close price");
        return {
          timestamp: row[0],
          value: parseFloat(row[4]), // close price comes as string from API
        };
      });
      return prices;
    } else {
      throw new Error("Failed to fetch OHLCV data");
    }
  } catch (error) {
    console.error(`Error fetching OHLCV data for ${window}:", ${error}`);
    throw error;
  }
};
