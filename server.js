
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


const express = require('express');
const path = require('path');
const cors = require('cors');


const app = express();

// ✅ Allow CORS from your frontend domain
app.use(cors({
  origin: 'https://musclesbymik.com',
}));

// ✅ Parse incoming JSON and serve static files (success.html, cancel.html)
app.use(express.json());
app.use(express.static('public'));

// ✅ Create Stripe Checkout session route
app.post('/create-checkout-session', async (req, res) => {
  const { priceId } = req.body;

  if (!priceId || typeof priceId !== 'string') {
    return res.status(400).json({ error: 'Invalid price ID' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.DOMAIN}/success`,
      cancel_url: `${process.env.DOMAIN}/cancel`,
    });

    console.log('✅ Stripe session created:', session.id);
    res.json({ id: session.id });
  } catch (err) {
    console.error('❌ Error creating Stripe session:', err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Success and cancel routes
app.get('/success', (req, res) => {
  res.sendFile(path.join(__dirname, 'success.html'));
});

app.get('/cancel', (req, res) => {
  res.sendFile(path.join(__dirname, 'cancel.html'));
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
