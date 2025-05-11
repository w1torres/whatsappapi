// messages.js
module.exports = {
    boasVindas: () => `
  Olá! 👋 Seja bem-vindo à Pizza's da Ana!
  Posso te ajudar a fazer seu pedido. 😋
  Temos os melhores sabores da região! Vamos começar? 🍕
  Digite *menu* para ver os sabores disponíveis.`,
  
    menu: () => `
Estes são nossos sabores disponíveis (valores por tamanho):

🍕 Pequena / 🍕🍕 Grande

1️⃣ Calabresa – R$ 25 / R$ 35  
2️⃣ Frango com Catupiry – R$ 27 / R$ 37  
3️⃣ Quatro Queijos – R$ 28 / R$ 38  
4️⃣ Portuguesa – R$ 26 / R$ 36  
5️⃣ Marguerita – R$ 24 / R$ 34  
6️⃣ Napolitana – R$ 25 / R$ 35  
7️⃣ Bacon – R$ 27 / R$ 37  
8️⃣ Toscana – R$ 28 / R$ 38  
9️⃣ Vegetariana – R$ 24 / R$ 34  
🔟 Chocolate – R$ 26 / R$ 36

Digite os sabores, quantidades e tamanhos desejados.  
Exemplo: 2 Calabresa grande, 1 Frango com Catupiry pequena`,
  
    informeNome: () => `Para quem será o pedido? Por favor, informe seu nome completo.`,
  
    formaPagamento: () => `
  Qual a forma de pagamento?
  💵 Dinheiro
  💳 Cartão
  📱 PIX`,
  
  informeRetirada: () => `
  Informe o dia e horário desejado para retirada no formato:
  👉 Ex: *Hoje 18h* ou *Quarta 19h*

  Disponibilidade:
  📅 Dias: de Segunda a Domingo
  🕒 Horários:  18h as 21h
`,
  
  pedidoResumo: (order) => `
  ✅ Resumo do seu pedido:
  👤 Cliente: ${order.nome}
  📦 Pedido:
  ${order.pedido}
  
  💰 Total: R$ ${order.total},00
  💳 Pagamento: ${order.pagamento}
  📅 Retirada: ${order.retirada}
  `,
  
  
    agradecimento: (nome) => `
  🍕 Obrigado pelo seu pedido, ${nome}!
  Sua pizza estará pronta na hora marcada.
  Qualquer dúvida é só chamar aqui mesmo!
  Bom apetite! 😋`,
  
    ajuda: () => `Se precisar de algo, é só chamar! 😊`,
  
    menuRequisitado: () => `Digite *menu* para ver os sabores disponíveis.`,
  };
  