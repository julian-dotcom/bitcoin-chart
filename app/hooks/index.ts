import { useState, useEffect } from "react";
import { fetchAllBtcDataAndFilter, DEFAULT_WINDOW } from "../utils";
import { BitcoinPrice } from "../types";

export const useBitcoinData = () => {
  const [allData, setAllData] = useState<Record<string, BitcoinPrice[]>>({}); // object with data for all timedframes
  const [curPrice, setCurPrice] = useState<number>();
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAllBtcDataAndFilter();
        setAllData(data);
        const newestPrice = data[DEFAULT_WINDOW]?.slice(-1)[0]?.value;
        setCurPrice(newestPrice ? newestPrice : undefined);
        setError("");
      } catch (err) {
        console.error("Messed up", `${err}`);
        setError(`${err}`);
        setAllData({});
        setCurPrice(undefined);
      }
    };
    fetchData();
  }, []);

  return { allData, curPrice, error };
};
