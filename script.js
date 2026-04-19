const input = document.getElementById('item-input');
const addBtn = document.getElementById('add-btn');
const listElement = document.getElementById('shopping-list');
const itemCount = document.getElementById('item-count');
const emptyState = document.getElementById('empty-state');

let items = JSON.parse(localStorage.getItem('clean_list_db')) || [];

const updateLocalStorage = () => {
    localStorage.setItem('clean_list_db', JSON.stringify(items));
};

const render = () => {
    listElement.innerHTML = '';
    
    if (items.length === 0) {
        emptyState.style.display = 'block';
        itemCount.innerText = '0 itens';
    } else {
        emptyState.style.display = 'none';
        itemCount.innerText = `${items.length} ${items.length === 1 ? 'item' : 'itens'}`;
        
        items.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = `item-node ${item.checked ? 'checked' : ''}`;
            
            li.innerHTML = `
                <div class="checkbox-custom" onclick="toggleItem(${index})">
                    ${item.checked ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>' : ''}
                </div>
                <span class="item-text" onclick="toggleItem(${index})">${item.text}</span>
                <div class="delete-action" onclick="deleteItem(${index})">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </div>
            `;
            listElement.appendChild(li);
        });
    }
};

const addItem = () => {
    const text = input.value.trim();
    if (text) {
        items.unshift({ text, checked: false }); // Adiciona no topo
        input.value = '';
        updateLocalStorage();
        render();
    }
};

window.toggleItem = (index) => {
    items[index].checked = !items[index].checked;
    updateLocalStorage();
    render();
};

window.deleteItem = (index) => {
    items.splice(index, 1);
    updateLocalStorage();
    render();
};

addBtn.addEventListener('click', addItem);
input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addItem();
});

// Inicializar
render();
