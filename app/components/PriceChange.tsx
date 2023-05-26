import { BitcoinPrice } from "../types";
import { StyleSheet, Text } from "react-native";

const PriceChange = ({ selData }: { selData: BitcoinPrice[] }) => {
  let diff: number | undefined; // compute % price difference
  if (!!selData && selData.length !== 0) {
    const first = selData[0]?.value;
    const last = selData.slice(-1)[0]?.value;
    if (first && last) {
      diff = ((last - first) / first) * 100;
      diff = Number(diff.toFixed(2));
    }
  }

  return (
    <Text
      style={[
        styles.priceChangeText,
        !diff || diff === 0 ? styles.zeroText : diff > 0 ? styles.greenText : styles.redText,
      ]}
    >
      {!diff ? "NaN" : diff <= 0 ? diff : `+${diff}`}%
    </Text>
  );
};

const styles = StyleSheet.create({
  priceChangeText: {
    fontSize: 20,
    color: "grey",
  },
  greenText: {
    color: "#00C853",
  },
  redText: {
    color: "#FF1744",
  },
  zeroText: {
    color: "grey",
  },
});

export default PriceChange;
