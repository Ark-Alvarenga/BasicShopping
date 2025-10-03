'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
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

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const fetchProducts = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category !== 'all') {
      params.append('category', category);
    }
    
    const response = await fetch(`/api/products?${params}`);
    const data = await response.json();
    setProducts(data);
    setLoading(false);
  };

  const addToCart = async (productId: string) => {
    await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity: 1 }),
    });
    alert('Added to cart!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold">ShopHub</Link>
            <div className="flex items-center gap-4">
              <Link href="/cart" className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
                <ShoppingCart className="w-5 h-5" />
                Cart
              </Link>
              <Link href="/admin" className="text-gray-700 hover:text-gray-900">Admin</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold mb-8">Shop</h1>

        <div className="mb-6">
          <label className="text-sm font-medium mr-4">Filter by category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value="all">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <Link href={`/product/${product.id}`}>
                  <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
                </Link>
                <div className="p-4">
                  <Link href={`/product/${product.id}`}>
                    <h3 className="font-semibold text-lg mb-2 hover:text-gray-600">{product.name}</h3>
                  </Link>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">{formatPrice(product.price)}</span>
                    <button
                      onClick={() => addToCart(product.id)}
                      className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm"
                    >
                      Add to Cart
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Stock: {product.stock}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
