# 🚚 Aponti Fast Delivery - Infraestrutura de Microsserviços & DevOps

Este repositório contém a reestruturação completa da infraestrutura de microsserviços da **Aponti Fast Delivery**, desenvolvida para garantir alta disponibilidade, escalabilidade, isolamento de rede e deploy automatizado em resposta ao crescimento de tráfego da aplicação.

---

## 📐 Arquitetura do Projeto

O ecossistema é composto por 4 microsserviços desenvolvidos em Node.js e um banco de dados relacional (PostgreSQL):

```text
docker-swarm-aponti-fap/
├── .gitignore
├── docker-compose.yml       # Orquestração para Desenvolvimento Local (Fase 2)
├── docker-stack.yml         # Orquestração em Cluster Swarm (Fase 3)
├── api-gateway/             # Ponto de entrada público e roteador
├── product-service/         # Microsserviço de Produtos
├── inventory-service/       # Microsserviço de Estoque
├── order-service/           # Microsserviço de Pedidos
└── README.md
```

---

## 🛠️ Otimizações Aplicadas (Fase 1)

- **Multi-stage Builds:** utilização do Node 18 Alpine para compilação e execução.
- **Redução de Imagem:** imagens finais leves, copiando apenas dependências de produção, minimizando consumo de memória e acelerando o download no cluster.
- **Segurança:** as imagens contêm apenas o runtime estritamente necessário para execução.

---

## 🚀 Como Executar e Testar

### 📍 Fase 2: Ambiente Local de Desenvolvimento (Bridge Network)

Nesta fase, a aplicação roda em uma máquina única usando uma rede do tipo `bridge` para validação rápida de comunicação entre serviços.

**1. Subir os contêineres localmente**

Na raiz do projeto, execute:

```bash
docker compose up --build -d
```

**2. Validar os serviços**

Acesse os endpoints locais para testar a comunicação:

| Serviço | Endpoint |
|---|---|
| API Gateway | http://localhost:3000 |
| Product Service | http://localhost:3001 |
| Inventory Service | http://localhost:3002 |
| Order Service | http://localhost:3003 |

**3. Encerrar o ambiente local**

```bash
docker compose down
```

---

### 🌐 Fase 3: Cluster de Alta Disponibilidade com Docker Swarm (Overlay Network)

Nesta fase, a infraestrutura é elevada para um cluster Swarm com réplicas distribuídas, isolamento de rede criptografado via driver `overlay` e controle do banco de dados no nó Manager.

**1. Build e push das imagens para o Docker Hub**

O Docker Swarm necessita que as imagens estejam acessíveis em um registry remoto.

> ⚠️ **Antes de rodar:** as imagens no `docker-compose.yml` estão nomeadas como `<seu-usuario-dockerhub>/aponti-fap-<serviço>:v1.0.0`. Troque `<seu-usuario-dockerhub>` pelo seu usuário real do Docker Hub antes do build/push — cada pessoa faz o push para a própria conta.

```bash
# 1. Gerar os builds locais das imagens
docker compose build

# 2. Autenticar no Docker Hub (com a SUA conta)
docker login

# 3. Enviar as 4 imagens para o SEU repositório remoto
docker compose push
```

**2. Inicializar o cluster Swarm**

Transforme sua máquina no nó gerenciador (Manager):

```bash
docker swarm init
```

**3. Fazer deploy da stack em produção**

Execute a stack utilizando o arquivo `docker-stack.yml`:

```bash
docker stack deploy -c docker-stack.yml aponti_stack
```

**4. Verificar a saúde do cluster**

Listar a stack implantada:

```bash
docker stack ls
```

Listar todos os serviços e réplicas ativas:

```bash
docker service ls
```

Verificar a distribuição das tasks (contêineres) nos nós:

```bash
docker service ps aponti_stack_api-gateway
docker service ps aponti_stack_product-service
```

---

## 🛡️ Segurança e Regras de Roteamento (Swarm)

- **Exposição de portas:** apenas o `api-gateway` expõe uma porta pública (`3000:3000`).
- **Isolamento de microsserviços:** os serviços de produtos, estoque, pedidos e o banco de dados não expõem portas externas e comunicam-se exclusivamente via rede privada `overlay` (`aponti-net`).
- **Persistência do banco:** o serviço `db` utiliza o volume nomeado `db-data` e possui restrição `placement.constraints` para ser executado estritamente no nó manager.

---

## 📊 Matriz de Réplicas (Alta Disponibilidade)

| Serviço | Imagem | Réplicas no Swarm | Porta Exposta |
|---|---|---|---|
| api-gateway | `<seu-usuario-dockerhub>/aponti-fap-api-gateway:v1.0.0` | 2 | 3000 (Pública) |
| product-service | `<seu-usuario-dockerhub>/aponti-fap-product-service:v1.0.0` | 3 | Privada |
| inventory-service | `<seu-usuario-dockerhub>/aponti-fap-inventory-service:v1.0.0` | 3 | Privada |
| order-service | `<seu-usuario-dockerhub>/aponti-fap-order-service:v1.0.0` | 3 | Privada |
| db | `postgres:15-alpine` | 1 (Manager Node) | Privada |

> Substitua `<seu-usuario-dockerhub>` pelo usuário usado no `docker login` e nas tags de imagem do seu `docker-compose.yml` / `docker-stack.yml`.