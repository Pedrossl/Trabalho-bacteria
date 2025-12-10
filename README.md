2# 📊 Sistema de Análise Biomédica - ESP32

Sistema completo para monitoramento e análise de dados de equipamentos biomédicos via ESP32, com API REST, banco de dados SQLite e dashboards interativos.

## 🚀 Funcionalidades

- **API REST** com Node.js + Express
- **Banco de dados SQLite** para persistência de dados
- **Dashboard interativo** com gráficos e estatísticas
- **Interface de histórico** para monitoramento em tempo real
- **Integração ESP32** para coleta de dados

## 📋 Pré-requisitos

- Node.js (v14 ou superior)
- npm ou yarn

## 🔧 Instalação

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**

O arquivo `.env` já está configurado com valores padrão:
```env
PORT=3000
DB_PATH=./bacteria.db
NODE_ENV=development
API_URL=http://localhost:3000
```

## 🎯 Como Usar

### Iniciar o Servidor

```bash
node index.js
```

A API estará rodando em `http://localhost:3000`

### Acessar as Interfaces

- **Histórico ESP32**: `http://localhost:3000/` ou `http://localhost:3000/index.html`
- **Dashboard Analítico**: `http://localhost:3000/dashboard.html`

### Enviar Dados de Teste

Para popular o banco com 200 registros de teste:

```bash
node enviar-dados.js
```

## 📡 Endpoints da API

### POST `/dados`
Registra novos dados do equipamento.

**Body:**
```json
{
  "tempoOperacao": 384,
  "potencia": 10
}
```

**Resposta:**
```json
{
  "message": "Dados recebidos com sucesso",
  "recebido": {
    "id": 1,
    "tempoOperacao": 384,
    "potencia": 10,
    "timestamp": "2025-12-10T19:34:23.000Z"
  }
}
```

### GET `/historico`
Retorna os últimos 50 registros.

### GET `/todos`
Retorna todos os registros do banco.

### GET `/estatisticas`
Retorna estatísticas agregadas:
- Total de registros
- Tempo médio, mínimo e máximo
- Potência média, mínima e máxima

## 📊 Interfaces

### Histórico ESP32 (`index.html`)
- Visualização em tempo real dos dados
- Atualização automática a cada 2 segundos
- Exibe: Tempo, Potência e Horário
- Design dark mode otimizado

### Dashboard Analítico (`dashboard.html`)
Interface completa com 3 páginas navegáveis:

1. **Dashboard**
   - Cards com estatísticas gerais
   - Gráfico de evolução dos parâmetros

2. **Gráficos Detalhados**
   - Distribuição de Tempo de Operação
   - Distribuição de Potência
   - Scatter plot: Tempo vs Potência
   - Evolução das últimas 20 operações

3. **Tabela de Dados**
   - Visualização completa de todos os registros
   - Ordenação por data/hora

## 🗂️ Estrutura do Projeto

```
Biomedicina/
├── frontend/
│   ├── index.html          # Interface de histórico
│   └── dashboard.html      # Dashboard analítico
├── backend/
│   └── enviar-dados.js     # Script para gerar dados de teste
├── index.js                # Servidor API
├── .env                    # Variáveis de ambiente
├── .gitignore             # Arquivos ignorados pelo Git
├── package.json           # Dependências do projeto
└── README.md              # Este arquivo
```

## 📦 Dependências

- **express** - Framework web
- **cors** - Middleware para CORS
- **sqlite3** - Banco de dados SQLite
- **dotenv** - Gerenciamento de variáveis de ambiente
- **chart.js** - Biblioteca de gráficos (CDN)

## 🔌 Integração com ESP32

Para enviar dados do ESP32, faça requisições POST para o endpoint `/dados`:

```cpp
#include <WiFi.h>
#include <HTTPClient.h>

const char* serverUrl = "http://SEU_IP:3000/dados";

void enviarDados(int tempo, int potencia) {
  HTTPClient http;
  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");

  String json = "{\"tempoOperacao\":" + String(tempo) +
                ",\"potencia\":" + String(potencia) + "}";

  int httpCode = http.POST(json);
  http.end();
}
```

## 🎨 Tecnologias Utilizadas

- **Backend**: Node.js, Express
- **Banco de Dados**: SQLite3
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Gráficos**: Chart.js
- **Hardware**: ESP32

## 📝 Notas

- Os dados são armazenados permanentemente no arquivo `biomedicina.db`
- O banco de dados é criado automaticamente na primeira execução
- As interfaces se comunicam em tempo real com a API
- Suporte a CORS habilitado para desenvolvimento

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é de uso acadêmico para o mestrado em Biomedicina.

---

Desenvolvido com ❤️ para análise de equipamentos biomédicos
