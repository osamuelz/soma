#!/usr/bin/env bash
# Publicar o repositório SOMA no GitHub preservando o histórico completo.

set -euo pipefail
cd -- "$(dirname -- "${BASH_SOURCE[0]}")"

if [ "$#" -ne 1 ]; then
  echo "Uso: ./push_to_github.sh <URL_DO_SEU_REPOSITORIO_GITHUB>"
  echo "Exemplo: ./push_to_github.sh https://github.com/seu-usuario/soma.git"
  exit 1
fi

REPO_URL="$1"

case "$REPO_URL" in
  https://github.com/*/*|git@github.com:*/*) ;;
  *) echo "Informe uma URL de repositório do GitHub." >&2; exit 1 ;;
esac

if git remote get-url origin >/dev/null 2>&1; then
  git remote set-url origin "$REPO_URL"
else
  git remote add origin "$REPO_URL"
fi

COMMIT_COUNT="$(git rev-list --count HEAD)"
echo "Enviando $COMMIT_COUNT commits para $REPO_URL..."
git push -u origin HEAD:main

echo ""
echo "=========================================================="
echo "✓ Repositório publicado com sucesso no GitHub!"
echo "✓ Todo o histórico de $COMMIT_COUNT commits foi preservado."
echo "=========================================================="
