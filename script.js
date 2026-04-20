// 1. Pegar os elementos da tela
const input = document.getElementById('item-input');
const inputDate = document.getElementById('date-input');
const btnAdd = document.getElementById('add-btn');
const listaUl = document.getElementById('shopping-list-ul');
const btnLimpar = document.getElementById('clear-all');
const dataTxt = document.getElementById('current-date');
const btnShare = document.getElementById('share-btn');

// 2. Mostrar a data de hoje
const hoje = new Date();
dataTxt.innerText = hoje.toLocaleDateString('pt-br', { weekday: 'long', day: 'numeric', month: 'long' });

// 3. Banco de dados (carrega do celular ou começa vazio)
let itens = JSON.parse(localStorage.getItem('lista_v6')) || [];

// Formatar data de YYYY-MM-DD para DD/MM
function formatarData(dataString) {
    if (!dataString) return '';
    const partes = dataString.split('-');
    return `${partes[2]}/${partes[1]}`;
}

// 4. Função para desenhar a lista (RENDERIZAR)
function atualizarTela() {
    listaUl.innerHTML = '';
    
    itens.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = `list-item ${item.comprado ? 'bought' : ''}`;
        
        // Se houver data agendada, exibe. Se não, oculta o elemento.
        const dataTag = item.data ? `<span class="item-date">📅 Agendado: ${formatarData(item.data)}</span>` : '';

        li.innerHTML = `
            <span class="item-num">${index + 1}.</span>
            <div class="check-box" onclick="marcarItem(${index})"></div>
            <div class="item-content" onclick="marcarItem(${index})">
                <span class="item-text">${item.nome}</span>
                ${dataTag}
            </div>
            <button class="delete-btn" onclick="deletarItem(${index})">✕</button>
        `;
        
        listaUl.appendChild(li);
    });

    localStorage.setItem('lista_v6', JSON.stringify(itens));
}

// 5. FUNÇÃO PRINCIPAL: ADICIONAR ITEM
function adicionarNovoItem() {
    const nomeItem = input.value.trim();
    const dataAgendada = inputDate.value;
    
    if (nomeItem !== "") {
        itens.unshift({ 
            nome: nomeItem, 
            comprado: false,
            data: dataAgendada // Salva a data no objeto
        });
        
        input.value = ""; 
        inputDate.value = ""; 
        input.focus();    
        atualizarTela();  
    } else {
        alert("Digite o nome de um produto!");
    }
}

// 6. Funções de marcar e deletar
window.marcarItem = (index) => {
    itens[index].comprado = !itens[index].comprado;
    atualizarTela();
};

window.deletarItem = (index) => {
    itens.splice(index, 1);
    atualizarTela();
};

// 7. Funções de Ações Extras (Limpar e Compartilhar)
btnLimpar.onclick = () => {
    if (itens.length === 0) return alert("A lista já está vazia!");
    if (confirm("Apagar toda a lista de compras?")) {
        itens = [];
        atualizarTela();
    }
};

btnShare.onclick = () => {
    if (itens.length === 0) return alert("Adicione itens antes de compartilhar!");
    
    let textoMsg = "🛒 *Lista de Compras - SmartList*\n\n";
    
    itens.forEach((item) => {
        let status = item.comprado ? "✅" : "⬜";
        let dataStr = item.data ? ` (Para ${formatarData(item.data)})` : "";
        textoMsg += `${status} ${item.nome}${dataStr}\n`;
    });
    
    // Abre o link do WhatsApp
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(textoMsg)}`;
    window.open(url, '_blank');
};

// 8. EVENTOS (O que faz o botão funcionar)
btnAdd.onclick = adicionarNovoItem; 

input.onkeypress = (e) => {         
    if (e.key === 'Enter') {
        adicionarNovoItem();
    }
};

// Inicia a lista quando abre o app
atualizarTela();
