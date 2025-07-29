
const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const router = express.Router();

router.post('/', async (req, res) => {
  const { method, name, email, whatsapp, items } = req.body;

  const totalAmount = items.reduce((sum, item) => sum + item.harga, 0);

  const merchantRef = 'INV' + Date.now();
  const signature = crypto.createHmac('sha256', process.env.TRIPAY_PRIVATE_KEY)
    .update(process.env.TRIPAY_MERCHANT_CODE + merchantRef + totalAmount)
    .digest('hex');

  const data = {
    method,
    merchant_ref: merchantRef,
    amount: totalAmount,
    customer_name: name,
    customer_email: email,
    customer_phone: whatsapp,
    order_items: items.map(item => ({
      name: item.judul,
      price: item.harga,
      quantity: 1
    })),
    return_url: 'https://mistikanusantara.my.id/sukses.html',
    callback_url: 'https://mistikanusantara-backend.up.railway.app/api/webhook',
    signature
  };

  try {
    const response = await axios.post('https://tripay.co.id/api/transaction/create', data, {
      headers: {
        Authorization: `Bearer ${process.env.TRIPAY_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ success: false, message: 'Gagal membuat transaksi' });
  }
});

module.exports = router;
