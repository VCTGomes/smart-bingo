# Corretor de Bingos

Cadastre as cartelas e corrija o bingo na hora: você digita os números sorteados,
o app marca todas as cartelas e avisa quem bateu.

**Acesse:** <https://bingo.vctgomes.com>

## Como funciona

Página estática, sem servidor e sem conta. Tudo roda no próprio aparelho:

- as cartelas e os números sorteados ficam no `localStorage` do navegador;
- é um PWA, dá pra instalar na tela de início e usar **offline** (service worker);
- cartelas podem ser passadas entre aparelhos por QR Code (gerar e ler).

## Estrutura

```
index.html      o app inteiro (marcação, telas, QR, lógica de vitória)
sw.js           service worker, faz o cache offline dos assets
manifest.json   metadados do PWA
res/            fontes, css, js auxiliares e ícones
art/            artes originais em alta, de onde saíram os ícones (não servidas)
CNAME           domínio custom do GitHub Pages
```

## Rodar localmente

Qualquer servidor estático serve. O service worker exige `http://localhost`
(não funciona abrindo o arquivo com `file://`):

```sh
python3 -m http.server 8000
# abre http://localhost:8000
```

## Deploy

GitHub Pages, servindo a branch padrão a partir da raiz (`/`). Não há build, então
não é necessário GitHub Actions: o push já publica.
