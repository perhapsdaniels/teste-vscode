const readline = require("readline");
const https = require("https");

/* ===== FUNÇÕES DE CONVERSÃO ===== */

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

/* ===== COTAÇÃO DO DÓLAR ===== */

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
  }).on("error", () => {
    callback("Erro ao buscar cotação");
  });
}

/* ===== INTERFACE ===== */

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function mostrarMenu() {
  console.log("\nEscolha a conversão:");
  console.log("1 - Celsius → Fahrenheit");
  console.log("2 - Fahrenheit → Celsius");
  console.log("3 - Dólar → Real");
  console.log("4 - Real → Dólar");
  console.log("0 - Sair");

  rl.question("Opção: ", tratarOpcao);
}

function tratarOpcao(opcao) {
  if (opcao === "0") {
    console.log("Até mais.");
    rl.close();
    return;
  }

  rl.question("Digite o valor: ", (valor) => {
    const numero = Number(valor);

    if (isNaN(numero)) {
      console.log("Valor inválido.");
      return mostrarMenu();
    }

    if (opcao === "1") {
      console.log(`${numero}°C = ${celsiusParaFahrenheit(numero).toFixed(2)}°F`);
      return mostrarMenu();
    }

    if (opcao === "2") {
      console.log(`${numero}°F = ${fahrenheitParaCelsius(numero).toFixed(2)}°C`);
      return mostrarMenu();
    }

    if (opcao === "3" || opcao === "4") {
      console.log("Buscando cotação atual do dólar...");

      obterCotacaoDolar((erro, cotacao) => {
        if (erro) {
          console.log(erro);
          return mostrarMenu();
        }

        if (opcao === "3") {
          console.log(`US$ ${numero} = R$ ${(dolarParaReal(numero, cotacao)).toFixed(2)} (cotação ${cotacao})`);
        } else {
          console.log(`R$ ${numero} = US$ ${(realParaDolar(numero, cotacao)).toFixed(2)} (cotação ${cotacao})`);
        }

        mostrarMenu();
      });

      return;
    }

    console.log("Opção inválida.");
    mostrarMenu();
  });
}

/* ===== START ===== */

mostrarMenu();
