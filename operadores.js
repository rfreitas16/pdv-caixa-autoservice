let operadores = [];

async function carregarOperadores() {
  try {
    const resposta = await fetch('data/operadores.json');

    operadores = await resposta.json();
  } catch (erro) {
    console.error('Erro ao carregar operadores:', erro);
  }
}

function buscarOperadorPorPin(pin) {
  return operadores.find(op => op.pin === pin && op.ativo);
}
