const { sendMail } = require("../src/utils/mailer");

sendMail("ton.email@test.com", "Test Orthoshop", "Bonjour ! Test de mail.")
  .then(() => console.log("✅ Mail envoyé !"))
  .catch((err) => console.log("❌ Erreur mail :", err));