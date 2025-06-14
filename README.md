# DivinoCantar

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