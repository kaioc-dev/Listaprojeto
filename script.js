// 1. Pegar os elementos da tela
const input = document.getElementById('item-input');
const btnAdd = document.getElementById('add-btn');
const listaUl = document.getElementById('shopping-list-ul');
const btnLimpar = document.getElementById('clear-all');
const dataTxt = document.getElementById('current-date');

// 2. Mostrar a data de hoje
const hoje = new Date();
dataTxt.innerText = hoje.toLocaleDateString('pt-br', { weekday: 'long', day: 'numeric' });

// 3. Banco de dados (carrega do celular ou começa vazio)
let itens = JSON.parse(localStorage.getItem('lista_v5')) || [];

// 4. Função para desenhar a lista (RENDERIZAR)
function atualizarTela() {
    listaUl.innerHTML = '';
    
    itens.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = `list-item ${item.comprado ? 'bought' : ''}`;
        
        li.innerHTML = `
            <span class="item-num">${index + 1}.</span>
            <div class="check-box" onclick="marcarItem(${index})"></div>
            <span class="item-text" onclick="marcarItem(${index})">${item.nome}</span>
            <button class="delete-btn" onclick="deletarItem(${index})">✕</button>
        `;
        
        listaUl.appendChild(li);
    });

    localStorage.setItem('lista_v5', JSON.stringify(itens));
}

// 5. FUNÇÃO PRINCIPAL: ADICIONAR ITEM
function adicionarNovoItem() {
    const nomeItem = input.value.trim();
    
    if (nomeItem !== "") {
        // Adiciona no topo da lista
        itens.unshift({ nome: nomeItem, comprado: false });
        input.value = ""; // Limpa o campo
        input.focus();    // Volta o cursor para o campo
        atualizarTela();  // Desenha a lista de novo
    } else {
        alert("Digite o nome de um produto!");
    }
}

// 6. Funções de marcar e deletar
window.marcarItem = (index) => {
    itens[index].comprado = !itens[index].comprado;
    atualizarTela();
};

window.deletarItem = (index) => {
    itens.splice(index, 1);
    atualizarTela();
};

// 7. Função de limpar tudo
btnLimpar.onclick = () => {
    if (confirm("Apagar toda a lista?")) {
        itens = [];
        atualizarTela();
    }
};

// 8. EVENTOS (O que faz o botão funcionar)
btnAdd.onclick = adicionarNovoItem; // Clique no botão +

input.onkeypress = (e) => {         // Tecla Enter
    if (e.key === 'Enter') {
        adicionarNovoItem();
    }
};

// Inicia a lista quando abre o app
atualizarTela();
