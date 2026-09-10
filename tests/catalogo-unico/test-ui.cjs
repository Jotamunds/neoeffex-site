const fs = require('node:fs');
const assert = require('node:assert/strict');
const {JSDOM, VirtualConsole} = require('jsdom');
const root=require('node:path').resolve(__dirname, '../..') + '/';
const wait=()=>new Promise(r=>setTimeout(r,30));
function fixture(){return {
 catalogs:[{id:'cat',name:'Loja teste',slug:'loja-teste',is_active:true,orders_enabled:true,whatsapp_number:'5511999999999',order_message:'Confirme disponibilidade pelo WhatsApp.',catalog_profile:'standard',minimum_order_quantity:null,created_at:'2026-01-01'}],
 categories:[{id:'main',catalog_id:'cat',name:'Marmitas',sort_order:0},{id:'child',catalog_id:'cat',name:'Tradicionais',parent_id:'main',sort_order:1},{id:'other',catalog_id:'cat',name:'Bebidas',sort_order:2}],
 product_types:[],
 product_groups:[],
 products:[{id:'p1',catalog_id:'cat',category_id:'child',name:'Combo 10',description:'Dez marmitas',price:150,status:'active',product_type:'Combo',product_groups:['Mais pedido'],sort_order:0},{id:'p2',catalog_id:'cat',category_id:'other',name:'Suco',description:'Natural',price:5,status:'active',product_type:'Individual',product_groups:['Bebida'],sort_order:1}]
};}
function client(db,legacy,requests){return {
 auth:{onAuthStateChange(){},getUser:async()=>({data:{user:{id:'owner',email:'test@example.com'}}}),signOut:async()=>({})},
 storage:{from:()=>({getPublicUrl:()=>({data:{publicUrl:''}})})},
 from(table){let filters=[],selected='',op='',payload,one=false;
  const query={select(s){selected=s;return query;},eq(k,v){filters.push([k,v]);return query;},order(){return query;},single(){one=true;return query;},maybeSingle(){one=true;return query;},insert(v){op='insert';payload=v;return query;},update(v){op='update';payload=v;return query;},delete(){op='delete';return query;},
   then(resolve,reject){return Promise.resolve().then(()=>{
    requests.push({table,selected,op,payload,filters});
    if(legacy && /parent_id|product_type|product_groups/.test(selected)) return {error:{code:'42703',message:'column parent_id does not exist'}};
    if(!db[table]) db[table] = [];
    let rows=db[table].filter(row=>filters.every(([k,v])=>row[k]===v));
    if(op==='insert'){
     if((table==='product_types'||table==='product_groups'||table==='categories') && payload.name && db[table].some(r=>r.catalog_id===payload.catalog_id && String(r.name).trim().toLowerCase()===String(payload.name).trim().toLowerCase())) {
      return {data:null,error:{code:'23505',message:'duplicate key value violates unique constraint'}};
     }
     const row={id:'new-'+db[table].length,...payload};db[table].push(row);rows=[row];
    }
    if(op==='update'){
     if((table==='product_types'||table==='product_groups'||table==='categories') && payload.name) {
      const target=rows[0];
      if(target && db[table].some(r=>r.id!==target.id && r.catalog_id===target.catalog_id && String(r.name).trim().toLowerCase()===String(payload.name).trim().toLowerCase())) {
       return {data:null,error:{code:'23505',message:'duplicate key value violates unique constraint'}};
      }
     }
     rows.forEach(row=>Object.assign(row,payload));
    }
    if(op==='delete')db[table]=db[table].filter(row=>!rows.includes(row));
    let result=rows.map(row=>structuredClone(row));
    if(legacy)result.forEach(row=>{delete row.parent_id;delete row.product_type;delete row.product_groups;});
    return {data:one?result[0]:result,error:null};
   }).then(resolve,reject);}
  };return query;
 }
};}
async function setup(area,legacy=false,customDb=null){
 const errors=[],requests=[],db=customDb?structuredClone(customDb):fixture();
 const vc=new VirtualConsole();vc.on('jsdomError',e=>{if(!/navigation/.test(e.message))errors.push(e.message);});vc.on('error',(...e)=>errors.push(e.join(' ')));
 const dom=new JSDOM(fs.readFileSync(root+area+'/index.html','utf8'),{url:'https://test.invalid/'+area+'/?catalogo=loja-teste',runScripts:'outside-only',pretendToBeVisual:true,virtualConsole:vc});
 const w=dom.window;w.matchMedia=()=>({matches:false,addEventListener(){}});
 w.NEOEFFEX_SUPABASE_CONFIG={url:'https://test.supabase.co',publishableKey:'test-only'};
 w.supabase={createClient:()=>client(db,legacy,requests)};
 w.eval(fs.readFileSync(root+'assets/catalog/organization.js','utf8'));
 w.eval(fs.readFileSync(root+'assets/catalog/profiles.js','utf8'));
 w.eval(fs.readFileSync(root+area+'/assets/js/'+area+'.js','utf8'));
 await wait();return {dom,w,d:w.document,db,requests,errors};
}
(async()=>{
 let checks=0;
 let x=await setup('catalogo');
 assert(!x.d.querySelector('#catalogContent').hidden);assert.equal(x.d.querySelectorAll('.product-card').length,2);checks++;
 assert(x.d.querySelector('#categoryFilters').textContent.includes('Marmitas / Tradicionais'));checks++;
 x.d.querySelector('[data-category-id="main"]').click();assert.equal(x.d.querySelectorAll('.product-card').length,1);checks++;
 x.d.querySelector('.add-product-button').click();assert.equal(x.d.querySelector('#cartCount').textContent,'1');checks++;
 x.d.querySelector('[data-category-id="all"]').click();
 x.d.querySelector('#typeFilter').value='Individual';x.d.querySelector('#typeFilter').dispatchEvent(new x.w.Event('change'));
 assert.equal(x.d.querySelectorAll('.product-card').length,1);assert(x.d.querySelector('.product-card').textContent.includes('Suco'));checks++;
 x.d.querySelector('.add-product-button').click();assert.equal(x.d.querySelector('#cartCount').textContent,'2');assert.match(x.d.querySelector('#cartTotal').textContent,/155,00/);checks++;
 assert(decodeURIComponent(x.d.querySelector('#whatsappButton').href).includes('Combo 10'));assert(decodeURIComponent(x.d.querySelector('#whatsappButton').href).includes('Suco'));checks++;
 x.d.querySelector('#groupFilter').value='Mais pedido';x.d.querySelector('#groupFilter').dispatchEvent(new x.w.Event('change'));
 assert.equal(x.d.querySelectorAll('.product-card').length,0);assert(!x.d.querySelector('#emptyResults').hidden);checks++;
 x.d.querySelector('#clearFiltersButton').click();assert.equal(x.d.querySelectorAll('.product-card').length,2);assert.equal(x.d.querySelector('#cartCount').textContent,'2');checks++;
 x.d.querySelector('#catalogSearch').value='mais pedido';x.d.querySelector('#catalogSearch').dispatchEvent(new x.w.Event('input'));assert.equal(x.d.querySelectorAll('.product-card').length,1);checks++;
 assert.deepEqual(x.errors,[]);x.dom.window.close();
 x=await setup('catalogo',true);assert(!x.d.querySelector('#catalogContent').hidden);assert(x.d.querySelector('#organizationFilters').hidden);assert.equal(x.d.querySelectorAll('.product-card').length,2);assert.deepEqual(x.errors,[]);checks++;x.dom.window.close();

 // Cenário 1: Zero lojas vinculadas
 x=await setup('admin',false,{catalogs:[],categories:[],products:[]});
 assert(x.d.body.classList.contains('is-authenticated'));
 assert.equal(x.d.querySelector('#newCatalogButton'),null);
 assert.equal(x.d.querySelector('#deleteCatalogButton'),null);
 assert(x.d.querySelector('#newProductButton').disabled);
 assert(x.d.querySelector('#editCatalogButton').disabled);
 assert(x.d.querySelector('#manageCategoriesButton').disabled);
 assert(x.d.querySelector('#configureOrdersButton').disabled);
 assert(x.d.querySelector('#catalogSelect').closest('.catalog-select-field').hidden);
 assert(x.d.querySelector('#activeCatalogName').textContent.includes('Entre em contato com a Neoeffex'));
 assert(x.d.querySelector('#settingsCatalogName').textContent.includes('Nenhuma loja vinculada'));
 assert(x.d.querySelector('#newRootCategoryButton').disabled);
 assert(x.d.querySelector('#newSubcategoryButton').disabled);
 assert(x.d.querySelector('#newProductTypeButton').disabled);
 assert(x.d.querySelector('#newProductGroupButton').disabled);
 assert(x.d.querySelector('#rootCategoryForm').hidden);
 assert(x.d.querySelector('#subcategoryForm').hidden);
 assert(x.d.querySelector('#productTypeForm').hidden);
 assert(x.d.querySelector('#productGroupForm').hidden);
 assert(x.d.querySelector('#emptyProductTypeState').textContent.includes('Nenhuma loja vinculada'));
 assert(x.d.querySelector('#emptyProductGroupState').textContent.includes('Nenhuma loja vinculada'));
 assert.equal(x.d.querySelector('#typesTabCount').textContent, '0');
 assert.equal(x.d.querySelector('#groupsTabCount').textContent, '0');
 assert.deepEqual(x.errors,[]);checks++;x.dom.window.close();

 // Cenário 2: Uma loja existente
 x=await setup('admin');
 assert(x.d.body.classList.contains('is-authenticated'));
 assert.equal(x.d.querySelector('#newCatalogButton'),null);
 assert.equal(x.d.querySelector('#deleteCatalogButton'),null);
 assert(x.d.querySelector('#catalogSelect').closest('.catalog-select-field').hidden);
 assert.equal(x.d.querySelector('#editCatalogButton').disabled,false);
 assert.equal(x.d.querySelector('#newProductButton').disabled,false);
 assert.equal(x.d.querySelector('#configureOrdersButton').disabled,false);
 assert(x.d.querySelector('#activeCatalogName').textContent.includes('Loja teste'));checks++;

 // Sidebar Configurações e Resumo de Pedidos com Perfil
 const settingsLink = x.d.querySelector('#settingsMenuLink');
 assert(settingsLink);
 assert(settingsLink.textContent.includes('Configurações'));
 assert.equal(x.d.querySelector('#categoriesMenuLink'),null);
 assert(!x.d.querySelector('#configuracoes').hidden);
 assert.equal(x.d.querySelector('#ordersProfile').textContent, 'Padrão');
 assert.equal(x.d.querySelector('#ordersMinimum').textContent, 'Sem mínimo'); checks++;

 // Edição de loja existente
 x.d.querySelector('#editCatalogButton').click();
 assert(!x.d.querySelector('#catalogModal').hidden);
 assert.equal(x.d.querySelector('#catalogModalTitle').textContent,'Editar loja');
 assert.equal(x.d.querySelector('#catalogId').value,'cat');
 assert.equal(x.d.querySelector('#catalogName').value,'Loja teste');
 assert.equal(x.d.querySelector('#catalogProfile').value,'standard');
 assert.equal(x.d.querySelector('#catalogMinimumOrder').value,'');
 assert(x.d.querySelector('#catalogProfileFeatures').children.length >= 4);
 assert.equal(x.d.querySelector('#deleteCatalogButton'),null);checks++;

 // Alterar perfil para marmitas e configurar pedido mínimo
 x.d.querySelector('#catalogProfile').value = 'marmitas';
 x.d.querySelector('#catalogProfile').dispatchEvent(new x.w.Event('change'));
 assert(x.d.querySelector('#catalogProfileFeatures').textContent.includes('Seleção de sabores'));
 x.d.querySelector('#catalogMinimumOrder').value = '5';

 // Salvar via UPDATE
 x.d.querySelector('#catalogName').value='Loja Atualizada';
 x.d.querySelector('#catalogForm').dispatchEvent(new x.w.Event('submit',{cancelable:true}));await wait();
 const catalogUpdate=x.requests.find(r=>r.op==='update' && r.table==='catalogs');
 assert(catalogUpdate);
 assert.equal(catalogUpdate.payload.name,'Loja Atualizada');
 assert.equal(catalogUpdate.payload.catalog_profile,'marmitas');
 assert.equal(catalogUpdate.payload.minimum_order_quantity,5);
 assert(!x.requests.some(r=>r.op==='insert' && r.table==='catalogs'));checks++;

 // Ausência de catalogId aborta e não faz INSERT
 x.d.querySelector('#editCatalogButton').click();
 x.d.querySelector('#catalogId').value='';
 x.d.querySelector('#catalogForm').dispatchEvent(new x.w.Event('submit',{cancelable:true}));await wait();
 assert(!x.requests.some(r=>r.op==='insert' && r.table==='catalogs'));
 assert(x.d.querySelector('#catalogFeedback').textContent.includes('nenhuma loja'));checks++;
 x.d.querySelector('#closeCatalogModal').click();

 // Produtos funcionam na loja ativa (sem tipos nem grupos configurados inicialmente)
 x.d.querySelector('#newProductButton').click();
 assert(!x.d.querySelector('#productModal').hidden);
 assert(!x.d.querySelector('#productType').disabled);
 assert.equal(x.d.querySelector('#productType').value, '');
 assert(!x.d.querySelector('#productGroupsEmptyHint').hidden);
 x.d.getElementById('productName').value = 'Produto novo';
 x.d.getElementById('productPrice').value = '12.50';
 x.d.getElementById('productCategory').value = 'main';
 x.d.getElementById('productCategory').dispatchEvent(new x.w.Event('change'));
 x.d.getElementById('productSubcategory').value = 'child';
 x.d.querySelector('#productForm').dispatchEvent(new x.w.Event('submit', { cancelable: true })); await wait();
 const product = x.db.products.find(p => p.name === 'Produto novo');
 assert(product);
 assert.equal(product.product_type, null);
 assert.deepEqual(Array.from(product.product_groups), []);
 assert.equal(product.category_id, 'child');
 assert.equal(product.price, '12.50'); checks++;

 // CONFIGURAÇÕES: CATEGORIAS PRINCIPAIS
 assert.equal(x.d.querySelectorAll('#rootCategoryList tr').length,2);
 const marmitasRow=Array.from(x.d.querySelectorAll('#rootCategoryList tr')).find(r=>r.textContent.includes('Marmitas'));
 assert(marmitasRow.querySelector('.category-action--danger').disabled);
 assert(marmitasRow.querySelector('.category-action--danger').title.includes('subcategorias'));checks++;
 const bebidasRow=Array.from(x.d.querySelectorAll('#rootCategoryList tr')).find(r=>r.textContent.includes('Bebidas'));
 assert(bebidasRow.querySelector('.category-action--danger').disabled);
 assert(bebidasRow.querySelector('.category-action--danger').title.includes('produtos'));checks++;

 // Criar nova categoria raiz
 x.d.querySelector('#newRootCategoryButton').click();
 assert(!x.d.querySelector('#rootCategoryForm').hidden);
 x.d.querySelector('#rootCategoryName').value='Sobremesas';
 x.d.querySelector('#rootCategoryOrder').value='3';
 x.d.querySelector('#rootCategoryForm').dispatchEvent(new x.w.Event('submit',{cancelable:true}));await wait();
 const sobremesas=x.db.categories.find(c=>c.name==='Sobremesas');
 assert(sobremesas);assert.equal(sobremesas.parent_id,null);assert.equal(sobremesas.sort_order,3);checks++;

 // Editar categoria raiz
 const sobremesasRow=Array.from(x.d.querySelectorAll('#rootCategoryList tr')).find(r=>r.textContent.includes('Sobremesas'));
 assert(sobremesasRow);
 sobremesasRow.querySelectorAll('.category-action')[0].click();
 assert(!x.d.querySelector('#rootCategoryForm').hidden);
 assert.equal(x.d.querySelector('#rootCategoryName').value,'Sobremesas');
 x.d.querySelector('#rootCategoryName').value='Doces & Sobremesas';
 x.d.querySelector('#rootCategoryForm').dispatchEvent(new x.w.Event('submit',{cancelable:true}));await wait();
 assert.equal(x.db.categories.find(c=>c.id===sobremesas.id).name,'Doces & Sobremesas');checks++;

 // Excluir categoria raiz vazia
 const docesRow=Array.from(x.d.querySelectorAll('#rootCategoryList tr')).find(r=>r.textContent.includes('Doces & Sobremesas'));
 assert(!docesRow.querySelector('.category-action--danger').disabled);
 docesRow.querySelector('.category-action--danger').click();
 assert(!x.d.querySelector('#deleteModal').hidden);
 x.d.querySelector('#confirmDeleteButton').click();await wait();
 assert(!x.db.categories.some(c=>c.name==='Doces & Sobremesas'));checks++;

 // CONFIGURAÇÕES: SUBCATEGORIAS
 x.d.querySelector('#subcategoriesTabButton').click();
 assert(!x.d.querySelector('#subcategoriesTabPanel').hidden);
 assert(x.d.querySelector('#categoriesTabPanel').hidden);checks++;

 // Subcategoria 'Tradicionais' com produto tem exclusão desabilitada
 const tradRow=Array.from(x.d.querySelectorAll('#subcategoryList tr')).find(r=>r.textContent.includes('Tradicionais'));
 assert(tradRow);
 assert(tradRow.querySelector('.category-action--danger').disabled);
 assert(tradRow.querySelector('.category-action--danger').title.includes('produtos vinculados'));checks++;

 // Criar subcategoria (regra de 2 níveis: opções do select são SOMENTE categorias raiz)
 x.d.querySelector('#newSubcategoryButton').click();
 assert(!x.d.querySelector('#subcategoryForm').hidden);
 const parentOptions=Array.from(x.d.querySelectorAll('#subcategoryParent option')).map(o=>o.value);
 assert(!parentOptions.includes('child'));
 assert(parentOptions.includes('main'));
 x.d.querySelector('#subcategoryName').value='Fitness';
 x.d.querySelector('#subcategoryParent').value='main';
 x.d.querySelector('#subcategoryOrder').value='2';
 x.d.querySelector('#subcategoryForm').dispatchEvent(new x.w.Event('submit',{cancelable:true}));await wait();
 const fitnessCat=x.db.categories.find(c=>c.name==='Fitness');
 assert(fitnessCat);assert.equal(fitnessCat.parent_id,'main');assert.equal(fitnessCat.sort_order,2);checks++;

 // Bloqueio de 3º nível: tentativa de passar parent_id que aponta para outra subcategoria é rejeitada
 x.d.querySelector('#newSubcategoryButton').click();
 x.d.querySelector('#subcategoryName').value='Inválida Nível 3';
 x.d.querySelector('#subcategoryParent').appendChild(new x.w.Option('Child', 'child'));
 x.d.querySelector('#subcategoryParent').value='child'; // 'child' já possui parent_id
 x.d.querySelector('#subcategoryForm').dispatchEvent(new x.w.Event('submit',{cancelable:true}));await wait();
 assert(!x.db.categories.some(c=>c.name==='Inválida Nível 3'));
 assert(x.d.querySelector('#subcategoryFeedback').textContent.includes('2 níveis'));checks++;
 x.d.querySelector('#cancelSubcategoryButton').click();

 // Editar subcategoria
 const fitnessRow=Array.from(x.d.querySelectorAll('#subcategoryList tr')).find(r=>r.textContent.includes('Fitness'));
 fitnessRow.querySelectorAll('.category-action')[0].click();
 assert.equal(x.d.querySelector('#subcategoryName').value,'Fitness');
 x.d.querySelector('#subcategoryName').value='Linha Fit';
 x.d.querySelector('#subcategoryForm').dispatchEvent(new x.w.Event('submit',{cancelable:true}));await wait();
 assert.equal(x.db.categories.find(c=>c.id===fitnessCat.id).name,'Linha Fit');checks++;

 // Excluir subcategoria vazia
 const fitRow=Array.from(x.d.querySelectorAll('#subcategoryList tr')).find(r=>r.textContent.includes('Linha Fit'));
 assert(!fitRow.querySelector('.category-action--danger').disabled);
 fitRow.querySelector('.category-action--danger').click();
 assert(!x.d.querySelector('#deleteModal').hidden);
 x.d.querySelector('#confirmDeleteButton').click();await wait();
 assert(!x.db.categories.some(c=>c.name==='Linha Fit'));checks++;

  // CONFIGURAÇÕES: TIPOS DE PRODUTO
  x.d.querySelector('#typesTabButton').click();
  assert(!x.d.querySelector('#typesTabPanel').hidden);
  assert(x.d.querySelector('#categoriesTabPanel').hidden);
  assert(x.d.querySelector('#subcategoriesTabPanel').hidden);
  assert(x.d.querySelector('#groupsTabPanel').hidden);
  assert(!x.d.querySelector('#emptyProductTypeState').hidden);
  assert.equal(x.d.querySelector('#typesTabCount').textContent,'0');checks++;

  // Validação de Tipo: nome vazio, nome > 60, ordem negativa
  x.d.querySelector('#newProductTypeButton').click();
  assert(!x.d.querySelector('#productTypeForm').hidden);
  x.d.querySelector('#productTypeName').value='';
  x.d.querySelector('#productTypeForm').dispatchEvent(new x.w.Event('submit',{cancelable:true}));await wait();
  assert(x.d.querySelector('#productTypeFeedback').textContent.includes('entre 1 e 60'));
  x.d.querySelector('#productTypeName').value='A'.repeat(61);
  x.d.querySelector('#productTypeForm').dispatchEvent(new x.w.Event('submit',{cancelable:true}));await wait();
  assert(x.d.querySelector('#productTypeFeedback').textContent.includes('entre 1 e 60'));
  x.d.querySelector('#productTypeName').value='Individual';
  x.d.querySelector('#productTypeOrder').value='-1';
  x.d.querySelector('#productTypeForm').dispatchEvent(new x.w.Event('submit',{cancelable:true}));await wait();
  assert(x.d.querySelector('#productTypeFeedback').textContent.includes('inteira a partir de zero'));checks++;

  // Criar Tipo válido
  x.d.querySelector('#productTypeOrder').value='0';
  x.d.querySelector('#productTypeForm').dispatchEvent(new x.w.Event('submit',{cancelable:true}));await wait();
  assert(x.d.querySelector('#productTypeForm').hidden);
  assert.equal(x.db.product_types.length,1);
  assert.equal(x.db.product_types[0].name,'Individual');
  assert.equal(x.db.product_types[0].sort_order,0);
  assert.equal(x.db.product_types[0].catalog_id,'cat');
  assert.equal(x.d.querySelector('#typesTabCount').textContent,'1');
  assert(x.d.querySelector('#emptyProductTypeState').hidden);checks++;

  // Duplicidade case-insensitive rejeitada com mensagem amigável
  x.d.querySelector('#newProductTypeButton').click();
  x.d.querySelector('#productTypeName').value=' individual ';
  x.d.querySelector('#productTypeOrder').value='1';
  x.d.querySelector('#productTypeForm').dispatchEvent(new x.w.Event('submit',{cancelable:true}));await wait();
  assert.equal(x.db.product_types.length,1);
  assert(x.d.querySelector('#productTypeFeedback').textContent.includes('Já existe um tipo com este nome'));
  x.d.querySelector('#cancelProductTypeButton').click();
  assert(x.d.querySelector('#productTypeForm').hidden);checks++;

  // Editar Tipo - Bloqueio de renomeação quando em uso por produto
  const typeRow=x.d.querySelector('#productTypeList tr');
  assert(typeRow && typeRow.textContent.includes('Individual'));
  // Individual é usado por p2: exclusão bloqueada
  assert(typeRow.querySelector('.category-action--danger').disabled);
  typeRow.querySelectorAll('.category-action')[0].click();
  assert(!x.d.querySelector('#productTypeForm').hidden);
  assert.equal(x.d.querySelector('#productTypeName').value,'Individual');
  // Tentativa de renomear tipo em uso é bloqueada
  x.d.querySelector('#productTypeName').value='Individual Modificado';
  x.d.querySelector('#productTypeForm').dispatchEvent(new x.w.Event('submit',{cancelable:true}));await wait();
  assert(x.d.querySelector('#productTypeFeedback').textContent.includes('está sendo usado por 1 produto'));
  assert.equal(x.db.product_types[0].name,'Individual');
  // Alterar ordem de tipo em uso é permitido
  x.d.querySelector('#productTypeName').value='Individual';
  x.d.querySelector('#productTypeOrder').value='1';
  x.d.querySelector('#productTypeForm').dispatchEvent(new x.w.Event('submit',{cancelable:true}));await wait();
  assert.equal(x.db.product_types[0].sort_order,1);checks++;

  // Criar segundo tipo (Combo, já em uso por p1)
  x.d.querySelector('#newProductTypeButton').click();
  x.d.querySelector('#productTypeName').value='Combo';
  x.d.querySelector('#productTypeOrder').value='2';
  x.d.querySelector('#productTypeForm').dispatchEvent(new x.w.Event('submit',{cancelable:true}));await wait();
  assert.equal(x.db.product_types.length,2);
  const comboRow=Array.from(x.d.querySelectorAll('#productTypeList tr')).find(r=>r.textContent.includes('Combo'));
  assert(comboRow);
  assert(comboRow.querySelector('.category-action--danger').disabled);checks++;

  // Criar terceiro tipo (Kit, não usado por nenhum produto) e excluir
  x.d.querySelector('#newProductTypeButton').click();
  x.d.querySelector('#productTypeName').value='Kit';
  x.d.querySelector('#productTypeOrder').value='3';
  x.d.querySelector('#productTypeForm').dispatchEvent(new x.w.Event('submit',{cancelable:true}));await wait();
  assert.equal(x.db.product_types.length,3);
  const kitRow=Array.from(x.d.querySelectorAll('#productTypeList tr')).find(r=>r.textContent.includes('Kit'));
  assert(kitRow);
  assert(!kitRow.querySelector('.category-action--danger').disabled);
  kitRow.querySelector('.category-action--danger').click();
  assert(!x.d.querySelector('#deleteModal').hidden);
  assert.equal(x.d.querySelector('#deleteModalTitle').textContent,'Excluir tipo?');
  assert(x.d.querySelector('#deleteModalDescription').textContent.includes('Kit'));
  x.d.querySelector('#confirmDeleteButton').click();await wait();
  assert.equal(x.db.product_types.length,2);
  assert(!x.db.product_types.some(t=>t.name==='Kit'));checks++;

  // CONFIGURAÇÕES: GRUPOS DE PRODUTOS
  x.d.querySelector('#groupsTabButton').click();
  assert(!x.d.querySelector('#groupsTabPanel').hidden);
  assert(x.d.querySelector('#typesTabPanel').hidden);
  assert(!x.d.querySelector('#emptyProductGroupState').hidden);
  assert.equal(x.d.querySelector('#groupsTabCount').textContent,'0');checks++;

  // Validação de Grupo: vírgula proibida
  x.d.querySelector('#newProductGroupButton').click();
  assert(!x.d.querySelector('#productGroupForm').hidden);
  x.d.querySelector('#productGroupName').value='Promoções, Ofertas';
  x.d.querySelector('#productGroupForm').dispatchEvent(new x.w.Event('submit',{cancelable:true}));await wait();
  assert(x.d.querySelector('#productGroupFeedback').textContent.includes('não pode conter vírgulas'));checks++;

  // Criar Grupo válido (Destaques)
  x.d.querySelector('#productGroupName').value='Destaques';
  x.d.querySelector('#productGroupOrder').value='0';
  x.d.querySelector('#productGroupForm').dispatchEvent(new x.w.Event('submit',{cancelable:true}));await wait();
  assert(x.d.querySelector('#productGroupForm').hidden);
  assert.equal(x.db.product_groups.length,1);
  assert.equal(x.db.product_groups[0].name,'Destaques');
  assert.equal(x.db.product_groups[0].catalog_id,'cat');
  assert.equal(x.d.querySelector('#groupsTabCount').textContent,'1');
  assert(x.d.querySelector('#emptyProductGroupState').hidden);checks++;

  // Criar Grupo em uso por p1 (Mais pedido)
  x.d.querySelector('#newProductGroupButton').click();
  x.d.querySelector('#productGroupName').value='Mais pedido';
  x.d.querySelector('#productGroupOrder').value='1';
  x.d.querySelector('#productGroupForm').dispatchEvent(new x.w.Event('submit',{cancelable:true}));await wait();
  assert.equal(x.db.product_groups.length,2);
  const maisPedidoRow=Array.from(x.d.querySelectorAll('#productGroupList tr')).find(r=>r.textContent.includes('Mais pedido'));
  assert(maisPedidoRow);
  // Mais pedido é usado por p1: exclusão bloqueada
  assert(maisPedidoRow.querySelector('.category-action--danger').disabled);
  // Tentativa de renomear grupo em uso é bloqueada
  maisPedidoRow.querySelectorAll('.category-action')[0].click();
  assert(!x.d.querySelector('#productGroupForm').hidden);
  x.d.querySelector('#productGroupName').value='Super Oferta';
  x.d.querySelector('#productGroupForm').dispatchEvent(new x.w.Event('submit',{cancelable:true}));await wait();
  assert(x.d.querySelector('#productGroupFeedback').textContent.includes('está sendo usado por 1 produto'));
  // Alterar ordem de grupo em uso é permitido
  x.d.querySelector('#productGroupName').value='Mais pedido';
  x.d.querySelector('#productGroupOrder').value='2';
  x.d.querySelector('#productGroupForm').dispatchEvent(new x.w.Event('submit',{cancelable:true}));await wait();
  assert.equal(x.db.product_groups.find(g=>g.name==='Mais pedido').sort_order,2);checks++;

  // Criar terceiro grupo (Temporário) e excluir
  x.d.querySelector('#newProductGroupButton').click();
  x.d.querySelector('#productGroupName').value='Temporário';
  x.d.querySelector('#productGroupOrder').value='3';
  x.d.querySelector('#productGroupForm').dispatchEvent(new x.w.Event('submit',{cancelable:true}));await wait();
  assert.equal(x.db.product_groups.length,3);
  const tempRow=Array.from(x.d.querySelectorAll('#productGroupList tr')).find(r=>r.textContent.includes('Temporário'));
  assert(!tempRow.querySelector('.category-action--danger').disabled);
  tempRow.querySelector('.category-action--danger').click();
  assert(!x.d.querySelector('#deleteModal').hidden);
  x.d.querySelector('#confirmDeleteButton').click();await wait();
  assert.equal(x.db.product_groups.length,2);
  assert(!x.db.product_groups.some(g=>g.name==='Temporário'));checks++;

  // =========================================================================
  // ETAPA 4: INTEGRAÇÃO DAS CONFIGURAÇÕES AO FORMULÁRIO DE PRODUTOS
  // =========================================================================

  // 1. Novo produto com Tipos e Grupos configurados
  x.d.querySelector('#newProductButton').click();
  assert(!x.d.querySelector('#productModal').hidden);
  // Tipo agora é select com opções carregadas
  const typeOptions = Array.from(x.d.querySelectorAll('#productType option')).map(o => o.value);
  assert(typeOptions.includes(''));
  assert(typeOptions.includes('Individual'));
  assert(typeOptions.includes('Combo'));
  // Grupos agora são checkboxes visuais
  const groupBoxes = Array.from(x.d.querySelectorAll("input[name='productGroupItem']")).map(b => b.value);
  assert(groupBoxes.includes('Destaques'));
  assert(groupBoxes.includes('Mais pedido'));
  // Dinâmica Categoria -> Subcategoria
  x.d.getElementById('productCategory').value = 'other'; // Bebidas (sem subcategorias)
  x.d.getElementById('productCategory').dispatchEvent(new x.w.Event('change'));
  assert.equal(x.d.querySelectorAll('#productSubcategory option').length, 1);
  x.d.getElementById('productCategory').value = 'main'; // Marmitas (tem 'Tradicionais')
  x.d.getElementById('productCategory').dispatchEvent(new x.w.Event('change'));
  const subOptions = Array.from(x.d.querySelectorAll('#productSubcategory option')).map(o => o.value);
  assert(subOptions.includes('child'));

  // Preencher e salvar com Tipo e Múltiplos Grupos selecionados
  x.d.getElementById('productName').value = 'Marmita Fit Especial';
  x.d.getElementById('productPrice').value = '25.00';
  x.d.getElementById('productCategory').value = 'main';
  x.d.getElementById('productSubcategory').value = 'child';
  x.d.getElementById('productType').value = 'Combo';
  Array.from(x.d.querySelectorAll("input[name='productGroupItem']")).forEach(cb => {
    cb.checked = true; // Marca Destaques e Mais pedido
  });
  x.d.querySelector('#productForm').dispatchEvent(new x.w.Event('submit', { cancelable: true })); await wait();

  const fitEspecial = x.db.products.find(p => p.name === 'Marmita Fit Especial');
  assert(fitEspecial);
  assert.equal(fitEspecial.category_id, 'child');
  assert.equal(fitEspecial.product_type, 'Combo');
  assert(fitEspecial.product_groups.includes('Destaques'));
  assert(fitEspecial.product_groups.includes('Mais pedido'));
  assert.equal(fitEspecial.price, '25.00'); checks++;

  // 2. Salvar produto somente com categoria raiz (sem subcategoria)
  x.d.querySelector('#newProductButton').click();
  x.d.getElementById('productName').value = 'Suco de Uva';
  x.d.getElementById('productPrice').value = '8.00';
  x.d.getElementById('productCategory').value = 'other';
  x.d.getElementById('productCategory').dispatchEvent(new x.w.Event('change'));
  x.d.getElementById('productSubcategory').value = '';
  x.d.getElementById('productType').value = ''; // Nenhum tipo
  x.d.querySelector('#productForm').dispatchEvent(new x.w.Event('submit', { cancelable: true })); await wait();
  const sucoUva = x.db.products.find(p => p.name === 'Suco de Uva');
  assert(sucoUva);
  assert.equal(sucoUva.category_id, 'other');
  assert.equal(sucoUva.product_type, null);
  assert.deepEqual(Array.from(sucoUva.product_groups), []); checks++;

  // 3. Edição de produto existente (p1): categorias resolvidas, tipo selecionado e grupos marcados
  const editRow = Array.from(x.d.querySelectorAll('.product-row')).find(r => r.textContent.includes('Combo 10'));
  assert(editRow);
  editRow.querySelector('.row-action').click();
  assert(!x.d.querySelector('#productModal').hidden);
  assert.equal(x.d.getElementById('productCategory').value, 'main');
  assert.equal(x.d.getElementById('productSubcategory').value, 'child');
  assert.equal(x.d.getElementById('productType').value, 'Combo');
  const maisPedidoBox = Array.from(x.d.querySelectorAll("input[name='productGroupItem']")).find(b => b.value === 'Mais pedido');
  assert(maisPedidoBox && maisPedidoBox.checked);
  // Salvar sem alterações preserva os dados intactos
  x.d.querySelector('#productForm').dispatchEvent(new x.w.Event('submit', { cancelable: true })); await wait();
  const p1Saved = x.db.products.find(p => p.id === 'p1');
  assert.equal(p1Saved.product_type, 'Combo');
  assert(p1Saved.product_groups.includes('Mais pedido')); checks++;

  // 4. Injeção arbitrária rejeitada no frontend
  x.d.querySelector('#newProductButton').click();
  x.d.getElementById('productName').value = 'Tentativa Invalida';
  x.d.getElementById('productPrice').value = '10.00';
  x.d.getElementById('productCategory').value = 'main';
  x.d.getElementById('productType').appendChild(new x.w.Option('Invalido', 'Invalido'));
  x.d.getElementById('productType').value = 'Invalido';
  x.d.querySelector('#productForm').dispatchEvent(new x.w.Event('submit', { cancelable: true })); await wait();
  assert(x.d.querySelector('#productFeedback').textContent.includes('não pertence a este catálogo'));
  x.d.querySelector('#closeProductModal').click(); checks++;

  assert.deepEqual(x.errors,[]);x.dom.window.close();

  // 5. Compatibilidade com valores legados não existentes em Configurações
  const legacyDb = fixture();
  legacyDb.products.push({
    id: 'p_legacy',
    catalog_id: 'cat',
    category_id: 'other',
    name: 'Produto Antigo',
    price: 30,
    status: 'active',
    product_type: 'Tipo Raro Descontinuado',
    product_groups: ['Grupo Descontinuado'],
    sort_order: 10
  });
  const xLegacy = await setup('admin', false, legacyDb);
  const legacyRow = Array.from(xLegacy.d.querySelectorAll('.product-row')).find(r => r.textContent.includes('Produto Antigo'));
  assert(legacyRow);
  legacyRow.querySelector('.row-action').click();
  assert(!xLegacy.d.querySelector('#productTypeLegacyWarning').hidden);
  assert(xLegacy.d.querySelector('#productTypeLegacyWarning').textContent.includes('Tipo Raro Descontinuado'));
  assert(!xLegacy.d.querySelector('#productGroupsLegacyWarning').hidden);
  assert(xLegacy.d.querySelector('#productGroupsLegacyWarning').textContent.includes('Grupo Descontinuado'));
  // Salvar sem modificar preserva os valores legados
  xLegacy.d.querySelector('#productForm').dispatchEvent(new xLegacy.w.Event('submit', { cancelable: true })); await wait();
  const legacySaved = xLegacy.db.products.find(p => p.id === 'p_legacy');
  assert.equal(legacySaved.product_type, 'Tipo Raro Descontinuado');
  assert(legacySaved.product_groups.includes('Grupo Descontinuado')); checks++;
  assert.deepEqual(xLegacy.errors, []);
  xLegacy.dom.window.close();

 // Cenário 3: Múltiplas lojas existentes
 const multiDb={
  catalogs:[
   {id:'c1',name:'Loja 1',slug:'loja-1',is_active:true,orders_enabled:true,whatsapp_number:'5511111111111',created_at:'2026-01-01'},
   {id:'c2',name:'Loja 2',slug:'loja-2',is_active:true,orders_enabled:true,whatsapp_number:'5522222222222',created_at:'2026-01-02'}
  ],
  categories:[
   {id:'cat1',catalog_id:'c1',name:'Cat Loja 1',sort_order:0},
   {id:'cat2',catalog_id:'c2',name:'Cat Loja 2',sort_order:0}
  ],
  product_types:[
   {id:'pt1',catalog_id:'c1',name:'Individual',sort_order:0},
   {id:'pt2',catalog_id:'c2',name:'Combo',sort_order:0}
  ],
  product_groups:[
   {id:'pg1',catalog_id:'c1',name:'Destaques',sort_order:0},
   {id:'pg2',catalog_id:'c2',name:'Promoções',sort_order:0}
  ],
  products:[
   {id:'p1',catalog_id:'c1',category_id:'cat1',name:'Produto Loja 1',price:10,status:'active',sort_order:0},
   {id:'p2',catalog_id:'c2',category_id:'cat2',name:'Produto Loja 2',price:20,status:'active',sort_order:0}
  ]
 };
 x=await setup('admin',false,multiDb);
 assert(!x.d.querySelector('#catalogSelect').closest('.catalog-select-field').hidden);
 assert.equal(x.d.querySelectorAll('#catalogSelect option').length,2);
 assert.equal(x.d.querySelector('#newCatalogButton'),null);
 assert.equal(x.d.querySelector('#deleteCatalogButton'),null);
 assert.equal(x.d.querySelectorAll('.product-row').length,1);
 assert(x.d.querySelector('.product-row').textContent.includes('Produto Loja 1'));
 assert(x.d.querySelector('#rootCategoryList').textContent.includes('Cat Loja 1'));
 assert(!x.d.querySelector('#rootCategoryList').textContent.includes('Cat Loja 2'));
 assert(x.d.querySelector('#productTypeList').textContent.includes('Individual'));
 assert(!x.d.querySelector('#productTypeList').textContent.includes('Combo'));
 assert(x.d.querySelector('#productGroupList').textContent.includes('Destaques'));
 assert(!x.d.querySelector('#productGroupList').textContent.includes('Promoções'));checks++;

 // Formulários e modais abertos são fechados ao trocar de loja (evita salvar na loja errada)
 x.d.querySelector('#newProductTypeButton').click();
 assert(!x.d.querySelector('#productTypeForm').hidden);
 x.d.querySelector('#newProductButton').click();
 assert(!x.d.querySelector('#productModal').hidden);

 // Alternar entre lojas isola os produtos e as configurações e fecha modais abertos
 x.d.querySelector('#catalogSelect').value='c2';
 x.d.querySelector('#catalogSelect').dispatchEvent(new x.w.Event('change'));
 await wait();
 assert(x.d.querySelector('#productModal').hidden);
 assert(x.d.querySelector('#productTypeForm').hidden);
 assert.equal(x.d.querySelectorAll('.product-row').length,1);
 assert(x.d.querySelector('.product-row').textContent.includes('Produto Loja 2'));
 assert(!x.d.querySelector('.product-row').textContent.includes('Produto Loja 1'));
 assert(x.d.querySelector('#rootCategoryList').textContent.includes('Cat Loja 2'));
 assert(!x.d.querySelector('#rootCategoryList').textContent.includes('Cat Loja 1'));
 assert(x.d.querySelector('#productTypeList').textContent.includes('Combo'));
 assert(!x.d.querySelector('#productTypeList').textContent.includes('Individual'));
 assert(x.d.querySelector('#productGroupList').textContent.includes('Promoções'));
 assert(!x.d.querySelector('#productGroupList').textContent.includes('Destaques'));

 // Modal de edição de loja também fecha ao alternar loja
 x.d.querySelector('#editCatalogButton').click();
 assert(!x.d.querySelector('#catalogModal').hidden);
 x.d.querySelector('#catalogSelect').value='c1';
 x.d.querySelector('#catalogSelect').dispatchEvent(new x.w.Event('change'));
 await wait();
 assert(x.d.querySelector('#catalogModal').hidden);checks++;
 assert.deepEqual(x.errors,[]);x.dom.window.close();

 // Modo legado
 x=await setup('admin',true);x.d.querySelector('#newProductButton').click();assert(x.d.querySelector('#productType').disabled);assert(!x.d.querySelector('#organizationNotice').hidden);checks++;
 for(const [id,value] of Object.entries({productName:'Legado',productPrice:'5',productCategory:'other'}))x.d.getElementById(id).value=value;
 x.d.querySelector('#productForm').dispatchEvent(new x.w.Event('submit',{cancelable:true}));await wait();
 const request=x.requests.find(r=>r.op==='insert' && r.table==='products');assert(request);assert(!('product_groups' in request.payload));assert(!('product_type' in request.payload));assert.deepEqual(x.errors,[]);checks++;x.dom.window.close();
 console.log(`UI DOM: ${checks} checks passed. Mock Supabase, no layout engine or live backend.`);
})().catch(e=>{console.error(e);process.exit(1);});
