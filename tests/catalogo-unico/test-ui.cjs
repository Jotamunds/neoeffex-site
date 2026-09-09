const fs = require('node:fs');
const assert = require('node:assert/strict');
const {JSDOM, VirtualConsole} = require('jsdom');
const root=require('node:path').resolve(__dirname, '../..') + '/';
const wait=()=>new Promise(r=>setTimeout(r,30));
function fixture(){return {
 catalogs:[{id:'cat',name:'Loja teste',slug:'loja-teste',is_active:true,orders_enabled:true,whatsapp_number:'5511999999999',order_message:'Confirme disponibilidade pelo WhatsApp.',created_at:'2026-01-01'}],
 categories:[{id:'main',catalog_id:'cat',name:'Marmitas',sort_order:0},{id:'child',catalog_id:'cat',name:'Tradicionais',parent_id:'main',sort_order:1},{id:'other',catalog_id:'cat',name:'Bebidas',sort_order:2}],
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
    let rows=db[table].filter(row=>filters.every(([k,v])=>row[k]===v));
    if(op==='insert'){const row={id:'new-'+db[table].length,...payload};db[table].push(row);rows=[row];}
    if(op==='update')rows.forEach(row=>Object.assign(row,payload));
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
 assert(x.d.querySelector('#rootCategoryForm').hidden);
 assert(x.d.querySelector('#subcategoryForm').hidden);
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

 // Sidebar Configurações
 const settingsLink = x.d.querySelector('#settingsMenuLink');
 assert(settingsLink);
 assert(settingsLink.textContent.includes('Configurações'));
 assert.equal(x.d.querySelector('#categoriesMenuLink'),null);
 assert(!x.d.querySelector('#configuracoes').hidden);checks++;

 // Edição de loja existente
 x.d.querySelector('#editCatalogButton').click();
 assert(!x.d.querySelector('#catalogModal').hidden);
 assert.equal(x.d.querySelector('#catalogModalTitle').textContent,'Editar loja');
 assert.equal(x.d.querySelector('#catalogId').value,'cat');
 assert.equal(x.d.querySelector('#catalogName').value,'Loja teste');
 assert.equal(x.d.querySelector('#deleteCatalogButton'),null);checks++;

 // Salvar via UPDATE
 x.d.querySelector('#catalogName').value='Loja Atualizada';
 x.d.querySelector('#catalogForm').dispatchEvent(new x.w.Event('submit',{cancelable:true}));await wait();
 const catalogUpdate=x.requests.find(r=>r.op==='update' && r.table==='catalogs');
 assert(catalogUpdate);assert.equal(catalogUpdate.payload.name,'Loja Atualizada');
 assert(!x.requests.some(r=>r.op==='insert' && r.table==='catalogs'));checks++;

 // Ausência de catalogId aborta e não faz INSERT
 x.d.querySelector('#editCatalogButton').click();
 x.d.querySelector('#catalogId').value='';
 x.d.querySelector('#catalogForm').dispatchEvent(new x.w.Event('submit',{cancelable:true}));await wait();
 assert(!x.requests.some(r=>r.op==='insert' && r.table==='catalogs'));
 assert(x.d.querySelector('#catalogFeedback').textContent.includes('nenhuma loja'));checks++;
 x.d.querySelector('#closeCatalogModal').click();

 // Produtos funcionam na loja ativa
 x.d.querySelector('#newProductButton').click();assert(!x.d.querySelector('#productModal').hidden);assert(!x.d.querySelector('#productType').disabled);checks++;
 for(const [id,value] of Object.entries({productName:'Produto novo',productPrice:'12.50',productType:'Combo',productGroups:'Novo, novo, Oferta',productCategory:'child'}))x.d.getElementById(id).value=value;
 x.d.querySelector('#productForm').dispatchEvent(new x.w.Event('submit',{cancelable:true}));await wait();
 const product=x.db.products.find(p=>p.name==='Produto novo');assert(product);assert.equal(product.product_type,'Combo');assert.deepEqual(Array.from(product.product_groups),['Novo','Oferta']);assert.equal(product.category_id,'child');assert.equal(product.price,'12.50');checks++;

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

 assert.deepEqual(x.errors,[]);x.dom.window.close();

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
 assert(!x.d.querySelector('#rootCategoryList').textContent.includes('Cat Loja 2'));checks++;

 // Formulário aberto é fechado ao trocar de loja (evita salvar na loja errada)
 x.d.querySelector('#newRootCategoryButton').click();
 assert(!x.d.querySelector('#rootCategoryForm').hidden);

 // Alternar entre lojas isola os produtos e as configurações
 x.d.querySelector('#catalogSelect').value='c2';
 x.d.querySelector('#catalogSelect').dispatchEvent(new x.w.Event('change'));
 await wait();
 assert.equal(x.d.querySelectorAll('.product-row').length,1);
 assert(x.d.querySelector('.product-row').textContent.includes('Produto Loja 2'));
 assert(!x.d.querySelector('.product-row').textContent.includes('Produto Loja 1'));
 assert(x.d.querySelector('#rootCategoryList').textContent.includes('Cat Loja 2'));
 assert(!x.d.querySelector('#rootCategoryList').textContent.includes('Cat Loja 1'));
 assert(x.d.querySelector('#rootCategoryForm').hidden);checks++;
 assert.deepEqual(x.errors,[]);x.dom.window.close();

 // Modo legado
 x=await setup('admin',true);x.d.querySelector('#newProductButton').click();assert(x.d.querySelector('#productType').disabled);assert(!x.d.querySelector('#organizationNotice').hidden);checks++;
 for(const [id,value] of Object.entries({productName:'Legado',productPrice:'5',productCategory:'other'}))x.d.getElementById(id).value=value;
 x.d.querySelector('#productForm').dispatchEvent(new x.w.Event('submit',{cancelable:true}));await wait();
 const request=x.requests.find(r=>r.op==='insert' && r.table==='products');assert(request);assert(!('product_groups' in request.payload));assert(!('product_type' in request.payload));assert.deepEqual(x.errors,[]);checks++;x.dom.window.close();
 console.log(`UI DOM: ${checks} checks passed. Mock Supabase, no layout engine or live backend.`);
})().catch(e=>{console.error(e);process.exit(1);});
