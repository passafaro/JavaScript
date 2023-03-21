
/*  listagem de produtos ------------------------------------------ */

function compararPreco(a, b){
  if (a.preco < b.preco)
    return -1;

  if (a.preco > b.preco)
    return 1;

  return 0;
}


function compararNome(a, b){
  if (a.nome < b.nome)
    return -1;

  if (a.nome > b.nome)
    return 1;

  return 0;
}


function listaProdutos(dataJson, ordem){

  if(ordem == "precoMaior"){
    dataJson.sort(compararPreco)
    dataJson.reverse()
  } else if (ordem == "precoMenor") {
    dataJson.sort(compararPreco)
  } else if (ordem == "alfabetica_ZA") {
    dataJson.sort(compararNome)
    dataJson.reverse()
  } else {
    dataJson.sort(compararNome)
  }

  let produtos = ""
  dataJson.forEach(element => {

      let preco = String(element.preco)
      preco = preco.replace('.', ',')

      produtos +=   `<div class="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3 boxProduto">
                        <div class="boxProduto_sombra">
                          <div class="boxProduto_imagem" style="background-image: url('imagens/${element.imagem}');"></div>
                          <div class="boxProduto_nome" >${element.nome}</div>
                          <div class="boxProduto_preco">
                            R$ ${preco}
                            <div class="carrinho" onclick="adicionarItemCarrinho('${element.codigo}')"></div>
                          </div>
                        </div>
                      </div> `
  });
  
  return produtos

}


function carregarProdutosIniciar(ordem = "alfabetica"){

  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      let dataJson = JSON.parse(xhr.responseText);

      let produtos = listaProdutos(dataJson, ordem)
      document.getElementById('produtos').innerHTML =   produtos

      sessionStorage.setItem('produtos', JSON.stringify(dataJson))
    }
  };
  xhr.open('GET', 'produtos.json', true);
  xhr.send();


  
  if(sessionStorage.getItem('carrinho')){
    criarTopoCarrinhoCompras()
    adicionarItemAoCarrinhoHTML()
  }

}


function carregarProdutos(ordem = "alfabetica"){

  let dataJson  = sessionStorage.getItem("produtos");
  let dataJsonRecuperado = JSON.parse(dataJson)

  let produtos = listaProdutos(dataJsonRecuperado, ordem)
  document.getElementById('produtos').innerHTML =  produtos;

}



/*  carrinho ------------------------------------------ */

//iniciando array global para o carrinho
let arrayDeProdutosCarrinhoDeCompras = []

function finalizarSessao(){
  sessionStorage.removeItem('carrinho')
  let elementoTopo = document.getElementById("cxCarrinhoListaProdutosTopo");                    
  elementoTopo.innerHTML =  ""

  let elementoTopo2 = document.getElementById("carrinhoListaProdutos");                    
  elementoTopo2.innerHTML =  ""
  arrayDeProdutosCarrinhoDeCompras = []
}


function adicionarItemCarrinho(codigo){

  if(sessionStorage.getItem('carrinho')){
    arrayDeProdutosCarrinhoDeCompras = JSON.parse(sessionStorage.getItem('carrinho'))
    let produtoSelecionado = arrayDeProdutosCarrinhoDeCompras.indexOf( arrayDeProdutosCarrinhoDeCompras.find(item => item.codigo === codigo) )
    if(produtoSelecionado !== -1){

        arrayDeProdutosCarrinhoDeCompras[produtoSelecionado].quantidadeCarrinho++

    } else {

      // recupera produtos na sessao
      let dataJson  = sessionStorage.getItem("produtos");
      let dataJsonRecuperado = JSON.parse(dataJson)

      // busca produto na base
      let produtoSelecionado = dataJsonRecuperado.find(item => item.codigo === codigo)
      produtoSelecionado.quantidadeCarrinho = 1
    
      arrayDeProdutosCarrinhoDeCompras.push(produtoSelecionado)


    }

  } else {

    // recupera produtos na sessao
    let dataJson  = sessionStorage.getItem("produtos");
    let dataJsonRecuperado = JSON.parse(dataJson)

    // busca produto na base
    let produtoSelecionado = dataJsonRecuperado.find(item => item.codigo === codigo)
    produtoSelecionado.quantidadeCarrinho = 1
  
    arrayDeProdutosCarrinhoDeCompras.push(produtoSelecionado)

  }

  criarTopoCarrinhoCompras()

  sessionStorage.setItem('carrinho', JSON.stringify(arrayDeProdutosCarrinhoDeCompras))

  adicionarItemAoCarrinhoHTML()
}


//adicionar ao carrinho
function adicionarItemAoCarrinhoHTML(){ 

  let arrayDeProdutosCarrinhoDeCompras = JSON.parse(sessionStorage.getItem('carrinho'))

  let caixaCarrinhoDeCompras = ""
  let caixaCarrinhoDeComprasTotal = ""
  arrayDeProdutosCarrinhoDeCompras.forEach(function(item){
    let estruturaItem =  ` <div class="row item">
                              <div class="col-3 col-sm-2 col-md-2 col-lg-2 col-xl-2" ><div class="carrinhoImagem" style="background-image: url('imagens/${item.imagem}');"></div></div>
                              <div class="col-2          col-md-3 col-lg-4 col-xl-4 d-none d-md-block" >${item.nome}</div>
                              <div class="col-2 col-sm-2 col-md-2 col-lg-1 col-xl-1 offset-sm-2 offset-md-0   Quantidade"  > <a onclick="quantidadeCarrinho('${item.codigo}', '-')">- </a>${item.quantidadeCarrinho} <a onclick="quantidadeCarrinho('${item.codigo}', '+')">+</a></div>
                              <div class="col-3 col-sm-2 col-md-2 col-lg-2 col-xl-2" >R$ ${item.preco}</div>
                              <div class="col-3 col-sm-3 col-md-2 col-lg-2 col-xl-2" >R$ ${(item.quantidadeCarrinho * item.preco).toFixed(2)}</div>
                              <div class="col-1 col-sm-1 col-md-1 col-lg-1 col-xl-1" >
                                <div class="carrinhoExcluir" onclick="removerItemCarrinho('${item.codigo}')"></div>
                              </div>
                            </div>`
    
    caixaCarrinhoDeComprasTotal = Number(caixaCarrinhoDeComprasTotal) + Number(item.quantidadeCarrinho * item.preco)
    caixaCarrinhoDeCompras += estruturaItem
  })

  
  let estruturaItem =  ` <div class="row linhaTotal">
                          <div class="col-3 col-sm-3 col-md-2 col-lg-2 col-xl-2 offset-8 offset-sm-8 offset-md-9 offset-lg-9 offset-xl-9 " > R$ ${caixaCarrinhoDeComprasTotal.toFixed(2)}</div>
                          <div class="col-1 col-sm-1 col-md-1 col-lg-1 col-xl-1" >
                            <div class="carrinhoExcluirTodos" onclick="finalizarSessao()"></div>
                          </div>
                        </div>`
  caixaCarrinhoDeCompras = caixaCarrinhoDeCompras + estruturaItem

  let itensCarrinhoDeCompras = document.getElementById("carrinhoListaProdutos");                    
  itensCarrinhoDeCompras.innerHTML =   caixaCarrinhoDeCompras

}





function criarTopoCarrinhoCompras(){
  let topoCarrinho = `<div class="row" id="carrinhoListaProdutosTopo">
    <div class="col-5 col-sm-6 col-md-7 col-lg-7 col-xl-7" >Descrição</div>
    <div class="col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2" >Preço</div>
    <div class="col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2" >Subtotal</div>
    <div class="col-0 col-sm-0 col-md-1 col-lg-1 col-xl-1" ></div>
  </div>`

  let elementoTopo = document.getElementById("cxCarrinhoListaProdutosTopo");                    
  elementoTopo.innerHTML =  topoCarrinho
}



function removerItemCarrinho(codigo){
  
  arrayDeProdutosCarrinhoDeCompras = JSON.parse(sessionStorage.getItem('carrinho'))

  let produtoSelecionado = arrayDeProdutosCarrinhoDeCompras.indexOf( arrayDeProdutosCarrinhoDeCompras.find(item => item.codigo === codigo) )
  if(produtoSelecionado !== -1){

    arrayDeProdutosCarrinhoDeCompras.splice(produtoSelecionado,1)
    
    if(arrayDeProdutosCarrinhoDeCompras.length != 0 ){
      sessionStorage.setItem('carrinho', JSON.stringify(arrayDeProdutosCarrinhoDeCompras))
      adicionarItemAoCarrinhoHTML()
    } else {
      finalizarSessao()
    }
    
  }
}


function quantidadeCarrinho(codigo, operacao){

  if(sessionStorage.getItem('carrinho')){
    arrayDeProdutosCarrinhoDeCompras = JSON.parse(sessionStorage.getItem('carrinho'))
    let produtoSelecionado = arrayDeProdutosCarrinhoDeCompras.indexOf( arrayDeProdutosCarrinhoDeCompras.find(item => item.codigo === codigo) )
    if(produtoSelecionado !== -1){

      if(operacao== '+'){
        arrayDeProdutosCarrinhoDeCompras[produtoSelecionado].quantidadeCarrinho++
      } else {
        if(arrayDeProdutosCarrinhoDeCompras[produtoSelecionado].quantidadeCarrinho > 1){
        arrayDeProdutosCarrinhoDeCompras[produtoSelecionado].quantidadeCarrinho--
        } else {
          removerItemCarrinho(codigo)
        }
      }
      sessionStorage.setItem('carrinho', JSON.stringify(arrayDeProdutosCarrinhoDeCompras))
      adicionarItemAoCarrinhoHTML()

    } 
  }
}
