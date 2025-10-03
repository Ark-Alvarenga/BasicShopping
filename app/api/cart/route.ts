import { NextRequest, NextResponse } from 'next/server';
import { getCart, addToCart as addToCartUtil, removeFromCart as removeFromCartUtil, updateCartItemQuantity as updateCartUtil, clearCart as clearCartUtil } from '@/lib/cart';
import { prisma } from '@/lib/prisma';
import { Product } from '@prisma/client';

export async function GET() {
  try {
    const cart = await getCart();
    
    if (cart.length === 0) {
      return NextResponse.json({ items: [], total: 0 });
    }

    const productIds = cart.map(item => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    const items = cart.map(cartItem => {
      const product = products.find((p: Product) => p.id === cartItem.productId);
      return {
        ...cartItem,
        product,
      };
    });

    const total = items.reduce((sum, item) => {
      return sum + (item.product?.price || 0) * item.quantity;
    }, 0);

    return NextResponse.json({ items, total });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { productId, quantity } = await request.json();
    await addToCartUtil(productId, quantity || 1);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { error: 'Failed to add to cart' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { productId, quantity } = await request.json();
    await updateCartUtil(productId, quantity);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get('productId');

    if (productId) {
      await removeFromCartUtil(productId);
    } else {
      await clearCartUtil();
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing from cart:', error);
    return NextResponse.json(
      { error: 'Failed to remove from cart' },
      { status: 500 }
    );
  }
}
