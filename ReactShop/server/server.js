const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const { User, Product, Order, Message } = require('./models');

const app = express();
const server = http.createServer(app); 
const wss = new WebSocket.Server({ server }); 

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/reactshop')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

const SECRET_KEY = 'super_secret_key'; 

// --- AUTH MIDDLEWARE ---
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; 
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // Hozzáadjuk a felhasználói adatokat a kéréshez
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
  }
};

// --- API ENDPOINTS ---

// 1. GET /api/products (Publikus)
app.get('/api/products', async (req, res) => {
  const products = await Product.find();
  // Visszaküldés a frontendnek (Mongo _id -> id)
  res.json(products.map(p => ({ ...p.toObject(), id: p._id })));
});

// 2. POST /api/products (Új termék létrehozása - Protected, Admin only)
app.post('/api/products', authenticate, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admins only' });
  
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ ...product.toObject(), id: product._id });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create product' });
  }
});

// 3. PUT /api/products/:id (Termék frissítése - Protected, Admin only)
app.put('/api/products/:id', authenticate, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admins only' });
  
  const productId = req.params.id;
  // Kiszűrjük az ID mezőket, amik benne lehetnek a kérés törzsében
  const { id, _id, ...updatedData } = req.body; 
  
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updatedData, 
      { new: true, runValidators: true } // Visszaadja a frissített terméket
    );
    
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ ...updatedProduct.toObject(), id: updatedProduct._id });
  } catch (error) {
    res.status(500).json({ message: 'Product update failed due to server logic.' });
  }
});

// 4. DELETE /api/products/:id (Protected, Admin only)
app.delete('/api/products/:id', authenticate, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admins only' });
  
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Product deletion failed' });
  }
});


// 5. POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const role = username.toLowerCase().includes('admin') ? 'admin' : 'user';
    // FIGYELEM: Ha implementáltad a bcryptet, itt hashelj!
    const user = new User({ username, password, role }); 
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role, username }, SECRET_KEY);
    res.status(201).json({ 
      user: { id: user._id, username, role }, 
      token 
    });
  } catch (err) {
    res.status(400).json({ message: 'Registration failed' });
  }
});

// 6. POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password }); 
  
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id, role: user.role, username }, SECRET_KEY);
  res.json({ 
    user: { id: user._id, username, role: user.role }, 
    token 
  });
});

// 7. POST /api/orders
app.post('/api/orders', authenticate, async (req, res) => {
  try {
    const order = new Order({ ...req.body, userId: req.user.id });
    await order.save();
    res.status(201).json({ success: true, orderId: order._id });
  } catch (err) {
    res.status(500).json({ message: 'Order failed' });
  }
});


// --- WEBSOCKET SERVER (Chat) ---
wss.on('connection', async (ws, req) => {
  const urlParams = new URLSearchParams(req.url.split('?')[1]);
  const username = urlParams.get('username') || 'Guest';
  
  console.log(`User connected: ${username}`);

  // 1. ÜZENET ELŐZMÉNY LEKÉRÉSE ÉS KÜLDÉSE (Utolsó 50)
  try {
    const history = await Message.find().sort({ timestamp: 1 }).limit(50);
    
    history.forEach(msg => {
      const msgObject = msg.toObject();
      const clientMsg = {
        ...msgObject,
        id: msgObject._id.toString(), 
      };
      ws.send(JSON.stringify(clientMsg));
    });
  } catch (error) {
    console.error("Failed to load chat history:", error);
  }

  ws.on('message', async (message) => { // async a message függvényhez
    const data = JSON.parse(message);
    
    // Az érkező adat (userId, username, text)
    const incomingMessage = {
      userId: data.userId, 
      username: data.username,
      text: data.text,
      timestamp: Date.now()
    };

    // 2. MENTÉS AZ ADATBÁZISBA
    const newMessage = new Message(incomingMessage);
    await newMessage.save();

    // 3. SZÓRÁS AZ ÖSSZES KLIENT FELÉ
    const broadcastMsg = {
      ...newMessage.toObject(),
      id: newMessage._id.toString(), 
    };

    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(broadcastMsg));
      }
    });
  });
});


// Start Server on Port 5000
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`WebSocket running on ws://localhost:${PORT}`);
});