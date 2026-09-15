let carrinho = [];
let resumoCompra = [];

let clienteClubAtual = null;
let clienteSemClub = false;

// aceitar somente numeros no cpf
const cpfClubInput = document.getElementById('cpfClub');

cpfClubInput.addEventListener('input', function () {
  this.value = this.value.replace(/\D/g, '');
});
//verificar se tem 11 digitos
function validarCPF(cpf) {
  cpf = String(cpf).replace(/\D/g, '');

  if (cpf.length !== 11) {
    return false;
  }

  // Impede CPFs com todos os números iguais
  if (/^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  let soma = 0;

  for (let i = 0; i < 9; i++) {
    soma += Number(cpf[i]) * (10 - i);
  }

  let resto = (soma * 10) % 11;

  if (resto === 10) {
    resto = 0;
  }

  if (resto !== Number(cpf[9])) {
    return false;
  }

  soma = 0;

  for (let i = 0; i < 10; i++) {
    soma += Number(cpf[i]) * (11 - i);
  }

  resto = (soma * 10) % 11;

  if (resto === 10) {
    resto = 0;
  }

  return resto === Number(cpf[10]);
}
//buscar cpf no club
function buscarClienteClub(cpf) {
  return clientesClub.find(
    cliente => cliente.cpf === cpf && cliente.ativo === true,
  );
}
// verificar o club
function verificarClub() {
  const input = document.getElementById('cpfClub');

  const cpf = input.value.trim();

  if (!validarCPF(cpf)) {
    alert('Digite um CPF válido.');

    input.focus();

    console.log('CLIENTES:', clientesClub);
    console.log('CPF DIGITADO:', cpf);
    console.log('CLIENTE ENCONTRADO:', cliente);

    return;
  }

  const cliente = buscarClienteClub(cpf);

  if (cliente) {
    clienteClubAtual = cliente;
    clienteSemClub = false;

    alert(
      `Olá, ${cliente.nome}!\n\n` + 'Cliente Clube Fidelidade identificado.',
    );

    iniciarCarrinho();

    return;
  }

  /*
   * CPF não encontrado
   */

  const cadastrar = confirm(
    'CPF não encontrado no Clube Fidelidade.\n\n' + 'Deseja se cadastrar?',
  );

  if (cadastrar) {
    abrirCadastroClub(cpf);
  } else {
    clienteClubAtual = null;
    clienteSemClub = true;

    iniciarCarrinho();
  }
}

// abrir cadastro do cliente
function abrirCadastroClub(cpf) {
  document.getElementById('telaClub').style.display = 'none';

  document.getElementById('telaCadastroClub').style.display = 'block';

  document.getElementById('cpfCadastroClub').value = cpf;

  document.getElementById('nomeClub').value = '';

  document.getElementById('nomeClub').focus();
}
// cadastrar cliente
function cadastrarClienteClub() {
  const nome = document.getElementById('nomeClub').value.trim();

  const cpf = document.getElementById('cpfCadastroClub').value.trim();

  if (!nome) {
    alert('Digite o nome do cliente.');

    document.getElementById('nomeClub').focus();

    return;
  }

  const novoCliente = {
    id: clientesClub.length + 1,

    nome: nome,

    cpf: cpf,

    ativo: true,
  };

  clientesClub.push(novoCliente);

  clienteClubAtual = novoCliente;

  clienteSemClub = false;

  alert(
    'Cliente cadastrado com sucesso!\n\n' +
      'O desconto do Clube será aplicado.',
  );

  iniciarCarrinho();
}
// iniciar carrinho

function iniciarCarrinho() {
  document.getElementById('telaClub').style.display = 'none';

  document.getElementById('telaCadastroClub').style.display = 'none';

  document.getElementById('telaCarrinho').style.display = 'block';

  atualizarIndicadorClub();

  atualizarCarrinho();
}

function cancelarCarrinho() {
  // Atualiza indicador do Clube
  atualizarIndicadorClub();

  // Volta para a tela do CPF
  const telaCarrinho = document.getElementById('telaCarrinho');

  const telaClub = document.getElementById('telaClub');

  const telaCadastroClub = document.getElementById('telaCadastroClub');

  const clubInfo = document.getElementById('clienteClubInfo');

  if (telaCarrinho) {
    telaCarrinho.style.display = 'none';
  }

  if (telaCadastroClub) {
    telaCadastroClub.style.display = 'none';
  }

  if (telaClub) {
    telaClub.style.display = 'block';
    clubInfo.style.display = 'none';
  }

  // Limpa o CPF digitado
  const cpf = document.getElementById('cpfClub');

  if (cpf) {
    cpf.value = '';
    cpf.focus();
  }

  // Limpa mensagem
  const mensagem = document.getElementById('mensagemClub');

  if (mensagem) {
    mensagem.innerHTML = '';
  }

  console.log('Compra cancelada. Cliente deslogado.');
}

function atualizarIndicadorClub() {
  const elemento = document.getElementById('clienteClubInfo');

  if (!elemento) {
    return;
  }

  if (clienteClubAtual) {
    elemento.innerHTML = `
            ⭐ Clube Fidelidade:
            <strong>
                ${clienteClubAtual.nome}
            </strong>
        `;
  } else {
    elemento.innerHTML = `
            Cliente sem Clube Fidelidade
        `;
  }
}

// function adicionarProduto(id, quantidade) {
//   const produto = produtos.find(p => p.id == id);

//   if (!produto) {
//     alert('Produto não encontrado.');

//     return;
//   }

//   quantidade = parseInt(quantidade, 10) || 1;

//   const itemExistente = carrinho.find(item => item.id == id);

//   /*
//    * Só aplica descontoClub se
//    * existir cliente no Clube
//    */

//   const descontoClub = clienteClubAtual ? Number(produto.descontoClub) || 0 : 0;

//   if (itemExistente) {
//     itemExistente.qtd = Number(itemExistente.qtd) + quantidade;
//   } else {
//     carrinho.push({
//       id: produto.id,

//       codigo: produto.codigo,

//       nome: produto.nome,

//       preco: Number(produto.preco),

//       desconto: Number(produto.desconto) || 0,

//       descontoClub: descontoClub,

//       qtd: quantidade,
//     });
//   }

//   atualizarCarrinho();
// }
//versao nova
function adicionarProduto(id, quantidade, desconto = 0) {
  const produto = produtos.find(p => p.id == id);

  if (!produto) {
    alert('Produto não encontrado.');
    return;
  }

  quantidade = parseInt(quantidade, 10);

  if (isNaN(quantidade) || quantidade <= 0) {
    quantidade = 1;
  }
  desconto = parseFloat(desconto) || 0;
  // Limita o desconto entre 0% e 100%
  if (desconto < 0) desconto = 0;
  if (desconto > 100) desconto = 100;

  const itemExistente = carrinho.find(item => item.id == id);

  if (itemExistente) {
    // SOMA somente a nova quantidade
    itemExistente.qtd = Number(itemExistente.qtd) + quantidade;
    // Atualiza o desconto somente se foi informado
    if (desconto > 0) {
      itemExistente.desconto = desconto;
    }
  } else {
    carrinho.push({
      ...produto,
      qtd: quantidade,
      desconto: Number(produto.desconto) || 0,
    });
  }
  salvarCarrinhoSessao();
  atualizarCarrinho();
}

function calcularItem(item) {
  const preco = Number(item.preco) || 0;

  const quantidade = Number(item.qtd) || 0;

  const desconto = Number(item.desconto) || 0;

  const descontoClub = Number(item.descontoClub) || 0;

  const bruto = preco * quantidade;

  // Primeiro desconto
  const valorDesconto = bruto * (desconto / 100);

  const depoisDesconto = bruto - valorDesconto;

  // Depois desconto Club
  const valorDescontoClub = clienteClubAtual
    ? depoisDesconto * (descontoClub / 100)
    : 0;

  const subtotal = depoisDesconto - valorDescontoClub;

  return {
    bruto,

    valorDesconto,

    valorDescontoClub,

    totalDescontos: valorDesconto + valorDescontoClub,

    subtotal,
  };
}

function atualizarCarrinho() {
  const tabela = document.getElementById('carrinho');

  tabela.innerHTML = '';

  let total = 0;

  carrinho.forEach(item => {
    const calculo = calcularItem(item);

    total += calculo.subtotal;

    const linha = document.createElement('tr');

    linha.innerHTML = `
            <td>
                ${item.nome}
            </td>
            <td>
                ${formatarMoeda(item.preco)}
            </td>
            <td>
                ${item.qtd}
            </td>

                        <td>

                ${item.desconto > 0 ? `${item.desconto}%` : 'Sem desconto'}

                ${
                  clienteClubAtual && item.descontoClub > 0
                    ? `
                            <br>
                            <small>
                                Club: ${item.descontoClub}%
                            </small>
                        `
                    : ''
                }

            </td>

            <td>
                ${formatarMoeda(calculo.subtotal)}
            </td>

             <td>
       <button id="cancelar" onclick="removerProduto(${item.id})">
            ❌
        </button>
            </td>
        `;

    tabela.appendChild(linha);
  });

  document.getElementById('total').textContent = formatarMoeda(total);
}
//  RESUMO DA COMPRA

function mostrarResumoCompra() {
  let quantidadeTotal = 0;
  let valorTotal = 0;
  let descontoTotal = 0;

  carrinho.forEach(item => {
    const quantidade = Number(item.qtd) || 0;
    const preco = Number(item.preco) || 0;
    const desconto = Number(item.desconto) || 0;
    const descontoClub = Number(item.descontoClub) || 0;

    // Soma todas as quantidades
    quantidadeTotal += quantidade;

    // Valor bruto do item
    const valorBruto = preco * quantidade;

    // Valor do desconto do item
    const valorDesconto = valorBruto * (desconto / 100);

    // Primeiro desconto

    const depoisDesconto = valorBruto - valorDesconto;

    // Depois desconto Club

    const valorDescontoClub = clienteClubAtual
      ? depoisDesconto * (descontoClub / 100)
      : 0;

    // const subtotal = depoisDesconto - valorDescontoClub;

    // Soma os valores
    valorTotal += valorBruto;

    descontoTotal += valorDesconto + valorDescontoClub;
  });

  // Valor final depois dos descontos
  const valorFinal = valorTotal - descontoTotal;
  // valor final com estacionamento
  const valorEstacionamento =
    estacionamento.length > 0 ? Number(estacionamento[0].valor) : 0;
  const totalFinal = valorFinal + valorEstacionamento;

  /*
   * ARRAY DO RESUMO
   */
  resumoCompra = [
    {
      quantidadeTotal: quantidadeTotal,
      valorTotal: valorTotal,
      descontoTotal: descontoTotal,
      valorFinal: totalFinal,
    },
  ];

  /*
   * MOSTRA UMA ÚNICA LINHA NA TABELA
   */
  const tabela = document.getElementById('tabelaResumoCompra');

  tabela.innerHTML = `
        <tr>

            <td>
                ${quantidadeTotal}
            </td>

            <td>
                R$ ${valorTotal.toFixed(2)}
            </td>

            <td>
                - R$ ${descontoTotal.toFixed(2)}
            </td>
            <td>
                <strong>
                    R$ ${valorFinal.toFixed(2)}
                </strong>
            </td>
            <td>
                R$ ${valorEstacionamento.toFixed(2)}
            </td>

               <td>
                <strong>
                    R$ ${totalFinal.toFixed(2)}
                </strong>
            </td>

        </tr>
    `;
  document.getElementById('totalCarrinho').innerText = totalFinal.toFixed(2);
  // console.log('Resumo da compra:', resumoCompra);
}

function methodMoney() {
  input = document.getElementById('valorPago');
  input.style.display = 'block';
}
function limparCarrinho() {
  solicitarSenha(() => {
    sessionStorage.removeItem('carrinho');
    carrinho = [];
    resumoCompra = [];
    cancelarCarrinho();
    atualizarCarrinho();
    voltarLayout();
  });
}
function digitarCodigoUnid() {
  solicitarCodigoBarrasUnid();
}
function digitarCodigo() {
  solicitarCodigoBarras();
}
function digitarQuantidade() {
  solicitarQtd();
}
function digitarTicket() {
  solicitarTicket();
}

// troca de layout ao clicar em finalizar compra
function trocarlayout() {
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
  mostrarResumoCompra();

  // TODO ver bug de quando volta o layout nao calcula o estacionamento nem total

  const footerArea = document.getElementsByClassName('aling-content');
  for (const payment of footerArea) {
    const btnFinish = document.getElementById('btnFinalizar');
    btnFinish.style.display = 'none';
    payment.style.display = 'flex';
  }
}
//volta o layout para tela de inicio
function voltarLayout() {
  const cardO = document.getElementsByClassName('card');
  for (const cards of cardO) {
    cards.style.display = 'flex';
  }
  const cardcheck = document.getElementsByClassName('cardCheck');
  for (const cards of cardcheck) {
    cards.style.display = 'none';
  }
  const btns = document.getElementsByClassName('area-buttons');

  for (const btn of btns) {
    btn.style.display = 'flex';
  }
  const payments = document.getElementsByClassName('area-buttons-payment');
  for (const payment of payments) {
    payment.style.display = 'none';
  }
  const footerArea = document.getElementsByClassName('aling-content');
  // const btnfinish = document.getElementById('btnFinalizar');
  for (const payment of footerArea) {
    const btnFinish = document.getElementById('btnFinalizar');
    btnFinish.style.display = 'flex';
    btnFinish.style.alignContent = 'center';
    payment.style.display = 'flex';
  }
}

function irPagamento() {
  const total = parseFloat(document.getElementById('total').innerText);

  if (total == 0) {
    alert('Carrinho vazio.');
    return;
  } else {
    digitarTicket();
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
function solicitarTicket(callback) {
  acaoPendente = callback;
  document.getElementById('parking').value = '';
  document.getElementById('pinpadModalParking').style.display = 'flex';
}
function digitarCod(numero) {
  const campo = document.getElementById('codeNumber');

  if (campo.value.length < 13) {
    campo.value += numero;
  }
  if (campo.value.length === 13) {
    confirmarCod();
  }
}
function digitarCodUnid(numero) {
  const campo = document.getElementById('codeNumberUnid');

  if (campo.value.length < 13) {
    campo.value += numero;
  }
  if (campo.value.length === 13) {
    confirmarCodUnid();
  }
}
function digitarNum(numero) {
  const campo = document.getElementById('parking');

  if (campo.value.length < 6) {
    campo.value += numero;
  }
  if (campo.value.length === 6) {
    confirmarNum();
  }
}
function apagarCod() {
  const campo = document.getElementById('codeNumber');

  campo.value = campo.value = '';
}
function apagarNum() {
  const campo = document.getElementById('parking');

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
function confirmarNum() {
  const codnumber = document.getElementById('parking').value;
  if (codnumber.length < 6) {
    alert('o codigo deve ter 6 digitos, tente novamente');
    apagarCod();
  } else {
    buscarEstacionamento(codnumber);
    fecharPinpad();
  }
}
function buscarEstacionamento(codnumber) {
  const input = document.getElementById('parking');

  const numero = codnumber;

  // Monta o código completo
  const codigo = 'EST-' + numero;

  const resultado = buscarCodigoEstacionamento(codigo);

  if (!resultado) {
    alert('Código de estacionamento inválido.\n\n' + 'Tente novamente.');

    input.value = '';
    input.focus();

    return;
  }
  // Código encontrado
  registrarSaidaEstacionamento(resultado);
  trocarlayout();
}
function solicitarCodigoEstacionamento(codnumber) {
  let codigo = 'EST-' + codnumber;
  // console.log(codigo, 'codigo vindo da funcao nova');
  // console.log(codnumber, 'codinumber vindo da funcao nova');

  while (true) {
    codigo = prompt('Digite o código do estacionamento:');
    // codigo = 'EST-' + codnumber;
    // let codigo = 'EST-' + codnumber;
    // Cancelou
    if (codigo === null) {
      return;
    }

    codigo = codigo.trim();

    // Código vazio
    if (codigo === '') {
      alert('Digite um código.');
      continue;
    }

    // Procura o código no array
    const registro = buscarCodigoEstacionamento(codigo);

    if (!registro) {
      alert('Código de estacionamento inválido.\n\n' + 'Digite novamente.');
      // console.log('Código de estacionamento inválido.\n\n' + 'Digite novamente.');

      continue;
    }

    // Código encontrado
    registrarSaidaEstacionamento(registro);

    break;
  }
}
function codigoExiste(codigo) {
  const registro = estacionamento.find(item => item.codigo === codigo);

  return registro !== undefined;
}
function buscarCodigoEstacionamento(codigo) {
  for (const registro of estacionamento) {
    // Verifica o código principal
    if (registro.codigo === codigo) {
      return registro;
    }

    // Verifica os códigos de cada período
    for (const cobranca of registro.cobrancas || []) {
      if (cobranca.codigo === codigo) {
        return {
          registro: registro,
          cobranca: cobranca,
        };
      }
    }
  }

  return null;
}
function validarCodigoEstacionamento(codigo) {
  codigo = String(codigo).trim();

  if (!codigo) {
    return false;
  }

  const resultado = buscarCodigoEstacionamento(codigo);

  if (!resultado) {
    alert('Código de estacionamento inválido.');
    return false;
  }

  return true;
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
//pinpad das teclas do pinpad do estacionamento
document.addEventListener('keydown', e => {
  const modal = document.getElementById('pinpadModalParking');

  // Só funciona quando o PIN Pad estiver aberto
  if (modal.style.display !== 'flex') return;

  // Números do teclado principal
  if (e.key >= '0' && e.key <= '9') {
    digitarNum(e.key);
    e.preventDefault();
    return;
  }

  // Números do teclado numérico (Numpad)
  if (e.code.startsWith('Numpad')) {
    const numero = e.code.replace('Numpad', '');

    if (!isNaN(numero)) {
      digitarNum(numero);
      e.preventDefault();
      return;
    }
  }

  // Backspace
  if (e.key === 'Backspace') {
    apagarNum();
    e.preventDefault();
    return;
  }

  // Enter
  if (e.key === 'Enter') {
    confirmarNum();
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
//pinpad Estacionamento

///validador de senha pinpad

let acaoPendente = null;

function solicitarSenha(callback) {
  acaoPendente = callback;

  document.getElementById('senhaPin').value = '';

  document.getElementById('pinpadModal').style.display = 'flex';
}

function digitarPin(numero) {
  const campo = document.getElementById('senhaPin');

  // Não permite mais de 4 dígitos
  if (campo.value.length >= 4) {
    return;
  }

  campo.value += numero;

  // Ao completar 4 dígitos, confirma automaticamente
  if (campo.value.length === 4) {
    // Pequeno atraso para o operador visualizar o último dígito
    setTimeout(() => {
      confirmarPin();
    }, 150);
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
  document.getElementById('pinpadModalParking').style.display = 'none';
}

//Parte dos operadores para limpar o carrinho passando senha de operador
let validandoPin = false;
let operadorAutorizado = null;

function confirmarPin() {
  if (validandoPin) {
    return;
  }

  validandoPin = true;

  const senha = document.getElementById('senhaPin').value;

  const operador = buscarOperadorPorPin(senha);

  if (!operador) {
    alert('Senha inválida.');

    document.getElementById('senhaPin').value = '';

    validandoPin = false;

    return;
  }

  operadorAutorizado = operador;

  fecharPinpad();

  if (acaoPendente) {
    acaoPendente();

    acaoPendente = null;
  }

  validandoPin = false;

  console.log(`${operadorAutorizado.nome} autorizou a operação.`);
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
// foco no pinpad
function solicitarSenha(callback) {
  acaoPendente = callback;

  document.getElementById('senhaPin').value = '';

  const modal = document.getElementById('pinpadModal');
  modal.style.display = 'flex';

  // Garante que o teclado funcione imediatamente
  modal.focus();
}
// Atalho no F2 para cancelar compra
window.addEventListener('keydown', function (event) {
  // Verifica se a tecla pressionada é o F2
  if (event.key === 'F2') {
    event.preventDefault();
    limparCarrinho();
  }
});
