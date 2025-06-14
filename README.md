# DivinoCantar

[![GitHub repo](https://img.shields.io/badge/GitHub-tiagonpsilva%2Fdivino--cantar--frontend-blue?logo=github)](https://github.com/tiagonpsilva/divino-cantar-frontend)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live%20Demo-brightgreen?logo=github)](https://tiagonpsilva.github.io/divino-cantar-frontend/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://makeapullrequest.com)

[![React](https://img.shields.io/badge/React-18.0+-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0+-646CFF?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.0+-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)

[![Model Context Protocol](https://img.shields.io/badge/MCP-Enabled-FF6B6B?logo=anthropic)](https://modelcontextprotocol.io/)
[![Git Flow](https://img.shields.io/badge/Git--Flow-Enabled-F05032?logo=git)](https://nvie.com/posts/a-successful-git-branching-model/)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-FE5196?logo=conventionalcommits)](https://conventionalcommits.org)
[![Catholic Music](https://img.shields.io/badge/Catholic-Music%20Repertoire-gold?logo=music)](https://github.com/tiagonpsilva/divino-cantar-frontend)
[![AI Assistant](https://img.shields.io/badge/AI-Assistant%20Enabled-purple?logo=robot)](https://github.com/tiagonpsilva/divino-cantar-frontend)

Aplicação web para gerenciar repertório musical para celebrações católicas.

## 🚀 Como executar

1. Instale as dependências:
```bash
npm install
```

2. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

3. Acesse http://localhost:5173 (ou a porta indicada no terminal) no seu navegador

## 🌐 Deploy GitHub Pages

O projeto está configurado para deploy automático no GitHub Pages:

**URL da aplicação**: https://tiagonpsilva.github.io/divino-cantar-frontend/

### Deploy automático
- Push para `main` → Deploy automático via GitHub Actions
- Workflow configurado em `.github/workflows/deploy.yml`
- Build otimizado com Vite para produção

## 🎯 Funcionalidades Implementadas

### Interface
- ✅ Layout responsivo moderno com sidebar
- ✅ Modo claro/escuro completo com persistência
- ✅ Logo adaptativo (versões clara e escura)
- ✅ Navegação intuitiva com 8 seções principais
- ✅ Ícones coloridos e animações suaves

### Páginas Principais
- 🏠 **Início** - Dashboard com estatísticas e atividades recentes
- 📅 **Liturgia do Dia** - Leituras e músicas sugeridas
- 🎵 **Repertório** - Organizado por momentos da missa
- 🔍 **Buscar Músicas** - Com filtros avançados
- 🎼 **Cifras** - Visualizador com transposição de tons
- 👥 **Planejar Missa** - Interface para montar celebrações
- 📚 **Minha Biblioteca** - Gerenciar coleções e documentos
- ⚙️ **Configurações** - Personalização do sistema

### Dados
- ✅ Mock completo com 10 músicas de exemplo
- ✅ Todos os momentos da missa cobertos
- ✅ Liturgia do dia com leituras
- ✅ Estrutura de tipos TypeScript completa

## 🛠️ Tecnologias

- React com TypeScript
- Vite
- TailwindCSS
- Lucide Icons

## 🔗 Model Context Protocol (MCP) Integration

Este projeto está integrado com o Model Context Protocol para facilitar o desenvolvimento e manutenção através do Claude Code.

### Configuração MCP

O projeto está configurado com os seguintes servidores MCP:

- **GitHub MCP**: Integração completa com repositórios GitHub
- **Claude GitHub MCP**: Ferramentas específicas para desenvolvimento  
- **Docker MCP**: Suporte para containerização

### Funcionalidades MCP Disponíveis

- ✅ Criação e gestão de issues no GitHub
- ✅ Pull requests automatizados
- ✅ Análise de código e revisões
- ✅ Sincronização com repositório remoto
- ✅ Gestão de branches e merges
- ✅ Deployment automatizado

### Repository

- **GitHub**: [tiagonpsilva/divino-cantar-frontend](https://github.com/tiagonpsilva/divino-cantar-frontend)
- **Branch principal**: `main`
- **Git-flow**: Configurado com branches `develop`, `feature/*`, `release/*`, `hotfix/*`

## 📱 Experiência do Usuário

- Interface limpa e minimalista
- Navegação intuitiva entre liturgia e repertório
- Suporte completo para dispositivos móveis
- Alternância entre modo claro e escuro

## 🎵 Momentos da Missa Suportados

- Entrada
- Perdão
- Glória
- Salmo
- Aclamação
- Ofertório
- Santo
- Cordeiro
- Comunhão
- Ação de Graças
- Final
- Momentos especiais (Quaresma, Natal)