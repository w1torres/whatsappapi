const dayjs = require("dayjs");
require("dayjs/locale/pt-br");
dayjs.locale("pt-br");

function ajustarData(dia, horario) {
  const hoje = dayjs();

  const diasSemana = {
    hoje: hoje,
    amanhã: hoje.add(1, "day"),
    amanha: hoje.add(1, "day"),
    segunda: hoje.day(1),
    terça: hoje.day(2),
    terca: hoje.day(2),
    quarta: hoje.day(3),
    quinta: hoje.day(4),
    sexta: hoje.day(5),
    sábado: hoje.day(6),
    sabado: hoje.day(6),
    domingo: hoje.day(0),
  };

  let data = diasSemana[dia.toLowerCase()];
  if (!data) return null;

  // Garante que datas passadas sejam ajustadas para a próxima semana
  if (
    data.isBefore(hoje, "day") &&
    ["segunda", "terça", "terca", "quarta", "quinta", "sexta", "sábado", "sabado", "domingo"].includes(dia.toLowerCase())
  ) {
    data = data.add(7, "day");
  }

  const diaSemana = formatarDiaSemana(data.format("dddd")); // ex: "quarta-feira"
  const dataFormatada = data.format("DD/MM");

  return `${diaSemana}, ${dataFormatada} às ${horario}`;
}

function formatarDiaSemana(dia) {
  const diasComFeira = ["segunda", "terça", "quarta", "quinta", "sexta"];
  if (diasComFeira.includes(dia)) {
    return capitalizeFirstLetter(`${dia}-feira`);
  }
  return capitalizeFirstLetter(dia);
}

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = { ajustarData };
