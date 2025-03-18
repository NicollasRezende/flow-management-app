Coletando informações do workspace# Flow Management App

Este é um aplicativo de gerenciamento de fluxo de menus, desenvolvido com React, TypeScript e React Flow Renderer. Ele permite criar, editar e visualizar fluxos de menus interativos.

## Estrutura do Projeto

```
index.html
package.json
postcss.config.js
tailwind.config.js
tsconfig.json
tsconfig.node.json
vite.config.ts
public/
    assets/
        flow-template.json
src/
    App.tsx
    index.css
    main.tsx
    components/
        MenuEditPanel.tsx
        MenuFlowApp.tsx
        MenuFlowEditor.tsx
        MenuNodeComponent.tsx
        MenuToolbar.tsx
    types/
        menu.ts
```

## Funcionalidades

- **MenuFlowApp**: Componente principal que gerencia o estado do fluxo de menus.
- **MenuFlowEditor**: Editor visual para criar e editar menus.
- **MenuEditPanel**: Painel de edição para modificar os detalhes de um menu.
- **MenuToolbar**: Barra de ferramentas para ações como salvar, adicionar, importar e exportar menus.
- **MenuNodeComponent**: Componente visual para representar um nó de menu no editor de fluxo.

## Pré-requisitos

- Node.js
- npm ou yarn

## Instalação

1. Clone o repositório:

```sh
git clone https://github.com/seu-usuario/flow-management-app.git
cd flow-management-app
```

2. Instale as dependências:

```sh
npm install
# ou
yarn install
```

## Uso

### Desenvolvimento

Para iniciar o servidor de desenvolvimento:

```sh
npm run dev
# ou
yarn dev
```

### Build

Para criar uma build de produção:

```sh
npm run build
# ou
yarn build
```

### Preview

Para visualizar a build de produção:

```sh
npm run preview
# ou
yarn preview
```

## Estrutura dos Arquivos

### flow-template.json

Contém o template JSON inicial para os menus.

### MenuToolbar.tsx

Barra de ferramentas com botões para salvar, adicionar, importar e exportar menus.

### MenuEditPanel.tsx

Painel de edição para modificar os detalhes de um menu.

### MenuFlowEditor.tsx

Editor visual para criar e editar menus.

### MenuFlowApp.tsx

Componente principal que gerencia o estado do fluxo de menus.

### MenuNodeComponent.tsx

Componente visual para representar um nó de menu no editor de fluxo.

### menu.ts

Define os tipos TypeScript para os menus.
