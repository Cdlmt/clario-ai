import { StyleSheet, View } from 'react-native'
import React from 'react'
import { useAuth } from '../../auth/context/AuthContext';
import { router } from 'expo-router';
import Button from '../../../shared/ui/button';
import Text from '../../../shared/ui/text';
import { colors } from '../../../shared/constants/theme';

export default function SignoutButton() {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  }

  return (
    <Button variant="danger" onPress={handleSignOut}>
      <Text variant="body" weight="bold" color={colors.white}>Sign out</Text>
    </Button>
  )
}

const styles = StyleSheet.create({})