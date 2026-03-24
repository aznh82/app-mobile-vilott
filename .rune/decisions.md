# Architecture Decisions

| Date | Decision | Rationale | Status |
|------|----------|-----------|--------|
| 2026-03-18 | Hybrid monetization (Ads + Premium IAP) | Maximize revenue: free users see ads, premium removes ads + unlocks advanced features | Active |
| 2026-03-18 | SQLite (expo-sqlite) for local storage | Offline-first, fast queries, no server needed | Active |
| 2026-03-18 | Regex HTML parsing instead of cheerio | Smaller bundle, no native dependencies needed for Expo | Active |
| 2026-03-18 | Single-screen app (no navigation) | Simple UX for single-purpose lottery app | Superseded |
| 2026-03-24 | Multi-screen with React Navigation bottom tabs | 5 games need separate screens; bottom tabs for quick switching | Active |
| 2026-03-24 | Separate DB table per game (JSON array storage) | Different number formats per game; migration from n1-n6 columns to JSON | Active |
| 2026-03-24 | Config-driven architecture (GAME_CONFIGS) | All game-specific logic derived from GameConfig — extensible for new games | Active |
| 2026-03-24 | Max 3D + Max 3D Pro on shared tab with toggle | Save tab bar space; games are nearly identical | Active |
| 2026-03-24 | Premium gates stats screens only | Free users see results + detail; premium unlocks statistics/AI suggestions | Active |
| 2026-03-24 | Jest for unit testing | Most common RN test framework; ts-jest for TypeScript support | Active |
| 2026-03-24 | GitHub Actions CI | tsc + jest on every push/PR to prevent regressions | Active |
| 2026-03-18 | AdMob SDK wrapped in try/catch | App must work even if ads fail to load (graceful degradation) | Active |
| 2026-03-24 | Non-blocking AdMob SDK init | SDK init was crashing app on startup; made async with fallback | Active |
| 2026-03-24 | Added react-native-iap plugin to app.json | Missing native plugin caused crash when IAP module loaded | Active |
