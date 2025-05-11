// calculador.js
const precosPizza = {
    "calabresa": { pequena: 25, grande: 35 },
    "frango com catupiry": { pequena: 27, grande: 37 },
    "quatro queijos": { pequena: 28, grande: 38 },
    "portuguesa": { pequena: 26, grande: 36 },
    "marguerita": { pequena: 24, grande: 34 },
    "napolitana": { pequena: 25, grande: 35 },
    "bacon": { pequena: 27, grande: 37 },
    "toscana": { pequena: 28, grande: 38 },
    "vegetariana": { pequena: 24, grande: 34 },
    "chocolate": { pequena: 26, grande: 36 }
  };
  
  function interpretarPedido(texto) {
    const itens = texto.split(',').map(p => p.trim());
    const pedidoDetalhado = [];
    let total = 0;
  
    for (let item of itens) {
      const match = item.match(/(\d+)\s+(.+?)\s+(grande|pequena)/i);
      if (!match) continue;
  
      const quantidade = parseInt(match[1]);
      const sabor = match[2].toLowerCase().trim();
      const tamanho = match[3].toLowerCase();
  
      const precoSabor = precosPizza[sabor];
      if (!precoSabor || !precoSabor[tamanho]) continue;
  
      const precoUnitario = precoSabor[tamanho];
      const subtotal = quantidade * precoUnitario;
      total += subtotal;
  
      pedidoDetalhado.push(`${quantidade} ${sabor} ${tamanho} - R$ ${subtotal},00`);
    }
  
    return {
      pedido: pedidoDetalhado.join('\n'),
      total
    };
  }
  
  module.exports = { interpretarPedido };
  