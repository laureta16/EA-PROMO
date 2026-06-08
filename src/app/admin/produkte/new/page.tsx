import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { listCategories } from "@/lib/queries";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  if (!(await isAdmin())) redirect("/admin");
  const categories = await listCategories();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Produkt i ri</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
