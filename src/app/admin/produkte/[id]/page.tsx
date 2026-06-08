import { notFound, redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getProductById, listCategories } from "@/lib/queries";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isAdmin())) redirect("/admin");
  const { id } = await params;
  const p = getProductById(Number(id));
  if (!p) notFound();
  const categories = listCategories();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Redakto: {p.name}</h1>
      <ProductForm product={p} categories={categories} />
    </div>
  );
}
