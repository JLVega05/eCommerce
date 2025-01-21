const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Stripe = require('stripe');

// Configura Stripe amb la teva clau secreta
const stripe = new Stripe('sk_test_51QXmCnCTEl068jEK3Xo8ZzLsaJPJ5nqtH4ygFqDeHeROjHm2z2gAtMKJ12tG5pgG72J3RU96NdiuLxiNdzmmTQL500eioFe9bt'); 

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({ origin: 'http://localhost:3000' })); // Permet peticions del frontend al port 3000
app.use(bodyParser.json()); // Permet processar el cos de les peticions en format JSON

// Endpoint per crear una sessió de Stripe Checkout
app.post('/create-checkout-session', async (req, res) => {
  const { items, success_url, cancel_url } = req.body;

  try {
    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'eur',
        product_data: { name: item.name },
        unit_amount: item.price * 100, // Convertir a cèntims
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url,
      cancel_url,
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creant la sessió de Stripe:', error);
    res.status(500).json({ error: 'No es pot crear la sessió de Stripe' });
  }
});

// Endpoint de prova per comprovar el servidor
app.get('/', (req, res) => {
  res.send('Servidor actiu!');
});

// Executa el servidor
app.listen(PORT, () => {
  console.log(`Servidor escoltant al port ${PORT}`);
});

// Middleware per processar dades JSON
app.use(bodyParser.json());
 
// Configuració del transportador de nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "jairon.vega.cardenas@prateducacio.com", // La teva adreça de Gmail
    pass: "bbid vsxb wjbd fmfm", // Contrasenya d'Aplicació de Gmail
  },
});
 
// Endpoint per enviar correus
app.post("/send-email", async (req, res) => {
  const { name, email, subject, message } = req.body;
 
  const mailOptions = {
    from: email,
    to: "jairon.vega.cardenas@prateducacio.com", // Correu on vols rebre els missatges 
    subject: `${subject} - de ${name}`,
    text: message,
  };
 
  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send("Email enviat correctament");
  } catch (error) {
    console.error("Error enviant el correu:", error);
    res.status(500).send("Error enviant el correu");
  }
});
