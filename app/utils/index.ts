import axios from "axios";
import { BitcoinPrice, TimeFrame, TimeWindow } from "../types";

// Get today's date
const today = new Date();
const formatter = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "long",
  day: "numeric",
  year: "numeric",
});
export const TODAY = formatter.format(today);

const BINANCE_RATE_LIMIT = 50;
const BINANCE_URL = "https://api.binance.com/api/v3/klines";
const BITCOIN_MARKET = "BTCUSDT";
const MAX_CANDLES = 400;
const ONE_YEAR_FILTER = 7; //for 1 year chart, only keep every 7th candle
export const BITCOIN_COLOR = "#F7931A";

export const DEFAULT_WINDOW = TimeFrame.FOUR_HOURS;
// Need to keep amount of candles at ~50 to keep app performant
export const TIMEWINDOWS: TimeWindow[] = [
  { window: TimeFrame.FOUR_HOURS, candleLength: "5m", candlesNeeded: 48 },
  { window: TimeFrame.ONE_DAY, candleLength: "30m", candlesNeeded: 48 },
  { window: TimeFrame.ONE_WEEK, candleLength: "4h", candlesNeeded: 42 },
  { window: TimeFrame.ONE_MONTH, candleLength: "12h", candlesNeeded: 60 },
  { window: TimeFrame.ONE_YEAR, candleLength: "1d", candlesNeeded: 365 }, // 1y is filtered in function below
];

export const fetchAllBtcDataAndFilter = async (): Promise<Record<string, BitcoinPrice[]>> => {
  let sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  const data: Record<string, BitcoinPrice[]> = {};
  for (let window of TIMEWINDOWS) {
    const res = await fetchBitcoinDataForSpecificWindow(window.candleLength);
    let filtered = res.slice(-window.candlesNeeded);
    if (window.window === TimeFrame.ONE_YEAR) {
      filtered = filtered.filter((_, i) => i % ONE_YEAR_FILTER === 0);
    }
    data[window.window] = filtered;
    sleep(BINANCE_RATE_LIMIT);
  }
  return data;
};

const fetchBitcoinDataForSpecificWindow = async (candleLength: string): Promise<BitcoinPrice[]> => {
  try {
    const res = await axios.get(BINANCE_URL, {
      params: {
        symbol: BITCOIN_MARKET,
        interval: candleLength,
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
    console.error(`Error fetching OHLCV data for ${candleLength}: ${error}`);
    throw error;
  }
};
