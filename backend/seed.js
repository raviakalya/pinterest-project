const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');
const Pin = require('./models/Pin');

dotenv.config();

const usersData = [
  { username: 'creative_mind', email: 'creative@example.com', password: 'password123', bio: 'Digital artist and dreamer' },
  { username: 'foodie_explorer', email: 'foodie@example.com', password: 'password123', bio: 'Searching for the best flavors' },
  { username: 'tech_guru', email: 'tech@example.com', password: 'password123', bio: 'Obsessed with latest gadgets' },
  { username: 'travel_junkie', email: 'travel@example.com', password: 'password123', bio: 'World traveler and photographer' },
  { username: 'style_icon', email: 'style@example.com', password: 'password123', bio: 'Fashion enthusiast' }
];

const categories = ['Art', 'Food', 'Travel', 'Fashion', 'Home Decor', 'Technology'];

const pinsData = [
  // Art
  { title: 'Abstract Ocean', desc: 'A serene abstract painting of the sea.', cat: 'Art', img: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab' },
  { title: 'Street Mural', desc: 'Colorful street art in London.', cat: 'Art', img: 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8' },
  { title: 'Cyberpunk City', desc: 'Neon lights and rainy streets.', cat: 'Art', img: 'https://images.unsplash.com/photo-1515462277126-2dd0c162007a' },
  // Food
  { title: 'Artisan Pizza', desc: 'Stone-baked with fresh basil.', cat: 'Food', img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591' },
  { title: 'Sushi Selection', desc: 'Fresh sashimi and rolls.', cat: 'Food', img: 'https://images.unsplash.com/photo-1553621042-f6e147245754' },
  { title: 'Dessert Platter', desc: 'Sweet treats for everyone.', cat: 'Food', img: 'https://images.unsplash.com/photo-1551024601-bec78aea704b' },
  // Travel
  { title: 'Swiss Mountains', desc: 'The majestic Alps in winter.', cat: 'Travel', img: 'https://images.unsplash.com/photo-1531310197839-ccf54634509e' },
  { title: 'Bali Temple', desc: 'Peaceful morning at the water temple.', cat: 'Travel', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4' },
  { title: 'Tokyo Nights', desc: 'The neon heart of Shinjuku.', cat: 'Travel', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf' },
  // Fashion
  { title: 'Urban Chic', desc: 'Street style for the modern city.', cat: 'Fashion', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f' },
  { title: 'Summer Collection', desc: 'Light and airy fabrics.', cat: 'Fashion', img: 'https://images.unsplash.com/photo-1529139513055-119796836562' },
  { title: 'Vintage Leather', desc: 'Classic styles that never fade.', cat: 'Fashion', img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa' },
  // Home Decor
  { title: 'Modern Living', desc: 'Sleek furniture and open space.', cat: 'Home Decor', img: 'https://images.unsplash.com/photo-1556911227-4a18960ff66b' },
  { title: 'Boho Bedroom', desc: 'Cozy textures and warm lights.', cat: 'Home Decor', img: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af' },
  { title: 'Urban Jungle', desc: 'Bringing the outdoors in.', cat: 'Home Decor', img: 'https://images.unsplash.com/photo-1545241047-6083a3684587' },
  // Technology
  { title: 'Minimal Workspace', desc: 'Focus on what matters.', cat: 'Technology', img: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853' },
  { title: 'Coding Setup', desc: 'Late night productivity.', cat: 'Technology', img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c' },
  { title: 'Gaming Rig', desc: 'RGB everything.', cat: 'Technology', img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e' }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Pin.deleteMany({});
    console.log('Cleared existing data.');

    // Create Users
    const createdUsers = [];
    for (const u of usersData) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(u.password, salt);
      const user = new User({ ...u, password: hashedPassword });
      const savedUser = await user.save();
      createdUsers.push(savedUser);
    }
    console.log('Created 5 users.');

    // Create Pins for each user
    for (const user of createdUsers) {
      // Pick 4 unique categories for each user
      const userCats = [...categories].sort(() => 0.5 - Math.random()).slice(0, 4);
      
      for (const cat of userCats) {
        const pinSource = pinsData.find(p => p.cat === cat);
        const newPin = new Pin({
          title: `${pinSource.title} by ${user.username}`,
          description: pinSource.desc,
          category: pinSource.cat,
          imageUrl: `${pinSource.img}?auto=format&fit=crop&w=1200&q=80`,
          user: user._id
        });
        await newPin.save();
      }
    }
    console.log('Each user created 4 unique pins across all categories.');
    console.log('Seeding completed successfully!');
    process.exit();
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDB();
