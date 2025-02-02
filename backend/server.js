// backend/server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

// Sostituisci con la tua chiave segreta di Stripe
const stripe = require('stripe')('sk_test_51Qk6KcCOYow4mpBKAIhUWavW5Ey80eBjExYi9feR4FOUfRneEBG7WLsBwrKATcMdcJQIYiorFq6TsuyLXi6Q3Pdr00z8L7gxVO');

const app = express();
const PORT = process.env.PORT || 4242;

// Abilita CORS e parse JSON
app.use(cors());
app.use(express.json());

// Content Security Policy con Helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          "https://js.stripe.com",
          "https://m.stripe.network",
          "blob:",
        ],
        workerSrc: [
          "'self'",
          "blob:",
          "https://m.stripe.network",
        ],
        frameSrc: [
          "'self'",
          "https://js.stripe.com",
          "https://m.stripe.network",
        ],
        connectSrc: [
          "'self'",
          // Se hai un altro server dati (es. su 1337), aggiungilo qui
          `http://localhost:${PORT}`,
          "https://api.stripe.com",
          "https://m.stripe.network",
          "https://q.stripe.com",
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com",
        ],
        fontSrc: [
          "'self'",
          "data:",
          "https://fonts.gstatic.com",
        ],
        imgSrc: [
          "'self'",
          "data:",
          "https://q.stripe.com",
        ],
      },
    },
  })
);

// (Opzionale) Se vuoi servire la build React in produzione
// app.use(express.static(path.join(__dirname, '..', 'build')));
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
// });

// Endpoint per creare la sessione di Checkout di Stripe
app.post('/create-checkout-session', async (req, res) => {
  try {
    const { cartItems, shippingCost, discount } = req.body;

    const line_items = cartItems.map(item => ({
      price_data: {
        currency: 'eur',
        product_data: { name: item.name },
        unit_amount: item.unit_amount, // in centesimi
      },
      quantity: item.quantity,
    }));

    if (shippingCost > 0) {
      line_items.push({
        price_data: {
          currency: 'eur',
          product_data: { name: 'Costi di Spedizione' },
          unit_amount: Math.round(shippingCost * 100),
        },
        quantity: 1,
      });
    }

    // discount non gestito in questo esempio, potresti aggiungere coupon, ecc.
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: 'http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:3000/cancel',
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Errore nella creazione della sessione di Checkout:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server in esecuzione sulla porta ${PORT}`);
});
