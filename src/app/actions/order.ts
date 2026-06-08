"use server";

import { createOrder, getProductById } from "@/lib/queries";
import { revalidatePath } from "next/cache";

export type OrderFormState = { ok: boolean; message: string };

export async function submitOrderAction(
  _prev: OrderFormState | undefined,
  formData: FormData
): Promise<OrderFormState> {
  const productIdRaw = formData.get("product_id");
  const productNameRaw = formData.get("product_name");
  const customer = (formData.get("customer_name") ?? "").toString().trim();
  const phone = (formData.get("phone") ?? "").toString().trim();
  const email = (formData.get("email") ?? "").toString().trim() || null;
  const address = (formData.get("address") ?? "").toString().trim() || null;
  const notes = (formData.get("notes") ?? "").toString().trim() || null;
  const quantity = Math.max(1, Number(formData.get("quantity") ?? 1));

  if (!customer || !phone) {
    return { ok: false, message: "Ju lutem plotësoni emrin dhe numrin e telefonit." };
  }
  if (customer.length > 200 || phone.length > 50) {
    return { ok: false, message: "Vlera shumë e gjatë." };
  }

  let productId: number | null = null;
  let productName = (productNameRaw ?? "").toString();

  if (productIdRaw) {
    const id = Number(productIdRaw);
    if (Number.isFinite(id)) {
      const p = getProductById(id);
      if (p) {
        productId = p.id;
        productName = p.name;
      }
    }
  }
  if (!productName) productName = "Kërkesë e personalizuar";

  const productForPrice = productId ? getProductById(productId) : undefined;
  const total = (productForPrice?.price_cents ?? 0) * quantity;

  createOrder({
    product_id: productId,
    product_name: productName,
    quantity,
    customer_name: customer,
    phone,
    email,
    address,
    notes,
    items_json: null,
    total_cents: total,
  });

  revalidatePath("/admin/porosi");

  return {
    ok: true,
    message: "Faleminderit! Porosia juaj u regjistrua. Ju kontaktojmë shumë shpejt.",
  };
}
