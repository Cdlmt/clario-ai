import React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, paddings } from "../../../shared/constants/theme";
import PracticeHeader from "./practice.header";

type PracticeAnswerLayoutProps = {
  children: React.ReactNode;
};

export const PracticeAnswerLayout = ({ children }: PracticeAnswerLayoutProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <PracticeHeader theme="dark" />
      <View style={[styles.content, { paddingBottom: insets.bottom }]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.secondary,
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: paddings.horizontal,
    paddingVertical: paddings.vertical,
  },
});

