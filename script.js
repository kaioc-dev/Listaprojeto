// Banco de Dados Principal
let storageData = JSON.parse(localStorage.getItem('smartlist_v8')) || {
    lists: []
};

let currentListId = null;

// Elementos
const homeScreen = document.getElementById('home-screen');
const listDetailScreen = document.getElementById('list-detail-screen');
const listsGrid = document.getElementById('lists-grid');
const shoppingListUl = document.getElementById('shopping-list-ul');
const listTitleDisp = document.getElementById('current-list-title');

// --- NAVEGAÇÃO ---

function showHome() {
    homeScreen.style.display = 'block';
    listDetailScreen.style.display = 'none';
    renderHome();
}

function showList(listId) {
    currentListId = listId;
    const list = storageData.lists.find(l => l.id === listId);
    listTitleDisp.innerText = list.name;
    homeScreen.style.display = 'none';
    listDetailScreen.style.display = 'block';
    renderItems();
}

// --- LOGICA DA HOME ---

function renderHome() {
    listsGrid.innerHTML = '';
    if (storageData.lists.length === 0) {
        listsGrid.innerHTML = '<p style="text-align:center; color: #555; padding: 20px;">Nenhuma lista criada.</p>';
        return;
    }

    storageData.lists.forEach(list => {
        const card = document.createElement('div');
        card.className = 'list-card';
        card.onclick = () => showList(list.id);
        card.innerHTML = `
            <div>
                <h3>${list.name}</h3>
                <p>${list.items.length} itens cadastrados</p>
            </div>
            <i class="fas fa-chevron-right" style="color: var(--primary)"></i>
        `;
        listsGrid.appendChild(card);
    });
}

document.getElementById('create-list-btn').onclick = () => {
    const name = prompt("Nome da nova lista:");
    if (name) {
        const newList = {
            id: Date.now(),
            name: name,
            items: []
        };
        storageData.lists.push(newList);
        saveToStorage();
        showList(newList.id);
    }
};

// --- LOGICA DA LISTA INTERNA ---

function renderItems() {
    const list = storageData.lists.find(l => l.id === currentListId);
    shoppingListUl.innerHTML = '';
    
    list.items.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = `list-item ${item.bought ? 'bought' : ''}`;
        li.innerHTML = `
            <div class="check-box" onclick="toggleItem(${index})"></div>
            <div class="item-content" onclick="toggleItem(${index})">
                <span class="item-text">${item.name}</span>
                <br><small style="color: var(--primary)">${item.date || ''}</small>
            </div>
            <button class="btn-icon" onclick="deleteItem(${index})" style="color: var(--danger)">✕</button>
        `;
        shoppingListUl.appendChild(li);
    });
}

document.getElementById('add-btn').onclick = () => {
    const input = document.getElementById('item-input');
    const dateInput = document.getElementById('date-input');
    if (input.value.trim() === "") return;

    const list = storageData.lists.find(l => l.id === currentListId);
    list.items.unshift({
        name: input.value,
        date: dateInput.value,
        bought: false
    });
    
    input.value = "";
    renderItems();
};

window.toggleItem = (index) => {
    const list = storageData.lists.find(l => l.id === currentListId);
    list.items[index].bought = !list.items[index].bought;
    renderItems();
};

window.deleteItem = (index) => {
    const list = storageData.lists.find(l => l.id === currentListId);
    list.items.splice(index, 1);
    renderItems();
};

document.getElementById('save-btn').onclick = () => {
    saveToStorage();
    alert("Progresso salvo com sucesso!");
};

document.getElementById('back-btn').onclick = showHome;

document.getElementById('clear-all').onclick = () => {
    if (confirm("Remover esta lista permanentemente?")) {
        storageData.lists = storageData.lists.filter(l => l.id !== currentListId);
        saveToStorage();
        showHome();
    }
};

function saveToStorage() {
    localStorage.setItem('smartlist_v8', JSON.stringify(storageData));
}

// Compartilhar WhatsApp
document.getElementById('share-btn').onclick = () => {
    const list = storageData.lists.find(l => l.id === currentListId);
    let msg = `*${list.name}*\n\n`;
    list.items.forEach(i => {
        if (!i.bought) msg += `• ${i.name} ${i.date ? '('+i.date+')' : ''}\n`;
    });
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`);
};

// Início
showHome();
