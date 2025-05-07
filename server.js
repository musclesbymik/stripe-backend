require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const path = require('path');
const Stripe = require('stripe');

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Set the base domain for redirect URLs (local or production)
const DOMAIN = process.env.DOMAIN || 'http://localhost:3000';

app.use(express.json()); // To parse incoming JSON data
app.use(express.static(__dirname)); // Serve static files like success.html and cancel.html

// Basic route to confirm server is up
app.get('/', (req, res) => {
  res.send('Server is working!');
});

// Route to create Stripe Checkout session
app.post('/create-checkout-session', async (req, res) => {
  const { priceId } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${DOMAIN}/success`,
require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const path = require('path');
const Stripe = require('stripe');
const dotenv = require('dotenv');
const app = express();

// Stripe secret key from environment variable
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

app.use(express.json()); // To parse incoming JSON data
app.use(express.static(__dirname)); // Serve static files (e.g., success.html and cancel.html)

// Basic route for root URL to check if the server is running
app.get('/', (req, res) => {
  res.send('Server is working!');
});

// Route to create a Stripe Checkout session
app.post('/create-checkout-session', async (req, res) => {
  const { priceId } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.DOMAIN}/success`,
      cancel_url: `${process.env.DOMAIN}/cancel`,
    });

    // Respond with the session ID
    res.json({ id: session.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/success', (req, res) => {
  res.sendFile(path.join(__dirname, 'success.html'));
});

app.get('/cancel', (req, res) => {
  res.sendFile(path.join(__dirname, 'cancel.html'));
});

// Start the server on the specified port (defaults to 3000)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
