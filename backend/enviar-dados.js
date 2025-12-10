// Script para enviar 200 registros via API

const API_URL = "http://localhost:3000/dados";
const TOTAL_REGISTROS = 200;

// Função para gerar valores aleatórios realistas
function gerarDados() {
  return {
    tempoOperacao: Math.floor(Math.random() * 500) + 100, // 100-600 s
    potencia: Math.floor(Math.random() * 91) + 10, // 10-100%
  };
}

// Função para enviar um registro
async function enviarRegistro(dados, index) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return { sucesso: true, index, result };
  } catch (error) {
    return { sucesso: false, index, error: error.message };
  }
}

// Função principal
async function enviarTodosRegistros() {
  console.log(
    `Iniciando envio de ${TOTAL_REGISTROS} registros para ${API_URL}...\n`
  );

  let sucessos = 0;
  let falhas = 0;

  for (let i = 0; i < TOTAL_REGISTROS; i++) {
    const dados = gerarDados();
    const resultado = await enviarRegistro(dados, i + 1);

    if (resultado.sucesso) {
      sucessos++;
      if (sucessos % 50 === 0) {
        console.log(`✓ ${sucessos} registros enviados com sucesso...`);
      }
    } else {
      falhas++;
      console.error(
        `✗ Erro no registro ${resultado.index}: ${resultado.error}`
      );
    }

    // Pequeno delay para não sobrecarregar o servidor
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  console.log(`\n========== RESUMO ==========`);
  console.log(`Total de registros: ${TOTAL_REGISTROS}`);
  console.log(`Sucessos: ${sucessos}`);
  console.log(`Falhas: ${falhas}`);
  console.log(`===========================\n`);
}

// Verificar se a API está rodando antes de começar
async function verificarAPI() {
  try {
    const response = await fetch("http://localhost:3000/historico");
    if (response.ok) {
      console.log("✓ API está rodando!\n");
      return true;
    }
  } catch (error) {
    console.error("✗ Erro: A API não está rodando!");
    console.error(
      "Execute 'node index.js' em outro terminal antes de rodar este script.\n"
    );
    return false;
  }
}

// Executar
(async () => {
  const apiOk = await verificarAPI();
  if (apiOk) {
    await enviarTodosRegistros();
  } else {
    process.exit(1);
  }
})();
