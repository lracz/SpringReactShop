const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // In prod, hash this!
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  imageUrl: String
});

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{
    id: String,
    name: String,
    price: Number,
    quantity: Number
  }],
  total: Number,
  shipping: {
    fullName: String,
    address: String,
    city: String,
    zip: String,
    country: String
  },
  createdAt: { type: Date, default: Date.now }
});

const messageSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  username: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now } 
});

module.exports = {
  User: mongoose.model('User', userSchema),
  Product: mongoose.model('Product', productSchema),
  Order: mongoose.model('Order', orderSchema),
  Message: mongoose.model('Message', messageSchema) // ÚJ
};
