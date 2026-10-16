// Funções do carrinho de compras.
// O carrinho é um array de objetos { id, quantidade } salvo no localStorage.

function lerCarrinho() {
  var dados = localStorage.getItem("carrinho");
  if (dados == null) {
    return [];
  }
  return JSON.parse(dados);
}

function salvarCarrinho(carrinho) {
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function contarItens() {
  var carrinho = lerCarrinho();
  var total = 0;
  for (var i = 0; i < carrinho.length; i++) {
    total = total + carrinho[i].quantidade;
  }
  return total;
}

function adicionarAoCarrinho(id, quantidade) {
  var carrinho = lerCarrinho();
  var achou = false;
  for (var i = 0; i < carrinho.length; i++) {
    if (carrinho[i].id == id) {
      carrinho[i].quantidade = carrinho[i].quantidade + quantidade;
      achou = true;
    }
  }
  if (achou == false) {
    carrinho.push({ id: id, quantidade: quantidade });
  }
  salvarCarrinho(carrinho);
  mostrarCabecalho();
}

function mudarQuantidade(id, mudanca) {
  var carrinho = lerCarrinho();
  for (var i = 0; i < carrinho.length; i++) {
    if (carrinho[i].id == id) {
      carrinho[i].quantidade = carrinho[i].quantidade + mudanca;
      if (carrinho[i].quantidade < 1) {
        carrinho[i].quantidade = 1;
      }
    }
  }
  salvarCarrinho(carrinho);
  mostrarCabecalho();
  mostrarCarrinho();
}

function removerItem(id) {
  var carrinho = lerCarrinho();
  var novoCarrinho = [];
  for (var i = 0; i < carrinho.length; i++) {
    if (carrinho[i].id != id) {
      novoCarrinho.push(carrinho[i]);
    }
  }
  salvarCarrinho(novoCarrinho);
  mostrarCabecalho();
  mostrarCarrinho();
}

function calcularSubtotal() {
  var carrinho = lerCarrinho();
  var subtotal = 0;
  for (var i = 0; i < carrinho.length; i++) {
    var produto = buscarProduto(carrinho[i].id);
    subtotal = subtotal + produto.preco * carrinho[i].quantidade;
  }
  return subtotal;
}

// Frete grátis para compras a partir de R$ 200,00
function calcularFrete() {
  var subtotal = calcularSubtotal();
  if (subtotal == 0 || subtotal >= 200) {
    return 0;
  }
  return 19.9;
}

function calcularTotal() {
  return calcularSubtotal() + calcularFrete();
}

// Monta o resumo (subtotal, frete e total). Usado no carrinho, checkout e pagamento.
function montarResumo() {
  var frete = calcularFrete();
  var textoFrete = "Grátis";
  if (frete > 0) {
    textoFrete = formatarPreco(frete);
  }
  var html = "<h3>Resumo do pedido</h3>";
  html += "<div><span>Subtotal</span><span>" + formatarPreco(calcularSubtotal()) + "</span></div>";
  html += "<div><span>Frete</span><span>" + textoFrete + "</span></div>";
  html += '<div class="t"><span>Total</span><span>' + formatarPreco(calcularTotal()) + "</span></div>";
  html += '<p class="parc">ou ' + parcela(calcularTotal()) + "</p>";
  return html;
}

// Desenha a página do carrinho (carrinho.html)
function mostrarCarrinho() {
  var carrinho = lerCarrinho();
  var lista = document.getElementById("listaCarrinho");
  var resumo = document.getElementById("resumo");

  if (carrinho.length == 0) {
    lista.innerHTML = '<div class="empty"><h2>Seu carrinho está vazio</h2><p>Que tal conhecer os destaques da NEXUS?</p><a class="btn" href="categorias.html">Ver produtos</a></div>';
    resumo.style.display = "none";
    return;
  }

  var html = "";
  for (var i = 0; i < carrinho.length; i++) {
    var p = buscarProduto(carrinho[i].id);
    var q = carrinho[i].quantidade;
    html += '<div class="row">';
    html += '<img src="' + p.imagem + '" alt="' + p.nome + '">';
    html += '<div><a href="produto.html?id=' + p.id + '"><b>' + p.nome + "</b></a><br>";
    html += '<small style="color:var(--mut)">' + formatarPreco(p.preco) + " cada</small><br>";
    html += '<button class="link" style="float:none" onclick="removerItem(' + p.id + ')">Remover</button></div>';
    html += '<div class="qty"><button onclick="mudarQuantidade(' + p.id + ', -1)">−</button><span>' + q + '</span><button onclick="mudarQuantidade(' + p.id + ', 1)">+</button></div>';
    html += '<b class="price">' + formatarPreco(p.preco * q) + "</b>";
    html += "</div>";
  }
  lista.innerHTML = html;
  resumo.style.display = "block";
  resumo.innerHTML = montarResumo() + '<a class="btn g full" href="checkout.html">Finalizar compra</a><p style="text-align:center;margin-top:10px"><a class="link" style="float:none" href="categorias.html">Continuar comprando</a></p>';
}
