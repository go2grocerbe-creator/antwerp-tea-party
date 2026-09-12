"use server";

import { cookies } from "next/headers";
import { refresh } from "next/cache";
import { getCommerceProvider, resolveCart } from "./index";

const CART_COOKIE = "atp_cart_id";
const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

/**
 * Reads the current cart from the cart-id cookie. Read-only: safe to call from Server
 * Components (e.g. the header cart count, the cart page). Never creates a cart, because
 * cookies cannot be set during Server Component rendering — see docs/commerce-architecture.md.
 */
export async function getCurrentCart() {
  const cookieStore = await cookies();
  const cartId = cookieStore.get(CART_COOKIE)?.value;
  if (!cartId) return null;
  const cart = await getCommerceProvider().getCart(cartId);
  return cart;
}

export async function getCurrentCartSummary() {
  const cart = await getCurrentCart();
  if (!cart) return { resolvedLines: [], subtotal: 0, totalQuantity: 0, currency: "EUR" };
  return resolveCart(cart);
}

async function getOrCreateCartId() {
  const cookieStore = await cookies();
  const existing = cookieStore.get(CART_COOKIE)?.value;
  if (existing) return existing;

  const cart = await getCommerceProvider().createCart();
  cookieStore.set(CART_COOKIE, cart.id, {
    maxAge: CART_COOKIE_MAX_AGE,
    sameSite: "lax",
    path: "/",
  });
  return cart.id;
}

export async function addToCartAction(formData: FormData) {
  const productHandle = String(formData.get("productHandle") ?? "");
  const variantId = String(formData.get("variantId") ?? "");
  const quantity = Math.max(1, Number(formData.get("quantity") ?? 1) || 1);
  const preview = formData.get("preview");

  if (!productHandle || !variantId) {
    throw new Error("Missing productHandle or variantId");
  }

  // Draft products can only be added to the cart when the request carries the same preview
  // token the product page itself required to display them — see docs/commerce-architecture.md.
  const previewToken = process.env.COMMERCE_PREVIEW_TOKEN;
  const includeDrafts = Boolean(previewToken) && preview === previewToken;

  const cartId = await getOrCreateCartId();
  await getCommerceProvider().addCartLine(cartId, variantId, productHandle, quantity, { includeDrafts });
  refresh();
}

export async function updateCartLineAction(formData: FormData) {
  const lineId = String(formData.get("lineId") ?? "");
  const quantity = Math.max(0, Number(formData.get("quantity") ?? 0) || 0);
  if (!lineId) throw new Error("Missing lineId");

  const cookieStore = await cookies();
  const cartId = cookieStore.get(CART_COOKIE)?.value;
  if (!cartId) return;

  await getCommerceProvider().updateCartLine(cartId, lineId, quantity);
  refresh();
}

export async function removeCartLineAction(formData: FormData) {
  const lineId = String(formData.get("lineId") ?? "");
  if (!lineId) throw new Error("Missing lineId");

  const cookieStore = await cookies();
  const cartId = cookieStore.get(CART_COOKIE)?.value;
  if (!cartId) return;

  await getCommerceProvider().removeCartLine(cartId, lineId);
  refresh();
}

export async function getCheckoutUrlForCurrentCart() {
  const cookieStore = await cookies();
  const cartId = cookieStore.get(CART_COOKIE)?.value;
  if (!cartId) return null;
  return getCommerceProvider().getCheckoutUrl(cartId);
}
