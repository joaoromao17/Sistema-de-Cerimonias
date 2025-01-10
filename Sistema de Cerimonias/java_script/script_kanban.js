//seleciona todas as colunas
const columns = document.querySelectorAll(".column");

//criação de evento quando o cartão é segurado
document.addEventListener("dragstart", (e)=>{
    e.target.classList.add("dragging");
});

//criação de evento quando o cartão é soltado
document.addEventListener("dragend", (e)=>{
    e.target.classList.remove("dragging");
});

//verificação da posição dos cartões em relação às colunas, para a inserção deles
columns.forEach((item)=>{
    item.addEventListener("dragover", (e)=>{
        const dragging = document.querySelector(".dragging");
        const applyAfter = getNewPosition(item, e.clientY);

        if (applyAfter){
            applyAfter.insertAdjacentElement("afterend", dragging);
        }else{
            item.prepend(dragging);
        }
    }) 
})

function getNewPosition(column, posY){
    const cards = column.querySelectorAll(".item:not(.dragging)");
    let result;

    for (let refer_card of cards){
        const box = refer_card.getBoundingClientRect();
        const boxCenterY = box.y + box.height / 2;

        if (posY >= boxCenterY) result = refer_card;
    }

    return result;
}

// =====================================================================
//pega as informações do botão de "adicionar cartão"
var btnElement = document.querySelector('button.botao');
btnElement.addEventListener("click", criarCartao);

// função para criar os cartões sempre que o botão de "adicionar cartão" é acionado
function criarCartao() {
    //criação dos elementos
    var newDiv = document.createElement('div');
    var newText = document.createElement('textarea');
    var newDiv2 = document.createElement('div');
    var newButton = document.createElement('button');
    var newI = document.createElement('i');
    var newButton2 = document.createElement('button');
    var newI2 = document.createElement('i');

    //atributos div1
    newDiv.className = "item";
    newDiv.draggable = "true";
    
    //atributos div2
    newDiv2.className = "btns-card";

    //atributos textarea
    newText.className = "texto_card";
    newText.cols = "1";
    newText.rows = "2";

    //atributos button1
    newButton.className = "like";
    newButton.type = "button";
    newButton.innerHTML = "0";
    newButton.setAttribute("data-contador", 0);
    newButton.setAttribute("data-liked", "false");
    //função rodada quando o botão é clicado
    newButton.addEventListener("click", function(){
        var liked = newButton.getAttribute("data-liked") === "true";
        var contadorAtual = parseInt(newButton.getAttribute("data-contador"));

        if (liked){
            //remover "like"
            newButton.setAttribute("data-contador", contadorAtual - 1);
            newButton.innerHTML = newButton.getAttribute("data-contador");
        }else{
            //adicionar "like"
            newButton.setAttribute("data-contador", contadorAtual + 1);
            newButton.innerHTML = newButton.getAttribute("data-contador");
        }
        newButton.setAttribute("data-liked", (!liked).toString());
        newButton.appendChild(newI);
    });

    //atributos icone1
    newI.className = "fa fa-thumbs-o-up";

    //atributos button2
    newButton2.className = "apagar";
    newButton2.type = "button";
    //função rodada quando o botão é clicado
    newButton2.addEventListener("click", function(){
        newDiv.remove();
    });

    //atributos icone2
    newI2.className = "fa fa-trash-o";

    //heranças
    newDiv.appendChild(newText);
    newDiv.appendChild(newDiv2);
    newDiv2.appendChild(newButton);
    newButton.appendChild(newI);
    newDiv2.appendChild(newButton2);
    newButton2.appendChild(newI2);

    //adicionando div principal no arquivo
    document.querySelector('#espera').appendChild(newDiv);
}

// função para salvar as informações no local storage da ultima interação
function salvarNoLocalStorage(){
    //pega todos os cartões da interação atual
    var cartoes = document.querySelectorAll("div.item");

    //lista de dados para salvar posteriormente
    var dados = [];

    //repetição do código abaixo para cada cartão da interação atual
    cartoes.forEach(function(cartao){
        //informações necessárias de cada cartão em um padrão JSON
        //===============================================================================
        var cartaoInfo = {
            pai: cartao.parentNode.getAttribute("id"),
            filhos: [
                {text_area: cartao.childNodes[0].value},
                {filhos: [
                    {likes: cartao.childNodes[1].childNodes[0].getAttribute("data-contador"),
                    deuLike: cartao.childNodes[1].childNodes[0].getAttribute("data-liked")}
                ]}
            ]
        };
        //===============================================================================
        //coloca esses dados na lista criada inicialmente
        dados.push(cartaoInfo);
    });

    //pega todos os títulos das colunas
    var titles = document.querySelectorAll("textarea.texto_titulo");

    //lista de dados para salvar posteriormente
    var dataTitles = [];

    //repetição do código abaixo para cada titulo de cada coluna
    titles.forEach(function(title){
        //informações necessárias de cada título em um padrão JSON
        //=================================
        var titleInfo = {
            text_area: title.value,
            id: title.id
        };
        //=================================
        //coloca esses dados na lista criada anteriormente
        dataTitles.push(titleInfo);
    });

    //salvar informações no localstorage
    localStorage.setItem("dadosDosCartoes", JSON.stringify(dados));
    localStorage.setItem("dadosDosTitles", JSON.stringify(dataTitles));

    //ativa animação de carregamento
    abrirLoad();
}

// função para trazer as informações salvas no local storage da ultima interação
function carregarDoLocalStorage(){
    //pega os dados dos cartões e dos títulos lá do localstorage
    //===========================================================
    var dadosArmazenados = localStorage.getItem("dadosDosCartoes");
    var titlesArmazenados = localStorage.getItem("dadosDosTitles");
    //===========================================================

    //só roda o código abaixo se tiver informações nos títulos das colunas
    if(titlesArmazenados){
        // pegar as informações de todos os títulos das colunas da sessão anterior
        var dataTitles = JSON.parse(titlesArmazenados);
        
        //insere as informações nas colunas da nova página recarregada
        dataTitles.forEach(function(textoTitulos){
            document.querySelector('#'+textoTitulos.id).value = textoTitulos.text_area;
        });
    }

    //só roda o código abaixo se existirem cartões salvos da última sessão
    if(dadosArmazenados){
        // pegar as informações de todos os cartões da sessão anterior
        var dados = JSON.parse(dadosArmazenados);

        // repete o código interno para cada cartão que existia anteriomente
        dados.forEach(function(cartaoInfo){
            //criação dos elementos
            var newDiv = document.createElement('div');
            var newText = document.createElement('textarea');
            var newDiv2 = document.createElement('div');
            var newButton = document.createElement('button');
            var newI = document.createElement('i');
            var newButton2 = document.createElement('button');
            var newI2 = document.createElement('i');
            var pai = cartaoInfo.pai;
            
            //atributos div1
            newDiv.className = "item";
            newDiv.draggable = "true";
            
            //atributos div2
            newDiv2.className = "btns-card";
            
            //atributos textarea
            newText.className = "texto_card";
            newText.cols = "1";
            newText.rows = "2";
            newText.innerHTML = cartaoInfo.filhos[0].text_area;
            
            //atributos button1
            newButton.className = "like";
            newButton.type = "button";
            newButton.innerHTML = cartaoInfo.filhos[1].filhos[0].likes;
            newButton.setAttribute("data-contador", parseInt(cartaoInfo.filhos[1].filhos[0].likes));
            newButton.setAttribute("data-liked", cartaoInfo.filhos[1].filhos[0].deuLike);
            //função rodada quando o botão é clicado
            newButton.addEventListener("click", function(){
                var liked = newButton.getAttribute("data-liked") === "true";
                var contadorAtual = parseInt(newButton.getAttribute("data-contador"));

                if (liked){
                    //remover "like"
                    newButton.setAttribute("data-contador", contadorAtual - 1);
                    newButton.innerHTML = newButton.getAttribute("data-contador");
                }else{
                    //adicionar "like"
                    newButton.setAttribute("data-contador", contadorAtual + 1);
                    newButton.innerHTML = newButton.getAttribute("data-contador");
                }
                newButton.setAttribute("data-liked", (!liked).toString());
                newButton.appendChild(newI);
            });
            
            //atributos icone1
            newI.className = "fa fa-thumbs-o-up";

            //atributos button2
            newButton2.className = "apagar";
            newButton2.type = "button";
            //função rodada quando o botão é clicado
            newButton2.addEventListener("click", function(){
                newDiv.remove();
            });
            
            //atributos icone2
            newI2.className = "fa fa-trash-o";
            
            //heranças
            newDiv.appendChild(newText);
            newDiv.appendChild(newDiv2);
            newDiv2.appendChild(newButton);
            newButton.appendChild(newI);
            newDiv2.appendChild(newButton2);
            newButton2.appendChild(newI2);
            
            //adicionando div principal na coluna que já estava
            document.querySelector('#'+pai).appendChild(newDiv);
        });
    }
}
// funções do botão de salvar que ativa o load
//===========================================================
function abrirLoad(){
    document.querySelector(".loader").style.display = 'block';
    setTimeout(abrirCheck, 1000);
}
function abrirCheck(){
    document.querySelector(".loader").style.display = 'none';
    document.querySelector(".check").style.display = 'block';
    setTimeout(fecharTudo, 2000);
}
function fecharTudo(){
    document.querySelector(".check").style.display = 'none';
}
//===========================================================

//função para salvar imagem da tela
function salvarTela() {
    window.print();
}

//função do botão de limpar as informações do quadro
function limparDados(){
    localStorage.clear();
    location.reload();
}

// aviso peguntando se quer recarregar a página
//====================================================

// Cria uma variável para guardar o estado de salvamento
var paginaSalva = false;

// Seleciona o botão pelo seu id
var btn_verifica = document.querySelector(".salvar");

// Adiciona um evento de clique ao botão de salvar
btn_verifica.addEventListener("click", function() {
    // Muda o estado de salvamento para verdadeiro
    paginaSalva = true;
    setTimeout(atualizar_pag, 2000);
});
function atualizar_pag(){
    location.reload();
}
// Cria uma função para verificar o estado de salvamento
function verificarSalvamento() {
    // Se a página não foi salva
    if (!paginaSalva) {
        // Retorna uma string que é mostrada ao usuário
        return "Você tem certeza que quer sair da página sem salvar?";
    }
}

// Atribui a função de verificar o salvamento ao evento beforeunload
window.onbeforeunload = verificarSalvamento;

//====================================================

// carrega as informações sempre que o site carrega
carregarDoLocalStorage();