// Seleção de elementos
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const itemsList = document.getElementById('items-list');
const emptyMsg = document.getElementById('empty-msg');
const dateText = document.getElementById('date-text');

// Exibir data
const now = new Date();
dateText.innerText = now.toLocaleDateString('pt-br', { weekday: 'long', day: 'numeric', month: 'short' });

// Estado da aplicação (carrega do LocalStorage)
let shoppingList = JSON.parse(localStorage.getItem('my_premium_list')) || [];

// Salvar no navegador
function saveToStorage() {
    localStorage.setItem('my_premium_list', JSON.stringify(shoppingList));
    render();
}

// Renderizar a lista na tela
function render() {
    itemsList.innerHTML = '';
    
    if (shoppingList.length === 0) {
        emptyMsg.style.display = 'block';
    } else {
        emptyMsg.style.display = 'none';
        
        shoppingList.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = `item-row ${item.done ? 'done' : ''}`;
            li.setAttribute('data-index', index);
            
            li.innerHTML = `
                <div class="check-box js-check"></div>
                <span class="item-name js-check">${item.text}</span>
                <button class="btn-delete js-delete">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            `;
            itemsList.appendChild(li);
        });
    }
}

// Evento: Adicionar item
todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = todoInput.value.trim();
    
    if (text !== '') {
        shoppingList.unshift({ text: text, done: false });
        todoInput.value = '';
        saveToStorage();
    }
});

// Evento: Clique na Lista (Check ou Delete) - Delegação de Eventos
itemsList.addEventListener('click', (e) => {
    const target = e.target;
    const parent = target.closest('.item-row');
    if (!parent) return;
    
    const index = parent.getAttribute('data-index');

    // Se clicou na caixa de check ou no nome do item
    if (target.classList.contains('js-check')) {
        shoppingList[index].done = !shoppingList[index].done;
        
        // Mover para o final se estiver pronto
        if (shoppingList[index].done) {
            const item = shoppingList.splice(index, 1)[0];
            shoppingList.push(item);
        }
        saveToStorage();
    }

    // Se clicou no botão de deletar
    if (target.closest('.js-delete')) {
        shoppingList.splice(index, 1);
        saveToStorage();
    }
});

// Inicialização
render();
