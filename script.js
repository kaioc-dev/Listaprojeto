// Seletores de Elementos
const input = document.getElementById('main-input');
const addBtn = document.getElementById('add-button');
const listRender = document.getElementById('list-render');
const totalBadge = document.getElementById('total-badge');
const emptyState = document.getElementById('empty-state');

// Banco de Dados Local
let shoppingItems = JSON.parse(localStorage.getItem('smartlist_data')) || [];

// Função para atualizar tudo
const updateUI = () => {
    localStorage.setItem('smartlist_data', JSON.stringify(shoppingItems));
    
    // Limpar lista atual
    listRender.innerHTML = '';
    
    // Verificar se está vazio
    if (shoppingItems.length === 0) {
        emptyState.style.display = 'block';
        totalBadge.innerText = '0';
    } else {
        emptyState.style.display = 'none';
        totalBadge.innerText = shoppingItems.length;
        
        // Renderizar itens
        shoppingItems.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = `item ${item.checked ? 'checked' : ''}`;
            
            li.innerHTML = `
                <div class="check-box" onclick="toggleItem(${index})"></div>
                <span class="item-name" onclick="toggleItem(${index})">${item.name}</span>
                <button class="delete-btn" onclick="removeItem(${index})">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            `;
            listRender.appendChild(li);
        });
    }
};

// Adicionar Item
const addItem = () => {
    const value = input.value.trim();
    if (value) {
        shoppingItems.unshift({ name: value, checked: false });
        input.value = '';
        updateUI();
        if (navigator.vibrate) navigator.vibrate(10);
    }
};

// Alternar Check
window.toggleItem = (index) => {
    shoppingItems[index].checked = !shoppingItems[index].checked;
    
    // Sort automático: Mandar checados para o fim após animação
    setTimeout(() => {
        shoppingItems.sort((a, b) => a.checked - b.checked);
        updateUI();
    }, 200);
};

// Remover Item
window.removeItem = (index) => {
    shoppingItems.splice(index, 1);
    updateUI();
};

// Eventos de Teclado e Clique
addBtn.addEventListener('click', addItem);
input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addItem();
});

// Inicialização
updateUI();
