let estacionamento = [];
let contadorEstacionamento = 1;

const valoresEstacionamento = {
  1: 2.0, // 0 até 15 minutos
  2: 3.5, // 16 até 30
  3: 5.0, // 31 até 45
  4: 6.5, // 46 até 60
  5: 8.0, // 61 até 75
  6: 9.5, // 76 até 90
  7: 11.0, // 91 até 105
  8: 12.5, // 106 até 120
};

const valorAdicional15Min = 1.5;

function gerarCodigoEstacionamento() {
  const numero = String(contadorEstacionamento).padStart(6, '0');

  contadorEstacionamento++;

  return `EST-${numero}`;
}

function registrarEntradaEstacionamento() {
  const agora = new Date();
  const codigo = gerarCodigoEstacionamento();

  estacionamento = [
    {
      codigo: codigo,
      entrada: agora,
      saida: null,
      minutos: 0,
      periodos: 0,
      cobrancas: [],
      valorTotal: 0,
      tipo: 'estacionamento',
    },
  ];
  // document.getElementById('codigoEstacionamento').textContent = codigo;
  console.log(codigo, 'codigo do estacionamento');

  atualizarEstacionamento();

  // console.log('Entrada registrada:', agora);
}

function registrarSaidaEstacionamento() {
  if (estacionamento.length === 0) {
    alert('Nenhuma entrada de estacionamento registrada.');
    return;
  }

  const registro = estacionamento[0];

  registro.saida = new Date();

  calcularValorEstacionamento();

  atualizarEstacionamento();

  console.log('Saída registrada:', registro);
}
function calcularValorEstacionamento() {
  if (estacionamento.length === 0) {
    return;
  }

  const registro = estacionamento[0];

  if (!registro.entrada) {
    return;
  }

  const momentoSaida = registro.saida || new Date();

  const diferenca = momentoSaida.getTime() - registro.entrada.getTime();

  let minutos = Math.ceil(diferenca / 60000);

  // Se acabou de entrar, cobra pelo menos 15 minutos
  if (minutos < 1) {
    minutos = 1;
  }

  // Quantidade de blocos de 15 minutos
  const periodos = Math.ceil(minutos / 15);

  let valor = 0;

  if (valoresEstacionamento[periodos]) {
    valor = valoresEstacionamento[periodos];
  } else {
    // Valor dos primeiros 8 períodos
    valor = valoresEstacionamento[8];

    // Períodos adicionais
    const periodosAdicionais = periodos - 8;

    valor += periodosAdicionais * valorAdicional15Min;
  }

  registro.minutos = minutos;
  registro.periodos = periodos;
  registro.valor = valor;
}
function atualizarEstacionamento() {
  if (estacionamento.length === 0) {
    return;
  }

  const registro = estacionamento[0];

  const entrada = document.getElementById('horaEntrada');

  const saida = document.getElementById('horaSaida');

  const tempo = document.getElementById('tempoEstacionamento');

  const valor = document.getElementById('valorEstacionamento');

  if (entrada) {
    entrada.textContent = formatarHora(registro.entrada);
  }

  if (saida) {
    saida.textContent = registro.saida
      ? formatarHora(registro.saida)
      : '--:--:--';
  }

  if (tempo) {
    tempo.textContent = formatarTempo(registro.minutos);
  }

  if (valor) {
    valor.textContent = formatarMoeda(registro.valor);
  }
}

///formatar data\
function formatarHora(data) {
  return data.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function usarSemEstacionamento() {
  estacionamento = [
    {
      codigo: null,
      entrada: null,
      saida: null,
      minutos: 0,
      periodos: 0,
      cobrancas: [],
      valorTotal: 0,
      tipo: 'sem_estacionamento',
    },
  ];

  document.getElementById('codigoEstacionamento').textContent =
    'Sem estacionamento';

  document.getElementById('horaEntrada').textContent = '--:--:--';

  document.getElementById('horaSaida').textContent = '--:--:--';

  document.getElementById('tempoEstacionamento').textContent = '0min';

  document.getElementById('valorEstacionamento').textContent = 'R$ 0,00';
}

function formatarTempo(minutos) {
  const horas = Math.floor(minutos / 60);

  const minutosRestantes = minutos % 60;

  if (horas > 0) {
    return `${horas}h ${minutosRestantes}min`;
  }

  return `${minutosRestantes}min`;
}

function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}
