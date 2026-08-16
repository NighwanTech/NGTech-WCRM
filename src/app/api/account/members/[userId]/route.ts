// ============================================================
// /api/account/members/[userId]
//
//   PATCH  — change a member's role or suspension status. Admin+.
//   DELETE — remove a member from the account.           Admin+.
// ============================================================

import { NextResponse } from "next/server";
import { requireRole, toErrorResponse } from "@/lib/auth/account";
import { isAccountRole } from "@/lib/auth/roles";
import { getAdminClient } from "@/lib/admin-supabase";
import {
  checkRateLimit,
  rateLimitResponse,
  RATE_LIMITS,
} from "@/lib/rate-limit";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const ctx = await requireRole("admin");

    const limit = checkRateLimit(
      `admin:memberRole:${ctx.userId}`,
      RATE_LIMITS.adminAction,
    );
    if (!limit.success) return rateLimitResponse(limit);

    const { userId } = await params;

    // Prevent modifying self
    if (userId === ctx.userId) {
      return NextResponse.json(
        { error: "You cannot change your own role or suspension status" },
        { status: 400 },
      );
    }

    const body = (await request.json().catch(() => null)) as
      | { role?: unknown; is_suspended?: unknown }
      | null;
    const role = body?.role;
    const isSuspended = body?.is_suspended;

    const adminDb = getAdminClient();

    // 1. Role Change
    if (role !== undefined) {
      if (!isAccountRole(role)) {
        return NextResponse.json(
          { error: "'role' must be one of owner, admin, agent, viewer" },
          { status: 400 },
        );
      }

      if (role === "owner" && ctx.role !== "owner") {
        return NextResponse.json(
          { error: "Only existing owners can promote members to owner" },
          { status: 403 },
        );
      }

      const { error: roleErr } = await adminDb
        .from("profiles")
        .update({ account_role: role })
        .eq("account_id", ctx.accountId)
        .eq("user_id", userId);

      if (roleErr) {
        console.error("[PATCH /api/account/members] role update error:", roleErr);
        return NextResponse.json({ error: roleErr.message || "Failed to update role" }, { status: 400 });
      }
    }

    // 2. Suspension Status Change
    if (isSuspended !== undefined) {
      if (typeof isSuspended !== 'boolean') {
        return NextResponse.json({ error: "'is_suspended' must be a boolean" }, { status: 400 });
      }

      const { error: suspendErr } = await adminDb
        .from("profiles")
        .update({ is_suspended: isSuspended })
        .eq("account_id", ctx.accountId)
        .eq("user_id", userId);

      if (suspendErr) {
        console.error("[PATCH /api/account/members] suspend update error:", suspendErr);
        return NextResponse.json({ error: suspendErr.message || "Failed to update suspension status" }, { status: 400 });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return toErrorResponse(err);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const ctx = await requireRole("admin");

    const limit = checkRateLimit(
      `admin:memberRemove:${ctx.userId}`,
      RATE_LIMITS.adminAction,
    );
    if (!limit.success) return rateLimitResponse(limit);

    const { userId } = await params;

    if (userId === ctx.userId) {
      return NextResponse.json(
        { error: "You cannot remove yourself from the workspace" },
        { status: 400 },
      );
    }

    const adminDb = getAdminClient();

    // 1. Get target profile details
    const { data: targetProfile, error: profileErr } = await adminDb
      .from("profiles")
      .select("full_name, email")
      .eq("user_id", userId)
      .single();

    if (profileErr || !targetProfile) {
      return NextResponse.json({ error: "Target member not found" }, { status: 404 });
    }

    // 2. Find existing account owned by this user or create a new personal account
    const { data: existingAccount } = await adminDb
      .from("accounts")
      .select("id")
      .eq("owner_user_id", userId)
      .maybeSingle();

    let targetAccountId = existingAccount?.id;

    if (!targetAccountId) {
      const { data: newAccount, error: accErr } = await adminDb
        .from("accounts")
        .insert({
          name: targetProfile.full_name || targetProfile.email || "Personal Workspace",
          owner_user_id: userId,
        })
        .select("id")
        .single();

      if (accErr || !newAccount) {
        console.error("[DELETE /api/account/members] account provision error:", accErr);
        return NextResponse.json({ error: accErr?.message || "Failed to provision personal workspace" }, { status: 400 });
      }
      targetAccountId = newAccount.id;
    }

    // 3. Reassign target's profile to their personal account
    const { error: updateErr } = await adminDb
      .from("profiles")
      .update({
        account_id: targetAccountId,
        account_role: "owner",
      })
      .eq("user_id", userId);

    if (updateErr) {
      console.error("[DELETE /api/account/members] profile update error:", updateErr);
      return NextResponse.json({ error: updateErr.message }, { status: 400 });
    }

    // 4. Clean up department memberships from this workspace
    await adminDb
      .from("department_members")
      .delete()
      .eq("user_id", userId);

    return NextResponse.json({ ok: true, newPersonalAccountId: targetAccountId });
  } catch (err) {
    return toErrorResponse(err);
  }
}
