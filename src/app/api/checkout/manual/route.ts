import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  try {
    const body = await req.json();
    const { fullName, email, phone, companyName, plan, billingCycle, price, seats, addons, notes, transactionId } = body;

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
          seats: seats || 1,
          addons: addons || [],
          notes: notes || transactionId || '',
          status: "pending_transfer"
        }
      ])
      .select()
      .single();

    if (error) {
      // Fallback if extra columns don't exist in Supabase schema yet
      const { data: fallbackData, error: fallbackError } = await supabase
        .from("pending_orders")
        .insert([
          {
            full_name: fullName,
            email,
            phone,
            company_name: companyName,
            plan: `${plan}${seats ? ` (${seats} seats)` : ''}${addons && addons.length > 0 ? ` + Addons: ${addons.join(', ')}` : ''}`,
            billing_cycle: billingCycle,
            price,
            status: "pending_transfer"
          }
        ])
        .select()
        .single();

      if (fallbackError) {
        console.error("Error inserting pending order:", fallbackError);
        return NextResponse.json({ error: "Failed to create pending order" }, { status: 500 });
      }

      return NextResponse.json({ success: true, order: fallbackData });
    }

    return NextResponse.json({ success: true, order: data });
  } catch (error) {
    console.error("Checkout Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
