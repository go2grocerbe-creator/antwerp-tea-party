import { ProductForm } from "@/components/admin/ProductForm";
import { createProductAction } from "@/lib/admin/product-actions";

export const metadata = { title: "Add product — Admin", robots: { index: false, follow: false } };

export default function NewAdminProductPage() {
  return (
    <div className="admin-product-page">
      <h1>Add product</h1>
      <ProductForm action={createProductAction} />
    </div>
  );
}
