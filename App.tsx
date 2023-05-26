import { useState, useEffect } from "react";

import { BitcoinPrice } from "./app/types";
import { Image, StyleSheet, Text, View } from "react-native";
import { DEFAULT_WINDOW, TIMEWINDOWS, TODAY } from "./app/utils";
import { useBitcoinData } from "./app/hooks";
import Chart from "./app/components/Chart";
import PriceChange from "./app/components/PriceChange";
import TimeButton from "./app/components/TimeButton";

export default function App() {
  const { allData, curPrice, error } = useBitcoinData();
  const [selData, setSelData] = useState<BitcoinPrice[]>([]); // selected data
  const [selWindow, setSelWindow] = useState<string>(DEFAULT_WINDOW); // selected time window

  useEffect(() => {
    if (selWindow in allData && allData[selWindow]?.length) {
      setSelData(allData[selWindow] as BitcoinPrice[]);
    } else setSelData([]);
  }, [allData, selWindow]);

  return (
    <View style={styles.box}>
      <View style={styles.headlineBox}>
        <Text style={styles.textDate}>{TODAY}</Text>
        <View style={styles.bitcoin}>
          <Image source={require("./app/assets/bitcoin.png")} style={styles.logo} />
          <Text style={styles.textBitcoin}>Bitcoin</Text>
        </View>
        <Text style={styles.textPrice}>{!!curPrice ? `$${curPrice.toLocaleString()}` : "NaN"}</Text>
        <PriceChange selData={selData} />
      </View>
      {selData?.length ? (
        <Chart data={selData} />
      ) : !!error ? (
        <Text style={styles.textError}>{error}</Text>
      ) : (
        <Text>Loading...</Text>
      )}
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
  btnBox: {
    flexDirection: "row",
    gap: 10,
  },
  logo: {
    width: 30,
    height: 30,
  },
  headlineBox: {
    alignSelf: "flex-start",
    alignItems: "flex-start",
    marginBottom: 40,
    gap: 7,
  },
  textBitcoin: {
    fontSize: 30,
    fontWeight: "bold",
  },
  textDate: { fontSize: 20, color: "#434343" },
  textError: {
    color: "red",
    fontSize: 25,
    paddingVertical: 30,
  },
  textPrice: {
    fontSize: 30,
    color: "#434343",
  },
});
