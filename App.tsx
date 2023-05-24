import { BitcoinPrice } from "./app/types";
import { StyleSheet, Text, View, Image } from "react-native";
import { TIMEWINDOWS, DEFAULT_WINDOW, fetchAllBtcData } from "./app/utils";
import { useState, useEffect } from "react";
import Chart from "./app/components/Chart";
import PriceChange from "./app/components/PriceChange";
import TimeButton from "./app/components/TimeButton";

export default function App() {
  const [allData, setAllData] = useState<Record<string, BitcoinPrice[]>>({}); // object with data for different windows
  const [selData, setSelData] = useState<BitcoinPrice[]>([]); // selected data to visualize
  const [selWindow, setSelWindow] = useState<string>(DEFAULT_WINDOW); // store which time window is selected
  const [curPrice, setCurPrice] = useState<number>();

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAllBtcData();
      setAllData(data);
      const recentCandle = data["6h"]?.slice(-1)[0]?.value;
      setCurPrice(recentCandle ? recentCandle : undefined);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selWindow in allData && allData[selWindow]?.length) {
      setSelData(allData[selWindow] as BitcoinPrice[]);
    }
  }, [allData, selWindow]);

  return (
    <View style={styles.box}>
      <View style={styles.textBox}>
        <View style={styles.bitcoin}>
          <Image source={require("./app/assets/bitcoin.png")} style={styles.logo} />
          <Text style={styles.titleText}>Bitcoin</Text>
        </View>
        <Text style={styles.priceText}>{!!curPrice ? `$${curPrice.toLocaleString()}` : "NaN"}</Text>
        <PriceChange selData={selData} />
      </View>
      {selData?.length ? <Chart data={selData} /> : <Text>Loading...</Text>}
      <View style={styles.btnBox}>
        {TIMEWINDOWS.map((t) => (
          <TimeButton
            key={t.window}
            timewindow={t.window}
            selWindow={selWindow}
            setSelWindow={setSelWindow}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bitcoin: { flexDirection: "row", alignItems: "center", gap: 10 },
  box: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 15,
  },
  titleText: {
    fontSize: 30,
    fontWeight: "bold",
  },
  textBox: {
    alignSelf: "flex-start",
    alignItems: "flex-start",
    marginBottom: 40,
    gap: 7,
  },
  logo: {
    width: 30,
    height: 30,
  },
  priceText: {
    fontSize: 30,
    color: "grey",
  },
  btnBox: {
    flexDirection: "row",
    gap: 10,
  },
});
