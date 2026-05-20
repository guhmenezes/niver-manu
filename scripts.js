const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbyHCLLyyWsxja_SciXpOcWwttUkLAJw6aS2MPSSJ1gToBucmjGVHeCq5P0p6XizAHzF/exec';

function openPix() {
    const tagTitulo = document.getElementById('pix-titulo-presente');
    const tagValor = document.getElementById('pix-valor-presente');
    document.getElementById('pix-modal').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
    tagTitulo.innerText = 'Presente da Manu';
    tagValor.innerText = 'Valor Livre 💝';
}

function closePix() {
    document.getElementById('pix-modal').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}

function copyPix() {
    const chave = document.getElementById('pix-chave').innerText;
    navigator.clipboard.writeText(chave);
    alert('Chave copiada! É só colar no app do seu banco.');
}

function openPixWithValue(nomePresente, valorPresente) {
    document.getElementById('pix-modal').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
    
    const tagTitulo = document.getElementById('pix-titulo-presente');
    const tagValor = document.getElementById('pix-valor-presente');

    if(nomePresente !== 'Qualquer Valor') {
        tagTitulo.innerText = `Presente: ${nomePresente}`;
    }

    if (valorPresente === 'Livre') {
        tagValor.innerText = 'Valor Livre 💝';
    } else {
        tagValor.innerText = `Valor: R$ ${valorPresente}`;
    }

    fetch(WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({
            tipo_evento: 'clique',
            presente: nomePresente,
            valor: valorPresente
        })
    }).catch(err => console.error('Erro log:', err));
}


var acompanhanteCount = 0;

function addAcompanhante() {
    acompanhanteCount++;
    const container = document.getElementById('acompanhantes-container');
    
    const div = document.createElement('div');
    div.id = `acompanhante-${acompanhanteCount}`;
    div.style = "display: flex; gap: 10px; margin-top: 10px; align-items: center; background: #fff9fa; padding: 10px; border-radius: 8px;";
    
    div.innerHTML = `
        <input type="text" placeholder="Nome do acompanhante" class="acomp-nome" style="flex: 2;" required>
        <select class="acomp-tipo" style="flex: 1;">
            <option value="Adulto">Adulto</option>
            <option value="Criança">Criança</option>
        </select>
        <button type="button" onclick="removeAcompanhante(${acompanhanteCount})" 
                style="width: 30px; padding: 5px; background: #ff4d4d; border-radius: 50%; color: white; border: none; cursor: pointer;">×</button>
    `;
    
    container.appendChild(div);
}

function removeAcompanhante(id) {
    const el = document.getElementById(`acompanhante-${id}`);
    if (el) el.remove();
}

setTimeout(() => {
    const form = document.getElementById('rsvp-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const btn = document.getElementById('btn-enviar');
        const originalText = btn.innerText;
        btn.innerText = 'Enviando...';
        btn.disabled = true;
        
        const acompanhantes = [];
        document.querySelectorAll('#acompanhantes-container > div').forEach(div => {
            acompanhantes.push({
                nome: div.querySelector('.acomp-nome').value,
                tipo: div.querySelector('.acomp-tipo').value
            });
        });
    
        const payload = {
            titular: document.getElementById('nome').value,
            whatsapp: document.getElementById('whatsapp').value,
            email: document.getElementById('email').value || 'Não informado',
            presenca: document.getElementById('presenca').value,
            acompanhantes: acompanhantes 
        };
    
        fetch(WEBHOOK_URL, {
            method: 'POST',
            mode: 'no-cors', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(() => {
            btn.innerText = 'Confirmado ✅';
            form.reset();
            document.getElementById('acompanhantes-container').innerHTML = '';
            document.getElementById('sucesso-modal').style.display = 'block';
            document.getElementById('overlay-sucesso').style.display = 'block';
        })
        .catch(error => {
            console.error('Erro ao enviar dados:', error);
            alert('Ops! Ocorreu um erro ao salvar. Tente novamente.');
            btn.innerText = originalText;
            btn.disabled = false;
        });
    });
}, 100);

function closeSucesso() {
    document.getElementById('sucesso-modal').style.display = 'none';
    document.getElementById('overlay-sucesso').style.display = 'none';
}
