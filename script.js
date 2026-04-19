const form = document.getElementById('input-form');
const input = document.getElementById('todo-input');
const listElement = document.getElementById('main-list');
const clearBtn = document.getElementById('clear-btn');

// Carrega dados ou inicia vazio
let items = JSON.parse(localStorage.getItem('smartlist_data_v3')) || [];

function render() {
    listElement.innerHTML = '';
    
    items.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = `item-row ${item.done ? 'done' : ''}`;
        
        // Estrutura: Número | Caixa | Texto | Deletar
        li.innerHTML = `
            <span class="item-number">${index + 1}.</span>
            <div class="check-box" onclick="toggleItem(${index})"></div>
            <span class="item-text" onclick="toggleItem(${index})">${item.name}</span>
            <button class="delete-btn" onclick="deleteItem(${index})">✕</button>
        `;
        
        listElement.appendChild(li);
    });

    localStorage.setItem('smartlist_data_v3', JSON.stringify(items));
}

// Adicionar Item
form.onsubmit = (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (text) {
        items.unshift({ name: text, done: false });
        input.value = '';
        render();
    }
};

// Marcar/Desmarcar
window.toggleItem = (index) => {
    items[index].done = !items[index].done;
    
    // Opcional: Reordenar (comprados vão para o fim)
    if (items[index].done) {
        const item = items.splice(index, 1)[0];
        items.push(item);
    } else {
        const item = items.splice(index, 1)[0];
        items.unshift(item);
    }
    
    render();
};

// Deletar Único
window.deleteItem = (index) => {
    items.splice(index, 1);
    render();
};

// Limpar Tudo
clearBtn.onclick = () => {
    if (confirm("Limpar toda a lista?")) {
        items = [];
        render();
    }
};

// Inicializar
render();
