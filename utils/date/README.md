# date

Date utilities built on [luxon](https://moment.github.io/luxon/): parsing, arithmetic, comparison, duration formatting, and timezone handling. Re-exports every function from the barrel `index.ts`.

## What It Does

- **Parsing** (`parse.ts`) — `parseToDateTime`, `parseWithFormat`, `parseISO`, `createDateTime`, `fromMillis`, `fromSeconds`, `now`, `today`, `utc`
- **Formatting** (`formatDate.ts`) — `convertMomentFormatToLuxon` for translating moment.js-style format tokens to luxon tokens
- **Arithmetic** (`dateArithmetic.ts`) — `addToDate`, `subtractFromDate`, `startOf`, `endOf`, `fromNowPlus`, `fromNowMinus`, `daysInMonth`, `setDateValues`, `getDateValues`
- **Comparison** (`dateComparison.ts`) — `dateDiff`, `dateDiffAbs`, `isBefore`, `isAfter`, `isSame`, `isBetween`, `isValidDate`, `isPast`, `isFuture`, `isSameDay`, `minDate`, `maxDate`
- **Duration** (`duration.ts`) — `createDuration`, `humanizeDuration`, `fromNow`, `toRelative`, `convertDuration`
- **Timezone** (`timezone.ts`) — timezone conversion helpers
- **`getCorrectDate`** (`getCorrectDate.ts`) — locale-aware date correction helper

## Import

```ts
import { parseToDateTime, addToDate, isSameDay, fromNow } from "../../utils/date";
```

## Key Files

| File | Description |
|------|-------------|
| `index.ts` | Barrel re-exporting all of the below |
| `parse.ts` | Parsing and construction (`DateTime` factories) |
| `formatDate.ts` | moment.js → luxon format token conversion |
| `dateArithmetic.ts` | Adding, subtracting, and reading date components |
| `dateComparison.ts` | Ordering and equality checks |
| `duration.ts` | Duration creation and human-readable formatting |
| `timezone.ts` | Timezone conversion |
| `getCorrectDate.ts` | Locale-aware date correction |
| `date.test.ts` | Unit tests (Vitest) |
