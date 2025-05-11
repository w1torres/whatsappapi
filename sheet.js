const { google } = require("googleapis");
const path = require("path");
const fs = require("fs");
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc'); // Para lidar com UTC
const timezone = require('dayjs/plugin/timezone'); // Para fusos horários
dayjs.extend(utc);
dayjs.extend(timezone);

// Caminho para o arquivo da chave da conta de serviço
const CREDENTIALS_PATH = path.join(__dirname, "credentials.json"); // 👈 renomeie conforme sua chave

// ID da planilha
const SPREADSHEET_ID = "1rCP7VRR9LuDWEHoHUYKxD-DjDJYYFSkhZQyC3JlIK-A";

async function salvarPedido(order) {
  try {
    const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });


    const sheets = google.sheets({ version: "v4", auth: await auth.getClient() });

    const values = [
      [
        dayjs().tz('America/Sao_Paulo').format('DD/MM/YYYY HH:mm:ss'),
        order.nome,
        order.pedido,
        order.total,
        order.pagamento,
        order.retirada,
      ],
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: "Pedidos", // 👈 apenas o nome da aba
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS", // opcional, mas ajuda a garantir comportamento esperado
      resource: {
        values,
      },
    }); 

    console.log("Pedido salvo com sucesso!");
  } catch (error) {
    console.error("Erro ao salvar no Google Sheets:", error);
  }
}

module.exports = { salvarPedido };
