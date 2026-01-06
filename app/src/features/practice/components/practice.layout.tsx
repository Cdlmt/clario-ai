import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, usePathname } from "expo-router";
import { useEffect } from "react";
import { colors, paddings } from "../../../shared/constants/theme";
import PracticeHeader from "./practice.header";
import PracticeBottomBar from "./practice.bottombar";
import { useMembership } from "../../membership/hooks/useMembership";

type PracticeLayoutProps = {
  children: React.ReactNode;
};

export const PracticeLayout = ({ children }: PracticeLayoutProps) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();
  const { canPerformAction, isLoading } = useMembership();

  useEffect(() => {
    const checkAccess = async () => {
      if (isLoading) return; // Wait for loading to complete

      // Allow access to feedback page even if limits are reached
      // (user has already completed a session)
      if (pathname.includes('/practice/feedback')) {
        return;
      }

      try {
        const canAccess = await canPerformAction('transcribe');
        if (!canAccess) {
          // User cannot access practice, redirect to home
          router.replace('/home');
        }
      } catch (error) {
        console.error('Error checking practice access:', error);
        // In case of error, redirect to home for safety
        router.replace('/home');
      }
    };

    checkAccess();
  }, [canPerformAction, isLoading, router, pathname]);

  // Show loading or nothing while checking access
  if (isLoading && !pathname.includes('/practice/feedback')) {
    return null;
  }

  return (
    <View style={styles.container}>
      <PracticeHeader theme="light" />
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

