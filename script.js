const form = document.getElementById('input-group');
const input = document.getElementById('item-input');
const listUl = document.getElementById('shopping-list-ul');
const clearAllBtn = document.getElementById('clear-all');
const dateLabel = document.getElementById('current-date');

// Exibe a data de hoje
const hoje = new Date();
dateLabel.innerText = hoje.toLocaleDateString('pt-pt', { weekday: 'long', day: 'numeric', month: 'short' });

// Estado da Lista (LocalStorage)
let items = JSON.parse(localStorage.getItem('smartlist_vfinal')) || [];

function render() {
    listUl.innerHTML = '';
    
    items.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = `list-item ${item.bought ? 'bought' : ''}`;
        
        // Estrutura solicitada: [Número] [Caixa] [Texto] [Remover]
        li.innerHTML = `
            <span class="item-num">${index + 1}.</span>
            <div class="check-box" onclick="toggleItem(${index})"></div>
            <span class="item-text" onclick="toggleItem(${index})">${item.name}</span>
            <button class="delete-btn" onclick="deleteItem(${index})">✕</button>
        `;
        
        listUl.appendChild(li);
    });

    localStorage.setItem('smartlist_vfinal', JSON.stringify(items));
}

// Adicionar Novo Item
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = input.value.trim();
    if (val) {
        items.unshift({ name: val, bought: false });
        input.value = '';
        render();
    }
});

// Marcar/Desmarcar como Comprado
window.toggleItem = (index) => {
    items[index].bought = !items[index].bought;
    
    // Pequena lógica de organização: ao marcar, vai para o fim da lista
    if (items[index].bought) {
        const itemMoved = items.splice(index, 1)[0];
        items.push(itemMoved);
    } else {
        const itemMoved = items.splice(index, 1)[0];
        items.unshift(itemMoved);
    }
    
    render();
};

// Eliminar Item Único
window.deleteItem = (index) => {
    items.splice(index, 1);
    render();
};

// Limpar Tudo
clearAllBtn.onclick = () => {
    if (confirm("Desejas apagar todos os itens da lista?")) {
        items = [];
        render();
    }
};

// Inicializar a lista
render();
