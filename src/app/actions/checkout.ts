"use server";

import { revalidatePath } from "next/cache";
import { createOrder } from "@/lib/queries";
import type { OrderItem } from "@/lib/types";

export type CheckoutFormState = { ok: boolean; message: string };

export async function checkoutAction(
  _prev: CheckoutFormState | undefined,
  formData: FormData
): Promise<CheckoutFormState> {
  const customer = (formData.get("customer_name") ?? "").toString().trim();
  const phone = (formData.get("phone") ?? "").toString().trim();
  const email = (formData.get("email") ?? "").toString().trim() || null;
  const address = (formData.get("address") ?? "").toString().trim() || null;
  const notes = (formData.get("notes") ?? "").toString().trim() || null;
  const itemsRaw = (formData.get("items_json") ?? "").toString();

  if (!customer || !phone) {
    return { ok: false, message: "Ju lutem plotësoni emrin dhe numrin e telefonit." };
  }

  let items: OrderItem[] = [];
  try {
    const parsed = JSON.parse(itemsRaw);
    if (Array.isArray(parsed)) items = parsed;
  } catch {
    // ignore
  }
  if (items.length === 0) {
    return { ok: false, message: "Shporta juaj është bosh." };
  }

  const total = items.reduce((s, i) => s + i.quantity * i.price_cents, 0);
  const summary = items.map((i) => `${i.quantity}× ${i.product_name}`).join(", ");
  const totalQty = items.reduce((s, i) => s + i.quantity, 0);

  createOrder({
    product_id: items.length === 1 ? items[0].product_id : null,
    product_name:
      items.length === 1
        ? items[0].product_name
        : `Porosi me ${items.length} artikuj: ${summary}`,
    quantity: totalQty,
    customer_name: customer,
    phone,
    email,
    address,
    notes,
    items_json: JSON.stringify(items),
    total_cents: total,
  });

  revalidatePath("/admin/porosi");

  return {
    ok: true,
    message: "Faleminderit! Porosia juaj u regjistrua. Ju kontaktojmë shumë shpejt për konfirmim.",
  };
}
