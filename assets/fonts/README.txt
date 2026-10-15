Fontes locais do projeto SOMA
=============================

Neste ambiente de criação sem acesso externo à internet, os arquivos binários (.woff2)
da fonte Manrope não puderam ser baixados automaticamente.

A folha de estilos (`../css/styles.css`) já referencia `"Manrope"` como primeira opção na
pilha tipográfica (`--font-sans`), seguida por alternativas sans-serif geométricas de
sistema (`Inter`, `system-ui`, `-apple-system`, `Segoe UI`, `Roboto`, `Arial`).

Caso deseje incluir os arquivos locais da fonte Manrope posteriormente:
1. Baixe os arquivos `.woff2` oficiais da fonte Manrope (licenciada sob SIL Open Font License 1.1).
2. Coloque os arquivos nesta pasta (`assets/fonts/`) juntamente com o arquivo `OFL.txt`.
3. Adicione as declarações `@font-face` correspondentes no topo de `css/styles.css`.
