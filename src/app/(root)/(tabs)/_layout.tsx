import { NativeTabs } from 'expo-router/native-tabs';
import { useColorScheme } from 'react-native';

// Keep in sync with the brand palette in src/global.css.
const TAB_COLORS = {
  light: { background: '#ffffff', inactive: '#8a8d96', active: '#1a85ff' },
  dark: { background: '#0b0e14', inactive: '#5c5f68', active: '#1a85ff' },
} as const;

export default function TabsLayout() {
  const colors = TAB_COLORS[useColorScheme() === 'dark' ? 'dark' : 'light'];

  return (
    <NativeTabs
      backgroundColor={colors.background}
      tintColor={colors.active}
      iconColor={{ default: colors.inactive, selected: colors.active }}
      labelStyle={{
        default: { color: colors.inactive },
        selected: { color: colors.active },
      }}>
      <NativeTabs.Trigger name="home">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="house.fill" md="home" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="transactions">
        <NativeTabs.Trigger.Label>Transactions</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="list.bullet" md="list" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="assistant">
        <NativeTabs.Trigger.Label>Assistant</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="brain.head.profile" md="smart_toy" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="person.fill" md="person" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
