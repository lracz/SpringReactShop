const mongoose = require('mongoose');
const { User, Product } = require('./models');

// Connect to the same database as server.js
mongoose.connect('mongodb://localhost:27017/reactshop')
  .then(() => console.log('Connected to MongoDB for seeding...'))
  .catch(err => {
    console.error('Connection error:', err);
    process.exit(1);
  });

const seedDatabase = async () => {
  try {
    // 1. CLEAR EXISTING DATA (Optional: keeps the DB clean)
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data.');

    // 2. CREATE ADMINS & USERS

    const users = [
      {
        username: 'admin',
        password: 'admin123', 
        role: 'admin'
      },
      {
        username: 'manager',
        password: 'password123',
        role: 'admin'
      },
      {
        username: 'john_doe',
        password: 'password123',
        role: 'user'
      }
    ];

    await User.insertMany(users);
    console.log('✅ Users & Admins inserted.');

    // 3. CREATE 10 PRODUCTS
    const products = [
      {
        name: 'Wireless Noise-Canceling Headphones',
        price: 299.99,
        description: 'Experience pure silence with our top-tier noise cancellation technology and 30-hour battery life.',
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80'
      },
      {
        name: 'Smart Fitness Watch Pro',
        price: 199.50,
        description: 'Track your heart rate, sleep, and workouts with precision. Water-resistant up to 50 meters.',
        imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80'
      },
      {
        name: 'Mechanical Gaming Keyboard',
        price: 129.99,
        description: 'RGB backlit mechanical keyboard with tactile blue switches for the ultimate typing experience.',
        imageUrl: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500&q=80'
      },
      {
        name: 'Ergonomic Office Chair',
        price: 349.00,
        description: 'Designed for comfort during long work sessions. Features adjustable lumbar support and mesh back.',
        imageUrl: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=500&q=80'
      },
      {
        name: '4K Ultra HD Monitor',
        price: 450.00,
        description: 'Stunning color accuracy and resolution. Perfect for designers, gamers, and content creators.',
        imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80'
      },
      {
        name: 'Minimalist Laptop Stand',
        price: 45.00,
        description: 'Aluminum alloy stand that raises your laptop to eye level for better posture and cooling.',
        imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b91add1?w=500&q=80'
      },
      {
        name: 'Wireless Gaming Mouse',
        price: 79.99,
        description: 'Lag-free wireless performance with 25K DPI sensor and programmable buttons.',
        imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80'
      },
      {
        name: 'Portable SSD 1TB',
        price: 110.00,
        description: 'Lightning fast data transfer speeds in a pocket-sized drive. Shock-resistant and secure.',
        imageUrl: 'https://images.unsplash.com/photo-1597872258084-dd3137800125?w=500&q=80'
      },
      {
        name: 'Smart Home Speaker',
        price: 99.00,
        description: 'Voice-controlled speaker with premium sound. Controls your lights, thermostat, and plays music.',
        imageUrl: 'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=500&q=80'
      },
      {
        name: 'Professional Camera Lens',
        price: 899.00,
        description: '50mm f/1.2 lens for stunning portraits with creamy bokeh and sharp details.',
        imageUrl: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=500&q=80'
      }
    ];

    await Product.insertMany(products);
    console.log('✅ 10 Products inserted.');

    console.log('Database seeded successfully!');
    mongoose.connection.close();
  } catch (err) {
    console.error('Error seeding database:', err);
    mongoose.connection.close();
  }
};

seedDatabase();