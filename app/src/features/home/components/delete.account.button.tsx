import { StyleSheet, View, Alert, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
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
  const [isDeleting, setIsDeleting] = useState(false);

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
            setIsDeleting(true);
            try {
              await deleteAccount();
              await signOut();
              router.replace('/(onboarding)');
            } catch (error) {
              Alert.alert(t('home:deleteAccountError'));
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  return (
    <TouchableOpacity
      onPress={handleDeleteAccount}
      style={styles.container}
      disabled={isDeleting}
    >
      {isDeleting ? (
        <ActivityIndicator size="small" color={colors.danger} />
      ) : (
        <Text variant="smallBody" color={colors.danger}>
          {t('home:deleteAccount')}
        </Text>
      )}
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