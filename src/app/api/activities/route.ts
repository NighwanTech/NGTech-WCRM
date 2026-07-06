import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const contactId = searchParams.get("contact_id");
    const category = searchParams.get("category");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    if (!contactId) {
      return NextResponse.json(
        { error: "Missing contact_id" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data: userData, error: authError } = await supabase.auth.getUser();

    if (authError || !userData?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Build the query
    let query = supabase
      .from("customer_activities")
      .select("*, actor:auth.users!actor_id(email, raw_user_meta_data)", { count: "exact" })
      .eq("contact_id", contactId)
      .order("created_at", { ascending: false });

    // Apply category filter if provided and not "all"
    if (category && category !== "all") {
      query = query.eq("category", category);
    }

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: activities, error, count } = await query;

    if (error) {
      console.error("Error fetching activities:", error);
      return NextResponse.json(
        { error: "Failed to fetch activities" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      activities,
      total: count || 0,
      page,
      limit,
      hasMore: count ? from + limit < count : false,
    });
  } catch (error: any) {
    console.error("Activities API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
