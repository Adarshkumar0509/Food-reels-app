require('dotenv').config();
const mongoose = require('mongoose');
const Food = require('../models/food.model'); // <-- FIXED PATH

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas for seeding');

    // use a real foodPartner _id, or temporarily remove `required: true` from foodPartner in the model
    const someFoodPartnerId = '67c03c2f2c2f2c2f2c2f2c2f';

    await Food.create({
      name: 'Test Dish',
      description: 'Video from ImageKit',
      video:
        'https://ik.imagekit.io/xwchrpz0p/544605ec-ce31-4d06-81dc-d6695a08e16a_e42BLPHAV',
      foodPartner: someFoodPartnerId,
    });

    console.log('Seeded one food item');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

run();
