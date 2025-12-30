import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, paddings } from "../../../shared/constants/theme";
import PracticeHeader from "./practice.header";
import PracticeBottomBar from "./practice.bottombar";

type PracticeLayoutProps = {
  children: React.ReactNode;
};

export const PracticeLayout = ({ children }: PracticeLayoutProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <PracticeHeader />
      <View style={[styles.content, { paddingBottom: insets.bottom }]}>
        {children}
      </View>
      <PracticeBottomBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: paddings.horizontal,
    paddingVertical: paddings.vertical,
  },
});

