operadores;
window.onload = async () => {
  await carregarOperadores();

  console.log('Operadores carregados.');
};

//botoes
document.getElementById('btnDinheiro').addEventListener('click', methodMoney);

document.getElementById('btnFinalizar').addEventListener('click', irPagamento);

document.getElementById('btnBack').addEventListener('click', voltarLayout);

document.getElementById('btnLimpar').addEventListener('click', limparCarrinho);
document
  .getElementById('btn-codbarnum')
  .addEventListener('click', digitarCodigoUnid);

///quantidade
document.getElementById('btn-qtd').addEventListener('click', digitarQuantidade);

// botao de ajuda
document.getElementById('btn-help').addEventListener('click', terminalHelp);
///carregar carrinho
document.addEventListener('DOMContentLoaded', () => {
  carregarCarrinhoSessao();
});

//leitor por camera

// let scanner;

// const abrir = document.getElementById('abrirScanner');
// const fechar = document.getElementById('fecharScanner');

// abrir.onclick = iniciarScanner;
// fechar.onclick = pararScanner;

// function iniciarScanner() {
//   scanner = new Html5Qrcode('reader');

//   Html5Qrcode.getCameras()

//     .then(cameras => {
//       if (cameras.length == 0) {
//         alert('Nenhuma câmera encontrada.');

//         return;
//       }

//       scanner.start(
//         cameras[0].id,

//         {
//           fps: 10,

//           qrbox: {
//             width: 300,
//             height: 150,
//           },
//         },

//         sucessoLeitura,

//         erro => {},
//       );
//     });
// }

// function pararScanner() {
//   if (scanner) {
//     scanner.stop();
//   }
// }

// let ultimoCodigo = '';
// let ultimaLeitura = 0;

// function sucessoLeitura(codigo) {
//   const agora = Date.now();

//   if (codigo === ultimoCodigo && agora - ultimaLeitura < 1500) {
//     return;
//   }

//   ultimoCodigo = codigo;
//   ultimaLeitura = agora;

//   procurarProduto(codigo);
// }

// funcao de quantidade para o leitor

// function sucessoLeitura(codigo) {

//     const quantidade = parseInt(
//         document.getElementById("quantidade").value
//     ) || 1;

//     const produto = produtos.find(
//         p => p.codigo === codigo
//     );

//     if (!produto) {

//         alert("Produto não cadastrado.");

//         return;
//     }

//     adicionarProduto(
//         produto.id,
//         quantidade
//     );

//     document.getElementById("quantidade").value = 1;

//     console.log(
//         `${quantidade}x ${produto.nome} adicionado`
//     );
// }
function terminalHelp() {
  alert('Ajuda Solicitada ao operador, Aguarde...');
  const som = new Audio('./assets/sounds/bell-start.mp3');
  som.currentTime = 0;
  som.play();
}

function procurarProduto(codigo) {
  const produto = produtos.find(p => p.codigo === codigo);

  if (!produto) {
    alert('Código não cadastrado.');

    return;
  }

  adicionarProduto(produto.id);
}

//leitor digitando

const leitor = document.getElementById('codigoBarras');
leitor.maxLength = 13;
leitor.focus();

leitor.addEventListener('keydown', function (e) {
  if (e.key !== 'Enter') return;

  const codigo = leitor.value.trim();

  const produto = produtos.find(p => p.codigo === codigo);

  if (produto) {
    adicionarProduto(produto.id);
  } else {
    alert('Produto não encontrado.');
  }

  leitor.value = '';

  // leitor.focus();
});

document.addEventListener('click', () => {
  // leitor.focus();
});

function produtCode(codigo) {
  const produto = produtos.find(p => p.codigo === codigo);

  if (produto) {
    adicionarProduto(produto.id);
    fecharPinpad();
  } else {
    alert('Produto não encontrado. Digite novamente');
    apagarCod();
  }
  return;
}

function procurarProduto(codigo) {
  const produto = produtos.find(p => p.codigo === codigo);

  if (!produto) {
    alert('Produto não cadastrado.');
    return;
  }

  const quantidadeInput = document.getElementById('productQtd');
  // volta para 1 quantidade antes de adicionar
  quantidadeInput.value = 1;

  const quantidade = parseInt(quantidadeInput.value, 10) || 1;

  adicionarProduto(produto.id, quantidade);

  document.getElementById('codigoBarras').value = '';
}
function procurarProdutoPorQtd(codigo) {
  const produto = produtos.find(p => p.codigo === codigo);

  if (!produto) {
    alert('Produto não cadastrado.');
    return;
  }

  const quantidade = EnviarQtd();

  adicionarProduto(produto.id, quantidade);

  // // Depois da venda, volta para 1
  // quantidadeInput.value = 1;
  quantidade.value = 1;

  document.getElementById('codigoBarras').value = '';
}
