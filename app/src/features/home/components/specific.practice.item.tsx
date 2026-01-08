import React from 'react'
import { Alert, Image, ImageSourcePropType, StyleSheet, TouchableOpacity, View } from 'react-native'
import Text from '../../../shared/ui/text';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from '../../locales';

type SpecificPracticeItemProps = {
  icon: ImageSourcePropType;
  name: string;
  backgroundColor: string;
  color: string;
}

export default function SpecificPracticeItem(props: SpecificPracticeItemProps) {
  const { icon, name, backgroundColor, color } = props;
  const { t } = useTranslation();

  function handlePress() {
    Alert.alert('Coming soon');
  }

  return (
    <TouchableOpacity style={[styles.container, { backgroundColor }]} onPress={handlePress}>
      <View style={styles.contentContainer}>
        <View style={styles.iconContainer}>
          <Image source={icon} style={styles.icon} />
        </View>
        <View style={styles.textContainer}>
          <Text variant="largeBody" weight="medium" color={color} style={{ lineHeight: 16 }}>{name}</Text>
          <Text variant="text" weight="regular" color={color}>{t('home:practiceWithCompany', { company: name })}</Text>
        </View>
      </View>
      <Feather name="chevron-right" size={24} color={color} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 55,
    padding: 10,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 24,
    height: 24,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  textContainer: {
    justifyContent: 'center',
    paddingTop: 10,
    gap: 0,
  },
});