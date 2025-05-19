const express = require("express");
const bodyParser = require("body-parser");
const { MessagingResponse } = require("twilio").twiml;
const messages = require("./mensagens");
const validacoes = require("./validacoes"); // 👈 Importa as validações
const { salvarPedido } = require("./sheet");
const { interpretarPedido } = require("./calculadora");
const {ajustarData} = require("./utils")
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
const { MessagingResponse } = require("twilio").twiml;

// Habilita parsing de dados tipo application/x-www-form-urlencoded (Twilio usa esse formato!)
app.use(bodyParser.urlencoded({ extended: false }));

// (Opcional) Também aceita JSON se quiser fazer testes com ferramentas como Postman
app.use(bodyParser.json());


let orders = {};  // Armazena os pedidos por número de telefone

  app.post("/webhook", async (req, res) => {
    const twiml = new MessagingResponse();
    const incomingMsg = req.body.Body.trim();  // Mensagem recebida do cliente
    const from = req.body.From;  // Número de telefone do cliente

    if (!orders[from]) {
      orders[from] = { stage: 0 };  // Inicializa o pedido para este número de telefone
    }

    const order = orders[from];  // Acesso ao pedido do cliente

    try {
      switch (order.stage) {
        case 0:  // Primeira interação, boas-vindas
          twiml.message(messages.boasVindas());
          order.stage = 1;  // Avança para a próxima etapa
          break;

        case 1:  // Menu
          if (incomingMsg.toLowerCase().includes("menu")) {
            twiml.message(messages.menu());
            order.stage = 2;  // Avança para o próximo passo
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

          twiml.message(messages.informeNome());  // Solicita o nome do cliente
          order.stage = 3;  // Avança para a etapa de nome
          break;

        case 3:  // Validação do nome
          const erroNome = validacoes.validarNome(incomingMsg);
          if (erroNome) {
            twiml.message(erroNome);
            break;
          }

          order.nome = incomingMsg;  // Armazena o nome do cliente
          twiml.message(messages.formaPagamento());  // Solicita a forma de pagamento
          order.stage = 4;  // Avança para a etapa de pagamento
          break;

        case 4:  // Validação do pagamento
          const erroPagamento = validacoes.validarPagamento(incomingMsg);
          if (erroPagamento) {
            twiml.message(erroPagamento);
            break;
          }

          order.pagamento = incomingMsg;  // Armazena a forma de pagamento
          twiml.message(messages.informeRetirada());  // Solicita a retirada
          order.stage = 5;  // Avança para a etapa de retirada
          break;

          case 5:  // Validação da retirada
          const erroRetirada = validacoes.validarRetirada(incomingMsg);
          if (erroRetirada) {
            twiml.message(erroRetirada);
            break;
          }
        
          // Aqui você deve extrair o dia e horário da mensagem recebida
          const [dia, horario] = incomingMsg.toLowerCase().split(' '); // Ex: "amanhã 19h"
          const retiradaFormatada = ajustarData(dia, horario); // Chama a função que você criou
        
          if (!retiradaFormatada) {
            twiml.message("❌ Não entendi o dia e horário da retirada. Ex: 'hoje 18h', 'sexta 19h'.");
            break;
          }
        
          order.retirada = retiradaFormatada;
          twiml.message(messages.pedidoResumo(order));
            console.log("Resumo do pedido enviado.");
            
            twiml.message(messages.agradecimento(order.nome));  // Agradece ao cliente
            console.log("Agradecimento enviado.");
            
            // Atualiza o estado da ordem para indicar que foi finalizado
            order.stage = 6;  // Finaliza o pedido
            console.log("Estágio do pedido atualizado para:", order.stage);  // Verifica se o estágio foi alterado
            
            // Salva o pedido (adapte conforme necessário para o seu contexto)
            salvarPedido(order);  // Certifique-se de que o pedido está sendo salvo corretamente
            console.log("Pedido salvo:", order);  // Verifica se o pedido foi salvo corretamente
            
            // Pode ser interessante retornar uma mensagem de confirmação após salvar
            twiml.message("✅ Pedido finalizado com sucesso!");  // Confirmação final para o cliente
            console.log("Mensagem final enviada para o cliente.");
            
            // Redireciona o fluxo para o menu (alterando o estágio para 0 ou conforme seu fluxo)
            order.stage = 0;  // Define que o fluxo voltará para o menu inicial
            twiml.message("Voltar ao menu principal? Responda 'sim' para continuar.");
            console.log("Redirecionamento para o menu principal.");
            break;
      
      
      }
    } catch (err) {
      console.error("Erro ao processar mensagem:", err);
      twiml.message("⚠️ Ocorreu um erro interno. Tente novamente mais tarde.");
    }

    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(twiml.toString());
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log("Servidor rodando na porta", PORT);
  });
