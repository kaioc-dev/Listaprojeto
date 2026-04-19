const input = document.getElementById('item-input');
const addBtn = document.getElementById('add-btn');
const listUl = document.getElementById('shopping-list');
const clearAllBtn = document.getElementById('clear-all');

// Carregar itens salvos ou começar lista vazia
let items = JSON.parse(localStorage.getItem('minha_lista_compras')) || [];

// Função para desenhar a lista na tela
function render() {
    listUl.innerHTML = '';
    
    items.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = `item ${item.bought ? 'bought' : ''}`;
        
        li.innerHTML = `
            <div class="check-btn" onclick="toggleItem(${index})"></div>
            <span class="item-name" onclick="toggleItem(${index})">${item.name}</span>
            <button class="delete-btn" onclick="deleteItem(${index})">✕</button>
        `;
        
        listUl.appendChild(li);
    });

    // Salvar no navegador
    localStorage.setItem('minha_lista_compras', JSON.stringify(items));
}

// Função: Adicionar Item
function addItem() {
    const text = input.value.trim();
    if (text !== "") {
        items.unshift({ name: text, bought: false });
        input.value = '';
        render();
    }
}

// Função: Marcar como Comprado
window.toggleItem = (index) => {
    items[index].bought = !items[index].bought;
    render();
};

// Função: Deletar Item Único
window.deleteItem = (index) => {
    items.splice(index, 1);
    render();
};

// Função: Limpar Toda a Lista
clearAllBtn.onclick = () => {
    if (confirm("Deseja limpar toda a lista?")) {
        items = [];
        render();
    }
};

// Escutar o botão de adicionar e a tecla Enter
addBtn.onclick = addItem;
input.onkeypress = (e) => {
    if (e.key === 'Enter') addItem();
};

// Iniciar a lista ao abrir a página
render();
