'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface CartItem {
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
  };
}

export default function CartPage() {
  const [cart, setCart] = useState<{ items: CartItem[]; total: number }>({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const response = await fetch('/api/cart');
    const data = await response.json();
    setCart(data);
    setLoading(false);
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    await fetch('/api/cart', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity }),
    });
    fetchCart();
  };

  const removeItem = async (productId: string) => {
    await fetch(`/api/cart?productId=${productId}`, {
      method: 'DELETE',
    });
    fetchCart();
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold">ShopHub</Link>
            <div className="flex items-center gap-4">
              <Link href="/shop" className="text-gray-700 hover:text-gray-900">Shop</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

        {cart.items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Your cart is empty</p>
            <Link href="/shop" className="bg-gray-900 text-white px-6 py-3 rounded-lg inline-block hover:bg-gray-800">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {cart.items.map((item) => (
                <div key={item.productId} className="bg-white p-6 rounded-lg shadow-sm mb-4">
                  <div className="flex gap-4">
                    <img src={item.product.imageUrl} alt={item.product.name} className="w-24 h-24 object-cover rounded" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{item.product.name}</h3>
                      <p className="text-gray-600 mb-3">{formatPrice(item.product.price)}</p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="w-8 h-8 border rounded hover:bg-gray-100"
                          >
                            -
                          </button>
                          <span className="w-12 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="w-8 h-8 border rounded hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="text-red-600 hover:text-red-800 flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-sm sticky top-24">
                <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
                <div className="flex justify-between mb-4 pb-4 border-b">
                  <span>Subtotal</span>
                  <span className="font-semibold">{formatPrice(cart.total)}</span>
                </div>
                <div className="flex justify-between mb-6 text-xl font-bold">
                  <span>Total</span>
                  <span>{formatPrice(cart.total)}</span>
                </div>
                <Link
                  href="/checkout"
                  className="w-full bg-gray-900 text-white px-6 py-3 rounded-lg block text-center hover:bg-gray-800"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
