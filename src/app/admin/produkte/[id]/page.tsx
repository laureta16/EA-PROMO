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
  const [p, categories] = await Promise.all([getProductById(id), listCategories()]);
  if (!p) notFound();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Redakto: {p.name}</h1>
      <ProductForm product={p} categories={categories} />
    </div>
  );
}
