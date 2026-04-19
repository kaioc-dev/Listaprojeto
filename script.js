const input = document.getElementById('item-input');
const addBtn = document.getElementById('add-btn');
const listElement = document.getElementById('shopping-list');
const itemCount = document.getElementById('item-count');
const emptyState = document.getElementById('empty-state');

// Carregar dados salvos
let items = JSON.parse(localStorage.getItem('premium_list_db')) || [];

const save = () => {
    localStorage.setItem('premium_list_db', JSON.stringify(items));
};

const render = () => {
    listElement.innerHTML = '';
    
    // Atualizar contador e estado vazio
    itemCount.innerText = items.length;
    emptyState.style.display = items.length === 0 ? 'block' : 'none';

    items.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = `item-node ${item.checked ? 'checked' : ''}`;
        
        li.innerHTML = `
            <div class="check-wrapper">
                <input type="checkbox" ${item.checked ? 'checked' : ''} onchange="toggleItem(${index})">
                <span class="checkmark"></span>
            </div>
            <span class="item-text">${item.name}</span>
            <button class="delete-btn" onclick="deleteItem(${index})" aria-label="Excluir">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
        `;
        listElement.appendChild(li);
    });
};

const addItem = () => {
    const name = input.value.trim();
    if (name) {
        // Adiciona novo item ao início da lista
        items.unshift({ name, checked: false });
        input.value = '';
        save();
        render();
        
        // Pequeno feedback tátil no botão (se disponível)
        if (window.navigator.vibrate) window.navigator.vibrate(10);
    }
};

window.toggleItem = (index) => {
    items[index].checked = !items[index].checked;
    
    // Sort automático: itens comprados vão para o final
    setTimeout(() => {
        items.sort((a, b) => a.checked - b.checked);
        save();
        render();
    }, 300); // Pequeno delay para o usuário ver o check antes de mover
};

window.deleteItem = (index) => {
    // Adicionar efeito de saída antes de remover (opcional)
    items.splice(index, 1);
    save();
    render();
};

addBtn.addEventListener('click', addItem);
input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addItem();
});

// Inicializar app
render();
