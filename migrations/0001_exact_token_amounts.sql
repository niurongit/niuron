-- Add exact token amount columns alongside legacy floating display fields.
-- Legacy real columns are intentionally kept for backward-compatible UI reads.
-- New writes should populate *_base_units as unsigned integer strings and *_decimals.

ALTER TABLE swap_orders
  ADD COLUMN IF NOT EXISTS from_amount_base_units text NOT NULL DEFAULT '0',
  ADD COLUMN IF NOT EXISTS to_amount_base_units text NOT NULL DEFAULT '0',
  ADD COLUMN IF NOT EXISTS from_token_decimals integer NOT NULL DEFAULT 18,
  ADD COLUMN IF NOT EXISTS to_token_decimals integer NOT NULL DEFAULT 18;

ALTER TABLE batched_actions
  ADD COLUMN IF NOT EXISTS amount_base_units text NOT NULL DEFAULT '0',
  ADD COLUMN IF NOT EXISTS token_decimals integer NOT NULL DEFAULT 18;

ALTER TABLE activities
  ADD COLUMN IF NOT EXISTS amount_base_units text NOT NULL DEFAULT '0',
  ADD COLUMN IF NOT EXISTS token_decimals integer NOT NULL DEFAULT 18;

ALTER TABLE shadow_balances
  ADD COLUMN IF NOT EXISTS shadow_amount_base_units text NOT NULL DEFAULT '0',
  ADD COLUMN IF NOT EXISTS token_decimals integer NOT NULL DEFAULT 18;

ALTER TABLE stealth_payments
  ADD COLUMN IF NOT EXISTS amount_base_units text NOT NULL DEFAULT '0',
  ADD COLUMN IF NOT EXISTS token_decimals integer NOT NULL DEFAULT 18;

ALTER TABLE multisig_wallets
  ADD COLUMN IF NOT EXISTS balance_base_units text NOT NULL DEFAULT '0',
  ADD COLUMN IF NOT EXISTS token_decimals integer NOT NULL DEFAULT 18;

ALTER TABLE multisig_transactions
  ADD COLUMN IF NOT EXISTS amount_base_units text,
  ADD COLUMN IF NOT EXISTS token_decimals integer NOT NULL DEFAULT 18;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'swap_orders_from_amount_base_units_uint_chk') THEN
    ALTER TABLE swap_orders ADD CONSTRAINT swap_orders_from_amount_base_units_uint_chk CHECK (from_amount_base_units ~ '^\\d+$');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'swap_orders_to_amount_base_units_uint_chk') THEN
    ALTER TABLE swap_orders ADD CONSTRAINT swap_orders_to_amount_base_units_uint_chk CHECK (to_amount_base_units ~ '^\\d+$');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'swap_orders_from_token_decimals_chk') THEN
    ALTER TABLE swap_orders ADD CONSTRAINT swap_orders_from_token_decimals_chk CHECK (from_token_decimals BETWEEN 0 AND 255);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'swap_orders_to_token_decimals_chk') THEN
    ALTER TABLE swap_orders ADD CONSTRAINT swap_orders_to_token_decimals_chk CHECK (to_token_decimals BETWEEN 0 AND 255);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'batched_actions_amount_base_units_uint_chk') THEN
    ALTER TABLE batched_actions ADD CONSTRAINT batched_actions_amount_base_units_uint_chk CHECK (amount_base_units ~ '^\\d+$');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'batched_actions_token_decimals_chk') THEN
    ALTER TABLE batched_actions ADD CONSTRAINT batched_actions_token_decimals_chk CHECK (token_decimals BETWEEN 0 AND 255);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'activities_amount_base_units_uint_chk') THEN
    ALTER TABLE activities ADD CONSTRAINT activities_amount_base_units_uint_chk CHECK (amount_base_units ~ '^\\d+$');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'activities_token_decimals_chk') THEN
    ALTER TABLE activities ADD CONSTRAINT activities_token_decimals_chk CHECK (token_decimals BETWEEN 0 AND 255);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'shadow_balances_amount_base_units_uint_chk') THEN
    ALTER TABLE shadow_balances ADD CONSTRAINT shadow_balances_amount_base_units_uint_chk CHECK (shadow_amount_base_units ~ '^\\d+$');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'shadow_balances_token_decimals_chk') THEN
    ALTER TABLE shadow_balances ADD CONSTRAINT shadow_balances_token_decimals_chk CHECK (token_decimals BETWEEN 0 AND 255);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'stealth_payments_amount_base_units_uint_chk') THEN
    ALTER TABLE stealth_payments ADD CONSTRAINT stealth_payments_amount_base_units_uint_chk CHECK (amount_base_units ~ '^\\d+$');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'stealth_payments_token_decimals_chk') THEN
    ALTER TABLE stealth_payments ADD CONSTRAINT stealth_payments_token_decimals_chk CHECK (token_decimals BETWEEN 0 AND 255);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'multisig_wallets_balance_base_units_uint_chk') THEN
    ALTER TABLE multisig_wallets ADD CONSTRAINT multisig_wallets_balance_base_units_uint_chk CHECK (balance_base_units ~ '^\\d+$');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'multisig_wallets_token_decimals_chk') THEN
    ALTER TABLE multisig_wallets ADD CONSTRAINT multisig_wallets_token_decimals_chk CHECK (token_decimals BETWEEN 0 AND 255);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'multisig_transactions_amount_base_units_uint_chk') THEN
    ALTER TABLE multisig_transactions ADD CONSTRAINT multisig_transactions_amount_base_units_uint_chk CHECK (amount_base_units IS NULL OR amount_base_units ~ '^\\d+$');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'multisig_transactions_token_decimals_chk') THEN
    ALTER TABLE multisig_transactions ADD CONSTRAINT multisig_transactions_token_decimals_chk CHECK (token_decimals BETWEEN 0 AND 255);
  END IF;
END $$;
