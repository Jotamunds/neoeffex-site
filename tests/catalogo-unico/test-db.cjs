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

 await sql(`set role authenticated; set request.jwt.claim.sub=${q(a)}; update products set status='paused' where catalog_id=${q(ca)}; set role anon;`);
 assert.equal((await one(`select count(id)::int n from products where catalog_id=${q(ca)}`)).n,0);checks++;
 await sql(`set role authenticated; set request.jwt.claim.sub=${q(a)}; update catalogs set is_active=false where id=${q(ca)}; set role anon;`);
 assert.equal((await one(`select count(id)::int n from categories where catalog_id=${q(ca)}`)).n,0);checks++;
 await sql(`set role authenticated; set request.jwt.claim.sub=${q(a)};`);
 await ok('delete populated hierarchy via old RPC',`select delete_own_paused_catalog(${q(ca)});`);
 // Confirma que exclusão do catálogo removeu types e groups vinculados em cascata
 assert.equal((await one(`select count(*)::int n from product_types where catalog_id=${q(ca)}`)).n, 0); checks++; console.log('PASS catalog deletion cascades product_types');
 assert.equal((await one(`select count(*)::int n from product_groups where catalog_id=${q(ca)}`)).n, 0); checks++; console.log('PASS catalog deletion cascades product_groups');
 await sql('reset role');

 // A reaplicação deve falhar antes de tocar em dados.
 try {await sql(migration); assert.fail('repeat should fail');} catch(e){assert.match(e.message,/stores já existe/);await sql('rollback');checks++;}
 try {await sql(migrationTypesGroups); assert.fail('repeat types_groups should fail');} catch(e){assert.match(e.message,/product_types ou product_groups já existem/);await sql('rollback');checks++;}

 console.log(`DATABASE: ${checks} checks passed (PGlite PostgreSQL 18.3; fixture from supplied diagnostic).`);
 await db.close();
})().catch(e=>{console.error(e.message,e.code);process.exit(1);});
