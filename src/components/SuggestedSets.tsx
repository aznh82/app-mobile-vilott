import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme';
import { SuggestedSet } from '../utils/statistics';
import { usePremium } from '../context/PremiumContext';

interface SuggestedSetsProps {
  sets: SuggestedSet[];
  totalDraws: number;
  onRegenerate: () => void;
  onUpgrade?: () => void;
}

export default function SuggestedSets({
  sets,
  totalDraws,
  onRegenerate,
  onUpgrade,
}: SuggestedSetsProps) {
  const { isPremium, maxSuggestedSets } = usePremium();
  const visibleSets = sets.slice(0, maxSuggestedSets);
  const lockedCount = Math.max(0, 5 - maxSuggestedSets);

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>
        {isPremium ? '5 Bộ Số Gợi Ý (Nâng cao)' : `${maxSuggestedSets} Bộ Số Gợi Ý`}
      </Text>
      <Text style={styles.infoText}>
        {sets.length > 0
          ? isPremium
            ? `Dựa trên ${totalDraws} kỳ — Thuật toán đa chiến lược`
            : `Dựa trên ${totalDraws} kỳ — 5 số nóng + 1 số ngẫu nhiên`
          : '5 số nóng (cam) + 1 số ngẫu nhiên/vắng mặt (xanh)'}
      </Text>

      {sets.length === 0 ? (
        <Text style={styles.placeholder}>
          Nhấn "Cập nhật dữ liệu" để bắt đầu
        </Text>
      ) : (
        <>
          {visibleSets.map((set, i) => (
            <View key={set.numbers.join('-')} style={styles.setCard}>
              <View style={styles.setLabelContainer}>
                <Text style={styles.setLabel}>Bộ {i + 1}</Text>
                {set.strategy && (
                  <Text style={styles.strategyLabel}>{set.strategy}</Text>
                )}
              </View>
              <View style={styles.setBalls}>
                {set.numbers.map((num, j) => (
                  <View
                    key={j}
                    style={[
                      styles.ball,
                      num === set.cold && styles.ballCold,
                    ]}
                  >
                    <Text style={styles.ballText}>{num}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}

          {/* Locked sets teaser for free users */}
          {!isPremium && lockedCount > 0 && (
            <TouchableOpacity
              style={styles.lockedCard}
              onPress={onUpgrade}
              activeOpacity={0.7}
            >
              <View style={styles.lockedBalls}>
                {Array.from({ length: 6 }).map((_, j) => (
                  <View key={j} style={styles.ballLocked}>
                    <Text style={styles.ballLockedText}>?</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.lockedText}>
                +{lockedCount} bộ số nâng cao
              </Text>
              <Text style={styles.lockedCta}>👑 Mở khóa Premium</Text>
            </TouchableOpacity>
          )}
        </>
      )}

      <View style={styles.regenContainer}>
        <TouchableOpacity
          style={styles.regenBtn}
          onPress={onRegenerate}
          activeOpacity={0.7}
        >
          <Text style={styles.regenText}>Tạo lại bộ số</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.borderCard,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 10,
  },
  placeholder: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: 16,
  },
  setCard: {
    backgroundColor: colors.bgCardInner,
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  setLabelContainer: {
    minWidth: 40,
  },
  setLabel: {
    color: colors.accent,
    fontWeight: '700',
    fontSize: 14,
  },
  strategyLabel: {
    color: colors.jackpotGold,
    fontSize: 9,
    fontWeight: '600',
    marginTop: 2,
  },
  setBalls: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  ball: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ballCold: {
    backgroundColor: colors.cold,
  },
  ballText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  // Locked teaser
  lockedCard: {
    backgroundColor: 'rgba(38,53,69,0.4)',
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(245,200,66,0.2)',
    borderStyle: 'dashed',
  },
  lockedBalls: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 8,
  },
  ballLocked: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(100,120,140,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ballLockedText: {
    color: 'rgba(255,255,255,0.3)',
    fontWeight: '700',
    fontSize: 15,
  },
  lockedText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: 4,
  },
  lockedCta: {
    fontSize: 13,
    color: colors.jackpotGold,
    fontWeight: '700',
  },
  regenContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  regenBtn: {
    borderWidth: 1.5,
    borderColor: colors.accent,
    backgroundColor: 'transparent',
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 20,
  },
  regenText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.accent,
  },
});
