# Vietlott — Project Configuration

## Overview
React Native (Expo) mobile app for Vietnamese lottery. Supports 5 Vietlott games: Mega 6/45, Power 6/55, Lotto 5/35, Max 3D, Max 3D Pro. Multi-screen navigation with per-game detail and statistics screens. Scrapes official results, provides frequency analysis, absent number tracking, and AI-suggested number sets. Freemium model with AdMob ads + Premium IAP.

## Tech Stack
- Framework: React Native 0.83.2 + Expo SDK 55
- Language: TypeScript 5.9
- Package Manager: npm
- Test Framework: Jest 30 + ts-jest
- Build Tool: EAS Build (Expo Application Services)
- CI/CD: GitHub Actions (tsc + jest on push/PR)
- Navigation: React Navigation 7 (bottom tabs + native stack)
- Linter: none configured (planned)

## Directory Structure
```
App.tsx                  # Root: PremiumProvider → NavigationContainer → AppNavigator
index.ts                 # Entry point (registerRootComponent)
src/
├── components/          # 11 UI components
│   ├── GameResultCard   # Dashboard card for each game
│   ├── LatestResult     # Lottery result with countdown timer
│   ├── Max3DResult      # Max 3D prize tier display
│   ├── FrequencyChart   # Bar chart for number frequency
│   ├── AbsentNumbers    # Numbers missing longest
│   ├── SuggestedSets    # AI-generated number suggestions
│   ├── AdBanner         # Google AdMob banner (try/catch wrapped)
│   ├── PremiumBadge     # Premium status indicator
│   ├── PremiumPaywall   # IAP purchase modal
│   ├── PeriodFilter     # Time period selector
│   └── UpgradePromptBanner
├── context/             # PremiumContext (premium state, IAP, ad control)
├── database/            # SQLite layer — 5 tables (draws_645, draws_655, draws_535, draws_max3d, draws_max3d_pro)
├── hooks/               # useHomeDashboard (data fetching + state for home screen)
├── navigation/          # AppNavigator (bottom tabs + per-game stacks)
├── screens/             # 3 screens: HomeScreen, GameDetailScreen, GameStatsScreen
├── services/            # scraper.ts (multi-game API), interstitialAd.ts
├── types/               # GameConfig, GameId, navigation param types
├── utils/               # statistics.ts (frequency, suggestions — parameterized by GameId)
└── theme.ts             # Color palette (dark theme)
assets/                  # App icons, splash screen
scripts/                 # generate-icons.js (sharp-based icon generator)
store-assets/            # Play Store listing assets
.github/workflows/       # CI pipeline (tsc + jest)
```

## Games Supported
| Game | GameId | Table | Numbers | Draw Days |
|------|--------|-------|---------|-----------|
| Mega 6/45 | mega645 | draws_645 | 6 of 1–45 | T4, T6, CN |
| Power 6/55 | power655 | draws_655 | 6 of 1–55 + power | T3, T5, T7 |
| Lotto 5/35 | lotto535 | draws_535 | 5 of 1–35 + special | T3, T5, T7 |
| Max 3D | max3d | draws_max3d | 3-digit pairs | T2, T4, T6 |
| Max 3D Pro | max3d_pro | draws_max3d_pro | 3-digit pairs | T3, T5, T7 |

## Conventions
- Naming: PascalCase components, camelCase functions/variables, kebab-case files (except components)
- Components: functional with hooks, `export default function`, StyleSheet at bottom
- Error handling: `catch (e: unknown)` with `(e as Error)?.message`, Alert.alert for user-facing, console.warn for silent
- State management: React Context (PremiumContext) + local useState + custom hooks (useHomeDashboard)
- API pattern: direct fetch to Vietlott AJAX endpoints, HTML regex parsing (no cheerio)
- Data layer: expo-sqlite with parameterized queries, JSON array storage, singleton DB connection
- All DB/scraper functions accept `gameId: GameId` as first parameter
- Game config: `GAME_CONFIGS[gameId]` for number ranges, table names, API endpoints
- Ads: react-native-google-mobile-ads with try/catch fallback if SDK unavailable
- Numbers: padded with `String(n).padStart(2, '0')` for lottery, `padStart(3, '0')` for Max 3D
- Navigation: bottom tabs (Home + 4 game tabs), each game tab has native stack (Detail → Stats)

## Commands
- Install: `npm install`
- Dev: `npx expo start --dev-client`
- Test: `npx jest --ci`
- Type check: `npx tsc --noEmit`
- Build APK: `npx eas-cli build --platform android --profile preview --non-interactive`
- Build AAB: `npx eas-cli build --platform android --profile production --non-interactive`
- Generate icons: `node scripts/generate-icons.js`

## Key Files
- Entry point: `App.tsx`, `index.ts`
- Config: `app.json`, `eas.json`, `tsconfig.json`, `jest.config.js`
- Game types: `src/types/game.ts` (GameId, GameConfig, GAME_CONFIGS)
- Navigation types: `src/types/navigation.ts`
- Navigator: `src/navigation/AppNavigator.tsx`
- Home dashboard: `src/screens/HomeScreen.tsx` + `src/hooks/useHomeDashboard.ts`
- Game detail: `src/screens/GameDetailScreen.tsx`
- Game stats: `src/screens/GameStatsScreen.tsx` (premium gated)
- Data scraper: `src/services/scraper.ts` (multi-game, concurrent fetch)
- Database: `src/database/database.ts` (5-table schema, migration from legacy)
- Statistics: `src/utils/statistics.ts` (parameterized by GameId)
- Tests: `src/utils/statistics.test.ts` (17 tests, 96% coverage)
- Premium: `src/context/PremiumContext.tsx`
- Ad system: `src/components/AdBanner.tsx`, `src/services/interstitialAd.ts`
- Theme: `src/theme.ts`

## AdMob
- App ID: `ca-app-pub-5240031366086683~4032470389`
- Banner Unit: `ca-app-pub-5240031366086683/5898684425`
- Interstitial: configure in Google AdMob console
