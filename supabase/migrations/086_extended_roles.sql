-- ============================================================
-- 086_extended_roles.sql — Extended Multi-Tenant RBAC Hierarchy
--
-- Adds `manager` and `client` roles to account_role_enum and updates
-- `is_account_member()` to enforce the expanded role hierarchy:
--
-- Hierarchy:
--   owner (6) > admin (5) > manager (4) > agent (3) > client (2) > viewer (1)
--- ============================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum
    WHERE enumtypid = 'account_role_enum'::regtype AND enumlabel = 'manager'
  ) THEN
    ALTER TYPE account_role_enum ADD VALUE 'manager' BEFORE 'agent';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_enum
    WHERE enumtypid = 'account_role_enum'::regtype AND enumlabel = 'client'
  ) THEN
    ALTER TYPE account_role_enum ADD VALUE 'client' BEFORE 'viewer';
  END IF;
END $$;

-- Update is_account_member() security definer function
CREATE OR REPLACE FUNCTION is_account_member(
  target_account_id UUID,
  min_role account_role_enum DEFAULT 'viewer'
) RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM profiles p
    WHERE p.user_id = auth.uid()
      AND p.account_id = target_account_id
      AND CASE p.account_role
            WHEN 'owner'   THEN 6
            WHEN 'admin'   THEN 5
            WHEN 'manager' THEN 4
            WHEN 'agent'   THEN 3
            WHEN 'client'  THEN 2
            WHEN 'viewer'  THEN 1
          END
        >=
          CASE min_role
            WHEN 'owner'   THEN 6
            WHEN 'admin'   THEN 5
            WHEN 'manager' THEN 4
            WHEN 'agent'   THEN 3
            WHEN 'client'  THEN 2
            WHEN 'viewer'  THEN 1
          END
  );
$$;

ALTER FUNCTION is_account_member(UUID, account_role_enum) OWNER TO postgres;
GRANT EXECUTE ON FUNCTION is_account_member(UUID, account_role_enum) TO authenticated, service_role;
