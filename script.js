const input = document.getElementById('item-input');
const inputDate = document.getElementById('date-input');
const btnAdd = document.getElementById('add-btn');
const listaUl = document.getElementById('shopping-list-ul');
const btnLimpar = document.getElementById('clear-all');
const dataTxt = document.getElementById('current-date');
const btnShare = document.getElementById('share-btn');
const btnSave = document.getElementById('save-btn');
const emptyMsg = document.getElementById('empty-msg');
const listTitleDisp = document.getElementById('list-title');

// 1. Gerenciar Nome da Lista
let nomeDaLista = localStorage.getItem('smartlist_name');

function definirNome() {
    if (!nomeDaLista) {
        nomeDaLista = prompt("Dê um nome para sua nova lista (Ex: Mercado, Churrasco):");
        if (!nomeDaLista || nomeDaLista.trim() === "") nomeDaLista = "Minha";
        localStorage.setItem('smartlist_name', nomeDaLista);
    }
    listTitleDisp.innerText = nomeDaLista;
}

// 2. Data de hoje
const hoje = new Date();
dataTxt.innerText = hoje.toLocaleDateString('pt-br', { day: 'numeric', month: 'short' });

// 3. Dados
let itens = JSON.parse(localStorage.getItem('lista_v7')) || [];

function formatarData(dataString) {
    if (!dataString) return '';
    const partes = dataString.split('-');
    return `${partes[2]}/${partes[1]}`;
}

// 4. Renderizar
function atualizarTela() {
    listaUl.innerHTML = '';
    
    if (itens.length === 0) {
        emptyMsg.style.display = 'flex';
    } else {
        emptyMsg.style.display = 'none';
        itens.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = `list-item ${item.comprado ? 'bought' : ''}`;
            const dataTag = item.data ? `<span class="item-date">📅 ${formatarData(item.data)}</span>` : '';

            li.innerHTML = `
                <div class="check-box" onclick="marcarItem(${index})"></div>
                <div class="item-content" onclick="marcarItem(${index})">
                    <span class="item-text">${item.nome}</span>
                    ${dataTag}
                </div>
                <button class="delete-btn" onclick="deletarItem(${index})"><i class="fas fa-times"></i></button>
            `;
            listaUl.appendChild(li);
        });
    }
    // Auto-salvamento silencioso
    localStorage.setItem('lista_v7', JSON.stringify(itens));
}

// 5. Funções
function adicionarNovoItem() {
    const nomeItem = input.value.trim();
    if (nomeItem !== "") {
        itens.unshift({ nome: nomeItem, comprado: false, data: inputDate.value });
        input.value = ""; inputDate.value = ""; input.focus();
        atualizarTela();
    }
}

window.marcarItem = (index) => { itens[index].comprado = !itens[index].comprado; atualizarTela(); };
window.deletarItem = (index) => { itens.splice(index, 1); atualizarTela(); };

btnSave.onclick = () => {
    localStorage.setItem('lista_v7', JSON.stringify(itens));
    alert("Lista salva com sucesso no dispositivo!");
};

btnLimpar.onclick = () => {
    if (confirm("Limpar toda a lista?")) {
        itens = [];
        atualizarTela();
    }
};

btnShare.onclick = () => {
    if (itens.length === 0) return alert("Lista vazia!");
    let textoMsg = `🛒 *${nomeDaLista} List*\n\n`;
    itens.forEach((item) => {
        if (!item.comprado) {
            let dataStr = item.data ? ` [${formatarData(item.data)}]` : "";
            textoMsg += `• ${item.nome}${dataStr}\n`;
        }
    });
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(textoMsg)}`, '_blank');
};

btnAdd.onclick = adicionarNovoItem;
input.onkeypress = (e) => { if (e.key === 'Enter') adicionarNovoItem(); };

// Início
definirNome();
atualizarTela();
