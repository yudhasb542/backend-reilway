require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const checkoutRoute = require('./routes/checkout');
const webhookRoute = require('./routes/webhook');

app.use('/api/checkout', checkoutRoute);
app.use('/api/webhook', webhookRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
