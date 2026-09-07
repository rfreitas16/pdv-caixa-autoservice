let carrinho = [];

function adicionarProduto(id, quantidade) {
  const produto = produtos.find(p => p.id == id);

  if (!produto) {
    alert('Produto não encontrado.');
    return;
  }

  quantidade = parseInt(quantidade, 10);

  if (isNaN(quantidade) || quantidade <= 0) {
    quantidade = 1;
  }

  const itemExistente = carrinho.find(item => item.id == id);

  if (itemExistente) {
    // SOMA somente a nova quantidade
    itemExistente.qtd = Number(itemExistente.qtd) + quantidade;
  } else {
    carrinho.push({
      ...produto,
      qtd: quantidade,
    });
  }
  salvarCarrinhoSessao();
  atualizarCarrinho();
}
function atualizarCarrinho() {
  const tbody = document.getElementById('carrinho');

  tbody.innerHTML = '';

  let total = 0;

  carrinho.forEach(item => {
    const subtotal = item.preco * item.qtd;

    total += subtotal;

    tbody.innerHTML += `
        <tr>
            <td>${item.nome}</td>
            <td>R$ ${item.preco.toFixed(2)}</td>
            <td>${item.qtd}</td>

            <td>R$ ${subtotal.toFixed(2)}</td>
            <td>
        <button id="cancelar" onclick="removerProduto(${item.id})">
            ❌
        </button>
    </td>
        </tr>
        `;
  });

  document.getElementById('total').innerText = total.toFixed(2);
}
function methodMoney() {
  input = document.getElementById('valorPago');
  input.style.display = 'block';
}
function limparCarrinho() {
  solicitarSenha();
  carrinho = [];

  atualizarCarrinho();
  sessionStorage.removeItem('carrinho');

  document.getElementById('troco').innerHTML = '';

  document.getElementById('valorPago').value = '';
}
function digitarCodigoUnid() {
  solicitarCodigoBarrasUnid();
}
function digitarCodigo() {
  solicitarCodigoBarras();
}
function DigitarQuantidade() {
  solicitarQtd();
}
function trocarlayout() {
  const btns = document.getElementsByClassName('area-buttons');
  console.log(btns);
  btns.style.display = 'hidden';
  console.log(btns); // const payments = document.getElementsByClassName('area-buttons-payment');
  // payments.style.display = 'flex';
}
function irPagamento() {
  trocarlayout();
  const total = parseFloat(document.getElementById('total').innerText);

  if (total == 0) {
    alert('Carrinho vazio.');

    return;
  }
}
function finalizarCompra() {
  const total = parseFloat(document.getElementById('total').innerText);

  const pago = parseFloat(document.getElementById('valorPago').value);

  if (total == 0) {
    alert('Carrinho vazio.');

    return;
  }

  if (isNaN(pago)) {
    alert('Informe o pagamento.');

    return;
  }

  if (pago < total) {
    alert('Pagamento insuficiente.');

    return;
  }

  const troco = pago - total;

  document.getElementById('troco').innerHTML = `

        <h3>Compra Finalizada</h3>

        <p>Total: R$ ${total.toFixed(2)}</p>

        <p>Pago: R$ ${pago.toFixed(2)}</p>

        <h2>Troco: R$ ${troco.toFixed(2)}</h2>

    `;
}
function removerProduto(id) {
  const indice = carrinho.findIndex(item => item.id === id);

  if (indice === -1) return;

  if (carrinho[indice].qtd > 1) {
    carrinho[indice].qtd--;
  } else {
    carrinho.splice(indice, 1);
  }
  salvarCarrinhoSessao();
  atualizarCarrinho();
}
function cancelarItem(id) {
  carrinho = carrinho.filter(item => item.id !== id);
  atualizarCarrinho();
}
//Digitar o codigo de barras com pinpad

function solicitarCodigoBarrasUnid(callback) {
  acaoPendente = callback;

  document.getElementById('codeNumberUnid').value = '';
  document.getElementById('pinpadModalProdUnid').style.display = 'flex';
}
function solicitarCodigoBarras(callback) {
  acaoPendente = callback;

  document.getElementById('codeNumber').value = '';
  document.getElementById('pinpadModalProd').style.display = 'flex';
}
function digitarCod(numero) {
  const campo = document.getElementById('codeNumber');

  if (campo.value.length < 13) {
    campo.value += numero;
  }
}
function digitarCodUnid(numero) {
  const campo = document.getElementById('codeNumberUnid');

  if (campo.value.length < 13) {
    campo.value += numero;
  }
}
function apagarCod() {
  const campo = document.getElementById('codeNumber');

  campo.value = campo.value = '';
}
function apagarCodUnid() {
  const campo = document.getElementById('codeNumberUnid');

  campo.value = campo.value = '';
}
function confirmarCodUnid() {
  const codnumber = document.getElementById('codeNumberUnid').value;
  if (codnumber.length < 13) {
    alert('o codigo deve ter 13 digitos, tente novamente');
    apagarCod();
  } else {
    procurarProduto(codnumber);
    fecharPinpad();
  }
}
function confirmarCod(quantidade) {
  const codnumber = document.getElementById('codeNumber').value;
  if (codnumber.length < 13) {
    alert('o codigo deve ter 13 digitos, tente novamente');
    apagarCod();
  } else {
    procurarProdutoPorQtd(codnumber, quantidade);
    fecharPinpad();
  }
}
//salvar carrinho na sessao
function salvarCarrinhoSessao() {
  sessionStorage.setItem('carrinho', JSON.stringify(carrinho));
}
//recuperar carrinho
function carregarCarrinhoSessao() {
  const dados = sessionStorage.getItem('carrinho');

  if (dados) {
    try {
      carrinho = JSON.parse(dados);
    } catch (erro) {
      console.error('Erro ao carregar carrinho:', erro);

      carrinho = [];
    }
  }

  atualizarCarrinho();
}

///Digitar quantidade do produto antes de ler o codigo de barras
// function fecharCodProdutos() {
//   document.getElementById('codigoBarrasFocus').style.display = 'none';
//   document.getElementById('modal-scanner').style.display = 'none';
// }
function solicitarQtd(callback) {
  acaoPendente = callback;

  document.getElementById('productQtd').value = '';
  document.getElementById('pinpadModalQtd').style.display = 'flex';
}
function digitarQtd(numero) {
  const campo = document.getElementById('productQtd');
  if (campo.value.length < 3) {
    campo.value += numero;
  }
}
function apagarQtd() {
  const campo = document.getElementById('productQtd');
  campo.value = campo.value = '';
}
function EnviarQtd() {
  const quantidadeInput = document.getElementById('productQtd');
  if (quantidadeInput <= 0) {
    alert('digite um valor valido');
    apagarQtd();
  } else {
    const quantidade = parseInt(quantidadeInput.value) || 1;
    fecharPinpad();
    digitarCodigo();
    return quantidade;
  }
}
// pinpad do produto unid
document.addEventListener('keydown', e => {
  const modal = document.getElementById('pinpadModalProdUnid');

  // Só funciona quando o PIN Pad estiver aberto
  if (modal.style.display !== 'flex') return;

  // Números do teclado principal
  if (e.key >= '0' && e.key <= '9') {
    digitarCodUnid(e.key);
    e.preventDefault();
    return;
  }

  // Números do teclado numérico (Numpad)
  if (e.code.startsWith('Numpad')) {
    const numero = e.code.replace('Numpad', '');

    if (!isNaN(numero)) {
      digitarCodUnid(numero);
      e.preventDefault();
      return;
    }
  }

  // Backspace
  if (e.key === 'Backspace') {
    apagarCodUnid();
    e.preventDefault();
    return;
  }

  // Enter
  if (e.key === 'Enter') {
    confirmarCodUnid();
    e.preventDefault();
    return;
  }

  // Esc
  if (e.key === 'Escape') {
    fecharPinpad();
    e.preventDefault();
  }
});
//acao das teclas do pinpad produtos
document.addEventListener('keydown', e => {
  const modal = document.getElementById('pinpadModalProd');

  // Só funciona quando o PIN Pad estiver aberto
  if (modal.style.display !== 'flex') return;

  // Números do teclado principal
  if (e.key >= '0' && e.key <= '9') {
    digitarCod(e.key);
    e.preventDefault();
    return;
  }

  // Números do teclado numérico (Numpad)
  if (e.code.startsWith('Numpad')) {
    const numero = e.code.replace('Numpad', '');

    if (!isNaN(numero)) {
      digitarCod(numero);
      e.preventDefault();
      return;
    }
  }

  // Backspace
  if (e.key === 'Backspace') {
    apagarCod();
    e.preventDefault();
    return;
  }

  // Enter
  if (e.key === 'Enter') {
    confirmarCod();
    e.preventDefault();
    return;
  }

  // Esc
  if (e.key === 'Escape') {
    fecharPinpad();
    e.preventDefault();
  }
});
//acao das teclas do pinpad quantidade
document.addEventListener('keydown', e => {
  const modal = document.getElementById('pinpadModalQtd');

  // Só funciona quando o PIN Pad estiver aberto
  if (modal.style.display !== 'flex') return;

  // Números do teclado principal
  if (e.key >= '0' && e.key <= '9') {
    digitarQtd(e.key);
    e.preventDefault();
    return;
  }

  // Números do teclado numérico (Numpad)
  if (e.code.startsWith('Numpad')) {
    const numero = e.code.replace('Numpad', '');

    if (!isNaN(numero)) {
      digitarQtd(numero);
      e.preventDefault();
      return;
    }
  }

  // Backspace
  if (e.key === 'Backspace') {
    apagarQtd();
    e.preventDefault();
    return;
  }

  // Enter
  if (e.key === 'Enter') {
    EnviarQtd();
    e.preventDefault();
    return;
  }

  // Esc
  if (e.key === 'Escape') {
    fecharPinpad();
    e.preventDefault();
  }
});
//foco no pinpad
function solicitarSenha(callback) {
  acaoPendente = callback;

  document.getElementById('codeNumber').value = '';

  const modal = document.getElementById('pinpadModal');
  modal.style.display = 'flex';

  // Garante que o teclado funcione imediatamente
  modal.focus();
}
///validador de senha pinpad

const SENHA_OPERADOR = '1234';

let acaoPendente = null;

function solicitarSenha(callback) {
  acaoPendente = callback;

  document.getElementById('senhaPin').value = '';

  document.getElementById('pinpadModal').style.display = 'flex';
}

function digitarPin(numero) {
  const campo = document.getElementById('senhaPin');

  if (campo.value.length < 4) {
    campo.value += numero;
  }
}

function apagarPin() {
  const campo = document.getElementById('senhaPin');

  campo.value = campo.value.slice(0, -1);
}
function fecharPinpad() {
  document.getElementById('pinpadModal').style.display = 'none';
  document.getElementById('pinpadModalProd').style.display = 'none';
  document.getElementById('pinpadModalQtd').style.display = 'none';
  document.getElementById('pinpadModalProdUnid').style.display = 'none';
}
function confirmarPin() {
  const senha = document.getElementById('senhaPin').value;

  if (senha !== SENHA_OPERADOR) {
    alert('Senha inválida.');
    const campo = document.getElementById('senhaPin');

    campo.value = campo.value = '';
    return;
  }

  fecharPinpad();

  if (acaoPendente) {
    acaoPendente();

    acaoPendente = null;
  }
}

//adicionar acao das teclas

document.addEventListener('keydown', e => {
  const modal = document.getElementById('pinpadModal');

  // Só funciona quando o PIN Pad estiver aberto
  if (modal.style.display !== 'flex') return;

  // Números do teclado principal
  if (e.key >= '0' && e.key <= '9') {
    digitarPin(e.key);
    e.preventDefault();
    return;
  }

  // Números do teclado numérico (Numpad)
  if (e.code.startsWith('Numpad')) {
    const numero = e.code.replace('Numpad', '');

    if (!isNaN(numero)) {
      digitarPin(numero);
      e.preventDefault();
      return;
    }
  }

  // Backspace
  if (e.key === 'Backspace') {
    apagarPin();
    e.preventDefault();
    return;
  }

  // Enter
  if (e.key === 'Enter') {
    confirmarPin();
    e.preventDefault();
    return;
  }

  // Esc
  if (e.key === 'Escape') {
    fecharPinpad();
    e.preventDefault();
  }
});

//foco no pinpad

function solicitarSenha(callback) {
  acaoPendente = callback;

  document.getElementById('senhaPin').value = '';

  const modal = document.getElementById('pinpadModal');
  modal.style.display = 'flex';

  // Garante que o teclado funcione imediatamente
  modal.focus();
}
