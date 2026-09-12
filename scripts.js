// DigitalizaCupom - versão corrigida
let total = 0;


const pedido = `
Analise o cupom e responda SOMENTE em JSON válido.

{
  "categoria":"",
  "numero":"",
  "data":"",
  "estabelecimento":"",
  "itens":[
    {
      "descricao":"",
      "quantidade":0,
      "unidade":"un",
      "valorUnitario":0,
      "valorParcial":0
    }
  ],
  "desconto":0,
  "valorTotal":0
}

Categorias permitidas:

🏠 Materiais de Construção
🛒 Mercado e Compras
🚗 Transporte
🍔 Alimentação
💊 Saúde
🏋️ Academia
📱 Celular
💼 Trabalho
💳 Dívidas
🥳 Lazer
🏠 Gastos Fixos
💸 Pix

Não escreva explicações.
Retorne apenas JSON.
`;

function formatarMoeda(valor){
  return Number(valor || 0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
}

function formatarData(data){

  if(!data) return '';

  // já está em dd/mm/aaaa
  if(/^\d{2}\/\d{2}\/\d{4}$/.test(data)){
    return data;
  }

  // yyyy-mm-dd
  if(/^\d{4}-\d{2}-\d{2}$/.test(data)){
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  }

  const d = new Date(data);

  if(!isNaN(d)){
    return d.toLocaleDateString('pt-BR');
  }

  return data;
}

function atualizarStatus(texto){
  const el=document.getElementById('status-text');
  if(el) el.textContent=texto;
}

function atualizarTotal(){
  const el=document.querySelector('.total-gasto');
  if(el) el.textContent=formatarMoeda(total);
}

function mostrarCupomDetalhado(dados){

    const linhasItens = dados.itens.map(item => {

        return `
${String(item.descricao || '').padEnd(25)}
${Number(item.quantidade).toFixed(2)}${item.unidade}
 x ${formatarMoeda(item.valorUnitario)}
 = ${formatarMoeda(item.valorParcial)}
`;

    }).join('<br>');

    document.getElementById('problemSolutionInput').innerHTML += `
        <div class="comprovante">
            <p><strong>Categoria:</strong> ${dados.categoria}</p>
            <p><strong>Número:</strong> ${dados.numero}</p>
            <p><strong>Data:</strong> ${dados.data}</p>
            <p><strong>Estabelecimento:</strong> ${dados.estabelecimento}</p>

            <br>

            ${linhasItens}

            <br><br>

            <strong>DESCONTO (R$):</strong>
            -${formatarMoeda(dados.desconto)}

            <br>
            ____________________________________

            <br>

            <strong>Valor Total (R$):</strong>
            ${formatarMoeda(dados.valorTotal)}

            <br>
            ____________________________________
        </div>
    `;
}



function iniciarProcessamento(){document.body.classList.add('is-processing');}
function finalizarProcessamento(){document.body.classList.remove('is-processing');}

function adicionarTabelaSintetica(numero,data,categoria,descricao,valor){
  const tbody=document.querySelector('#tableSynthetic tbody');
  if(!tbody) return;
  const tr=tbody.insertRow();
  tr.innerHTML=`<td>${numero}</td><td>${data}</td><td>${categoria}</td><td>${descricao}</td><td>${formatarMoeda(valor)}</td>`;
}

function adicionarTabelaAnalitica(dados){

    const tbody =
        document.querySelector('#tableAnalytical tbody');

    if(!tbody) return;

    dados.itens.forEach(item => {

        const tr = tbody.insertRow();

        tr.innerHTML = `
            <td>${dados.numero}</td>
            <td>${dados.data}</td>
            <td>${dados.categoria}</td>
            <td>${item.descricao}</td>
            <td>${Number(item.quantidade).toFixed(2)}</td>
            <td>${item.unidade}</td>
            <td>${formatarMoeda(item.valorUnitario)}</td>
            <td>${formatarMoeda(item.valorParcial)}</td>
            <td>${formatarMoeda(dados.valorTotal)}</td>
        `;
    });

    if(dados.desconto > 0){

        const tr = tbody.insertRow();

        tr.innerHTML = `
            <td>${dados.numero}</td>
            <td>${dados.data}</td>
            <td>${dados.categoria}</td>
            <td>DESCONTO (R$)</td>
            <td></td>
            <td></td>
            <td></td>
            <td>-${formatarMoeda(dados.desconto)}</td>
            <td>${formatarMoeda(dados.valorTotal)}</td>
        `;
    }
}



async function lerFoto(){

  const foto =
    document.getElementById('cameraInput')?.files?.[0] ||
    document.getElementById('uploadInput')?.files?.[0];

  if(!foto){
    atualizarStatus('Selecione uma imagem.');
    return;
  }

  if(typeof puter === 'undefined'){
    atualizarStatus('Biblioteca Puter não carregada.');
    alert('Puter não carregado.');
    return;
  }

  try{

    iniciarProcessamento();

    atualizarStatus('Lendo cupom...');

    const resposta =
      await puter.ai.chat(pedido, foto);

    const texto =
      (resposta?.message?.content || '').trim();

    console.log("Resposta da IA:", texto);

	const textoLimpo = texto
  	.replace(/```json/gi, '')
  	.replace(/```/g, '')
  	.trim();

	const dados = JSON.parse(textoLimpo);
	dados.data = formatarData(dados.data);

    mostrarCupomDetalhado(dados);

    adicionarTabelaSintetica(
      dados.numero,
      dados.data,
      dados.categoria,
      dados.estabelecimento,
      dados.valorTotal
    );

    adicionarTabelaAnalitica(dados);

    total += Number(dados.valorTotal);

    atualizarTotal();

    atualizarStatus(
      'Cupom processado com sucesso.'
    );

  } catch(e){

    console.error(e);

    atualizarStatus(
      'Erro ao processar o cupom.'
    );

    alert(
      'A IA retornou um JSON inválido. Verifique o Console (F12).'
    );

  } finally {

    finalizarProcessamento();

  }
}


function exportExcel(tableId,fileName){
  const tabela=document.getElementById(tableId);
  if(!tabela){
    alert('Tabela nÃ£o encontrada.');
    return;
  }

  const html='\ufeff'+tabela.outerHTML;
  const blob=new Blob([html],{type:'application/vnd.ms-excel'});
  const url=URL.createObjectURL(blob);

  const a=document.createElement('a');
  a.href=url;
  a.download=fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}

window.exportExcel=exportExcel;
window.lerFoto=lerFoto;

document.addEventListener('DOMContentLoaded',()=>{
  atualizarTotal();

  document.querySelector('[data-action="camera"]')?.addEventListener('click',()=>{
    document.getElementById('cameraInput')?.click();
  });

  document.getElementById('btnUploadArquivo')?.addEventListener('click',()=>{
    document.getElementById('uploadInput')?.click();
  });

    document.getElementById('btnLimparResolucao')?.addEventListener('click',()=>{
    document.getElementById('problemSolutionInput').innerHTML ='<p>VISUALIZAÇÃO DOS CUPONS DE COMPRAS CARREGADOS:</p>';
    document.querySelector('#tableSynthetic tbody').innerHTML='';
    document.querySelector('#tableAnalytical tbody').innerHTML='';
    total=0;
    atualizarTotal();
    atualizarStatus('Dados limpos.');
  });
});