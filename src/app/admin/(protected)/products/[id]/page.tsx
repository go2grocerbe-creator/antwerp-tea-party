import { notFound } from "next/navigation";
import Link from "next/link";
import { ProductForm } from "@/components/admin/ProductForm";
import { getAdminProduct } from "@/lib/admin/products";
import { updateProductAction } from "@/lib/admin/product-actions";

export const metadata = { title: "Edit product — Admin", robots: { index: false, follow: false } };

export default async function EditAdminProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; created?: string }>;
}) {
  const { id } = await params;
  const { saved, created } = await searchParams;
  const product = await getAdminProduct(id);
  if (!product) notFound();

  return (
    <div className="admin-product-page">
      <Link href="/admin" className="text-link">
        Back to products
      </Link>
      <h1>{product.titleEn}</h1>
      {(saved || created) && (
        <p className="admin-notice admin-notice--success">
          {created ? "Product created." : "Changes saved."} Preview it at{" "}
          <Link href={`/nl/shop/${product.handle}`}>/nl/shop/{product.handle}</Link>
          {product.status !== "published" && " (only visible to you until it's published)."}
        </p>
      )}
      <ProductForm product={product} action={updateProductAction.bind(null, id)} />
    </div>
  );
}
