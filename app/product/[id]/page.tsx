'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ShoppingCart } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
}

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [params.id]);

  const fetchProduct = async () => {
    const response = await fetch(`/api/products/${params.id}`);
    const data = await response.json();
    setProduct(data);
    setLoading(false);
  };

  const addToCart = async () => {
    await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: params.id, quantity }),
    });
    alert('Added to cart!');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">Product not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold">ShopHub</Link>
            <div className="flex items-center gap-4">
              <Link href="/shop" className="text-gray-700 hover:text-gray-900">Shop</Link>
              <Link href="/cart" className="text-gray-700 hover:text-gray-900 flex items-center gap-1">
                <ShoppingCart className="w-5 h-5" />
                Cart
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <img src={product.imageUrl} alt={product.name} className="w-full rounded-lg shadow-lg" />
          </div>

          <div>
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            <p className="text-gray-600 mb-6">{product.description}</p>
            
            <div className="mb-6">
              <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
            </div>

            <div className="mb-6">
              <span className="text-sm text-gray-600">Category: </span>
              <span className="font-medium">{product.category}</span>
            </div>

            <div className="mb-6">
              <span className={`px-3 py-1 rounded-full text-sm ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>

            {product.stock > 0 && (
              <>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Quantity</label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 border rounded hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="w-16 text-center text-lg">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="w-10 h-10 border rounded hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={addToCart}
                  className="w-full bg-gray-900 text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors text-lg font-semibold flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
