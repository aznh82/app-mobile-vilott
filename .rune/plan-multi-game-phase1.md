# Phase 1: Backend

## Goal
Create game config types, migrate database to 5-table multi-game schema, install React Navigation,
and wire up a bottom-tab navigation skeleton with placeholder screens. After this phase the app
compiles and navigates — no real data yet.

## Data Flow
```
src/types/game.ts
  └── GameConfig, GameId, GAME_CONFIGS
        │
        ├──► src/database/database.ts
        │      initDB() creates 5 tables
        │      All query functions accept (gameId, ...)
        │      Migration: draws → draws_645
        │
        └──► src/navigation/AppNavigator.tsx
               BottomTabNavigator (5 tabs)
                     │
               App.tsx wraps with NavigationContainer
```

## Code Contracts

```typescript
// src/types/game.ts  (new file)
export type GameId =
  | 'mega645'
  | 'power655'
  | 'lotto535'
  | 'max3d'
  | 'max3d_pro';

export interface GameConfig {
  id: GameId;
  name: string;            // "Mega 6/45"
  shortName: string;       // "6/45"
  tableName: string;       // "draws_645"
  numberCount: number;     // main numbers: 6, 6, 5, 3, 3
  maxNumber: number;       // 45, 55, 35, 999, 999
  minNumber: number;       // 1, 1, 1, 0, 0
  hasSpecialNumber: boolean;
  hasJackpot: boolean;     // true only for 6/45, 6/55
  drawDays: string;
  pageUrl: string;         // path on vietlott.vn
  webPartClass: string;
  tabLabel: string;        // short label for bottom tab
}

export const GAME_CONFIGS: Record<GameId, GameConfig>;

// src/types/navigation.ts  (new file)
import { GameId } from './game';

export type RootTabParamList = {
  Home: undefined;
  Game645: { gameId: GameId };
  Game655: { gameId: GameId };
  Game535: { gameId: GameId };
  GameMax3D: { gameId: GameId };
};

export type GameStackParamList = {
  GameDetail: { gameId: GameId };
  GameStats: { gameId: GameId };
};

// src/database/database.ts  (modified — new exports)
export interface DrawRow {
  id: number;
  draw_number: string;
  draw_date: string;
  numbers: number[];       // JSON-parsed array
  special_number?: number; // Lotto 5/35 only
}

export function initDB(): Promise<void>;
// Creates draws_645, draws_655, draws_535, draws_max3d, draws_max3d_pro
// Migrates existing `draws` table → draws_645 if draws exists

export function saveDraws(
  gameId: GameId,
  draws: [string, string, number[], number?][]
): Promise<number>;  // returns count inserted

export function getLatestDraw(gameId: GameId): Promise<string | null>;
// Returns latest draw_number string or null

export function getDrawsByPeriod(
  gameId: GameId,
  period: string
): Promise<DrawRow[]>;

export function getTotalDraws(gameId: GameId): Promise<number>;

export function getLatestDrawFull(gameId: GameId): Promise<DrawRow | null>;

export function getLongestAbsent(
  gameId: GameId,
  limit?: number
): Promise<{ number: number; absent: number }[]>;
// Uses GAME_CONFIGS[gameId].minNumber / maxNumber for range

// src/navigation/AppNavigator.tsx  (new file)
export default function AppNavigator(): JSX.Element;
// BottomTabNavigator with 5 tabs: Home, 6/45, 6/55, 5/35, Max3D
// Each game tab renders placeholder text until Phase 2
```

## Tasks

- [ ] Task 1 — Create game config types and constants
  - File: `src/types/game.ts` (new)
  - File: `src/types/navigation.ts` (new)
  - Verify: `npx tsc --noEmit` — zero errors
  - Commit: `feat(types): add GameConfig and navigation param types for multi-game`
  - Logic:
    - GameId union covers all 5 games
    - GAME_CONFIGS defines all fields including webPartClass, pageUrl, hasJackpot
    - max3d and max3d_pro share the same tab (GameMax3D) but have separate GameIds/tables
    - navigation.ts exports RootTabParamList and GameStackParamList for typed navigation

- [ ] Task 2 — Migrate database to multi-game schema
  - File: `src/database/database.ts` (major modify)
  - Verify: Launch app on device/simulator — check no crash, 6/45 data intact
  - Commit: `refactor(db): multi-game schema, migrate draws→draws_645, add 4 new tables`
  - Logic:
    - initDB runs in order: (1) check if `draws` exists, (2) if yes create draws_645 and
      INSERT SELECT converting JSON n1–n6 columns OR rename depending on existing schema,
      (3) create remaining 4 tables, (4) drop old `draws` if migration succeeded
    - Schema per table: id INTEGER PK AUTOINCREMENT, draw_number TEXT UNIQUE,
      draw_date TEXT, numbers TEXT (JSON array), special_number INTEGER nullable
    - All query functions take gameId as first param, resolve tableName from GAME_CONFIGS[gameId].tableName
    - getLongestAbsent iterates minNumber..maxNumber from config — no hardcoded 1..45
  - Edge: Fresh install (no `draws` table) must still create all 5 tables without error
  - Edge: If migration fails, log warning and create fresh draws_645 (data loss acceptable beta)

- [ ] Task 3 — Install React Navigation packages
  - File: `package.json` (npm install)
  - Verify: `npm ls @react-navigation/native @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context`
  - Commit: `chore(deps): install React Navigation for multi-screen support`
  - Command:
    ```
    npm install @react-navigation/native @react-navigation/bottom-tabs \
      react-native-screens react-native-safe-area-context
    ```

- [ ] Task 4 — Create AppNavigator with bottom tabs
  - File: `src/navigation/AppNavigator.tsx` (new)
  - File: `App.tsx` (modify — add NavigationContainer wrapper)
  - Verify: `npx tsc --noEmit` — zero errors; app renders tab bar on device
  - Commit: `feat(nav): add bottom tab navigator skeleton with 5 game tabs`
  - Logic:
    - Import NavigationContainer from @react-navigation/native
    - Import createBottomTabNavigator from @react-navigation/bottom-tabs
    - Use RootTabParamList for typed navigator
    - Tab bar style: backgroundColor from theme.colors.bgPrimary, activeTintColor accent
    - Home tab → existing HomeScreen (unchanged for now)
    - Game tabs → simple placeholder View with game name Text
    - App.tsx: PremiumProvider → NavigationContainer → AppNavigator (replace bare HomeScreen)
  - Edge: SafeAreaProvider must wrap NavigationContainer to avoid tab bar overlap

## Failure Scenarios

| When | Then | Error Type |
|------|------|-----------|
| `draws` table exists with old schema (n1–n6 cols) | Read columns, build JSON array, INSERT into draws_645 | Silent — data preserved |
| `draws` table does not exist | Skip migration, create all 5 tables fresh | No error |
| Migration INSERT fails mid-row | console.warn, proceed — partial data acceptable | console.warn |
| GameId not in GAME_CONFIGS | throw new Error(`Unknown game: ${gameId}`) | Programming bug |
| NavigationContainer missing from App.tsx | Red-box error on launch | Fix: wrap correctly |

## Rejection Criteria (DO NOT)
- DO NOT delete existing `draws` data — migrate to `draws_645` first, drop only after success
- DO NOT use expo-router — React Navigation is the locked decision
- DO NOT store numbers as individual columns (n1, n2…) — JSON array in TEXT column only
- DO NOT hardcode number ranges (1–45) — always derive from GameConfig.minNumber/maxNumber
- DO NOT import from Phase 2 files — Phase 1 has zero runtime dependencies on scraper or screens

## Cross-Phase Context
- **Assumes**: Nothing — this is Phase 1 (foundation)
- **Exports to Phase 2**:
  - `GameId`, `GameConfig`, `GAME_CONFIGS` from `src/types/game.ts`
  - All database functions with `(gameId, ...)` signature from `src/database/database.ts`
  - `RootTabParamList`, `GameStackParamList` from `src/types/navigation.ts`
- **Exports to Phase 2 (navigation)**:
  - `AppNavigator` from `src/navigation/AppNavigator.tsx`
  - `NavigationContainer` wired in `App.tsx`
- **Interface contract**: `DrawRow.numbers` is always `number[]` (never string) — all phases depend on this

## Acceptance Criteria
- [ ] `src/types/game.ts` exports `GameId`, `GameConfig`, `GAME_CONFIGS` for all 5 games
- [ ] `src/types/navigation.ts` exports typed param lists
- [ ] Database creates exactly 5 tables on initDB()
- [ ] Existing 6/45 data is present in `draws_645` after migration
- [ ] All DB query functions accept `gameId` as first parameter
- [ ] `npm install` succeeds with React Navigation packages
- [ ] App renders bottom tab bar with 5 tabs
- [ ] `npx tsc --noEmit` passes with zero errors
- [ ] No crash on cold launch

## Files Touched
- `src/types/game.ts` — new
- `src/types/navigation.ts` — new
- `src/database/database.ts` — major modify
- `src/navigation/AppNavigator.tsx` — new
- `App.tsx` — modify (add NavigationContainer + SafeAreaProvider)
- `package.json` — modify (add nav deps)
