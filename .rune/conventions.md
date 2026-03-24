# Detected Conventions

## Naming
- **Components**: PascalCase (`LatestResult.tsx`, `GameResultCard.tsx`, `Max3DResult.tsx`)
- **Hooks**: camelCase with `use` prefix (`useHomeDashboard.ts`)
- **Services/Utils**: camelCase (`scraper.ts`, `statistics.ts`, `interstitialAd.ts`)
- **Types**: camelCase files (`game.ts`, `navigation.ts`)
- **Functions**: camelCase (`getDrawsByPeriod`, `calculateStats`, `fetchAllGames`)
- **Constants**: UPPER_SNAKE_CASE (`GAME_CONFIGS`, `ALL_GAME_IDS`, `MAX_PAGES`)
- **Interfaces**: PascalCase with descriptive suffix (`DrawRow`, `GameConfig`, `RenderInfo`, `VietlottResponse`)
- **Type aliases**: PascalCase (`GameId`, `DrawTuple`, `RootTabParamList`)

## Component Pattern
- Functional components with hooks
- `export default function ComponentName()` (not arrow function)
- Props interface defined inline above component
- `StyleSheet.create()` at bottom of file
- Colors imported from `../theme` — never hardcoded hex in components

## State Management
- React Context for global state (`PremiumContext`)
- Custom hooks for screen-level data logic (`useHomeDashboard`)
- `useState` for local UI state
- `useRef` for mutable values that don't trigger re-render (race condition guards, refresh counters)
- `useCallback` for memoized event handlers passed as props

## Architecture (Multi-Game)
- Config-driven: all game-specific logic derived from `GAME_CONFIGS[gameId]`
- All DB functions accept `gameId: GameId` as first parameter
- All scraper functions accept `gameId: GameId` as first parameter
- Statistics functions parameterized by `gameId` for number ranges
- Navigation: bottom tabs (Home + 4 game tabs), each game tab has native stack (Detail → Stats)
- Max 3D + Max 3D Pro share one tab with internal toggle

## Data Flow
- HomeScreen dashboard → `useHomeDashboard` hook → `getLatestDrawFull(gameId)` for all 5 games
- GameDetailScreen → `fetchNew(gameId, latest)` → `saveDraws(gameId, draws)` → reload
- GameStatsScreen → `getDrawsByPeriod(gameId, period)` → `calculateStats(draws, gameId)`
- Scraper: `fetchAllGames()` → `Promise.allSettled` over all 5 games concurrently

## Error Handling
- User-facing: `Alert.alert()` with title + message
- Silent/optional: `try/catch` with `console.warn()`
- AdMob/IAP: wrapped in try/catch — app works without them
- Catch blocks: `catch (e: unknown)` with `(e as Error)?.message` (no `any`)
- Network errors: Alert with retry button

## Database
- Singleton pattern via `getDatabase()`
- 5 tables: `draws_645`, `draws_655`, `draws_535`, `draws_max3d`, `draws_max3d_pro`
- Schema: `id, draw_number (UNIQUE), draw_date, numbers (JSON TEXT), special_number (nullable)`
- All queries use parameterized `?` placeholders (SQL injection safe)
- `expo-sqlite` async API (`runAsync`, `getAllAsync`, `getFirstAsync`)
- Migration: old `draws` table (n1-n6 columns) → `draws_645` (JSON array)

## Number Formatting
- Lottery games: `String(n).padStart(2, '0')` — "01" through "55"
- Max 3D: `String(n).padStart(3, '0')` — "000" through "999"
- Sorted ascending for display: `.sort((a, b) => a - b)`

## Testing
- Framework: Jest 30 + ts-jest
- Co-located tests: `statistics.test.ts` next to `statistics.ts`
- Run: `npx jest --ci`
- Coverage target: 80%+
