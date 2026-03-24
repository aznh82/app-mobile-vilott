# Phase 3: Ship

## Goal
Wire ads and premium IAP to all new screens, add offline/error handling polish, run a production
EAS build, and submit to the Play Store. After this phase the app is live with all 5 games.

## Data Flow
```
App launch
  └── AdMob SDK init (non-blocking, existing logic)
  └── NavigationContainer → tabs

Any screen
  └── AdBanner (bottom) → AdMob Banner unit
  └── Interstitial trigger:
        - First stats view per session → showInterstitial()
        - After every 3 refreshes on detail screen → showInterstitial()

GameStatsScreen (non-premium user)
  └── PremiumPaywall modal
        └── onPurchase → react-native-iap → PremiumContext.setPremium(true)
        └── onRestore → react-native-iap.restorePurchases() → setPremium if found

Network errors
  └── fetchNew / fetchAllGames fails → Alert.alert with retry button
  └── DB not ready → queue operations, retry after 500ms (existing pattern)
```

## Code Contracts

```typescript
// src/services/interstitialAd.ts  (modify — ensure compatible with multi-screen)
export function showInterstitialAd(): Promise<void>;
// Already exists; ensure it can be called from GameStatsScreen and GameDetailScreen

// src/context/PremiumContext.tsx  (verify — no new interface, confirm exports)
export interface PremiumContextValue {
  isPremium: boolean;
  setPremium: (value: boolean) => void;
  loading: boolean;
}
export function usePremium(): PremiumContextValue;

// src/components/AdBanner.tsx  (verify — already exists, confirm reusable)
interface AdBannerProps {
  position?: 'top' | 'bottom';
}
export default function AdBanner(props: AdBannerProps): JSX.Element;
// Must render without crash when AdMob SDK is unavailable (try/catch wrapper)

// EAS build — no code change, command only
// npx eas-cli build --platform android --profile production --non-interactive
```

## Tasks

- [ ] Task 1 — Verify AdBanner renders on all new screens
  - File: `src/screens/GameDetailScreen.tsx` (verify/modify — add AdBanner if missing)
  - File: `src/screens/GameStatsScreen.tsx` (verify/modify — add AdBanner if missing)
  - File: `src/screens/HomeScreen.tsx` (already has AdBanner — confirm still present)
  - Verify: Visual check — banner visible on all 3 screen types
  - Commit: `feat(ads): ensure AdBanner present on all game screens`
  - Logic:
    - AdBanner at bottom of GameDetailScreen (above safe area)
    - AdBanner at bottom of GameStatsScreen
    - HomeScreen already has top + bottom banners — preserve both
    - AdBanner component must have try/catch so SDK failure does not crash screen

- [ ] Task 2 — Wire interstitial ad triggers
  - File: `src/screens/GameStatsScreen.tsx` (modify — add interstitial trigger)
  - File: `src/screens/GameDetailScreen.tsx` (modify — add interstitial on refresh)
  - Verify: On device — interstitial appears after navigating to stats (non-premium)
  - Commit: `feat(ads): add interstitial triggers on stats view and detail refresh`
  - Logic:
    - GameStatsScreen: call showInterstitialAd() on first mount if !isPremium
    - GameDetailScreen: track refresh count in useRef; show interstitial every 3 pulls
    - Wrap showInterstitialAd() in try/catch — never let ad failure crash the screen

- [ ] Task 3 — Verify premium gate on GameStatsScreen
  - File: `src/screens/GameStatsScreen.tsx` (verify/modify)
  - File: `src/components/PremiumPaywall.tsx` (verify — existing component)
  - Verify: Non-premium → paywall shown; after IAP purchase → stats visible
  - Commit: `fix(premium): confirm paywall blocks GameStatsScreen for all 5 games`
  - Logic:
    - usePremium() from PremiumContext — if !isPremium, render PremiumPaywall
    - PremiumPaywall onPurchase: call react-native-iap purchase flow, on success setPremium(true)
    - PremiumPaywall onRestore: call restorePurchases(), map product IDs, setPremium if found
    - After premium: paywall unmounts, stats render immediately
  - Edge: Premium state must persist across app restarts (AsyncStorage in PremiumContext)

- [ ] Task 4 — Offline and error handling polish
  - File: `src/screens/HomeScreen.tsx` (modify — error handling)
  - File: `src/screens/GameDetailScreen.tsx` (modify — error handling)
  - Verify: Disable WiFi → refresh → Alert appears with retry; re-enable → retry succeeds
  - Commit: `fix(ux): add offline error alerts with retry on all fetch operations`
  - Logic:
    - fetchAllGames failure in HomeScreen: Alert.alert("Lỗi kết nối", message, [{text:"Thử lại", onPress: reload}])
    - fetchNew failure in GameDetailScreen: same Alert pattern
    - On retry, call same fetch function — do not duplicate fetch logic
    - DB errors: console.warn only (not user-facing) — DB failures are rare and hard to recover

- [ ] Task 5 — Tab bar icons and navigation polish
  - File: `src/navigation/AppNavigator.tsx` (modify)
  - Verify: Visual check — tab bar looks clean on dark background
  - Commit: `chore(ui): add tab bar icons and polish navigation appearance`
  - Logic:
    - Use @expo/vector-icons (already available in Expo SDK) for tab icons
    - Home: house icon, 6/45 / 6/55 / 5/35: grid or star icon, Max 3D: dice icon
    - Tab label text matches GameConfig.tabLabel
    - headerShown: false on all stack navigators (custom headers in screens)

- [ ] Task 6 — EAS production build
  - File: `eas.json` (verify production profile exists)
  - File: `app.json` (verify version bump)
  - Verify: Build completes without errors; AAB file produced
  - Commit: `chore(release): bump version for multi-game release`
  - Command:
    ```
    npx eas-cli build --platform android --profile production --non-interactive
    ```
  - Logic:
    - Increment version in app.json (versionCode + version string)
    - Verify google-services.json present (AdMob requires it)
    - Verify BILLING permission in app.json plugins for react-native-iap
    - Build must complete with zero warnings about missing native modules

## Failure Scenarios

| When | Then | Error Type |
|------|------|-----------|
| AdMob SDK unavailable (slow init) | AdBanner try/catch renders null; screen works normally | Silent fallback |
| Interstitial not loaded when triggered | showInterstitialAd() catches error; no crash; no ad shown | Silent catch |
| IAP purchase fails (network/user cancel) | Alert.alert with friendly message; isPremium stays false | Alert.alert |
| restorePurchases returns empty | Alert "Không tìm thấy giao dịch cũ"; isPremium unchanged | Alert.alert |
| EAS build fails: missing google-services.json | Add file from Firebase console, rebuild | Build error |
| EAS build fails: BILLING permission missing | Confirm app.json has react-native-iap plugin entry | Build error |

## Rejection Criteria (DO NOT)
- DO NOT skip the AdBanner try/catch — SDK init is non-blocking and may not be ready
- DO NOT call showInterstitialAd() for premium users — check isPremium first
- DO NOT push to Play Store manually — use EAS Submit or deliver the AAB to the user
- DO NOT bump versionCode without also bumping version string — Play Store rejects it
- DO NOT add any new screens or features — Phase 3 is wiring and shipping only

## Cross-Phase Context
- **Assumes from Phase 1**: NavigationContainer, SafeAreaProvider, all 5 game tabs
- **Assumes from Phase 2**: All screens implemented (Home, GameDetail, GameStats), AdBanner present
  in screens, PremiumPaywall imported in GameStatsScreen, statistics working for all games
- **Exports**: Final production APK/AAB artifact; app live on Play Store
- **Interface contract**: No new interfaces introduced in Phase 3 — only wiring existing ones

## Acceptance Criteria
- [ ] AdBanner renders on HomeScreen, GameDetailScreen, GameStatsScreen without crash
- [ ] Interstitial fires on first GameStatsScreen visit (non-premium user)
- [ ] Interstitial fires every 3 pull-to-refreshes on GameDetailScreen (non-premium)
- [ ] PremiumPaywall blocks all 5 game stats screens for non-premium users
- [ ] After purchase, stats unlock immediately without restart
- [ ] Offline refresh shows Alert with retry button
- [ ] Retry after reconnect succeeds
- [ ] Tab bar icons render correctly on dark background
- [ ] `npx tsc --noEmit` passes with zero errors
- [ ] EAS build completes and produces valid AAB
- [ ] No crash on cold launch in production build

## Files Touched
- `src/screens/GameDetailScreen.tsx` — modify (AdBanner + interstitial + error handling)
- `src/screens/GameStatsScreen.tsx` — modify (AdBanner + interstitial + premium verify)
- `src/screens/HomeScreen.tsx` — modify (error handling polish)
- `src/navigation/AppNavigator.tsx` — modify (tab icons)
- `app.json` — modify (version bump)
- `eas.json` — verify (no change expected)
