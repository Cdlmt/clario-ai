import { StyleSheet, View, Alert } from 'react-native'
import React from 'react'
import { useAuth } from '../../auth/context/AuthContext';
import { router } from 'expo-router';
import Text from '../../../shared/ui/text';
import { colors } from '../../../shared/constants/theme';
import { useTranslation } from '../../locales';
import { TouchableOpacity } from 'react-native';
import { deleteAccount } from '../services/deleteAccount.service';

export default function DeleteAccountButton() {
  const { signOut } = useAuth();
  const { t } = useTranslation();

  const handleDeleteAccount = async () => {
    Alert.alert(
      t('home:deleteAccountTitle'),
      t('home:deleteAccountMessage'),
      [
        {
          text: t('home:cancel'),
          style: 'cancel',
        },
        {
          text: t('home:delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAccount();
              await signOut();
              router.replace('/(onboarding)');
            } catch (error) {
              Alert.alert(t('home:deleteAccountError'));
            }
          },
        },
      ]
    );
  };

  return (
    <TouchableOpacity onPress={handleDeleteAccount} style={styles.container}>
      <Text variant="smallBody" color={colors.danger}>
        {t('home:deleteAccount')}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});