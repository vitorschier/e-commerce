// Código geral do site: funções úteis, cabeçalho, rodapé e a lógica de cada página.
// Cada página tem um elemento com um "id" próprio; o código só roda se esse id existir.

// ===== 1. FUNÇÕES ÚTEIS =====
function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function parcela(valor) {
  return "12x de " + formatarPreco(valor / 12) + " sem juros";
}

function pegarParametro(nome) {
  var parametros = new URLSearchParams(window.location.search);
  return parametros.get(nome);
}

function buscarProduto(id) {
  for (var i = 0; i < produtos.length; i++) {
    if (produtos[i].id == id) {
      return produtos[i];
    }
  }
  return null;
}

function mostrarAviso(texto) {
  var aviso = document.createElement("div");
  aviso.className = "toast";
  aviso.textContent = texto;
  document.body.appendChild(aviso);
  setTimeout(function () { aviso.remove(); }, 2200);
}

// ===== 2. CABEÇALHO E RODAPÉ (repetidos em todas as páginas) =====
function mostrarCabecalho() {
  var menu = ["Eletrônicos", "Computadores", "Áudio", "Games", "Casa Inteligente", "Acessórios"];
  var usuario = JSON.parse(localStorage.getItem("usuario"));
  var categoriaAtual = pegarParametro("categoria");
  var estaNaLista = document.getElementById("listaProdutos") != null;

  var html = '<header><div class="wrap"><div class="top">';
  html += '<a href="index.html" aria-label="NEXUS – página inicial"><span class="logo-box"><img src="../img/logo.png" alt="Logo NEXUS"></span></a>';
  html += '<form id="formBusca"><input id="campoBusca" placeholder="Buscar tecnologia premium, marcas, hardware..."></form>';
  html += '<div class="acts">';
  if (usuario) {
    html += '<a href="#" onclick="sair()">👤 ' + usuario.nome.split(" ")[0] + " (sair)</a>";
  } else {
    html += '<a href="login.html">👤 Entrar</a>';
  }
  html += '<button class="tbtn" id="btnTema" onclick="alternarTema()" aria-label="Alternar entre tema claro e escuro"></button>';
  var itens = contarItens();
  html += '<a class="pill" href="carrinho.html">🛒 ' + itens + (itens == 1 ? " Item" : " Itens") + "</a>";
  html += "</div></div></div><nav><div class=\"wrap\">";
  for (var i = 0; i < menu.length; i++) {
    var link = "categorias.html?categoria=" + encodeURIComponent(menu[i]);
    var ativo = estaNaLista && categoriaAtual == menu[i];
    if (i == 0) {
      link = "categorias.html";
      ativo = estaNaLista && categoriaAtual == null;
    }
    html += '<a href="' + link + '"' + (ativo ? ' class="on"' : "") + ">" + menu[i] + "</a>";
  }
  html += "</div></nav></header>";
  document.getElementById("cabecalho").innerHTML = html;
  aplicarTema();

  // Ao enviar a busca, vai para a página de categorias com o texto digitado
  document.getElementById("formBusca").addEventListener("submit", function (evento) {
    evento.preventDefault();
    var texto = document.getElementById("campoBusca").value;
    window.location.href = "categorias.html?busca=" + encodeURIComponent(texto);
  });
}

function mostrarRodape() {
  var html = '<footer><div class="wrap">';
  html += '<div class="fc"><div><span class="logo-box" style="margin-bottom:12px"><img src="../img/logo.png" alt="Logo NEXUS"></span><p>Tecnologia premium brasileira para profissionais e entusiastas. Produtos selecionados, experiência moderna e entrega pensada para quem valoriza desempenho e design.</p></div>';
  html += "<div><h4>Sobre</h4><p>Nossa História</p><p>Carreiras</p><p>Kit de Imprensa</p><p>Showrooms</p></div>";
  html += "<div><h4>Ajuda</h4><p>Status do Pedido</p><p>Trocas e Devoluções</p><p>Pagamentos Seguros</p><p>Portal de Suporte</p></div>";
  html += "<div><h4>Métodos de Pagamento</h4><p>Cartão de Crédito (12x Sem Juros)</p><p>Pix / Débito Direto</p><p>Boleto</p></div>";
  html += "<div><h4>Redes Sociais</h4><p>Twitter / X</p><p>Instagram</p><p>YouTube</p><p>GitHub</p></div></div>";
  html += '<div class="copy"><span>© 2026 NEXUS. Projeto escolar demonstrativo.</span><span>Nenhum pagamento real é processado.</span></div></div></footer>';
  document.getElementById("rodape").innerHTML = html;
}

// O tema escolhido fica salvo no localStorage, por isso vale para todas as páginas.
function alternarTema() {
  if (localStorage.getItem("tema") == "escuro") {
    localStorage.setItem("tema", "claro");
  } else {
    localStorage.setItem("tema", "escuro");
  }
  aplicarTema();
}

function aplicarTema() {
  var escuro = localStorage.getItem("tema") == "escuro";
  document.documentElement.setAttribute("data-theme", escuro ? "dark" : "light");
  var botao = document.getElementById("btnTema");
  if (botao) {
    // O botão mostra o tema para o qual ele vai mudar
    botao.innerHTML = escuro ? "☀ <span>Claro</span>" : "🌙 <span>Escuro</span>";
  }
}

function sair() {
  localStorage.removeItem("usuario");
  window.location.href = "index.html";
}

// ===== 3. CARD DE PRODUTO (usado na home, categorias e produto) =====
function criarCard(p) {
  var html = '<article class="pc"><a href="produto.html?id=' + p.id + '"><div class="im"><img src="' + p.imagem + '" alt="' + p.nome + '"></div></a>';
  if (p.selo != "") {
    html += '<span class="bd">' + p.selo + "</span>";
  }
  html += '<div class="inf"><span class="star">★ <b>' + p.nota + "</b></span>";
  html += '<a href="produto.html?id=' + p.id + '"><h3>' + p.nome + "</h3></a>";
  html += '<div class="price">' + formatarPreco(p.preco);
  if (p.precoAntigo > 0) {
    html += '<span class="old">' + formatarPreco(p.precoAntigo) + "</span>";
  }
  html += '</div><div class="parc">' + parcela(p.preco) + "</div></div></article>";
  return html;
}

function mostrarCards(idElemento, listaDeProdutos) {
  var html = "";
  for (var i = 0; i < listaDeProdutos.length; i++) {
    html += criarCard(listaDeProdutos[i]);
  }
  document.getElementById(idElemento).innerHTML = html;
}

// ===== 4. PÁGINA INICIAL (index.html) =====
function paginaInicial() {
  mostrarCards("destaques", [buscarProduto(3), buscarProduto(4), buscarProduto(1), buscarProduto(5)]);
  mostrarCards("maisVendidos", [buscarProduto(6), buscarProduto(7), buscarProduto(8), buscarProduto(9)]);
}

// ===== 5. CATEGORIAS / BUSCA (categorias.html) =====
function filtrarProdutos() {
  var categoria = pegarParametro("categoria");
  var busca = pegarParametro("busca");
  var precoMaximo = Number(document.getElementById("filtroPreco").value);
  var marca = document.getElementById("filtroMarca").value;
  var ordem = document.getElementById("ordenar").value;
  var resultado = [];

  for (var i = 0; i < produtos.length; i++) {
    var p = produtos[i];
    var passa = true;
    if (categoria != null && p.categoria != categoria) { passa = false; }
    if (busca != null && (p.nome + " " + p.descricao).toLowerCase().indexOf(busca.toLowerCase()) == -1) { passa = false; }
    if (p.preco > precoMaximo) { passa = false; }
    if (marca != "" && p.marca != marca) { passa = false; }
    if (passa) { resultado.push(p); }
  }

  if (ordem == "menor") { resultado.sort(function (a, b) { return a.preco - b.preco; }); }
  if (ordem == "maior") { resultado.sort(function (a, b) { return b.preco - a.preco; }); }

  document.getElementById("precoMax").textContent = formatarPreco(precoMaximo);
  document.getElementById("contagem").textContent = "Mostrando " + resultado.length + " de " + produtos.length + " produtos premium";
  if (resultado.length == 0) {
    document.getElementById("listaProdutos").innerHTML = '<div class="empty">Nenhum produto encontrado. Tente mudar os filtros ou a busca.</div>';
  } else {
    mostrarCards("listaProdutos", resultado);
  }
}

function paginaCategorias() {
  var categoria = pegarParametro("categoria");
  var busca = pegarParametro("busca");
  var titulo = "Curadoria de Eletrônicos";
  if (categoria != null) { titulo = categoria; }
  if (busca != null) { titulo = "Resultados para “" + busca.replace(/</g, "&lt;") + "”"; }
  document.getElementById("titulo").innerHTML = titulo;

  // Preenche a lista de marcas (sem repetir)
  var marcas = [];
  for (var i = 0; i < produtos.length; i++) {
    if (marcas.indexOf(produtos[i].marca) == -1) { marcas.push(produtos[i].marca); }
  }
  marcas.sort();
  var opcoes = '<option value="">Todas</option>';
  for (var j = 0; j < marcas.length; j++) {
    opcoes += '<option value="' + marcas[j] + '">' + marcas[j] + "</option>";
  }
  document.getElementById("filtroMarca").innerHTML = opcoes;

  // Sempre que o usuário mexer em um filtro, a lista é atualizada
  document.getElementById("filtroPreco").addEventListener("input", filtrarProdutos);
  document.getElementById("filtroMarca").addEventListener("change", filtrarProdutos);
  document.getElementById("ordenar").addEventListener("change", filtrarProdutos);
  filtrarProdutos();
}

// ===== 6. DETALHES DO PRODUTO (produto.html) =====
function paginaProduto() {
  var p = buscarProduto(pegarParametro("id"));
  var area = document.getElementById("detalheProduto");
  if (p == null) {
    area.innerHTML = '<div class="empty"><h2>Produto não encontrado</h2><a class="btn" href="categorias.html">Ver produtos</a></div>';
    return;
  }
  document.title = p.nome + " – NEXUS";
  var quantidade = 1;

  var html = '<div class="crumb"><a href="index.html">Início</a> › <a href="categorias.html?categoria=' + encodeURIComponent(p.categoria) + '">' + p.categoria + "</a> › " + p.nome + "</div>";
  html += '<div class="pd"><div><img class="big" src="' + p.imagem + '" alt="' + p.nome + '"></div><div>';
  html += '<span class="star">★ <b>' + p.nota + "</b></span><h1>" + p.nome + "</h1>";
  html += '<p style="color:var(--mut);padding-bottom:14px;border-bottom:1px solid var(--bd)">' + p.descricao + "</p>";
  html += '<p style="margin-top:16px"><span class="price">' + formatarPreco(p.preco) + "</span>";
  if (p.precoAntigo > 0) {
    var desconto = Math.round((1 - p.preco / p.precoAntigo) * 100);
    html += '<span class="old" style="font-size:16px">' + formatarPreco(p.precoAntigo) + '</span><span class="save">ECONOMIZE ' + desconto + "%</span>";
  }
  html += '</p><p class="parc">' + parcela(p.preco) + "</p>";
  html += '<p style="margin:10px 0"><b>Marca:</b> ' + p.marca + " &nbsp;|&nbsp; <b>Categoria:</b> " + p.categoria + "</p>";
  html += '<div class="buy"><div class="qty"><button id="menos">−</button><span id="qtd">1</span><button id="mais">+</button></div>';
  html += '<button class="btn o" id="btnAdicionar">Adicionar ao carrinho</button><button class="btn g" id="btnComprar">Comprar agora</button></div>';
  html += "</div></div>";

  html += '<h2 style="margin:40px 0 16px">Você também pode gostar</h2><div class="grid" id="relacionados"></div>';
  area.innerHTML = html;

  // Produtos relacionados: os 4 primeiros que não são o produto atual
  var outros = [];
  for (var i = 0; i < produtos.length && outros.length < 4; i++) {
    if (produtos[i].id != p.id) { outros.push(produtos[i]); }
  }
  mostrarCards("relacionados", outros);

  document.getElementById("mais").addEventListener("click", function () {
    quantidade = quantidade + 1;
    document.getElementById("qtd").textContent = quantidade;
  });
  document.getElementById("menos").addEventListener("click", function () {
    if (quantidade > 1) { quantidade = quantidade - 1; }
    document.getElementById("qtd").textContent = quantidade;
  });
  document.getElementById("btnAdicionar").addEventListener("click", function () {
    adicionarAoCarrinho(p.id, quantidade);
    mostrarAviso(quantidade + "× " + p.nome + " adicionado ao carrinho");
  });
  document.getElementById("btnComprar").addEventListener("click", function () {
    adicionarAoCarrinho(p.id, quantidade);
    window.location.href = "checkout.html";
  });
}

// ===== 7. CHECKOUT: DADOS DO CLIENTE (checkout.html) =====
function paginaCheckout() {
  if (lerCarrinho().length == 0) {
    window.location.href = "carrinho.html";
    return;
  }
  document.getElementById("resumo").innerHTML = montarResumo();

  var estados = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"];
  var opcoes = '<option value="">Selecione</option>';
  for (var i = 0; i < estados.length; i++) {
    opcoes += '<option value="' + estados[i] + '">' + estados[i] + "</option>";
  }
  document.getElementById("estado").innerHTML = opcoes;

  var usuario = JSON.parse(localStorage.getItem("usuario"));
  if (usuario) {
    document.getElementById("nome").value = usuario.nome;
    document.getElementById("email").value = usuario.email;
  }

  document.getElementById("formCheckout").addEventListener("submit", function (evento) {
    evento.preventDefault();
    var cliente = {
      nome: document.getElementById("nome").value.trim(),
      email: document.getElementById("email").value.trim(),
      telefone: document.getElementById("telefone").value.trim(),
      endereco: document.getElementById("endereco").value.trim(),
      cidade: document.getElementById("cidade").value.trim(),
      estado: document.getElementById("estado").value,
      cep: document.getElementById("cep").value.trim()
    };
    var erro = document.getElementById("erro");
    var soNumerosCep = cliente.cep.replace(/\D/g, "");
    var soNumerosTel = cliente.telefone.replace(/\D/g, "");

    if (cliente.nome.length < 3) { erro.textContent = "Digite seu nome completo."; return; }
    if (cliente.email.indexOf("@") == -1 || cliente.email.indexOf(".") == -1) { erro.textContent = "Digite um e-mail válido."; return; }
    if (soNumerosTel.length < 10) { erro.textContent = "Digite um telefone com DDD."; return; }
    if (cliente.endereco == "" || cliente.cidade == "") { erro.textContent = "Preencha endereço e cidade."; return; }
    if (cliente.estado == "") { erro.textContent = "Selecione o estado."; return; }
    if (soNumerosCep.length != 8) { erro.textContent = "O CEP deve ter 8 números."; return; }

    localStorage.setItem("cliente", JSON.stringify(cliente));
    window.location.href = "pagamento.html";
  });
}

// ===== 8. PAGAMENTO SIMULADO (pagamento.html) =====
// Cada forma de pagamento abre a sua própria tela intermediária.
var telasDePagamento = {
  pix: "processando-pix.html",
  credito: "processando-credito.html",
  debito: "processando-debito.html",
  boleto: "processando-boleto.html"
};

function paginaPagamento() {
  if (lerCarrinho().length == 0 || localStorage.getItem("cliente") == null) {
    window.location.href = "carrinho.html";
    return;
  }
  document.getElementById("resumo").innerHTML = montarResumo();

  // Lista de parcelas do cartão de crédito (1x até 12x, sem juros)
  var total = calcularTotal();
  var opcoesParcelas = "";
  for (var n = 1; n <= 12; n++) {
    opcoesParcelas += '<option value="' + n + '">' + n + "x de " + formatarPreco(total / n) + " sem juros</option>";
  }
  document.getElementById("parcelas").innerHTML = opcoesParcelas;

  // Mostra a explicação (e as parcelas, se for crédito) da forma escolhida
  function atualizarForma() {
    var forma = document.querySelector('input[name="forma"]:checked').value;
    var texto = "";
    if (forma == "pix") { texto = "Você verá um QR Code e um código Pix de demonstração. Nenhum valor será cobrado."; }
    if (forma == "credito") { texto = "Escolha o número de parcelas. Por segurança, este projeto NÃO pede número de cartão."; }
    if (forma == "debito") { texto = "Pagamento à vista no débito. Por segurança, este projeto NÃO pede número de cartão."; }
    if (forma == "boleto") { texto = "Um boleto de demonstração será gerado. Nenhum valor será cobrado."; }
    document.getElementById("explicacao").textContent = texto;
    document.getElementById("blocoParcelas").style.display = forma == "credito" ? "block" : "none";
  }
  var opcoes = document.getElementsByName("forma");
  for (var i = 0; i < opcoes.length; i++) {
    opcoes[i].addEventListener("change", atualizarForma);
  }
  atualizarForma();

  // Ao continuar: guarda a escolha e abre a tela intermediária correta
  document.getElementById("formPagamento").addEventListener("submit", function (evento) {
    evento.preventDefault();
    var forma = document.querySelector('input[name="forma"]:checked').value;
    var parcelas = 1;
    if (forma == "credito") {
      parcelas = Number(document.getElementById("parcelas").value);
    }
    localStorage.setItem("pagamento", JSON.stringify({ forma: forma, parcelas: parcelas }));
    window.location.href = telasDePagamento[forma];
  });
}

// Cria o pedido, esvazia o carrinho e vai para a tela de pedido aprovado.
// É chamada pelo botão de confirmar das telas processando-*.html
function criarPedido() {
  var pagamento = JSON.parse(localStorage.getItem("pagamento"));
  var carrinho = lerCarrinho();
  var itens = [];
  for (var i = 0; i < carrinho.length; i++) {
    var p = buscarProduto(carrinho[i].id);
    itens.push({ nome: p.nome, quantidade: carrinho[i].quantidade, subtotal: p.preco * carrinho[i].quantidade });
  }
  var pedido = {
    numero: "NX" + String(Date.now()).slice(-6),
    cliente: JSON.parse(localStorage.getItem("cliente")),
    itens: itens,
    frete: calcularFrete(),
    total: calcularTotal(),
    forma: pagamento.forma,
    parcelas: pagamento.parcelas
  };
  localStorage.setItem("ultimoPedido", JSON.stringify(pedido));
  localStorage.removeItem("carrinho");
  localStorage.removeItem("pagamento");
  window.location.href = "sucesso.html";
}

// ===== 8B. TELAS INTERMEDIÁRIAS (processando-pix, -credito, -debito e -boleto) =====
function paginaProcessamento() {
  var tela = document.getElementById("telaProcessamento");
  var forma = tela.getAttribute("data-forma");
  var pagamento = JSON.parse(localStorage.getItem("pagamento"));

  // Se a pessoa chegou aqui sem escolher essa forma de pagamento, volta para a escolha
  if (lerCarrinho().length == 0 || localStorage.getItem("cliente") == null || pagamento == null || pagamento.forma != forma) {
    window.location.href = "pagamento.html";
    return;
  }
  document.getElementById("resumo").innerHTML = montarResumo();
  document.getElementById("btnConfirmar").addEventListener("click", criarPedido);

  if (forma == "pix") {
    // Contagem regressiva de 10 minutos
    var segundos = 600;
    var relogio = setInterval(function () {
      segundos = segundos - 1;
      var min = Math.floor(segundos / 60);
      var seg = segundos % 60;
      document.getElementById("tempo").textContent = min + ":" + (seg < 10 ? "0" : "") + seg;
      if (segundos <= 0) {
        clearInterval(relogio);
        document.getElementById("tempo").textContent = "expirado";
        document.getElementById("btnConfirmar").disabled = true;
      }
    }, 1000);

    document.getElementById("btnCopiar").addEventListener("click", function () {
      var campo = document.getElementById("codigoPix");
      campo.select();
      if (navigator.clipboard) { navigator.clipboard.writeText(campo.value); }
      mostrarAviso("Código Pix copiado!");
    });
  }

  if (forma == "credito" || forma == "debito") {
    // Texto da compra
    var texto = "Débito à vista: " + formatarPreco(calcularTotal());
    if (forma == "credito" && pagamento.parcelas == 1) { texto = "Crédito à vista: " + formatarPreco(calcularTotal()); }
    if (forma == "credito" && pagamento.parcelas > 1) { texto = "Crédito em " + pagamento.parcelas + "x de " + formatarPreco(calcularTotal() / pagamento.parcelas) + " sem juros"; }
    document.getElementById("detalhe").textContent = texto;

    // Simula 3 segundos de processamento e depois mostra "autorizado"
    setTimeout(function () {
      document.getElementById("aguardando").style.display = "none";
      document.getElementById("aprovado").style.display = "block";
    }, 3000);
  }

  if (forma == "boleto") {
    // Vencimento: 3 dias depois de hoje
    var data = new Date();
    data.setDate(data.getDate() + 3);
    document.getElementById("vencimento").textContent = data.toLocaleDateString("pt-BR");
  }
}

// ===== 9. PEDIDO CONFIRMADO (sucesso.html) =====
function paginaSucesso() {
  var pedido = JSON.parse(localStorage.getItem("ultimoPedido"));
  var area = document.getElementById("dadosPedido");
  if (pedido == null) {
    area.innerHTML = '<p>Nenhum pedido encontrado.</p><a class="btn" href="index.html">Voltar à loja</a>';
    return;
  }
  var nomesForma = { pix: "Pix", credito: "Cartão de crédito", debito: "Cartão de débito", boleto: "Boleto bancário" };
  var formaTexto = nomesForma[pedido.forma];
  if (pedido.forma == "credito" && pedido.parcelas > 1) {
    formaTexto = formaTexto + " em " + pedido.parcelas + "x de " + formatarPreco(pedido.total / pedido.parcelas) + " sem juros";
  }
  var html = "<p style=\"color:var(--mut);margin:8px 0\">Obrigado, " + pedido.cliente.nome.split(" ")[0] + "! Número do pedido: <b>#" + pedido.numero + "</b> (simulação).</p>";
  html += '<div class="box sum" style="text-align:left;margin:18px 0">';
  for (var i = 0; i < pedido.itens.length; i++) {
    html += "<div><span>" + pedido.itens[i].quantidade + "× " + pedido.itens[i].nome + "</span><span>" + formatarPreco(pedido.itens[i].subtotal) + "</span></div>";
  }
  html += "<div><span>Frete</span><span>" + (pedido.frete > 0 ? formatarPreco(pedido.frete) : "Grátis") + "</span></div>";
  html += '<div class="t"><span>Total</span><span>' + formatarPreco(pedido.total) + "</span></div>";
  html += '<p class="parc">Pagamento: ' + formaTexto + "</p>";
  html += '<p class="parc">Entrega: ' + pedido.cliente.endereco + ", " + pedido.cliente.cidade + " – " + pedido.cliente.estado + ", CEP " + pedido.cliente.cep + "</p></div>";
  html += '<a class="btn" href="index.html">Voltar à loja</a>';
  area.innerHTML = html;
}

// ===== 10. LOGIN E CADASTRO (login.html e cadastro.html) =====
function paginaLogin() {
  document.getElementById("formLogin").addEventListener("submit", function (evento) {
    evento.preventDefault();
    var email = document.getElementById("email").value.trim();
    var senha = document.getElementById("senha").value;
    var erro = document.getElementById("erro");
    if (email.indexOf("@") == -1) { erro.textContent = "Digite um e-mail válido."; return; }
    if (senha == "") { erro.textContent = "Digite sua senha."; return; }

    var usuario = JSON.parse(localStorage.getItem("usuario"));
    if (usuario == null || usuario.email != email) {
      usuario = { nome: email.split("@")[0], email: email };
    }
    localStorage.setItem("usuario", JSON.stringify(usuario));
    window.location.href = "index.html";
  });
}

function paginaCadastro() {
  document.getElementById("formCadastro").addEventListener("submit", function (evento) {
    evento.preventDefault();
    var nome = document.getElementById("nome").value.trim();
    var email = document.getElementById("email").value.trim();
    var senha = document.getElementById("senha").value;
    var senha2 = document.getElementById("senha2").value;
    var erro = document.getElementById("erro");
    if (nome.length < 3) { erro.textContent = "Digite seu nome completo."; return; }
    if (email.indexOf("@") == -1) { erro.textContent = "Digite um e-mail válido."; return; }
    if (senha.length < 8) { erro.textContent = "A senha deve ter pelo menos 8 caracteres."; return; }
    if (senha != senha2) { erro.textContent = "As senhas não são iguais."; return; }

    // Por segurança, a senha NÃO é salva em lugar nenhum (é só uma simulação)
    localStorage.setItem("usuario", JSON.stringify({ nome: nome, email: email }));
    window.location.href = "index.html";
  });
}

function mostrarOuOcultarSenha() {
  var campos = document.querySelectorAll('input[type="password"], input.senha');
  for (var i = 0; i < campos.length; i++) {
    campos[i].classList.add("senha");
    campos[i].type = campos[i].type == "password" ? "text" : "password";
  }
}

// ===== 11. INÍCIO: roda ao carregar qualquer página =====
mostrarCabecalho();
mostrarRodape();

if (document.getElementById("destaques")) { paginaInicial(); }
if (document.getElementById("listaProdutos")) { paginaCategorias(); }
if (document.getElementById("detalheProduto")) { paginaProduto(); }
if (document.getElementById("listaCarrinho")) { mostrarCarrinho(); }
if (document.getElementById("formCheckout")) { paginaCheckout(); }
if (document.getElementById("formPagamento")) { paginaPagamento(); }
if (document.getElementById("telaProcessamento")) { paginaProcessamento(); }
if (document.getElementById("dadosPedido")) { paginaSucesso(); }
if (document.getElementById("formLogin")) { paginaLogin(); }
if (document.getElementById("formCadastro")) { paginaCadastro(); }
