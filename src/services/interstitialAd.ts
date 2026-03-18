import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';

const AD_UNIT_ID = __DEV__
  ? TestIds.INTERSTITIAL
  : 'ca-app-pub-xxxxxxxxxxxxxxxx/zzzzzzzzzzzzzz';

let interstitial: ReturnType<typeof InterstitialAd.createForAdRequest> | null = null;
let isLoaded = false;

function createAndLoad() {
  interstitial = InterstitialAd.createForAdRequest(AD_UNIT_ID, {
    keywords: ['lottery', 'statistics', 'vietlott'],
  });

  interstitial.addAdEventListener(AdEventType.LOADED, () => {
    isLoaded = true;
  });

  interstitial.addAdEventListener(AdEventType.CLOSED, () => {
    isLoaded = false;
    // Preload next interstitial
    createAndLoad();
  });

  interstitial.addAdEventListener(AdEventType.ERROR, () => {
    isLoaded = false;
    // Retry after 30s
    setTimeout(createAndLoad, 30000);
  });

  interstitial.load();
}

export function preloadInterstitial() {
  if (!interstitial) {
    createAndLoad();
  }
}

export async function showInterstitialAd(): Promise<boolean> {
  if (isLoaded && interstitial) {
    try {
      await interstitial.show();
      return true;
    } catch {
      return false;
    }
  }
  return false;
}
