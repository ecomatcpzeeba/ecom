import bcrypt from 'bcryptjs'
const data = {
  users: [
    {
      name: 'Hoor',
      email: 'admin@example.com',
      password: bcrypt.hashSync('12345'),
      isAdmin: true,
    },
    {
      name: 'Amina',
      email: 'user1@example.com',
      password: bcrypt.hashSync('12345'),
      isAdmin: false,
    },
    {
      name: 'Abdullah',
      email: 'user2@example.com',
      password: bcrypt.hashSync('12345'),
      isAdmin: false,
    },
  ],
  products: [
    {
      name: 'Free Shirt',
      slug: 'free-shirt',
      category: 'Shirts',
      image: '/images/shirt1.png',
      price: 70,
      brand: 'Nike',
      rating: 4.5,
      numReviews: 8,
      countInStock: 20,
      description: 'A popular shirt',
      isFeatured: true,
      banner: '/images/banner1.jpg',
    },
    {
      name: 'Fit Shirt',
      slug: 'fit-shirt',
      category: 'Shirts',
      image: '/images/shirt2.png',
      price: 80,
      brand: 'Adidas',
      rating: 3.2,
      numReviews: 10,
      countInStock: 20,
      description: 'A popular shirt',
      isFeatured: true,
      banner: '/images/banner2.png',
    },
    {
      name: 'Slim Shirt',
      slug: 'slim-shirt',
      category: 'Shirts',
      image: '/images/shirt3.png',
      price: 90,
      brand: 'Raymond',
      rating: 4.5,
      numReviews: 3,
      countInStock: 20,
      description: 'A popular shirt',
    },
    {
      name: 'Golf Pants',
      slug: 'golf-pants',
      category: 'Pants',
      image: '/images/pants1.png',
      price: 90,
      brand: 'Oliver',
      rating: 2.9,
      numReviews: 13,
      countInStock: 20,
      description: 'Smart looking pants',
    },
    {
      name: 'Fit Pants',
      slug: 'fit-pants',
      category: 'Pants',
      image: '/images/pants2.png',
      price: 95,
      brand: 'Zara',
      rating: 3.5,
      numReviews: 7,
      countInStock: 20,
      description: 'A popular pants',
    },
    {
      name: 'Classic Pants',
      slug: 'classic-pants',
      category: 'Pants',
      image: '/images/pants3.png',
      price: 75,
      brand: 'Casely',
      rating: 2.4,
      numReviews: 14,
      countInStock: 20,
      description: 'A popular pants',
    },
    {
      name: 'Blue Leggings',
      slug: 'blue-leggings',
      category: 'Leggings',
      image: '/images/pants3.png',
      price: 299,
      brand: 'Cpzeeba',
      rating: 2.4,
      numReviews: 14,
      countInStock: 20,
      description: 'A popular pants',
      colors: [
        {
          name: 'Red',
          colorCode: '#FF0000',
          link: 'https://cpzeeba.com/product/blue-leggings',
        },
        {
          name: 'Green',
          colorCode: '#00FF00',
          link: 'https://cpzeeba.com/product/blue-leggings',
        },
        {
          name: 'Blue',
          colorCode: '#0000FF',
          link: 'https://cpzeeba.com/product/blue-leggings',
        },
      ],
      sizes: [
        { size: 'S', countInStock: 20 },
        { size: 'M', countInStock: 20 },
        { size: 'L', countInStock: 20 },
        { size: 'XL', countInStock: 20 },
        { size: 'XXL', countInStock: 20 },
        { size: 'XXXL', countInStock: 20 },
      ],
    },
  ],
}

export default data
