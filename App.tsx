import { StyleSheet, Text, View, Image } from "react-native";
import Chart from "./app/components/Chart";
import TimeButton from "./app/components/TimeButton";
import { data } from "./app/data";
import { TIMEWINDOWS, fetchAllBtcData } from "./app/utils";
import { useState, useEffect } from "react";
import { BitcoinPrice } from "./app/types";

export default function App() {
  const [allData, setAllData] = useState<Record<string, BitcoinPrice[]>>({}); // object with data for different windows
  const [selData, setSelData] = useState<BitcoinPrice[]>([]); // selected data to visualize
  const [selWindow, setSelWindow] = useState(TIMEWINDOWS[0].window); // store which time window is selected
  const [curPrice, setCurPrice] = useState<number>();

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAllBtcData();
      setAllData(data);
      setCurPrice(allData["6h"].slice(-1)[0].value);
    };
    fetchData();
  }, []);

  useEffect(() => {
    setSelData(allData[selWindow]);
  }, [allData, selWindow]);
  console.log(curPrice);
  return (
    <View style={styles.box}>
      <View style={styles.textBox}>
        <View style={styles.bitcoin}>
          <Image source={require("./app/assets/bitcoin.png")} style={{ width: 30, height: 30 }} />
          <Text style={styles.titleText}>Bitcoin</Text>
        </View>
        <Text style={styles.priceText}>{!!curPrice ? `$${curPrice.toLocaleString()}` : "NaN"}</Text>
        <Text style={styles.priceChangeText}>+23%</Text>
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
  tinyLogo: {
    width: 50,
    height: 50,
  },
  priceText: {
    fontSize: 30,
    color: "grey",
  },
  priceChangeText: {
    fontSize: 15,
    color: "grey",
  },
  btnBox: {
    flexDirection: "row",
    gap: 10,
  },
  redText: {
    color: "#FF1744",
  },
  greenText: {
    color: "#00C853",
  },
  zeroText: {
    color: "grey",
  },
});
