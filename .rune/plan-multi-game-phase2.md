# Phase 2: Frontend

## Goal
Build the complete user-facing app: generic multi-game scraper, redesigned HomeScreen dashboard,
per-game detail screens, statistics screens with frequency/absent/AI suggestions, and adapt all
statistics logic for different number ranges. After this phase every screen is functional end-to-end.

## Data Flow
```
HomeScreen (mount)
  └── getLatestDrawFull(gameId) × 5  ────────────► DB (5 tables)
  └── if empty → fetchAllGames()
        └── fetchPage(gameId, key, renderInfo, page)
              └── Vietlott AjaxPro API
              └── parseResults(gameId, html)
              └── saveDraws(gameId, rows)  ────────► DB

User taps game card
  └── navigate(GameDetail, { gameId })
        └── GameDetailScreen
              └── getDrawsByPeriod(gameId, period)  ► DB
              └── pull-to-refresh → fetchNew(gameId) ► API → DB
              └── "Thống kê" button (premium)
                    └── navigate(GameStats, { gameId })
                          └── GameStatsScreen
                                └── computeStats(gameId, draws)  (statistics.ts)
                                └── getSuggestions(gameId, draws) (statistics.ts)

Max 3D screen
  └── GameDetailScreen(gameId='max3d')
        └── internal tab toggle → gameId 'max3d' | 'max3d_pro'
        └── Each side: Max3DResult component
```

## Code Contracts

```typescript
// src/services/scraper.ts  (refactored)
export function fetchAllFrom(
  gameId: GameId,
  startDraw?: string,
  onProgress?: (page: number, count: number) => void
): Promise<[string, string, number[], number?][]>;

export function fetchNew(
  gameId: GameId,
  latestDraw: string
): Promise<[string, string, number[], number?][]>;

export function fetchJackpotInfo(gameId: GameId): Promise<{
  jackpot: string | null;
  jackpot_winners: string | null;
}>;

export function fetchAllGames(
  onProgress?: (gameId: GameId, page: number, count: number) => void
): Promise<Record<GameId, number>>;  // new draws count per game

// src/utils/statistics.ts  (adapted)
export interface StatsResult {
  frequency: { number: number; count: number }[];
  absentNumbers: { number: number; absent: number }[];
  suggestions: number[][];
}

export function computeStats(
  gameId: GameId,
  draws: DrawRow[]
): StatsResult;
// Uses GAME_CONFIGS[gameId] for number range
// Max 3D: top/bottom 20 by frequency only (no suggestions)
// Lottery games: full frequency + absent + AI suggestions

export function generateSuggestions(
  gameId: GameId,
  draws: DrawRow[],
  count?: number
): number[][];
// Returns count (default 5) sets of numbers for lottery games
// Returns [] for Max 3D games

// src/screens/HomeScreen.tsx  (redesigned)
// Shows 5 GameResultCards. Triggers fetchAllGames on first launch.

// src/components/GameResultCard.tsx  (new)
interface GameResultCardProps {
  gameId: GameId;
  config: GameConfig;
  drawNumber: string | null;
  drawDate: string | null;
  numbers: number[];
  specialNumber?: number;
  jackpot?: string | null;
  onPress: () => void;
}
export default function GameResultCard(props: GameResultCardProps): JSX.Element;

// src/screens/GameDetailScreen.tsx  (new)
// Receives { gameId } from route.params
// Renders: LatestResult (or Max3DResult), draw history FlatList, refresh, stats button

// src/screens/GameStatsScreen.tsx  (new — premium gated)
// Receives { gameId } from route.params
// Renders: FrequencyChart, AbsentNumbers, SuggestedSets adapted from existing components

// src/components/Max3DResult.tsx  (new)
interface Max3DResultProps {
  numbers: number[];   // up to 20 numbers across prize tiers
  drawNumber: string;
  drawDate: string;
  isProVariant?: boolean;
}
export default function Max3DResult(props: Max3DResultProps): JSX.Element;

// src/navigation/AppNavigator.tsx  (updated — replace placeholders with real screens)
// Each game tab: Stack with GameDetail + GameStats screens
```

## Tasks

- [ ] Task 1 — Refactor scraper to use GameConfig
  - File: `src/services/scraper.ts` (major modify)
  - Verify: `npx tsc --noEmit`
  - Commit: `refactor(scraper): parameterize all functions by GameId/GameConfig`
  - Logic:
    - Replace hardcoded URLs, class names, page paths with GAME_CONFIGS[gameId] lookups
    - getAjaxUrl(gameId): `${BASE_URL}/ajaxpro/Vietlott.PlugIn.WebParts.${config.webPartClass},Vietlott.PlugIn.WebParts.ashx`
    - getApiKey(gameId): fetch BASE_URL + config.pageUrl, extract key via existing regex
    - Keep delay(300) between pages — rate limiting convention
    - Keep getRenderInfo() shared across all games

- [ ] Task 2 — Implement parseResults for lottery games (6/45, 6/55, 5/35)
  - File: `src/services/scraper.ts` (continue modify)
  - Verify: `npx tsc --noEmit`
  - Commit: `feat(scraper): parse results for all three lottery game types`
  - Logic:
    - 6/45 and 6/55: reuse existing bong_tron span regex — same HTML structure
    - 5/35: parse 5 main numbers + 1 special number; result string format "AA BB CC DD EE | SS"
    - Special number stored as 4th element of tuple: [drawNum, date, [n1..n5], specialNum]
    - Validate extracted count against config.numberCount; log warning if mismatch

- [ ] Task 3 — Implement parseResults for Max 3D / Max 3D Pro
  - File: `src/services/scraper.ts` (continue modify)
  - Verify: `npx tsc --noEmit`
  - Commit: `feat(scraper): add Max 3D and Max 3D Pro result parsing`
  - Logic:
    - Max 3D uses RetExtraParam1 (left column) + RetExtraParam2 (right column) in JSON response
    - Extract numbers from both columns: special (2), first (4), second (6), third (8) = 20 total
    - Max 3D Pro uses same RetExtraParam structure with GameMax3DProResultDetailWebPart
    - Store all prize-tier numbers as flat numbers array; order is preserved for display
  - Edge: If RetExtraParam1/2 missing, fall back to HtmlContent parse; log warning

- [ ] Task 4 — Implement fetchAllGames concurrent loader
  - File: `src/services/scraper.ts` (continue modify)
  - Verify: `npx tsc --noEmit`
  - Commit: `feat(scraper): concurrent multi-game fetch with per-game progress callback`
  - Logic:
    - Promise.allSettled over all 5 GameIds
    - Each settled result: if fulfilled add count, if rejected log warning and record 0
    - onProgress callback receives (gameId, page, count) for UI progress modal
    - Returns Record<GameId, number> — count of new draws per game

- [ ] Task 5 — Update HomeScreen to multi-game dashboard
  - File: `src/screens/HomeScreen.tsx` (major rewrite)
  - Verify: `npx tsc --noEmit`; visual check: 5 game cards visible
  - Commit: `feat(home): redesign as multi-game dashboard with GameResultCards`
  - Logic:
    - On mount: call getLatestDrawFull(gameId) for each of 5 games
    - If all 5 return null (first launch): show progress modal, call fetchAllGames(), then reload
    - Render ScrollView with 5 GameResultCards
    - Pull-to-refresh: fetchAllGames() then reload all cards
    - Keep AdBanner (top + bottom), PremiumBadge in header
    - Remove from HomeScreen: FrequencyChart, AbsentNumbers, SuggestedSets, PeriodFilter

- [ ] Task 6 — Create GameResultCard component
  - File: `src/components/GameResultCard.tsx` (new)
  - Verify: `npx tsc --noEmit`
  - Commit: `feat(ui): add GameResultCard component for home dashboard`
  - Logic:
    - Lottery games (6/45, 6/55, 5/35): colored number balls, special number with different color
    - Max 3D: show "Giải ĐB: XXX  XXX" (just 2 special prize numbers, 3-digit padded)
    - Jackpot row only if config.hasJackpot === true and jackpot prop is non-null
    - Empty state: Text "Chưa có dữ liệu" if drawNumber is null
    - Touchable (TouchableOpacity) → onPress navigates to detail

- [ ] Task 7 — Create GameDetailScreen
  - File: `src/screens/GameDetailScreen.tsx` (new)
  - Verify: `npx tsc --noEmit`; navigate to each game from home, data loads
  - Commit: `feat(screens): add per-game detail screen with draw history and refresh`
  - Logic:
    - Receives gameId from route.params; loads config = GAME_CONFIGS[gameId]
    - Header shows config.name + jackpot if config.hasJackpot
    - Latest result: Max3DResult for max3d/max3d_pro, LatestResult for others
    - Draw history: FlatList of rows (draw_number, draw_date, formatted numbers)
    - Pull-to-refresh: fetchNew(gameId, latestDrawNumber) → saveDraws → reload list
    - "Thống kê" FAB button at bottom right → navigate to GameStats (locked if not premium)
    - Max 3D screen: internal toggle tabs "Max 3D" / "Max 3D Pro" switching gameId state
    - AdBanner at bottom of screen

- [ ] Task 8 — Create Max3DResult component
  - File: `src/components/Max3DResult.tsx` (new)
  - Verify: `npx tsc --noEmit`
  - Commit: `feat(ui): add Max3DResult component with prize tier layout`
  - Logic:
    - 4 prize tiers: Giải ĐB (nums[0..1]), Giải nhất (nums[2..5]), Giải nhì (nums[6..11]), Giải ba (nums[12..19])
    - Each number displayed 3-digit padded: String(n).padStart(3, '0')
    - Prize tier label + matching accent color per tier
    - If isProVariant prop, show "Max 3D Pro" label
  - Edge: If numbers.length < expected for a tier, show dashes for missing slots; console.warn

- [ ] Task 9 — Adapt LatestResult for variable number counts
  - File: `src/components/LatestResult.tsx` (modify)
  - Verify: `npx tsc --noEmit`
  - Commit: `refactor(ui): make LatestResult support 5, 6 numbers and optional special number`
  - Logic:
    - Accept numbers: number[] instead of assuming length 6
    - Accept optional specialNumber: number for 5/35
    - Render specialNumber with different background color + "Đặc biệt" label if present
    - No hardcoded assumption about array length

- [ ] Task 10 — Adapt statistics.ts for multi-game
  - File: `src/utils/statistics.ts` (modify)
  - Verify: `npx tsc --noEmit`
  - Commit: `refactor(stats): parameterize statistics and suggestions by GameConfig`
  - Logic:
    - computeStats(gameId, draws): derives number range from GAME_CONFIGS[gameId]
    - For max3d/max3d_pro: compute top/bottom 20 frequency only (no suggestions)
    - generateSuggestions returns [] for max3d/max3d_pro
    - All existing 6/45 logic preserved when gameId='mega645'

- [ ] Task 11 — Create GameStatsScreen (premium gated)
  - File: `src/screens/GameStatsScreen.tsx` (new)
  - Verify: `npx tsc --noEmit`; screen shows stats for 6/45; locked modal appears for non-premium
  - Commit: `feat(screens): add per-game statistics screen with premium gate`
  - Logic:
    - Receives gameId from route.params
    - If not premium: show PremiumPaywall modal (existing component)
    - Load draws via getDrawsByPeriod(gameId, selectedPeriod)
    - Compute stats via computeStats(gameId, draws)
    - Render: FrequencyChart, AbsentNumbers (reuse existing components)
    - Render: SuggestedSets only if !isMax3D (no suggestions for 3D games)
    - PeriodFilter at top (reuse existing component)
    - Show interstitial ad on first stats view for free users (existing interstitialAd.ts)

- [ ] Task 12 — Wire real screens into AppNavigator
  - File: `src/navigation/AppNavigator.tsx` (modify)
  - Verify: Full navigation flow works; `npx tsc --noEmit`
  - Commit: `feat(nav): wire GameDetailScreen and GameStatsScreen into navigator`
  - Logic:
    - Each game tab: createNativeStackNavigator with GameDetail + GameStats screens
    - Pass gameId as initial param to GameDetail for each stack
    - Home tab keeps flat HomeScreen (no stack needed)
    - Tab icons: use text labels or simple emoji — visual polish deferred to Phase 3

## Failure Scenarios

| When | Then | Error Type |
|------|------|-----------|
| Game API endpoint returns 404 or unexpected HTML | Return empty array, console.warn | console.warn |
| API key regex fails on game page | throw Error caught by fetchAllGames → 0 count for that game | Per-game error |
| Max 3D RetExtraParam1/2 absent | Fall back to HtmlContent parse; if also absent return [] | console.warn |
| One game fails in fetchAllGames | Promise.allSettled — other 4 games continue unaffected | Partial success |
| No data for a game on first launch | GameResultCard shows empty state; user can trigger refresh | No crash |
| Max 3D numbers array has wrong length | Show available numbers + dashes for missing; console.warn | console.warn |
| Non-premium user reaches GameStatsScreen | PremiumPaywall modal shown immediately | No crash |

## Rejection Criteria (DO NOT)
- DO NOT break existing 6/45 functionality — must work identically before and after refactor
- DO NOT use cheerio or DOM parser — stick with regex (project convention)
- DO NOT fetch games sequentially — use Promise.allSettled for fetchAllGames
- DO NOT hardcode API keys — extract from game page at runtime
- DO NOT remove delay(300) between pagination requests — rate limiting is mandatory
- DO NOT put statistics components in HomeScreen — they belong in GameStatsScreen only
- DO NOT add NativeBase, React Native Paper, or any UI library — StyleSheet only
- DO NOT hardcode 6 numbers in LatestResult — use dynamic array

## Cross-Phase Context
- **Assumes from Phase 1**:
  - `GameId`, `GameConfig`, `GAME_CONFIGS` from `src/types/game.ts`
  - All DB functions with `(gameId, ...)` signature from `src/database/database.ts`
  - `RootTabParamList`, `GameStackParamList` from `src/types/navigation.ts`
  - `AppNavigator` skeleton + `NavigationContainer` in `App.tsx`
- **Exports to Phase 3**:
  - All screens complete and navigable
  - `fetchAllGames` and `fetchNew` working for all 5 games
  - `computeStats` accepting gameId
  - AdBanner placeholder in all screens (wiring to real units in Phase 3)
  - PremiumPaywall present in GameStatsScreen (IAP wiring in Phase 3)

## Acceptance Criteria
- [ ] HomeScreen shows 5 GameResultCards with current data after scrape
- [ ] fetchAllGames() runs all 5 games concurrently, failures do not block others
- [ ] Tapping a game card navigates to correct GameDetailScreen
- [ ] GameDetailScreen shows draw history for selected game
- [ ] Pull-to-refresh works on Home and Detail screens
- [ ] Max 3D screen shows toggle between Max 3D and Max 3D Pro
- [ ] Max3DResult shows prize tiers with 3-digit padded numbers
- [ ] LatestResult works with 5-number and 6-number arrays + optional special number
- [ ] GameStatsScreen shows frequency/absent stats for lottery games
- [ ] GameStatsScreen shows top/bottom-20 frequency only for Max 3D games
- [ ] SuggestedSets not rendered for Max 3D games
- [ ] Non-premium users see PremiumPaywall on GameStatsScreen
- [ ] `npx tsc --noEmit` passes with zero errors

## Files Touched
- `src/services/scraper.ts` — major modify (multi-game generic)
- `src/screens/HomeScreen.tsx` — major rewrite (dashboard)
- `src/screens/GameDetailScreen.tsx` — new
- `src/screens/GameStatsScreen.tsx` — new
- `src/components/GameResultCard.tsx` — new
- `src/components/Max3DResult.tsx` — new
- `src/components/LatestResult.tsx` — modify (variable numbers + special)
- `src/utils/statistics.ts` — modify (gameId param, Max 3D branch)
- `src/navigation/AppNavigator.tsx` — modify (real screens replace placeholders)
