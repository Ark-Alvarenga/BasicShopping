import { cookies } from 'next/headers';

export interface CartItem {
  productId: string;
  quantity: number;
}

export async function getCart(): Promise<CartItem[]> {
  const cookieStore = await cookies();
  const cartData = cookieStore.get('cart')?.value;
  
  if (!cartData) {
    return [];
  }

  try {
    return JSON.parse(cartData);
  } catch {
    return [];
  }
}

export async function setCart(cart: CartItem[]) {
  const cookieStore = await cookies();
  cookieStore.set('cart', JSON.stringify(cart), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export async function addToCart(productId: string, quantity: number = 1) {
  const cart = await getCart();
  const existingItem = cart.find(item => item.productId === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ productId, quantity });
  }

  await setCart(cart);
  return cart;
}

export async function removeFromCart(productId: string) {
  const cart = await getCart();
  const updatedCart = cart.filter(item => item.productId !== productId);
  await setCart(updatedCart);
  return updatedCart;
}

export async function updateCartItemQuantity(productId: string, quantity: number) {
  const cart = await getCart();
  const item = cart.find(item => item.productId === productId);

  if (item) {
    if (quantity <= 0) {
      return await removeFromCart(productId);
    }
    item.quantity = quantity;
    await setCart(cart);
  }

  return cart;
}

export async function clearCart() {
  await setCart([]);
}
