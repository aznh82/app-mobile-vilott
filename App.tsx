import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Platform } from 'react-native';
import { PremiumProvider } from './src/context/PremiumContext';
import HomeScreen from './src/screens/HomeScreen';
import { colors } from './src/theme';

export default function App() {
  return (
    <PremiumProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <HomeScreen />
      </SafeAreaView>
    </PremiumProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
});
