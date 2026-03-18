import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme';
import { usePremium } from '../context/PremiumContext';

interface UpgradePromptBannerProps {
  onUpgrade: () => void;
}

export default function UpgradePromptBanner({ onUpgrade }: UpgradePromptBannerProps) {
  const { isPremium, showUpgradePrompt, dismissUpgradePrompt } = usePremium();

  if (isPremium || !showUpgradePrompt) return null;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeBtn} onPress={dismissUpgradePrompt}>
        <Text style={styles.closeBtnText}>✕</Text>
      </TouchableOpacity>

      <Text style={styles.icon}>👑</Text>
      <Text style={styles.title}>Mở khóa Premium</Text>
      <Text style={styles.desc}>
        Không quảng cáo • 5 bộ số nâng cao • Thuật toán thông minh
      </Text>

      <TouchableOpacity style={styles.upgradeBtn} onPress={onUpgrade} activeOpacity={0.7}>
        <Text style={styles.upgradeBtnText}>Nâng cấp ngay</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(245,200,66,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(245,200,66,0.3)',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 8,
    right: 12,
    zIndex: 1,
  },
  closeBtnText: {
    color: colors.textMuted,
    fontSize: 16,
    fontWeight: '600',
  },
  icon: {
    fontSize: 28,
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.jackpotGold,
    marginBottom: 4,
  },
  desc: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
  },
  upgradeBtn: {
    backgroundColor: colors.jackpotGold,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  upgradeBtnText: {
    color: '#111',
    fontWeight: '700',
    fontSize: 13,
  },
});
