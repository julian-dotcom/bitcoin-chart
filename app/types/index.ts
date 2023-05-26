export interface BitcoinPrice {
  timestamp: number;
  value: number;
}

export enum TimeFrame {
  FOUR_HOURS = "4h",
  ONE_DAY = "1d",
  ONE_WEEK = "1w",
  ONE_MONTH = "1m",
  ONE_YEAR = "1y",
}

export interface TimeWindow {
  window: TimeFrame;
  candleLength: string;
  candlesNeeded: number;
}
