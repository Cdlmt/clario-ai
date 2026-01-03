import { StyleSheet, View } from 'react-native'
import React from 'react'
import { colors, gaps } from '../../../shared/constants/theme';
import Text from '../../../shared/ui/text';
import SpotifyIcon from '../../../shared/assets/logos/spotify.png';
import GoogleIcon from '../../../shared/assets/logos/google.png';
import AppleIcon from '../../../shared/assets/logos/apple.png';
import StripeIcon from '../../../shared/assets/logos/stripe.png';
import AnthropicIcon from '../../../shared/assets/logos/anthropic.png';
import NetflixIcon from '../../../shared/assets/logos/netflix.png';
import SpecificPracticeItem from './specific.practice.item';

export default function SpecificPractices() {
  return (
    <View style={styles.container}>
      <Text variant="largeBody" weight="medium">🔓 Specific practices</Text>
      <SpecificPracticeItem icon={SpotifyIcon} name="Spotify" backgroundColor="#1DB954" color={colors.white} />
      <SpecificPracticeItem icon={GoogleIcon} name="Google" backgroundColor={colors.lightGray} color={colors.black} />
      <SpecificPracticeItem icon={StripeIcon} name="Stripe" backgroundColor="#5433FF" color={colors.white} />
      <SpecificPracticeItem icon={AnthropicIcon} name="Anthropic" backgroundColor="#DDDDDD" color={colors.black} />
      <SpecificPracticeItem icon={NetflixIcon} name="Netflix" backgroundColor="#191919" color={colors.white} />
      <SpecificPracticeItem icon={AppleIcon} name="Apple" backgroundColor={colors.black} color={colors.white} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: gaps.inner,
  },
});