import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// We use the service role key so this route can insert directly without a session
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, email, phone, companyName, plan, billingCycle, price } = body;

    if (!fullName || !email || !plan || !billingCycle || price === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("pending_orders")
      .insert([
        {
          full_name: fullName,
          email,
          phone,
          company_name: companyName,
          plan,
          billing_cycle: billingCycle,
          price,
          status: "pending_transfer"
        }
      ])
      .select()
      .single();

    if (error) {
      console.error("Error inserting pending order:", error);
      return NextResponse.json({ error: "Failed to create pending order" }, { status: 500 });
    }

    return NextResponse.json({ success: true, order: data });
  } catch (error) {
    console.error("Checkout Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
