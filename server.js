const express = require("express");
const bodyParser = require("body-parser");
const { MessagingResponse } = require("twilio").twiml;
const messages = require("./mensagens");
const validacoes = require("./validacoes");
const { salvarPedido } = require("./sheet");
const { interpretarPedido } = require("./calculadora");
const { ajustarData } = require("./utils");

const app = express();

// Configuração correta do body-parser (apenas uma vez)
app.use(bodyParser.urlencoded({ extended: false }));  // Para dados do Twilio (form-urlencoded)
app.use(bodyParser.json());  // Opcional: Para testes com Postman/API

let orders = {};  // Armazena os pedidos por número de telefone

app.post("/webhook", async (req, res) => {
  const twiml = new MessagingResponse();
  
  // Verifica se req.body.Body existe antes de usar .trim()
  if (!req.body || !req.body.Body) {
    console.error("Twilio não enviou 'Body' na requisição:", req.body);
    return res.status(400).type("text/xml").send(
      twiml.message("Erro: Mensagem inválida. Tente novamente.").toString()
    );
  }

  const incomingMsg = req.body.Body.trim();  // Agora seguro
  const from = req.body.From;

  if (!orders[from]) {
    orders[from] = { stage: 0 };  // Inicializa o pedido
  }

  const order = orders[from];

  try {
    switch (order.stage) {
      case 0:  // Boas-vindas
        twiml.message(messages.boasVindas());
        order.stage = 1;
        break;

      case 1:  // Menu
        if (incomingMsg.toLowerCase().includes("menu")) {
          twiml.message(messages.menu());
          order.stage = 2;
        } else {
          twiml.message(messages.menuRequisitado());
        }
        break;

      case 2:  // Interpretação do pedido
        const resultado = interpretarPedido(incomingMsg);
        if (!resultado.total) {
          twiml.message("❌ Não entendi seu pedido. Verifique os sabores e tamanhos informados.");
          break;
        }
        order.pedido = resultado.pedido;
        order.total = resultado.total;
        twiml.message(messages.informeNome());
        order.stage = 3;
        break;

      case 3:  // Validação do nome
        const erroNome = validacoes.validarNome(incomingMsg);
        if (erroNome) {
          twiml.message(erroNome);
          break;
        }
        order.nome = incomingMsg;
        twiml.message(messages.formaPagamento());
        order.stage = 4;
        break;

      case 4:  // Validação do pagamento
        const erroPagamento = validacoes.validarPagamento(incomingMsg);
        if (erroPagamento) {
          twiml.message(erroPagamento);
          break;
        }
        order.pagamento = incomingMsg;
        twiml.message(messages.informeRetirada());
        order.stage = 5;
        break;

      case 5:  // Validação da retirada
        const erroRetirada = validacoes.validarRetirada(incomingMsg);
        if (erroRetirada) {
          twiml.message(erroRetirada);
          break;
        }
        const [dia, horario] = incomingMsg.toLowerCase().split(' ');
        const retiradaFormatada = ajustarData(dia, horario);
        if (!retiradaFormatada) {
          twiml.message("❌ Não entendi o dia e horário da retirada. Ex: 'hoje 18h', 'sexta 19h'.");
          break;
        }
        order.retirada = retiradaFormatada;
        twiml.message(messages.pedidoResumo(order));
        twiml.message(messages.agradecimento(order.nome));
        order.stage = 6;
        await salvarPedido(order);  // Adicione 'await' se salvarPedido for assíncrono
        twiml.message("✅ Pedido finalizado com sucesso!");
        order.stage = 0;  // Reinicia o fluxo
        twiml.message("Voltar ao menu principal? Responda 'sim' para continuar.");
        break;
    }
  } catch (err) {
    console.error("Erro ao processar mensagem:", err);
    twiml.message("⚠️ Ocorreu um erro interno. Tente novamente mais tarde.");
  }

  res.type("text/xml").send(twiml.toString());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});