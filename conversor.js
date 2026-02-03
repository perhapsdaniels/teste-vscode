const readline = require("readline");

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
      console.log("Valor inválido. Isso não é um número.");
      rl.close();
      return;
    }

    let resultado;

    switch (opcao) {
      case "1":
        resultado = (numero * 9 / 5) + 32;
        console.log(`${numero}°C = ${resultado.toFixed(2)}°F`);
        break;

      case "2":
        resultado = (numero - 32) * 5 / 9;
        console.log(`${numero}°F = ${resultado.toFixed(2)}°C`);
        break;

      case "3":
        const cotacaoDolar = 5.00; // valor fixo por enquanto
        resultado = numero * cotacaoDolar;
        console.log(`US$ ${numero} = R$ ${resultado.toFixed(2)}`);
        break;

      case "4":
        const cotacaoReal = 5.00; // valor fixo por enquanto
        resultado = numero / cotacaoReal;
        console.log(`R$ ${numero} = US$ ${resultado.toFixed(2)}`);
        break;

      default:
        console.log("Opção inválida.");
    }

    rl.close();
  });
});
