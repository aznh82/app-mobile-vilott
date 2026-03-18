import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../theme';
import { usePremium } from '../context/PremiumContext';

const BANNER_AD_ID = __DEV__ ? 'ca-app-pub-3940256099942544/6300978111' : 'ca-app-pub-5240031366086683/5898684425';

interface AdBannerProps {
  placement?: 'bottom' | 'inline';
}

function BannerAdWrapper({ placement }: { placement: 'bottom' | 'inline' }) {
  const isInline = placement === 'inline';

  try {
    const { BannerAd, BannerAdSize } = require('react-native-google-mobile-ads');
    return (
      <BannerAd
        unitId={BANNER_AD_ID}
        size={isInline ? BannerAdSize.MEDIUM_RECTANGLE : BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: false,
          keywords: ['lottery', 'statistics', 'prediction', 'vietlott'],
        }}
        onAdFailedToLoad={() => {
          // Silently fail - don't crash
          console.warn('Ad failed to load');
        }}
      />
    );
  } catch (e) {
    // AdMob not available — return nothing
    return null;
  }
}

export default function AdBanner({ placement = 'bottom' }: AdBannerProps) {
  const { isPremium } = usePremium();

  if (isPremium) return null;

  const isInline = placement === 'inline';

  return (
    <View style={isInline ? styles.inlineContainer : styles.bottomContainer}>
      <BannerAdWrapper placement={placement} />
    </View>
  );
}

const styles = StyleSheet.create({
  bottomContainer: {
    alignItems: 'center',
    marginVertical: 8,
    backgroundColor: colors.bgCard,
    borderTopWidth: 1,
    borderTopColor: colors.borderCard,
    paddingTop: 8,
  },
  inlineContainer: {
    alignItems: 'center',
    marginVertical: 12,
    borderRadius: 10,
    overflow: 'hidden',
  },
});
