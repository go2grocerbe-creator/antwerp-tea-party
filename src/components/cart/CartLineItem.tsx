import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { localePath, type Dictionary, type Locale } from "@/i18n";
import type { Product, ProductVariant } from "@/lib/commerce";
import { removeCartLineAction, updateCartLineAction } from "@/lib/commerce/actions";

export function CartLineItem({
  lineId,
  product,
  variant,
  quantity,
  lineTotal,
  locale,
  dictionary,
}: {
  lineId: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
  lineTotal: number;
  locale: Locale;
  dictionary: Dictionary;
}) {
  return (
    <li className="cart-line">
      <Link className="cart-line__image" href={localePath(locale, `/shop/${product.handle}`)}>
        <Image src={product.images[0]?.src ?? ""} alt={product.images[0]?.alt || ""} fill sizes="96px" />
      </Link>

      <div className="cart-line__info">
        <Link href={localePath(locale, `/shop/${product.handle}`)}>
          <strong>{product.title[locale]}</strong>
        </Link>
        <span className="cart-line__weight">{variant.weightLabel}</span>
        <span className="cart-line__price">{formatPrice(variant.price, variant.currency, locale)}</span>
      </div>

      <form action={updateCartLineAction} className="cart-line__quantity">
        <input type="hidden" name="lineId" value={lineId} />
        <label>
          <span className="sr-only">{dictionary.cartPage.quantity}</span>
          <input type="number" name="quantity" min={0} max={99} defaultValue={quantity} />
        </label>
        <button type="submit" className="text-link">
          {dictionary.cartPage.update}
        </button>
      </form>

      <div className="cart-line__total">{formatPrice(lineTotal, variant.currency, locale)}</div>

      <form action={removeCartLineAction} className="cart-line__remove">
        <input type="hidden" name="lineId" value={lineId} />
        <button type="submit" className="text-link">
          {dictionary.cartPage.remove}
        </button>
      </form>
    </li>
  );
}
