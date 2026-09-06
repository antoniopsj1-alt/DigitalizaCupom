/* 
Variável - Um pedacinho da memória do computador
que eu guardo o que eu quiser
let 
console.log() - Mostra algo na tela

Função - Pedacinho de código QUE
Só executa QUANDO eu CHAMO ELA

Lógica de Programação - Pensar como computador pensa
Algoritmo - Receita de bolo

[x] Carregar a foto
[x] Falar QUAL FOTO eu vou carregar  
[x] Salva a foto  
[x] Enviar para a IA foto + orientação
[x] Receber a resposta da IA  
[x] Formatar a resposta
[x] Colocar na tela   
[ ] Estilizar a lista
     
document = HTML
querySelector = Selecionar um elemento do HTML
innerHTML = Colocar algo dentro do HTML
*/
const botaoCamera = document.querySelector('button[data-action="camera"]');

botaoCamera.addEventListener('click', () => {
  lerFoto();
});




let pedido = 'Olhe a foto deste comprovante e responda em UMA linha, sem escrever mais nada, com 2 pedaços separados por |. Primeiro pedaço: o emoji da categoria, nome da categoria, (data do comprovante) e o nome do estabelecimento dentro de <strong>, e depois cada item comprado com seu valor, quantidade, unidade e preço unitário, colocar um por linha usando <br>. Segundo pedaço: o total pago, só o número, com ponto e sempre com duas casas decimais. As categorias são: 🛒 Mercado e Compras, 🚗 Transporte, 🍔 Alimentação, 💊 Saúde, 🏋️ Academia, 📱 Celular, 💼 Trabalho, 💳 Dívidas, 🥳 Lazer, 🏠 Gastos Fixos, 💸 Pix. Exemplo de resposta: 🛒 <strong> (04/09/2026) Benny Materia de Construção</strong><br>Porcelanato Delta 120cm x 120cm : 100,00m² x R$99,90 = R$9.990,00<br>Argamassa Porcelanato Interno 20kg  : 25,00un x R$50,00 = R$1.250,00<br>Desconto: 10% x 11.240,00 = R$-1.124,00|10116.00';
let total = 0

async function lerFoto(){
    // Pegar a foto do input
    let foto = document.querySelector(".foto").files[0]

    // Chamada Assincrona
    // Estou pegando a INFO e estou enviando para a IA
    let resposta = await puter.ai.chat(pedido, foto)

    // Pegar a resposta da IA e filtrar para mostrar na tela
    let texto = resposta.message.content
    let partes = texto.split("|")
    console.log(partes)

// Seleciona o elemento com id problemSolutionInput
const problemSolutionDiv = document.getElementById('problemSolutionInput');

// Cria o conteúdo HTML que deseja inserir
const novaListaHTML = `
    <div class="comprovante">
        <div class="itens">${partes[0]}</div>
        <div class="total-nota">Total da nota: R$ ${partes[1]}</div>
    </div>
`;

total += Number(partes[1])
    document.querySelector(".total-gasto").innerHTML = "R$" + total.toFixed(2)

    // Adiciona o conteúdo ao conteúdo existente no div (se desejar append)
problemSolutionDiv.innerHTML += novaListaHTML;

// Ou, se preferir substituir o conteúdo existente
// problemSolutionDiv.innerHTML = novaListaHTML;


    // Colocar na tela
    document.querySelector(".lista").innerHTML += `
        <div class="comprovante">

            <div class="itens">${partes[0]}</div>

            <div class="total-nota">Total da nota: R$ ${partes[1]}</div>

        </div>
    `


}

/*
    // --- Lógica de Digitalização (Simulação de requisição Puter OCR) ---
    function digitizeImages() {
        const checkboxes = document.querySelectorAll('.img-checkbox:checked');
        if (checkboxes.length === 0) {
            alert('Selecione ao menos uma imagem carregada para digitalizar.');
            return;
        }

        const tableType = document.querySelector('input[name="tableType"]:checked').value;
        
        logStatus(`Iniciando digitalização de ${checkboxes.length} imagem(ns)...`);
        logStatus(`Conectando com o serviço Puter OCR...`);

        // Simulação assíncrona do tempo de rede/API
        setTimeout(() => {
            logStatus(`Processando dados estruturados...`);
            
            setTimeout(() => {
                generateMockData(checkboxes.length, tableType);
                logStatus(`Processamento concluído pela Puter! Resposta recebida com sucesso.`);
            }, 1500);

        }, 1000);
    }

    function generateMockData(imgCount, mode) {
        const tbodySintetica = document.querySelector('#tableSynthetic tbody');
        const tbodyAnalitica = document.querySelector('#tableAnalytical tbody');
        
        const dateNow = new Date().toLocaleDateString('pt-BR');

        // Dados simulados baseados na quantidade de imagens processadas
        for(let i=0; i<imgCount; i++) {
            const valUnit1 = (Math.random() * 50 + 10).toFixed(2);
            const valUnit2 = (Math.random() * 30 + 5).toFixed(2);
            const totalRecibo = (parseFloat(valUnit1)*2 + parseFloat(valUnit2)*1).toFixed(2);
            
            totalAcumulado += parseFloat(totalRecibo);

            if (mode === 'sintetica' || mode === 'ambas') {
                const trS = document.createElement('tr');
                trS.innerHTML = `
                    <td>${dateNow}</td>
                    <td>Alimentação</td>
                    <td>Refeição e Bebidas - Comprovante #${Math.floor(Math.random()*1000)}</td>
                    <td>${totalRecibo.replace('.', ',')}</td>
                `;
                tbodySintetica.appendChild(trS);
            }

            if (mode === 'analitica' || mode === 'ambas') {
                const trA1 = document.createElement('tr');
                const pParcial1 = (parseFloat(valUnit1)*2).toFixed(2);
                trA1.innerHTML = `
                    <td>${dateNow}</td>
                    <td>Alimentação</td>
                    <td>Prato Executivo</td>
                    <td>2</td>
                    <td>${valUnit1.replace('.', ',')}</td>
                    <td>${pParcial1.replace('.', ',')}</td>
                    <td rowspan="2">${totalRecibo.replace('.', ',')}</td>
                `;
                
                const trA2 = document.createElement('tr');
                const pParcial2 = (parseFloat(valUnit2)*1).toFixed(2);
                trA2.innerHTML = `
                    <td>${dateNow}</td>
                    <td>Alimentação</td>
                    <td>Refrigerante Lata</td>
                    <td>1</td>
                    <td>${valUnit2.replace('.', ',')}</td>
                    <td>${pParcial2.replace('.', ',')}</td>
                `;
                
                tbodyAnalitica.appendChild(trA1);
                tbodyAnalitica.appendChild(trA2);
            }
        }
        updateTotal();
    }

    function updateTotal() {
        totalValueSpan.innerText = totalAcumulado.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function logStatus(msg) {
        const currentText = statusBox.innerText;
        statusBox.innerText = msg + "\n" + (currentText.startsWith("Status:") ? "" : currentText).substring(0, 150);
    }

    // --- Exportação para Excel usando SheetJS ---
    function exportExcel(tableId, filename) {
        const table = document.getElementById(tableId);
        if(table.rows.length <= 1) {
            alert('A tabela está vazia. Digitalize comprovantes primeiro.');
            return;
        }
        // Converte a tabela HTML em uma planilha do Excel
        const wb = XLSX.utils.table_to_book(table, {sheet: "Comprovantes"});
        // Realiza o download
        XLSX.writeFile(wb, filename);
        logStatus(`Tabela salva como: ${filename}`);
    }






*/
    
    
