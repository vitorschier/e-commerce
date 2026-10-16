# NEXUS – Loja virtual (projeto escolar)

Loja de tecnologia feita com **HTML, CSS e JavaScript puro**, baseada no protótipo do Figma. Todo o texto está em português (pt-BR) e os preços em reais (R$). **Nenhum pagamento é real**: o checkout é só uma simulação e não pede dados de cartão ou banco.

## Como abrir
- Dê dois cliques em `index.html` (ele abre `html/index.html`), ou use a extensão **Live Server** do VS Code.
- As fontes vêm do Google Fonts; sem internet o site usa a fonte padrão do sistema.

## Estrutura
```
index.html          -> redireciona para html/index.html
html/               -> uma página para cada tela
  index.html          início (destaques e mais vendidos)
  categorias.html     lista de produtos, busca e filtros
  produto.html        detalhes do produto
  carrinho.html       carrinho de compras
  checkout.html       dados do cliente e endereço
  pagamento.html      pagamento simulado
  sucesso.html        pedido confirmado
  login.html / cadastro.html
css/style.css       -> todo o visual (cores, cards, tema claro/escuro, responsivo)
js/produtos.js      -> lista de produtos (array de objetos)
js/carrinho.js      -> funções do carrinho (adicionar, +, -, remover, subtotal, total)
js/script.js        -> cabeçalho, rodapé, busca, filtros e lógica de cada página
img/                -> fotos dos produtos (extraídas do PDF)
```

## Como o programa funciona (para explicar na apresentação)
1. **Produtos**: ficam em `produtos.js`, um array de objetos com id, nome, descrição, preço, categoria e imagem.
2. **Cabeçalho e rodapé**: o JavaScript escreve os dois em todas as páginas (`mostrarCabecalho` e `mostrarRodape`), então não precisamos repetir esse HTML.
3. **Carrinho**: é um array `[{ id, quantidade }]` salvo no `localStorage`, que guarda os dados no navegador e mantém o carrinho ao trocar de página.
   - `adicionarAoCarrinho`, `mudarQuantidade`, `removerItem`
   - `calcularSubtotal` (soma preço × quantidade), `calcularFrete` (grátis a partir de R$ 200) e `calcularTotal`
4. **Fluxo de compra**: produto → carrinho → checkout (valida o formulário e salva o cliente) → pagamento (Pix, cartão ou boleto, simulado) → sucesso (mostra o pedido e limpa o carrinho).
5. **Página certa, código certo**: no fim do `script.js`, cada página só executa sua função se o elemento dela existir (por exemplo, `if (document.getElementById("formCheckout"))`).

## Git e GitHub
```bash
git init
git add .
git commit -m "Primeira versão da loja NEXUS"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/nexus.git
git push -u origin main
```
Para publicar o site: no GitHub, vá em **Settings → Pages** e escolha a branch `main` (pasta `/root`).
