window.onload = function () {
  topOnLoad();
  operadoresOnLoad();
};

function topOnLoad() {
  // forcar pagina abrir no topo
  window.scrollTo(0, 0);
}
async function operadoresOnLoad() {
  await carregarOperadores();

  console.log('Operadores carregados.');
}
//botoes
document.getElementById('btnDinheiro').addEventListener('click', methodMoney);

document.getElementById('btnBackHome').addEventListener('click', homePage);
document.getElementById('btnFinalizar').addEventListener('click', irPagamento);
document.getElementById('btnCheckout').addEventListener('click', parkingExist);
// document.getElementById('btnCheckout').addEventListener('click', irPagamento);

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
/// voltar ao topo ao clicar em voltar na pagina do carrinho
const btnVoltarTopo = document.getElementById('btnBackHome');

btnVoltarTopo.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
  });
});

/// Carregar estacionamento na sessao se tiver
document.addEventListener('DOMContentLoaded', () => {
  carregarEstacionamentoSessao();

  const resumoSalvo = sessionStorage.getItem('resumoCompra');

  if (resumoSalvo) {
    try {
      resumoCompra = JSON.parse(resumoSalvo);
    } catch (erro) {
      console.error('Erro ao recuperar resumo da compra:', erro);

      resumoCompra = [];
    }
  }
});

//Tela inicial

function homePage() {
  const divHome = document.getElementById('initialOptions');
  divHome.style.transitionDelay = '10s';
  divHome.style.display = 'flex';
}
function cartHomePage() {
  const divHome = document.getElementById('home');
  const homePage = document.getElementById('initialOptions');
  homePage.style.display = 'none';
  divHome.style.display = 'none';
}
function bgHomeOptions() {
  const homePage = document.getElementById('home');
  const divHome = document.getElementById('initialOptions');

  homePage.style.display = 'flex';
  divHome.style.display = 'none';
}
function retryCpfNovo() {
  const pinpad = document.getElementById('pinpadModalNewCpfClub');

  pinpad.style.display = 'flex';
}
function cancelCadastro() {
  const homePage = document.getElementById('home');
  const divHome = document.getElementById('initialOptions');
  fecharPinpad();

  homePage.style.display = 'flex';
  divHome.style.display = 'none';
  const divCadastro = document.getElementById('telaCadastroClub');
  divCadastro.style.display = 'none';
}
function errorCadastro() {
  const divCadastro = document.getElementById('telaCadastroClub');
  divCadastro.style.display = 'none';
}

function parkingExist() {
  document.getElementById('btnBack').style.display = 'flex';
  document.getElementById('btnBackHome').style.display = 'none';
  document.getElementById('pinpadModalParking').style.display = 'none';

  const card = document.getElementsByClassName('card');
  for (const cards of card) {
    cards.style.display = 'none';
  }
  const cardcheck = document.getElementsByClassName('cardCheck');
  for (const cards of cardcheck) {
    cards.style.display = 'flex';
  }
  const btns = document.getElementsByClassName('area-buttons');

  for (const btn of btns) {
    btn.style.display = 'none';
  }
  const payments = document.getElementsByClassName('area-buttons-payment');
  for (const payment of payments) {
    payment.style.display = 'flex';
  }
  avancarCarrinho();
  
}

function voltarParaCarrinho() {
  const telaResumo =
    // document.getElementById("telaResumoCompra");
    document.getElementsByClassName('cardCheck');

  const telaCarrinho =
    // document.getElementById("telaCarrinho");
    document.getElementsByClassName('cart');

  if (!telaResumo || !telaCarrinho) {
    console.error('Tela de resumo ou carrinho não encontrada.');
    return;
  }

  // Esconde o resumo
  telaResumo.style.display = 'none';

  // Exibe o carrinho
  telaCarrinho.style.display = 'flex';

  // Recupera o carrinho salvo na sessão
  const carrinhoSalvo = sessionStorage.getItem('carrinho');

  if (carrinhoSalvo) {
    try {
      carrinho = JSON.parse(carrinhoSalvo);
    } catch (erro) {
      console.error('Erro ao recuperar carrinho:', erro);
    }
  }

  // Recupera o estacionamento salvo na sessão
  const estacionamentoSalvo = sessionStorage.getItem('estacionamento');

  if (estacionamentoSalvo) {
    try {
      estacionamento = JSON.parse(estacionamentoSalvo);

      // Restaura as datas
      estacionamento = estacionamento.map(registro => ({
        ...registro,
        entrada: registro.entrada ? new Date(registro.entrada) : null,
        saida: registro.saida ? new Date(registro.saida) : null,
      }));
    } catch (erro) {
      console.error('Erro ao recuperar estacionamento:', erro);
    }
  }

  // Atualiza a interface
  atualizarCarrinho();

  console.log('Retornou ao carrinho.');
}

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

// function procurarProduto(codigo) {
//   const produto = produtos.find(p => p.codigo === codigo);

//   if (!produto) {
//     alert('Código não cadastrado.');

//     return;
//   }

//   adicionarProduto(produto.id);
// }

//leitor digitando
const leitor = document.getElementById('codigoBarras');
leitor.maxLength = 13;

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

  leitor.focus();
});

//use a funcao abaixo para enviar automaticamente o codigo ao completar 13 digitos

// leitor.addEventListener('input', () => {
//   if (leitor.value.length === 13) {
//     procurarProduto(leitor.value);
//   }
// });

// ---------------------------------

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
  quantidade.value = 1;
}
