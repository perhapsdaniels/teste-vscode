const https = require("https");

/* ===== FUNÇÕES ===== */

function celsiusParaFahrenheit(c) {
  return (c * 9 / 5) + 32;
}

function fahrenheitParaCelsius(f) {
  return (f - 32) * 5 / 9;
}

function dolarParaReal(valor, cotacao) {
  return valor * cotacao;
}

function realParaDolar(valor, cotacao) {
  return valor / cotacao;
}

function obterCotacaoDolar(callback) {
  const url = "https://economia.awesomeapi.com.br/json/last/USD-BRL";

  https.get(url, (res) => {
    let dados = "";

    res.on("data", chunk => dados += chunk);
    res.on("end", () => {
      try {
        const json = JSON.parse(dados);
        callback(null, Number(json.USDBRL.bid));
      } catch {
        callback("Erro ao processar cotação");
      }
    });
  }).on("error", () => callback("Erro ao buscar cotação"));
}

/* ===== CLI ===== */

const valor = Number(process.argv[2]);
const de = process.argv[3];
const para = process.argv[4];

if (isNaN(valor) || !de || !para) {
  console.log("Uso:");
  console.log("  conversor <valor> <de> <para>");
  console.log("Exemplos:");
  console.log("  conversor 10 usd brl");
  console.log("  conversor 30 c f");
  process.exit(1);
}

if (de === "c" && para === "f") {
  console.log(`${valor}°C = ${celsiusParaFahrenheit(valor).toFixed(2)}°F`);
  process.exit(0);
}

if (de === "f" && para === "c") {
  console.log(`${valor}°F = ${fahrenheitParaCelsius(valor).toFixed(2)}°C`);
  process.exit(0);
}

if ((de === "usd" && para === "brl") || (de === "brl" && para === "usd")) {
  obterCotacaoDolar((erro, cotacao) => {
    if (erro) {
      console.log(erro);
      return;
    }

    if (de === "usd") {
      console.log(`US$ ${valor} = R$ ${(dolarParaReal(valor, cotacao)).toFixed(2)} (cotação ${cotacao})`);
    } else {
      console.log(`R$ ${valor} = US$ ${(realParaDolar(valor, cotacao)).toFixed(2)} (cotação ${cotacao})`);
    }
  });

  return;
}

console.log("Conversão não suportada.");
