# Amount Precision

Niuron stores token quantities in two forms during the migration window:

- Legacy human-readable numeric fields such as `amount`, `fromAmount`, `shadowAmount`.
- Exact base-unit fields such as `amountBaseUnits`, `fromAmountBaseUnits`, `shadowAmountBaseUnits` plus token decimals.

New financial logic must treat `*_base_units` as authoritative. Legacy float columns are display/backward-compatibility only and should not be used for accounting, privacy commitments, settlement, or balance checks.

## Rules

1. Parse user input with `parseDecimalToBaseUnits(amount, decimals)` from `shared/amounts.ts`.
2. Persist base units as unsigned integer strings.
3. Persist decimals next to the amount so token precision is explicit at write time.
4. Format display values with `formatBaseUnitsToDecimal(baseUnits, decimals)`.
5. Never compare token balances using JavaScript floating point numbers.

## Migration

Apply `migrations/0001_exact_token_amounts.sql` before enabling exact-accounting writes in production.

The migration is additive and keeps legacy fields intact, so it is safe for existing UI reads. Follow-up migrations can drop legacy float columns after all reads and writes use exact fields.
