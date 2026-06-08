"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isAdmin, login, logout } from "@/lib/auth";
import {
  createCategory,
  createOffer,
  createProduct,
  deleteCategory,
  deleteOffer,
  deleteProduct,
  updateCategory,
  updateOffer,
  updateProduct,
} from "@/lib/admin-mutations";
import { getProductById, updateOrderStatus } from "@/lib/queries";
import { saveUploadedImage } from "@/lib/upload";

async function assertAdmin() {
  if (!(await isAdmin())) throw new Error("Unauthorized");
}

export async function loginAction(_prev: { error?: string } | undefined, formData: FormData) {
  const pwd = (formData.get("password") ?? "").toString();
  const ok = await login(pwd);
  if (!ok) return { error: "Fjalëkalimi është i pasaktë." };
  redirect("/admin");
}

export async function logoutAction() {
  await logout();
  redirect("/admin");
}

function toInt(v: FormDataEntryValue | null, fallback = 0): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function str(v: FormDataEntryValue | null): string {
  return (v ?? "").toString().trim();
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function saveProductAction(formData: FormData) {
  await assertAdmin();
  const id = str(formData.get("id")); // existing doc id (slug) when editing
  const name = str(formData.get("name"));
  let slug = str(formData.get("slug"));
  if (!slug) slug = slugify(name);
  const description = (formData.get("description") ?? "").toString();
  const price_cents = toInt(formData.get("price_cents"));
  let image_url: string | null = str(formData.get("image_url")) || null;
  const category_slug = str(formData.get("category_slug")) || null;
  const featured = formData.get("featured") ? 1 : 0;
  const active = formData.get("active") ? 1 : 0;

  if (!name || !slug || !description || !price_cents) {
    throw new Error("Të dhëna të paplota.");
  }

  // Handle uploaded image (overrides URL field if present)
  const file = formData.get("image_file");
  if (file instanceof File && file.size > 0) {
    image_url = await saveUploadedImage(file);
  } else if (!image_url && id) {
    image_url = (await getProductById(id))?.image_url ?? null;
  }

  if (id) {
    // Edit: slug is immutable, use the URL/doc id
    await updateProduct(id, {
      slug: id,
      name,
      description,
      price_cents,
      image_url,
      category_slug,
      featured,
      active,
    });
  } else {
    await createProduct({
      slug,
      name,
      description,
      price_cents,
      image_url,
      category_slug,
      featured,
      active,
    });
  }

  revalidatePath("/");
  revalidatePath("/produkte");
  revalidatePath("/admin/produkte");
  redirect("/admin/produkte");
}

export async function deleteProductAction(formData: FormData) {
  await assertAdmin();
  const id = str(formData.get("id"));
  if (id) await deleteProduct(id);
  revalidatePath("/produkte");
  revalidatePath("/admin/produkte");
}

export async function saveCategoryAction(formData: FormData) {
  await assertAdmin();
  const id = str(formData.get("id"));
  const name = str(formData.get("name"));
  let slug = str(formData.get("slug"));
  if (!slug) slug = slugify(name);
  const description = str(formData.get("description")) || null;
  if (!name || !slug) throw new Error("Emri dhe slug-u janë të detyrueshëm.");
  if (id) await updateCategory(id, { slug: id, name, description });
  else await createCategory({ slug, name, description });
  revalidatePath("/produkte");
  revalidatePath("/admin/kategori");
  redirect("/admin/kategori");
}

export async function deleteCategoryAction(formData: FormData) {
  await assertAdmin();
  const id = str(formData.get("id"));
  if (id) await deleteCategory(id);
  revalidatePath("/produkte");
  revalidatePath("/admin/kategori");
}

export async function saveOfferAction(formData: FormData) {
  await assertAdmin();
  const id = str(formData.get("id"));
  const title = str(formData.get("title"));
  const description = str(formData.get("description"));
  const discount_percent = toInt(formData.get("discount_percent"));
  const active = formData.get("active") ? 1 : 0;
  if (!title || !description) throw new Error("Të dhëna të paplota.");
  const payload = { title, description, discount_percent, active };
  if (id) await updateOffer(id, payload);
  else await createOffer(payload);
  revalidatePath("/");
  revalidatePath("/oferta");
  revalidatePath("/admin/oferta");
  redirect("/admin/oferta");
}

export async function deleteOfferAction(formData: FormData) {
  await assertAdmin();
  const id = str(formData.get("id"));
  if (id) await deleteOffer(id);
  revalidatePath("/oferta");
  revalidatePath("/admin/oferta");
}

export async function updateOrderStatusAction(formData: FormData) {
  await assertAdmin();
  const id = str(formData.get("id"));
  const status = str(formData.get("status"));
  if (id && status) await updateOrderStatus(id, status);
  revalidatePath("/admin/porosi");
}
