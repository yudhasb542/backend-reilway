
const express = require('express');
const axios = require('axios');
const sendWhatsApp = require('../utils/sendWhatsApp');
const router = express.Router();

router.post('/', async (req, res) => {
  const callbackData = req.body;

  if (callbackData.status !== 'PAID') return res.sendStatus(200);

  try {
    const invoiceURL = `https://tripay.co.id/api/transaction/detail?reference=${callbackData.reference}`;
    const invoiceRes = await axios.get(invoiceURL, {
      headers: { Authorization: `Bearer ${process.env.TRIPAY_API_KEY}` }
    });

    const data = invoiceRes.data.data;
    const name = data.customer_name;
    const phone = data.customer_phone;

    const bukuRes = await axios.get(process.env.BUKU_JSON_URL);
    const semuaBuku = bukuRes.data;

    const purchasedBooks = data.order_items.map(item => {
      const found = semuaBuku.find(b => b.judul === item.name);
      return found ? { judul: found.judul, file: found.file, harga: found.harga } : null;
    }).filter(Boolean);

    await sendWhatsApp(name, phone, purchasedBooks);
    res.sendStatus(200);
  } catch (err) {
    console.error("Gagal proses webhook:", err.message);
    res.sendStatus(500);
  }
});

module.exports = router;
