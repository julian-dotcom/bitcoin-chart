import { StyleSheet, Text, Pressable } from "react-native";

const TimeButton = ({
  timewindow,
  selWindow,
  setSelWindow,
}: {
  timewindow: string;
  selWindow: string;
  setSelWindow: (selWindow: string) => void;
}) => {
  return (
    <Pressable
      style={[styles.btn, timewindow === selWindow && styles.selBtn]}
      onPress={() => setSelWindow(timewindow)}
    >
      <Text>{timewindow}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  btn: {
    borderRadius: 10,
    backgroundColor: "#f6f8fa",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  selBtn: {
    backgroundColor: "#c0c0c0",
  },
});

export default TimeButton;
