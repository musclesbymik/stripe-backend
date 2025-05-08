require('dotenv').config(); // Load environment variables from .env

// Log the Stripe secret key to confirm it's loaded correctly
console.log('STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY);

// Import required modules
const express = require('express');
const path = require('path');
const Stripe = require('stripe');

// Initialize the app and Stripe with the secret key
const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Set the base domain for redirect URLs (live or local)
const DOMAIN = process.env.DOMAIN || 'http://localhost:3000';

app.use(express.json()); // Parse incoming JSON requests
app.use(express.static(__dirname)); // Serve static files (e.g., success.html, cancel.html)

// Route to check if the server is up
app.get('/', (req, res) => {
  res.send('Server is working!');
});

// Route to create a Stripe Checkout session
app.post('/create-checkout-session', async (req, res) => {
  const { priceId } = req.body;
  
  if (!priceId) {
    return res.status(400).json({ error: 'priceId is required' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',  // Subscription mode for recurring payments
      line_items: [
        {
          price: priceId,  // The live price ID for your subscription product
          quantity: 1,  // Number of items (1 subscription)
        },
      ],
      success_url: `${DOMAIN}/success`,  // Success URL after successful payment
      cancel_url: `${DOMAIN}/cancel`,  // Cancel URL if the user cancels payment
    });

    // Respond with the session ID to redirect the user to Stripe Checkout
    res.json({ id: session.id });
  } catch (err) {
    console.error('Error creating checkout session:', err);
    res.status(500).json({ error: err.message });
  }
});

// Success page after payment is successful
app.get('/success', (req, res) => {
  res.sendFile(path.join(__dirname, 'success.html'));
});

// Cancel page if the user cancels the payment
app.get('/cancel', (req, res) => {
  res.sendFile(path.join(__dirname, 'cancel.html'));
});

// Start the server on the specified port (defaults to 3000)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
