import Link from "next/link";
import { listAdminProducts } from "@/lib/admin/products";
import { setProductStatusAction } from "@/lib/admin/product-actions";

export const metadata = { title: "Products — Admin", robots: { index: false, follow: false } };

export default async function AdminProductListPage() {
  const products = await listAdminProducts();

  return (
    <div className="admin-products">
      <div className="admin-products__header">
        <h1>Products</h1>
        <Link href="/admin/products/new" className="button">
          Add product
        </Link>
      </div>

      {products.length === 0 ? (
        <p>No products yet. Add the first one.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title (EN)</th>
              <th>Handle</th>
              <th>Status</th>
              <th>Variants</th>
              <th>Updated</th>
              <th aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>
                  <Link href={`/admin/products/${p.id}`}>{p.titleEn}</Link>
                </td>
                <td>{p.handle}</td>
                <td>
                  <span className={`admin-status admin-status--${p.status}`}>{p.status}</span>
                </td>
                <td>{p.variantCount}</td>
                <td>{new Date(p.updatedAt).toLocaleDateString()}</td>
                <td className="admin-table__actions">
                  {p.status !== "published" && (
                    <form action={setProductStatusAction}>
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="status" value="published" />
                      <button type="submit" className="text-link">
                        Publish
                      </button>
                    </form>
                  )}
                  {p.status === "published" && (
                    <form action={setProductStatusAction}>
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="status" value="draft" />
                      <button type="submit" className="text-link">
                        Unpublish
                      </button>
                    </form>
                  )}
                  {p.status !== "archived" && (
                    <form action={setProductStatusAction}>
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="status" value="archived" />
                      <button type="submit" className="text-link">
                        Archive
                      </button>
                    </form>
                  )}
                  {p.status === "archived" && (
                    <form action={setProductStatusAction}>
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="status" value="draft" />
                      <button type="submit" className="text-link">
                        Restore to draft
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
