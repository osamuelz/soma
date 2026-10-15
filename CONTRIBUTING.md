# Contribuindo com SOMA

O projeto usa HTML, CSS e JavaScript nativos, sem instalação de dependências.

1. Crie uma branch a partir de `main`.
2. Abra `index.html` no navegador ou execute `python -m http.server 8000`.
3. Faça uma alteração com propósito claro e registre-a em um commit descritivo.
4. Abra um pull request com a mudança e a validação realizada.

## Antes de enviar

- Verifique a sintaxe com `node --check js/main.js`.
- Verifique espaços e conflitos com `git diff --check`.
- Confira a página em telas largas e estreitas.
- Navegue por teclado e confira o menu, o formulário e o foco após remover hábitos.
- Confira inclusão, conclusão, remoção, limite de seis hábitos e persistência após recarregar.
- Preserve textos inseridos como texto puro e o funcionamento sem armazenamento local.
- Mantenha os caminhos de recursos relativos para publicação em `/soma/`.

O GitHub Actions verifica a sintaxe JavaScript, a sintaxe do script de publicação
e os espaços no último commit. A publicação no GitHub Pages usa `main`, na raiz.
