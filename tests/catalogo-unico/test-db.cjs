const fs = require('node:fs');
const assert = require('node:assert/strict');
const {PGlite} = require('@electric-sql/pglite');
const root = require('node:path').resolve(__dirname, '../..') + '/';
const diag = JSON.parse(fs.readFileSync(require('node:path').join(__dirname, 'schema-fixture.json')));
const q = v => "'" + v.replaceAll("'", "''") + "'";
const a = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const b = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const ca = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc';
const cb = 'dddddddd-dddd-4ddd-8ddd-dddddddddddd';

(async () => {
 const db = new PGlite(); let checks=0;
 const sql = s => db.exec(s);
 const one = async s => (await db.query(s)).rows[0];
 async function ok(name,s){await sql(s); checks++; console.log('PASS',name);}
 async function denied(name,s,code){
   await sql('begin');
   try{await sql(s);await sql('set constraints all immediate');assert.fail('Unexpected success: '+name);}
   catch(e){assert.equal(e.code,code,name+': '+e.message); checks++; console.log('PASS denied',name);}
   finally{await sql('rollback');}
 }
 await sql(`create role anon; create role authenticated; create schema auth;
 create table auth.users(id uuid primary key, email text);
 create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
 grant usage on schema public, auth to anon, authenticated;
 grant execute on function auth.uid() to anon, authenticated;`);
 for(const table of ['catalogs','categories','products']){
   const cols=diag.colunas.filter(c=>c.tabela===table);
   // Os nomes exatos das chaves são conferidos antes de executar este fixture.
   await sql(`create table public.${table} (${cols.map(c=>`${c.coluna} ${c.tipo} ${c.valor_padrao ? 'default '+c.valor_padrao : ''} ${c.aceita_nulo === 'NO' ? 'not null' : ''}`).join(',')});`);
 }
 for(const c of diag.restricoes) await sql(`alter table public.${c.tabela} add constraint ${c.nome} ${c.definicao};`);
 await sql('create unique index categories_catalog_id_name_lower_key on public.categories(catalog_id, lower(name));');
 for(const t of ['catalogs','categories','products']) await sql(`alter table public.${t} enable row level security; grant select,insert,update,delete on public.${t} to authenticated;`);
 for(const t of ['catalogs','categories','products']){
   const cols=diag.permissoes_colunas.filter(c=>c.tabela===t && c.papel==='anon' && c.privilegio==='SELECT').map(c=>c.coluna);
   await sql(`grant select (${cols.join(',')}) on public.${t} to anon;`);
 }
 for(const p of diag.politicas.filter(p=>p.schema==='public')) await sql(`create policy ${p.nome} on public.${p.tabela} for ${p.operacao} to ${p.papeis.join(',')} ${p.using_expression?'using ('+p.using_expression+')':''} ${p.check_expression?'with check ('+p.check_expression+')':''};`);
 await sql(`create function public.set_updated_at() returns trigger language plpgsql as $$ begin new.updated_at=now(); return new; end $$;`);
 for(const c of diag.catalogos){
   await sql(`insert into auth.users(id) values (${q(c.owner_id)}) on conflict do nothing;`);
   await sql(`insert into public.catalogs(id,owner_id,name,slug,is_active) values (${q(c.id)},${q(c.owner_id)},${q(c.nome)},${q(c.slug)},${c.ativo});`);
 }
 const deletion=fs.readFileSync(root+'admin/setup/010_delete_paused_catalog.sql','utf8');
 await sql(deletion.slice(deletion.indexOf('create or replace function'),deletion.indexOf('comment on function')));
 await sql(`update auth.users set email='m.luzimarjw@gmail.com' where id=${q(a)};`);
 const before=await db.query('select id, owner_id, slug, name, is_active from public.catalogs order by id');
 const migration=fs.readFileSync(root+'supabase/migrations/20260907235435_store_catalog_organization.sql','utf8');
 await ok('migration on diagnostic schema',migration);
 assert.deepEqual((await db.query('select id, owner_id, slug, name, is_active from public.catalogs order by id')).rows,before.rows);
 assert.equal((await one('select count(*)::int n from stores')).n,4);
 const verified=JSON.parse((await one(fs.readFileSync(root+'admin/setup/verify_store_catalog_organization.sql','utf8'))).verificacao);
 assert(Object.values(verified.verificacoes).every(v=>v===true)); checks++; console.log('PASS read-only verification SQL');
 checks++; console.log('PASS four stores, original catalog identity preserved');
 // Todas as transações seguintes usam os papéis reais, não privilégios postgres.
 await sql(`set role authenticated; set request.jwt.claim.sub=${q(a)};`);
 assert.equal((await one('select count(*)::int n from stores')).n,1);checks++;
 await denied('cross-account store insert',`insert into stores(owner_id) values (${q(b)})`,'42501');
 await denied('standalone store',`insert into stores(owner_id) values (${q(a)})`,'23503');
 await denied('second catalog same store',`insert into catalogs(owner_id,name,slug,store_id) values (${q(a)},'Duplicate','duplicate',${q(ca)})`,'23505');
 await denied('catalog in another account store',`insert into catalogs(owner_id,name,slug,store_id) values (${q(a)},'Other store','other-store',${q(cb)})`,'23505');
 await ok('old admin INSERT creates pair',`insert into catalogs(owner_id,name,slug,is_active) values (${q(a)},'New store','new-store',false);`);
 await denied('cannot delete live store',`delete from stores where id=${q(ca)}`,'23503');
 const nc=await one("select id,store_id from catalogs where slug='new-store'");
 await ok('paused deletion RPC also removes store',`select delete_own_paused_catalog('${nc.id}');`);
 assert.equal((await one(`select count(*)::int n from stores where id='${nc.store_id}'`)).n,0);
 const rootCategory='10000000-0000-4000-8000-000000000001';
 const child='10000000-0000-4000-8000-000000000002';
 const other='10000000-0000-4000-8000-000000000003';
 await ok('category and subcategory',`insert into categories(id,catalog_id,name) values ('${rootCategory}',${q(ca)},'Marmitas'); insert into categories(id,catalog_id,name,parent_id) values ('${child}',${q(ca)},'Tradicionais','${rootCategory}');`);
 await denied('third level',`insert into categories(catalog_id,name,parent_id) values (${q(ca)},'Third level','${child}')`,'23503');
 await denied('cycle',`update categories set parent_id='${child}' where id='${rootCategory}'`,'23503');
 await denied('delete parent with children',`delete from categories where id='${rootCategory}'`,'23503');
 await sql(`set request.jwt.claim.sub=${q(b)}; insert into categories(id,catalog_id,name) values ('${other}',${q(cb)},'Other'); set request.jwt.claim.sub=${q(a)};`);
 await denied('parent from another store',`insert into categories(catalog_id,name,parent_id) values (${q(ca)},'Cross store','${other}')`,'23503');
 await ok('product with type and groups',`insert into products(catalog_id,category_id,name,price,product_type,product_groups) values (${q(ca)},'${child}','Combo 10',150,'Tradicional',array['Combo','Mais pedido']);`);
 await ok('second product with mixed case and groups',`insert into products(catalog_id,category_id,name,price,product_type,product_groups) values (${q(ca)},'${child}','Marmita Fit',25,'tradicional',array['mais pedido','Promoção']);`);
 await sql(`set request.jwt.claim.sub=${q(b)}; insert into products(catalog_id,category_id,name,price,product_type,product_groups) values (${q(cb)},'${other}','Suco',5,'Tradicional',array['Mais pedido']); set request.jwt.claim.sub=${q(a)};`);
 await denied('duplicate groups',`update products set product_groups=array['Combo','combo'] where catalog_id=${q(ca)}`,'23514');
 await denied('invalid group separator',`update products set product_groups=array['A, B'] where catalog_id=${q(ca)}`,'23514');
 await denied('null group entry',`update products set product_groups=array[null]::text[] where catalog_id=${q(ca)}`,'23514');
 await denied('too many groups',`update products set product_groups=array(select n::text from generate_series(1,11) n) where catalog_id=${q(ca)}`,'23514');
 await denied('cross-account product insert',`insert into products(catalog_id,category_id,name,price) values (${q(cb)},'${other}','Intruder',1)`,'42501');
 await sql(`set request.jwt.claim.sub=${q(b)};`);
 assert.equal((await one(`select count(*)::int n from products where catalog_id=${q(ca)}`)).n,0);checks++;
 assert.equal((await db.query(`update products set name='Intruder' where catalog_id=${q(ca)} returning id`)).rows.length,0);checks++;
 await sql(`set role anon; reset request.jwt.claim.sub;`);
 await ok('anon reads classifications',`select parent_id from categories; select product_type, product_groups from products;`);
 await denied('anon stores private',`select * from stores`,'42501');
 await denied('anon owner private',`select owner_id from catalogs`,'42501');
 await denied('anon writes denied',`insert into categories(catalog_id,name) values (${q(ca)},'Anon')`,'42501');

 // ETAPA 3A — Aplicação da migração de product_types e product_groups
 await sql('reset role');
 const migrationTypesGroups = fs.readFileSync(root + 'supabase/migrations/20260909194500_catalog_product_types_groups.sql', 'utf8');
 await ok('migration types and groups', migrationTypesGroups);

 // Verificação pós-migration via script SQL
 const verifiedTypes = JSON.parse((await one(fs.readFileSync(root + 'admin/setup/verify_catalog_types_and_groups.sql', 'utf8'))).verificacao);
 assert(Object.values(verifiedTypes.verificacoes).every(v => v === true), 'Todas as verificações de types e groups devem passar');
 checks++; console.log('PASS verify_catalog_types_and_groups read-only SQL');

 // Conferir totais e deduplicação do backfill
 // ca: 1 tipo único ('Tradicional') e 3 grupos únicos ('Combo', 'Mais pedido', 'Promoção')
 // cb: 1 tipo único ('Tradicional') e 1 grupo único ('Mais pedido')
 assert.equal(verifiedTypes.totais.product_types, 2);
 assert.equal(verifiedTypes.totais.product_groups, 4);
 checks++; console.log('PASS backfill counts and case deduplication');

 // Testes com papéis reais
 await sql(`set role authenticated; set request.jwt.claim.sub=${q(a)};`);

 // Mesmo nome permitido em catálogo diferente
 await ok('same name allowed in different catalog', `insert into product_types(catalog_id, name) values (${q(ca)}, 'Bebida');`);
 await sql(`set request.jwt.claim.sub=${q(b)}; insert into product_types(catalog_id, name) values (${q(cb)}, 'Bebida'); set request.jwt.claim.sub=${q(a)};`);
 checks++; console.log('PASS same name in different catalog');

 // Duplicidade case-insensitive negada no mesmo catálogo
 await denied('duplicate type same case', `insert into product_types(catalog_id, name) values (${q(ca)}, 'Bebida')`, '23505');
 await denied('duplicate type different case', `insert into product_types(catalog_id, name) values (${q(ca)}, 'bebida')`, '23505');
 await denied('duplicate group same case', `insert into product_groups(catalog_id, name) values (${q(ca)}, 'Combo')`, '23505');
 await denied('duplicate group different case', `insert into product_groups(catalog_id, name) values (${q(ca)}, 'combo')`, '23505');

 // Validação de nomes e campos
 await denied('empty type name', `insert into product_types(catalog_id, name) values (${q(ca)}, '')`, '23514');
 await denied('whitespace only type name', `insert into product_types(catalog_id, name) values (${q(ca)}, '   ')`, '23514');
 await denied('type name over 60 chars', `insert into product_types(catalog_id, name) values (${q(ca)}, '${'A'.repeat(61)}')`, '23514');
 await denied('group name with comma', `insert into product_groups(catalog_id, name) values (${q(ca)}, 'A, B')`, '23514');
 await denied('negative sort order', `insert into product_types(catalog_id, name, sort_order) values (${q(ca)}, 'Valido', -1)`, '23514');
 await denied('nonexistent catalog_id under rls', `insert into product_types(catalog_id, name) values ('00000000-0000-0000-0000-000000000000', 'Valido')`, '42501');
 await sql('reset role');
 await denied('nonexistent catalog_id fk violation', `insert into product_types(catalog_id, name) values ('00000000-0000-0000-0000-000000000000', 'Valido')`, '23503');
 await sql(`set role authenticated; set request.jwt.claim.sub=${q(a)};`);

 // Segurança RLS
 await denied('cross-account insert type', `insert into product_types(catalog_id, name) values (${q(cb)}, 'Hacker')`, '42501');
 await denied('cross-account insert group', `insert into product_groups(catalog_id, name) values (${q(cb)}, 'Hacker')`, '42501');
 await sql(`set request.jwt.claim.sub=${q(b)};`);
 assert.equal((await one(`select count(*)::int n from product_types where catalog_id=${q(ca)}`)).n, 0); checks++;
 assert.equal((await db.query(`update product_types set name='Hacked' where catalog_id=${q(ca)} returning id`)).rows.length, 0); checks++;
 assert.equal((await db.query(`delete from product_types where catalog_id=${q(ca)} returning id`)).rows.length, 0); checks++;
 await sql(`set request.jwt.claim.sub=${q(a)};`);

 // Anon negado em product_types e product_groups
 await sql(`set role anon; reset request.jwt.claim.sub;`);
 await denied('anon select product_types denied', `select * from product_types`, '42501');
 await denied('anon select product_groups denied', `select * from product_groups`, '42501');
 await denied('anon insert product_types denied', `insert into product_types(catalog_id, name) values (${q(ca)}, 'Anon')`, '42501');
 await denied('anon insert product_groups denied', `insert into product_groups(catalog_id, name) values (${q(ca)}, 'Anon')`, '42501');
 await denied('anon update product_types denied', `update product_types set name='Anon'`, '42501');
 await denied('anon delete product_types denied', `delete from product_types`, '42501');

  // ETAPA 1 — Aplicação da migração de catalog_profile e purchase_mode
  await sql('reset role');
  const migrationProfilesPurchaseMode = fs.readFileSync(root + 'supabase/migrations/20260910170000_catalog_profiles_purchase_mode.sql', 'utf8');
  await ok('migration profiles and purchase mode', migrationProfilesPurchaseMode);

  // Verificação pós-migration via script SQL
  const verifiedProfiles = JSON.parse((await one(fs.readFileSync(root + 'admin/setup/verify_catalog_profiles_and_purchase_mode.sql', 'utf8'))).verificacao);
  assert.equal(verifiedProfiles.status, 'PASS', 'Todas as verificações de profiles e purchase_mode devem passar');
  checks++; console.log('PASS verify_catalog_profiles_and_purchase_mode read-only SQL');

  // Conferir defaults dos registros existentes
  const defaultCatalog = await one(`select catalog_profile, minimum_order_quantity from catalogs where id=${q(cb)}`);
  assert.equal(defaultCatalog.catalog_profile, 'standard');
  assert.equal(defaultCatalog.minimum_order_quantity, null);
  const defaultProduct = await one(`select purchase_mode from products where catalog_id=${q(cb)} limit 1`);
  assert.equal(defaultProduct.purchase_mode, 'simple');
  checks++; console.log('PASS catalog_profile_default_standard and product_purchase_mode_default_simple');

  // Testes de constraints de perfis e purchase_mode
  await sql(`set role authenticated; set request.jwt.claim.sub=${q(b)};`);
  await denied('invalid catalog profile', `update catalogs set catalog_profile='invalid_profile' where id=${q(cb)}`, '23514');
  await denied('zero minimum order quantity', `update catalogs set minimum_order_quantity=0 where id=${q(cb)}`, '23514');
  await denied('negative minimum order quantity', `update catalogs set minimum_order_quantity=-1 where id=${q(cb)}`, '23514');
  await denied('invalid purchase mode', `update products set purchase_mode='invalid_mode' where catalog_id=${q(cb)}`, '23514');

  // Atualizações válidas
  await ok('valid profile marmitas and minimum order', `update catalogs set catalog_profile='marmitas', minimum_order_quantity=5 where id=${q(cb)};`);
  await ok('valid purchase mode flavor_bundle', `update products set purchase_mode='flavor_bundle' where catalog_id=${q(cb)};`);
  checks++; console.log('PASS catalog_profile_marmitas and product_purchase_mode_flavor_bundle');

  // Anon lê novas colunas públicas
  await sql(`set role anon; reset request.jwt.claim.sub;`);
  await ok('anon reads profile and purchase mode', `select catalog_profile, minimum_order_quantity from catalogs; select purchase_mode from products;`);

  // ETAPA 2 — Aplicação da migração de flavors e product_flavors
  await sql('reset role');
  const migrationFlavors = fs.readFileSync(root + 'supabase/migrations/20260910173000_catalog_flavors.sql', 'utf8');
  await ok('migration flavors and product_flavors', migrationFlavors);

  // Verificação pós-migration via script SQL
  const verifiedFlavors = JSON.parse((await one(fs.readFileSync(root + 'admin/setup/verify_catalog_flavors.sql', 'utf8'))).verificacao);
  assert.equal(verifiedFlavors.status, 'PASS', 'Todas as verificações de flavors e product_flavors devem passar');
  checks++; console.log('PASS verify_catalog_flavors read-only SQL');

  // Recupera produtos de ca e cb para testes relacionais
  const prodA = (await one(`select id from products where catalog_id=${q(ca)} limit 1`)).id;
  const prodB = (await one(`select id from products where catalog_id=${q(cb)} limit 1`)).id;

  // CRUD e constraints de flavors
  await sql(`set role authenticated; set request.jwt.claim.sub=${q(a)};`);
  const flavorA1 = (await one(`insert into flavors(catalog_id, name, description, sort_order) values (${q(ca)}, 'Frango com Catupiry', 'Delicioso frango desfiado', 10) returning id`)).id;
  const flavorA2 = (await one(`insert into flavors(catalog_id, name, description, sort_order) values (${q(ca)}, 'Carne de Panela', 'Carne macia com legumes', 20) returning id`)).id;
  checks += 2; console.log('PASS flavors_crud insert');

  // Validações de constraints em flavors
  await denied('empty flavor name', `insert into flavors(catalog_id, name) values (${q(ca)}, '')`, '23514');
  await denied('whitespace only flavor name', `insert into flavors(catalog_id, name) values (${q(ca)}, '   ')`, '23514');
  await denied('duplicate flavor same case', `insert into flavors(catalog_id, name) values (${q(ca)}, 'Frango com Catupiry')`, '23505');
  await denied('duplicate flavor different case', `insert into flavors(catalog_id, name) values (${q(ca)}, 'frango com catupiry')`, '23505');
  await denied('negative sort order flavor', `insert into flavors(catalog_id, name, sort_order) values (${q(ca)}, 'Novo Sabor', -1)`, '23514');

  // Relação product_flavors
  await ok('product_flavors insert valid', `insert into product_flavors(product_id, flavor_id, catalog_id, sort_order, additional_price, is_available) values (${q(prodA)}, ${q(flavorA1)}, ${q(ca)}, 1, 0.00, true);`);
  await ok('product_flavors with additional price', `insert into product_flavors(product_id, flavor_id, catalog_id, sort_order, additional_price, is_available) values (${q(prodA)}, ${q(flavorA2)}, ${q(ca)}, 2, 5.00, true);`);
  checks += 2; console.log('PASS product_flavors_relation and flavor_additional_price');

  // Validações de constraints em product_flavors
  await denied('negative additional price', `insert into product_flavors(product_id, flavor_id, catalog_id, additional_price) values (${q(prodA)}, ${q(flavorA1)}, ${q(ca)}, -5.00)`, '23514');
  await denied('duplicate product flavor', `insert into product_flavors(product_id, flavor_id, catalog_id) values (${q(prodA)}, ${q(flavorA1)}, ${q(ca)})`, '23505');

  // ISOLAMENTO ANTI-CRUZAMENTO DE CATÁLOGOS NO BANCO
  // Usuário B cria um sabor no catálogo CB
  await sql(`set request.jwt.claim.sub=${q(b)};`);
  const flavorB1 = (await one(`insert into flavors(catalog_id, name) values (${q(cb)}, 'Vegano Especial') returning id`)).id;
  checks++;

  // Tentativa de associar produto de Ca com sabor de Cb (anti-cruzamento FK composta)
  await sql(`reset role`); // mesmo sem RLS, a constraint relacional composta impede o cruzamento
  await denied('cross-catalog flavor association (prodA with flavorB1)', `insert into product_flavors(product_id, flavor_id, catalog_id) values (${q(prodA)}, ${q(flavorB1)}, ${q(ca)})`, '23503');
  // Usar flavorA2 que já foi inserido mas com produto diferente ou novo sabor
  const flavorA3 = (await one(`insert into flavors(catalog_id, name) values (${q(ca)}, 'Calabresa Acebolada') returning id`)).id;
  await denied('mismatched catalog_id in product_flavors', `insert into product_flavors(product_id, flavor_id, catalog_id) values (${q(prodA)}, ${q(flavorA3)}, ${q(cb)})`, '23503');
  console.log('PASS product_flavors_isolation strict composite FKs');

  // SEGURANÇA E RLS EM FLAVORS E PRODUCT_FLAVORS
  await sql(`set role authenticated; set request.jwt.claim.sub=${q(b)};`);
  // Usuário B tenta inserir sabor no catálogo de A
  await denied('cross-account insert flavor', `insert into flavors(catalog_id, name) values (${q(ca)}, 'Invasao')`, '42501');
  // Usuário B tenta associar sabor no catálogo de A
  await denied('cross-account insert product_flavors', `insert into product_flavors(product_id, flavor_id, catalog_id) values (${q(prodA)}, ${q(flavorA1)}, ${q(ca)})`, '42501');
  // Usuário B não vê nem altera sabores de A
  assert.equal((await one(`select count(*)::int n from flavors where catalog_id=${q(ca)}`)).n, 0); checks++;
  assert.equal((await db.query(`update flavors set name='Hacked' where catalog_id=${q(ca)} returning id`)).rows.length, 0); checks++;
  assert.equal((await db.query(`delete from flavors where catalog_id=${q(ca)} returning id`)).rows.length, 0); checks++;
  console.log('PASS flavors_rls');

  // Anon lê sabores ativos de produtos ativos
  await sql(`set role anon; reset request.jwt.claim.sub;`);
  const anonFlavors = (await db.query(`select f.name, pf.additional_price from product_flavors pf join flavors f on f.id = pf.flavor_id where pf.catalog_id=${q(ca)}`)).rows;
  assert.equal(anonFlavors.length, 2); checks++;
  await denied('anon insert flavor denied', `insert into flavors(catalog_id, name) values (${q(ca)}, 'Anon')`, '42501');
  await denied('anon insert product_flavors denied', `insert into product_flavors(product_id, flavor_id, catalog_id) values (${q(prodA)}, ${q(flavorA1)}, ${q(ca)})`, '42501');

  await sql('reset role');

  await sql(`set role authenticated; set request.jwt.claim.sub=${q(a)}; update products set status='paused' where catalog_id=${q(ca)}; set role anon;`);
  assert.equal((await one(`select count(id)::int n from products where catalog_id=${q(ca)}`)).n,0);checks++;
  await sql(`set role authenticated; set request.jwt.claim.sub=${q(a)}; update catalogs set is_active=false where id=${q(ca)}; set role anon;`);
  assert.equal((await one(`select count(id)::int n from categories where catalog_id=${q(ca)}`)).n,0);checks++;
  await sql(`set role authenticated; set request.jwt.claim.sub=${q(a)};`);
  await ok('delete populated hierarchy via updated RPC',`select delete_own_paused_catalog(${q(ca)});`);
  // Confirma que exclusão do catálogo removeu types, groups, flavors e product_flavors vinculados em cascata
  assert.equal((await one(`select count(*)::int n from product_types where catalog_id=${q(ca)}`)).n, 0); checks++; console.log('PASS catalog deletion cascades product_types');
  assert.equal((await one(`select count(*)::int n from product_groups where catalog_id=${q(ca)}`)).n, 0); checks++; console.log('PASS catalog deletion cascades product_groups');
  assert.equal((await one(`select count(*)::int n from flavors where catalog_id=${q(ca)}`)).n, 0); checks++; console.log('PASS catalog deletion cascades flavors');
  assert.equal((await one(`select count(*)::int n from product_flavors where catalog_id=${q(ca)}`)).n, 0); checks++; console.log('PASS catalog deletion cascades product_flavors');
  await sql('reset role');

  // ETAPA LOGO ASPECT RATIO — Aplicação da migração de catalogs.logo_aspect_ratio
  const migrationLogoRatio = fs.readFileSync(root + 'supabase/migrations/20260910200000_catalog_logo_aspect_ratio.sql', 'utf8');
  await ok('migration logo_aspect_ratio', migrationLogoRatio);

  // Verificação pós-migration via script SQL
  const verifiedLogoRatio = JSON.parse((await one(fs.readFileSync(root + 'admin/setup/verify_catalog_logo_aspect_ratio.sql', 'utf8'))).verificacao);
  assert.equal(verifiedLogoRatio.status, 'PASS', 'Todas as verificações de logo_aspect_ratio devem passar');
  checks++; console.log('PASS verify_catalog_logo_aspect_ratio read-only SQL');

  // Conferir default dos catálogos existentes: square
  const defaultLogoRatio = await one(`select logo_aspect_ratio from catalogs where id=${q(cb)}`);
  assert.equal(defaultLogoRatio.logo_aspect_ratio, 'square');
  checks++; console.log('PASS logo_ratio_default_square');

  // Testes de constraints de logo_aspect_ratio
  await sql(`set role authenticated; set request.jwt.claim.sub=${q(b)};`);
  await denied('invalid logo aspect ratio', `update catalogs set logo_aspect_ratio='invalid_ratio' where id=${q(cb)}`, '23514');
  await ok('logo_ratio_portrait_3_4', `update catalogs set logo_aspect_ratio='portrait_3_4' where id=${q(cb)};`);
  await ok('logo_ratio_landscape_4_3', `update catalogs set logo_aspect_ratio='landscape_4_3' where id=${q(cb)};`);
  await ok('logo_ratio_square', `update catalogs set logo_aspect_ratio='square' where id=${q(cb)};`);

  // Anon lê nova coluna pública
  await sql(`set role anon; reset request.jwt.claim.sub;`);
  const anonLogo = await one(`select logo_aspect_ratio from catalogs where id=${q(cb)}`);
  assert.equal(anonLogo.logo_aspect_ratio, 'square'); checks++; console.log('PASS anon reads logo_aspect_ratio');
  await sql('reset role');

 // A reaplicação deve falhar antes de tocar em dados para tabelas estruturais, ou ser idempotente para alterações de colunas.
 try {await sql(migration); assert.fail('repeat should fail');} catch(e){assert.match(e.message,/stores já existe/);await sql('rollback');checks++;}
 try {await sql(migrationTypesGroups); assert.fail('repeat types_groups should fail');} catch(e){assert.match(e.message,/product_types ou product_groups já existem/);await sql('rollback');checks++;}
 await ok('repeat profiles_purchase_mode idempotent', migrationProfilesPurchaseMode);
 try {await sql(migrationFlavors); assert.fail('repeat flavors should fail');} catch(e){assert.match(e.message,/flavors ou product_flavors já existem/);await sql('rollback');checks++;}
 await ok('repeat logo_aspect_ratio idempotent', migrationLogoRatio);

 console.log(`DATABASE: ${checks} checks passed (PGlite PostgreSQL 18.3; fixture from supplied diagnostic).`);
 await db.close();
})().catch(e=>{console.error(e.message,e.code);process.exit(1);});

