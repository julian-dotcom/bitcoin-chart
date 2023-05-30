import { useState, useEffect } from "react";

import { BitcoinPrice } from "../types";
import { DEFAULT_WINDOW, fetchAllBtcDataAndFilter } from "../utils";

export const useBitcoinData = () => {
  const [allData, setAllData] = useState<Record<string, BitcoinPrice[]>>({}); // object with data for all timedframes
  const [curPrice, setCurPrice] = useState<number>();
  const [error, setError] = useState("");
  const [selectedData, setSelectedData] = useState<BitcoinPrice[]>([]); // selected data
  const [window, setWindow] = useState<string>(DEFAULT_WINDOW); // selected time window

  // Hook to set specific data when time window changes
  useEffect(() => {
    if (window in allData && allData[window]?.length) {
      setSelectedData(allData[window] as BitcoinPrice[]);
    } else setSelectedData([]);
  }, [allData, window]);

  // hook to fetch Bitcoin price data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAllBtcDataAndFilter();
        setAllData(data);
        const newestPrice = data[DEFAULT_WINDOW]?.slice(-1)[0]?.value;
        setCurPrice(newestPrice ? newestPrice : undefined);
        setError("");
      } catch (err) {
        setError(`${err}`);
        setAllData({});
        setCurPrice(undefined);
      }
    };
    fetchData();
  }, []);

  return { curPrice, error, selectedData, setWindow, window };
};
