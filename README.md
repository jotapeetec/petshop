# 🐾 AuMigos Pet Shop

Site de pet shop com carrinho de compras, mascote 3D interativo, animações e mapa de localização.

## 📁 Estrutura
| Arquivo | O que faz |
|---|---|
| `index.html` | Estrutura da página |
| `style.css`  | Todos os estilos |
| `script.js`  | Produtos, carrinho, animações e mapa |

## 🌐 Bibliotecas usadas (via CDN)
- **Three.js** — mascote 3D no hero (cachorrinho que segue o mouse, abana as orelhas e mostra a língua)
- **GSAP** — animações de entrada, animações no scroll (ScrollTrigger), contadores do hero, "pulso" do carrinho e toasts
- **Leaflet** — mapa interativo com marcador personalizado (🐾) e popup da loja

## 🚀 Publicar no GitHub Pages
1. Crie um repositório no GitHub (ex: `aumigos-petshop`)
2. Faça upload destes 3 arquivos na **raiz** do repositório
3. Vá em **Settings → Pages**
4. Em **Source**, selecione a branch `main` e a pasta `/(root)`
5. Salve — em ~1 minuto o site estará no ar em `https://seu-usuario.github.io/aumigos-petshop`

## ✅ Checklist da apresentação
- [ ] Mostrar o mascote 3D mexendo com o mouse (Three.js)
- [ ] Rolar a página e apontar as animações de entrada (GSAP)
- [ ] Mostrar os contadores animados do hero
- [ ] Dar zoom no mapa e clicar no marcador 🐾 (Leaflet)
- [ ] Adicionar produtos ao carrinho e finalizar um pedido
