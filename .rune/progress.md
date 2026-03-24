# Progress Log

## 2026-03-24 — Multi-Game Expansion v2.0.0
- Expanded from single-game (6/45) to 5 games: Mega 6/45, Power 6/55, Lotto 5/35, Max 3D, Max 3D Pro
- Phase 1: Game types, DB migration (5-table schema), React Navigation bottom tabs
- Phase 2: Multi-game scraper, HomeScreen dashboard, GameDetailScreen, GameStatsScreen, Max3DResult
- Phase 3: Ads wiring, premium gate verification, version bump to 2.0.0
- Code quality: fixed all CRITICAL/HIGH review issues, replaced all `any` types
- Refactored HomeScreen → useHomeDashboard custom hook
- Added Jest + 17 unit tests for statistics.ts (96% coverage)
- Added GitHub Actions CI pipeline (tsc + jest)
- Fixed countdown timer to use per-game draw schedule
- Removed dead code (Header.tsx, react-native-chart-kit)

## 2026-03-24 — Crash Fix Sprint
- Isolated AdMob SDK crash: made initialization non-blocking with try/catch
- Added react-native-iap plugin + BILLING permission to fix IAP crash
- Tested AdMob-only build to isolate crash source
- Onboard re-run: all context files current

## 2026-03-18 — v1.1.1 Release
- Core features complete: scraper, statistics, suggestions, absent tracking
- Hybrid monetization: AdMob banner/interstitial + Premium IAP
- Privacy Policy hosted on GitHub Pages
- AAB production build submitted
- Development client APK available for testing
- Known issue: APK crashes on startup (investigating AdMob SDK init)
