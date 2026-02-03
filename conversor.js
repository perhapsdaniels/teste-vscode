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

/* ===== FUNÇÃO PARA BUSCAR COTAÇÃO REAL ===== */

function obterCotacaoDolar(callback) {
  const url = "https://economia.awesomeapi.com.br/json/last/USD-BRL";

  https.get(url, (res) => {
    let dados = "";

    res.on("data", (chunk) => {
      dados += chunk;
    });

    res.on("end", () => {
      try {
        const json = JSON.parse(dados);
        const cotacao = Number(json.USDBRL.bid);
        callback(null, cotacao);
      } catch (erro) {
        callback("Erro ao processar a cotação");
      }
    });
  }).on("error", () => {
    callback("Erro ao buscar a cotação");
  });
}

/* ===== INTERFACE COM O USUÁRIO ===== */

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("Escolha a conversão:");
console.log("1 - Celsius → Fahrenheit");
console.log("2 - Fahrenheit → Celsius");
console.log("3 - Dólar → Real");
console.log("4 - Real → Dólar");

rl.question("Opção: ", (opcao) => {
  rl.question("Digite o valor: ", (valor) => {
    const numero = Number(valor);

    if (isNaN(numero)) {
      console.log("Valor inválido.");
      rl.close();
      return;
    }

    if (opcao === "1") {
      const resultado = celsiusParaFahrenheit(numero);
      console.log(`${numero}°C = ${resultado.toFixed(2)}°F`);
      rl.close();
    }

    else if (opcao === "2") {
      const resultado = fahrenheitParaCelsius(numero);
      console.log(`${numero}°F = ${resultado.toFixed(2)}°C`);
      rl.close();
    }

    else if (opcao === "3" || opcao === "4") {
      console.log("Buscando cotação atual do dólar...");

      obterCotacaoDolar((erro, cotacao) => {
        if (erro) {
          console.log(erro);
          rl.close();
          return;
        }

        let resultado;

        if (opcao === "3") {
          resultado = dolarParaReal(numero, cotacao);
          console.log(`US$ ${numero} = R$ ${resultado.toFixed(2)} (cotação: ${cotacao})`);
        } else {
          resultado = realParaDolar(numero, cotacao);
          console.log(`R$ ${numero} = US$ ${resultado.toFixed(2)} (cotação: ${cotacao})`);
        }

        rl.close();
      });
    }

    else {
      console.log("Opção inválida.");
      rl.close();
    }
  });
});
