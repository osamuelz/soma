# SOMA

**Link do site:** [osamuelz.github.io/soma](https://osamuelz.github.io/soma/)

**Repositório:** [github.com/osamuelz/soma](https://github.com/osamuelz/soma)

## Conceito do projeto

**SOMA** é uma landing page para um aplicativo fictício de acompanhamento de hábitos diários, guiado pelo lema **“Pequenos hábitos. Grandes mudanças.”**

A proposta visual e de comunicação parte da ideia de que pequenas ações consistentes tornam o dia mais equilibrado, com uma abordagem acolhedora, leve e objetiva — sem promessas exageradas de produtividade.

> **Aviso:** SOMA é um produto fictício criado exclusivamente para composição de portfólio. Não possui contas de usuário, sincronização em nuvem, notificações ou backend.

## Tecnologias

O projeto foi construído exclusivamente com tecnologias nativas da web, sem frameworks, bibliotecas de terceiros ou ferramentas de build:

- **HTML5** semântico (`lang="pt-BR"`, regiões acessíveis, formulários e controles nativos).
- **CSS3** moderno (variáveis CSS, CSS Grid, Flexbox, tipografia fluida com `clamp()`, suporte a `prefers-reduced-motion`).
- **JavaScript puro (ES6+)** modularizado em funções pequenas e focado em manipulação segura do DOM (`textContent` / `createElement`) e persistência local.

## Estrutura dos arquivos

```text
soma/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── assets/
│   └── fonts/
│       └── README.txt
└── README.md
```

## Como executar

O projeto usa apenas caminhos relativos e não exige nenhuma etapa de instalação (`npm`, bundlers ou compiladores):

1. **Abertura direta no navegador:**
   Abra o arquivo `soma/index.html` diretamente em qualquer navegador moderno (duplo clique ou `Ctrl+O` / `Cmd+O`).
2. **Usando um servidor local (opcional):**
   Na pasta `soma/`, execute um servidor estático simples, por exemplo:
   ```bash
   python3 -m http.server 8000
   ```
   Em seguida, acesse `http://localhost:8000` no navegador.

## Como publicar no GitHub Pages

1. Crie um repositório no GitHub e envie o conteúdo da pasta `soma/` para a raiz do repositório (ou configure a pasta de publicação).
2. No repositório do GitHub, acesse **Settings > Pages**.
3. Em **Build and deployment**, selecione **Deploy from a branch**.
4. Escolha a branch principal (`main` ou `master`) e a pasta `/ (root)` e clique em **Save**.
5. A URL deste projeto é `https://osamuelz.github.io/soma/`. Ao publicar em outra conta ou renomear o repositório, atualize também o endereço em `index.html`, `robots.txt` e `sitemap.xml`.

Para enviar o histórico inteiro a um repositório já criado, use Git Bash:

```bash
bash push_to_github.sh https://github.com/seu-usuario/soma.git
```

O script conta os commits automaticamente e faz um push normal, sem sobrescrever
o histórico remoto. O fluxo `Validate site` executa verificações de sintaxe em cada
push para `main` e em pull requests. Consulte [CONTRIBUTING.md](CONTRIBUTING.md)
para a lista de verificações manuais.

Os 14 commits recebidos no projeto original foram preservados com seus autores,
datas e identificadores. Os commits de preparação para publicação foram adicionados
após esse histórico.

## Funcionalidades da demonstração

A seção **“Experimente um dia com SOMA”** oferece uma demonstração interativa funcional diretamente na página:

- **Três hábitos iniciais:** *Beber um copo de água*, *Ler por 10 minutos* e *Fazer uma pausa para se alongar*.
- **Acompanhamento em tempo real:** marcar ou desmarcar qualquer hábito atualiza instantaneamente o contador (`X de Y hábitos concluídos`), a porcentagem, a barra de progresso (`role="progressbar"`) e a mensagem de incentivo contextual.
- **Adição de novos hábitos:** campo dedicado com contador de caracteres e validações para impedir nomes vazios, nomes duplicados (comparação insensível a maiúsculas/minúsculas e espaços extras), nomes com mais de 60 caracteres ou listas acima do limite de 6 hábitos.
- **Remoção e estado vazio:** cada hábito pode ser removido individualmente com redirecionamento acessível de foco. Quando todos os hábitos são removidos, um estado vazio orienta a adição do primeiro hábito e mantém o progresso em `0%` sem divisão por zero.
- **Segurança contra XSS:** todos os textos inseridos pela pessoa usuária são renderizados exclusivamente via `textContent`, sem uso de `innerHTML`.

## Uso de `localStorage`

- A demonstração utiliza a chave `soma_demo_state_v1` no `localStorage` para persistir:
  - A lista de hábitos (`id`, `title`, `icon`).
  - O estado de conclusão (`completed`) de cada hábito.
  - A data local (`YYYY-MM-DD`) calculada a partir do fuso horário local do navegador (`getFullYear()`, `getMonth() + 1`, `getDate()`), evitando mudanças prematuras de dia causadas por datas em UTC.
- **Virada de dia:** quando a página é aberta em uma nova data local, os nomes dos hábitos personalizados são preservados e todos os estados de conclusão são reiniciados para `false`.
- **Validação e resiliência:** todos os dados lidos do `localStorage` passam por validação estrutural. Caso os dados estejam corrompidos ou o `localStorage` esteja indisponível (como em modos restritos de navegação), a demonstração continua funcionando normalmente em memória.

## Tipografia e contraste

- **Fonte e limitação de ambiente:** a pilha tipográfica prioriza a fonte **Manrope** (SIL Open Font License 1.1). Como o ambiente de desenvolvimento não possui acesso externo à internet para baixar os binários `.woff2` oficiais da Manrope, foi configurado um fallback imediato para fontes sans-serif geométricas/humanistas do sistema (`Inter`, `system-ui`, `-apple-system`, `Segoe UI`, `Roboto`, `Arial`), sem gerar erros de requisição no console. Instruções para inclusão opcional dos arquivos `.woff2` locais estão em `assets/fonts/README.txt`.
- **Contraste verificado (WCAG 2.1):** todas as combinações de texto e fundo foram verificadas matematicamente para garantir relação mínima de contraste AA (4.5:1) e, na maioria dos elementos, AAA (> 7:1). O tom secundário (`#63705F`) é aplicado apenas sobre `#FFFFFF` (5.23:1) e `#F7F8F4` (4.91:1), enquanto superfícies em verde suave (`#E8EFE2`) e amarelo suave (`#F4E6B8`) utilizam texto principal `#20291F` (> 12:1) ou verde principal `#355E3B` (> 5.9:1).
