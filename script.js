const input = document.getElementById('item-input');
const addBtn = document.getElementById('add-btn');
const list = document.getElementById('shopping-list');
const emptyView = document.getElementById('empty-view');
const dateEl = document.getElementById('date-display');

// Exibir data atual formatada
const options = { weekday: 'long', day: 'numeric', month: 'long' };
dateEl.innerText = new Intl.DateTimeFormat('pt-BR', options).format(new Date());

// Banco de dados LocalStorage
let items = JSON.parse(localStorage.getItem('smartlist_v2')) || [];

function save() {
    localStorage.setItem('smartlist_v2', JSON.stringify(items));
    render();
}

function render() {
    list.innerHTML = '';
    
    if (items.length === 0) {
        emptyView.style.display = 'block';
    } else {
        emptyView.style.display = 'none';
        
        items.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = `item-card ${item.checked ? 'checked' : ''}`;
            
            li.innerHTML = `
                <div class="check-container" onclick="toggleItem(${index})"></div>
                <span class="item-text" onclick="toggleItem(${index})">${item.name}</span>
                <button class="delete-btn" onclick="deleteItem(${index})">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            `;
            list.appendChild(li);
        });
    }
}

function addItem() {
    const val = input.value.trim();
    if (val) {
        items.unshift({ name: val, checked: false });
        input.value = '';
        save();
        input.focus();
    }
}

window.toggleItem = (index) => {
    items[index].checked = !items[index].checked;
    
    // Organiza: marcados vão para o fim após um breve delay
    if (items[index].checked) {
        setTimeout(() => {
            const movedItem = items.splice(index, 1)[0];
            items.push(movedItem);
            save();
        }, 400);
    } else {
        save();
    }
};

window.deleteItem = (index) => {
    items.splice(index, 1);
    save();
};

// Eventos
addBtn.addEventListener('click', addItem);
input.addEventListener('keypress', (e) => { if (e.key === 'Enter') addItem(); });

// Init
render();
