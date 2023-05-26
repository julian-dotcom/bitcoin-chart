import { BITCOIN_COLOR } from "../utils";
import { BitcoinPrice } from "../types";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LineChart } from "react-native-wagmi-charts";

const Chart = ({ data }: { data: BitcoinPrice[] }) => {
  return (
    <GestureHandlerRootView>
      <LineChart.Provider data={data}>
        <LineChart>
          {/* 
          // @ts-ignore */}
          <LineChart.Path color={BITCOIN_COLOR} useLegacyImplementation={true}>
            <LineChart.Gradient />
          </LineChart.Path>
          <LineChart.CursorCrosshair color={BITCOIN_COLOR}>
            <LineChart.Tooltip
              textStyle={{
                backgroundColor: BITCOIN_COLOR,
                borderRadius: 4,
                color: "white",
                fontSize: 18,
                padding: 4,
              }}
            />
            <LineChart.Tooltip position="bottom">
              <LineChart.DatetimeText />
            </LineChart.Tooltip>
          </LineChart.CursorCrosshair>
        </LineChart>
      </LineChart.Provider>
    </GestureHandlerRootView>
  );
};

export default Chart;
