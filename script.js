// Banco de Dados Principal
let storageData = JSON.parse(localStorage.getItem('smartlist_v9')) || {
    lists: []
};

let currentListId = null;

// Elementos Principais
const homeScreen = document.getElementById('home-screen');
const listDetailScreen = document.getElementById('list-detail-screen');
const listsGrid = document.getElementById('lists-grid');
const shoppingListUl = document.getElementById('shopping-list-ul');
const listTitleDisp = document.getElementById('current-list-title');

// Mostrar a data de hoje (para a tela interna)
const hoje = new Date();
document.getElementById('current-date').innerText = hoje.toLocaleDateString('pt-br', { day: 'numeric', month: 'short' });

// --- NAVEGAÇÃO ---
function showHome() {
    homeScreen.style.display = 'block';
    listDetailScreen.style.display = 'none';
    renderHome();
}

function showList(listId) {
    currentListId = listId;
    const list = storageData.lists.find(l => l.id === listId);
    if(list) {
        listTitleDisp.innerText = list.name;
        homeScreen.style.display = 'none';
        listDetailScreen.style.display = 'block';
        renderItems();
    }
}

// --- LÓGICA DA HOME ---
function renderHome() {
    listsGrid.innerHTML = '';
    if (storageData.lists.length === 0) {
        listsGrid.innerHTML = `
            <div style="text-align:center; padding: 40px 20px; color: var(--border);">
                <i class="fas fa-ghost" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.5;"></i>
                <p>Nenhum registro encontrado. Inicie uma nova lista.</p>
            </div>
        `;
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

// FIX: Botão Criar Lista com EventListener seguro
const createListBtn = document.getElementById('create-list-btn');
if (createListBtn) {
    createListBtn.addEventListener('click', () => {
        const name = prompt("Defina um nome para sua lista:");
        
        if (name && name.trim() !== "") {
            const newList = {
                id: Date.now(), // Gera um ID único baseado na data
                name: name.trim(),
                items: []
            };
            storageData.lists.push(newList);
            saveToStorage();
            showList(newList.id);
        }
    });
}

// --- LÓGICA DA LISTA INTERNA ---
function renderItems() {
    const list = storageData.lists.find(l => l.id === currentListId);
    shoppingListUl.innerHTML = '';
    
    list.items.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = `list-item ${item.bought ? 'bought' : ''}`;
        
        // Formata a data se existir
        let dataStr = '';
        if (item.date) {
            const p = item.date.split('-');
            dataStr = `<br><small style="color: var(--primary); font-size: 0.75rem;">📅 ${p[2]}/${p[1]}</small>`;
        }

        li.innerHTML = `
            <div class="check-box" onclick="toggleItem(${index})"></div>
            <div class="item-content" onclick="toggleItem(${index})">
                <span class="item-text">${item.name}</span>
                ${dataStr}
            </div>
            <button class="btn-icon" onclick="deleteItem(${index})" style="color: var(--danger)"><i class="fas fa-times"></i></button>
        `;
        shoppingListUl.appendChild(li);
    });
}

// Adicionar Item
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
    dateInput.value = "";
    input.focus();
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

// Botão Salvar Premium
document.getElementById('save-btn').onclick = () => {
    saveToStorage();
    
    // Efeito visual no botão para confirmar salvamento
    const btnText = document.querySelector('.btn-save-premium .btn-text');
    const textoOriginal = btnText.innerText;
    btnText.innerText = "✓ SALVO";
    setTimeout(() => {
        btnText.innerText = textoOriginal;
    }, 2000);
};

document.getElementById('back-btn').onclick = () => {
    saveToStorage(); // Auto-salva ao voltar
    showHome();
};

document.getElementById('clear-all').onclick = () => {
    if (confirm("Deseja apagar esta lista inteira do sistema?")) {
        storageData.lists = storageData.lists.filter(l => l.id !== currentListId);
        saveToStorage();
        showHome();
    }
};

function saveToStorage() {
    localStorage.setItem('smartlist_v9', JSON.stringify(storageData));
}

// Compartilhar WhatsApp
document.getElementById('share-btn').onclick = () => {
    const list = storageData.lists.find(l => l.id === currentListId);
    if(list.items.length === 0) return alert("A lista está vazia!");
    
    let msg = `*${list.name}*\n\n`;
    list.items.forEach(i => {
        if (!i.bought) {
            let d = '';
            if (i.date) { const p = i.date.split('-'); d = ` [${p[2]}/${p[1]}]`; }
            msg += `• ${i.name}${d}\n`;
        }
    });
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`);
};

// Iniciar a aplicação
showHome();
