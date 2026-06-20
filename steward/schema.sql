-- Steward — Groundwork Tool 03 — Supabase schema
-- Run once in the Supabase SQL editor (project wimlphbdiborlwikjfdi).

CREATE TABLE IF NOT EXISTS steward_deals (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type            text NOT NULL,                 -- hdb_resale | private_resale | rental
  side            text,                          -- buy | sell | landlord | tenant
  client_name     text,
  client_contact  text,
  property_addr   text,
  anchors         jsonb DEFAULT '{}'::jsonb,     -- dates + satisfaction flags (otp_granted, exercised, stamp_paid, completed, ...)
  checks          jsonb DEFAULT '[]'::jsonb,     -- completed checklist step ids
  commission_expected   numeric,
  commission_invoiced   boolean DEFAULT false,
  commission_received   boolean DEFAULT false,
  cobroke         text,
  cdd_done        boolean DEFAULT false,
  notes           text,
  archived        boolean DEFAULT false,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS steward_tasks (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id     uuid REFERENCES steward_deals(id) ON DELETE CASCADE,
  label       text,
  due_date    date,
  done        boolean DEFAULT false,
  created_at  timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_steward_tasks_deal ON steward_tasks(deal_id);

ALTER TABLE steward_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE steward_tasks ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN CREATE POLICY "allow_all" ON steward_deals FOR ALL TO anon USING (true) WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "allow_all" ON steward_tasks FOR ALL TO anon USING (true) WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
