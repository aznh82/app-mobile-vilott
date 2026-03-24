# Developer Guide: Vietlott

## What This Does
Mobile app that scrapes results for 5 Vietlott lottery games (Mega 6/45, Power 6/55, Lotto 5/35, Max 3D, Max 3D Pro), provides statistical analysis and AI-generated number suggestions. Freemium model with ads + Premium subscription.

## Quick Setup
```bash
# Install dependencies
npm install

# Run development server (requires dev client APK on device)
npx expo start --dev-client

# Run tests
npx jest --ci

# Type check
npx tsc --noEmit

# Build APK for testing
npx eas-cli build --platform android --profile preview --non-interactive

# Build AAB for Play Store
npx eas-cli build --platform android --profile production --non-interactive

# Generate app icons
node scripts/generate-icons.js
```

## Key Files
- `App.tsx` — Root component: PremiumProvider → NavigationContainer → AppNavigator
- `src/types/game.ts` — GameId, GameConfig, GAME_CONFIGS for all 5 games
- `src/navigation/AppNavigator.tsx` — Bottom tab navigator with per-game stacks
- `src/screens/HomeScreen.tsx` — Multi-game dashboard showing latest results
- `src/hooks/useHomeDashboard.ts` — Data fetching logic for home screen
- `src/screens/GameDetailScreen.tsx` — Per-game detail with history and refresh
- `src/screens/GameStatsScreen.tsx` — Per-game statistics (premium gated)
- `src/services/scraper.ts` — Multi-game scraper via Vietlott AJAX API
- `src/database/database.ts` — SQLite layer with 5 tables (one per game)
- `src/utils/statistics.ts` — Frequency, absent tracking, AI suggestions
- `src/context/PremiumContext.tsx` — Premium state, IAP, ad control
- `app.json` — Expo config, AdMob app ID, permissions

## How to Contribute
1. Branch from master
2. Make changes, run tests: `npx jest --ci && npx tsc --noEmit`
3. Build and test on device: `npx eas-cli build --platform android --profile preview`
4. Open a PR — CI runs automatically (GitHub Actions)

## Common Issues
- **App crashes on startup** — Usually AdMob SDK initialization. Check `app.json` has valid AdMob app ID under `plugins > react-native-google-mobile-ads`
- **Can't test on Expo Go** — App uses native modules (AdMob, IAP, react-native-screens) which require a development build
- **Scraper returns empty results** — Vietlott website may have changed HTML structure. Check `parseResults()` in `scraper.ts`
- **Build fails on EAS** — Ensure `eas.json` profiles are correct and you're logged in: `npx eas-cli login`
- **Tests fail after changing statistics.ts** — Run `npx jest src/utils/statistics.test.ts` to see which test broke
- **New game not showing data** — Check `GAME_CONFIGS` in `src/types/game.ts` has correct `webPartClass` and `pageUrl`
