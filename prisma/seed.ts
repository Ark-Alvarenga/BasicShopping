import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@shop.com' },
    update: {},
    create: {
      email: 'admin@shop.com',
      password: hashedPassword,
      name: 'Admin User',
      isAdmin: true,
    },
  });

  console.log('Created admin user:', admin.email);

  const products = [
    {
      name: 'Wireless Headphones',
      description: 'High-quality wireless headphones with noise cancellation',
      price: 299.99,
      stock: 50,
      category: 'Electronics',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
    },
    {
      name: 'Smart Watch',
      description: 'Feature-rich smartwatch with health tracking',
      price: 399.99,
      stock: 30,
      category: 'Electronics',
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
    },
    {
      name: 'Laptop Stand',
      description: 'Ergonomic aluminum laptop stand',
      price: 49.99,
      stock: 100,
      category: 'Accessories',
      imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop',
    },
    {
      name: 'Mechanical Keyboard',
      description: 'RGB mechanical keyboard with custom switches',
      price: 149.99,
      stock: 45,
      category: 'Electronics',
      imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&h=500&fit=crop',
    },
    {
      name: 'USB-C Hub',
      description: '7-in-1 USB-C hub with HDMI and SD card reader',
      price: 79.99,
      stock: 75,
      category: 'Accessories',
      imageUrl: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500&h=500&fit=crop',
    },
    {
      name: 'Webcam 4K',
      description: 'Professional 4K webcam with autofocus',
      price: 199.99,
      stock: 25,
      category: 'Electronics',
      imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&h=500&fit=crop',
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.name.toLowerCase().replace(/\s+/g, '-') },
      update: {},
      create: {
        id: product.name.toLowerCase().replace(/\s+/g, '-'),
        ...product,
      },
    });
  }

  console.log('Created products');
  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
