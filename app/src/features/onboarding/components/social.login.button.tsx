import { Image, ImageSourcePropType, StyleSheet, TouchableOpacity, View } from "react-native";
import Text from "../../../shared/ui/text";
import { colors } from "../../../shared/constants/theme";
import { useMemo } from "react";
import FacebookIcon from '../../../shared/assets/logos/facebook.png';
import GoogleIcon from '../../../shared/assets/logos/google.png';
import AppleIcon from '../../../shared/assets/logos/apple.png';
import { useTranslation } from "../../locales";

type SocialLoginProvider = 'facebook' | 'google' | 'apple';

type SocialLoginButtonProps = {
  provider: SocialLoginProvider;
  onPress: () => void;
};

const providerIcons: Record<SocialLoginProvider, ImageSourcePropType> = {
  facebook: FacebookIcon,
  google: GoogleIcon,
  apple: AppleIcon,
};

export default function SocialLoginButton(props: SocialLoginButtonProps) {
  const { provider, onPress } = props;
  const { t } = useTranslation();

  const providerText = useMemo(() => provider.charAt(0).toUpperCase() + provider.slice(1), [provider]);

  return (
    <TouchableOpacity style={[styles.container, stylesColors[provider]]} onPress={onPress}>
      <Image source={providerIcons[provider]} style={styles.icon} resizeMode="contain" />
      <Text variant="body" weight="bold" style={stylesText[provider]}>{t('onboarding:continueWith', { provider: providerText })}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 50,
    borderRadius: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
  },
  icon: {
    width: 24,
    height: 24,
  },
});

const stylesColors = StyleSheet.create({
  facebook: {
    backgroundColor: '#1877F2',
  },
  google: {
    backgroundColor: colors.lightGray,
  },
  apple: {
    backgroundColor: '#000000',
  },
});

const stylesText = StyleSheet.create({
  facebook: {
    color: colors.white,
  },
  google: {
    color: colors.black,
  },
  apple: {
    color: colors.white,
  },
});