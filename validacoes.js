const { ajustarData } = require("./utils"); // Importe a função ajustarData
module.exports = {
    validarPedido(msg) {
      const temQuantidade = msg.match(/\d+/);
      if (!temQuantidade) {
        return "❗Por favor, informe o pedido com as quantidades, ex: 2 Calabresa, 1 Marguerita.";
      }
      return null;
    },
  
    validarNome(msg) {
      const partes = msg.trim().split(" ");
      if (partes.length < 2 || partes.some(p => p.length < 2)) {
        return "❗Por favor, informe seu nome completo (nome e sobrenome).";
      }
      return null;
    },
    
    validarPagamento(msg) {
      const formasValidas = ["dinheiro", "cartão", "cartao", "pix"];
      if (!formasValidas.includes(msg.toLowerCase())) {
        return "❗Forma de pagamento inválida. Escolha: Dinheiro, Cartão ou PIX.";
      }
      return null;
    },
  
    validarRetirada(msg) {
      const diasValidos = ["hoje", "amanhã", "amanha", "segunda", "terça", "quarta", "quinta", "sexta", "sábado", "domingo"];
      const horariosValidos = ["18h", "19h", "20h", "21h"];
      
      const msgLower = msg.toLowerCase();
    
      // Verifica se o dia é válido
      const diaValido = diasValidos.some(dia => msgLower.includes(dia));
      const horarioValido = horariosValidos.some(h => msgLower.includes(h));
    
      console.log("Dia válido:", diaValido);  // Log para verificar se o dia está sendo reconhecido corretamente
      console.log("Horário válido:", horarioValido);  // Log para verificar se o horário está sendo reconhecido corretamente
    
      if (!diaValido && !horarioValido) {
        return "❗Informe o dia (Hoje, Amanhã, ou um dia da semana como Segunda) e um horário válido (18h, 19h, 20h ou 21h).";
      }
    
      if (!diaValido) {
        return "❗Dia inválido. Escolha entre: Hoje, Amanhã ou um dia da semana como Segunda, Terça, etc.";
      }
    
      if (!horarioValido) {
        return "❗Horário inválido. Escolha entre: 18h, 19h, 20h ou 21h.";
      }
    
      // Ajusta a data com base na escolha do cliente
      const diaEscolhido = diasValidos.find(dia => msgLower.includes(dia));
      const horarioEscolhido = horariosValidos.find(h => msgLower.includes(h));
    
      console.log("Dia escolhido:", diaEscolhido);  // Log para verificar qual dia foi selecionado
      console.log("Horário escolhido:", horarioEscolhido);  // Log para verificar qual horário foi selecionado
    
      // Verificações básicas
      if (!diaEscolhido || !horarioEscolhido) {
        return "❗Informe corretamente o dia e o horário da retirada.";
      }
    
      const dataRetirada = ajustarData(diaEscolhido, horarioEscolhido);
    
      if (!dataRetirada) {
        return "❗Erro ao ajustar a data. Tente novamente.";
      }
    
      // Retorno final ajustado corretamente
      return null;  // Retorna null em caso de sucesso, indicando que não há erro
    }
    
    
};
  