
const axios = require('axios');
const moment = require('moment-timezone');

function getGreeting() {
  const hour = moment().tz('Asia/Jakarta').hour();
  if (hour < 11) return 'pagi';
  if (hour < 15) return 'siang';
  if (hour < 18) return 'sore';
  return 'malam';
}

async function sendWhatsApp(name, phone, books) {
  const greeting = getGreeting();
  const message = `Selamat ${greeting},\n\nTerima Kasih ${name} atas pembelian anda.\nIni adalah file yang sudah anda beli, silahkan digunakan dan semangat belajarnya ${name}!`;

  for (const book of books) {
    const text = `${message}\n\n📕 ${book.judul}\n`;

    await axios.post('https://api.gupshup.io/sm/api/v1/msg', null, {
      params: {
        channel: 'whatsapp',
        source: '628xxxxxxxxxx',  // Nomor WA resmi Anda (ubah ini nanti)
        destination: phone,
        src.name: process.env.GUPSHUP_APP_NAME,
        message: JSON.stringify({
          type: 'file',
          url: book.file,
          caption: text + '\nTerimakasih atas pembelian anda, saya akan menunggu pembelian anda berikutnya'
        })
      },
      headers: {
        apikey: process.env.GUPSHUP_API_KEY,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  }
}

module.exports = sendWhatsApp;
