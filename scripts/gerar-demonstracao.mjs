#!/usr/bin/env node
// Gera uma cópia de demonstração do relatório com dados FICTÍCIOS, cifrados com
// o mesmo esquema da versão oficial (PBKDF2-SHA256 310.000 iterações + AES-GCM 256).
// Serve para revisar o layout sem acesso aos dados reais. Código de acesso: teste123
// Uso: node scripts/gerar-demonstracao.mjs [index.html] [demonstracao/index.html]
// A pasta demonstracao/ é ignorada pelo git e nunca deve ser publicada.
import {readFileSync, writeFileSync, mkdirSync} from "node:fs";
import {dirname} from "node:path";
import {webcrypto as c} from "node:crypto";
const [,, entrada = "index.html", saida = "demonstracao/index.html"] = process.argv;
const enc = new TextEncoder(), b64 = u => Buffer.from(u).toString("base64");
const ETAPAS = ["Em projeto","Em especificação e orçamento","Em contratação","Contratada — aguardando início","Obra em andamento","Concluída"];
const LISTA_DE = {"Em projeto":["Concepção","Projetos em Elaboração"],"Em especificação e orçamento":["TR em Elaboração","Cotação / Orçamento"],"Em contratação":["Licitação / Contratação"],"Contratada — aguardando início":["Contrato Assinado"],"Obra em andamento":["Em Execução"],"Concluída":["Concluído"]};
const objs = ["Reforma da cobertura do Pavilhão de Aulas","Requalificação elétrica da Biblioteca Central","Adequação de acessibilidade — Escola Politécnica","Impermeabilização da laje do Instituto de Química","Construção de laboratório multiusuário","Reforma de sanitários do PAF I","Substituição do sistema de climatização da Reitoria","Recuperação estrutural da passarela de Ondina","Instalação de SPDA no Instituto de Biologia","Reforma do auditório da Faculdade de Direito","Pintura e esquadrias — Faculdade de Educação","Rede lógica do Instituto de Matemática","Adequação do Corpo de Bombeiros — Escola de Música","Reforma da cantina do campus Canela"];
const locais=["Ondina","Federação","Canela","Vitória da Conquista","Camaçari"];
const obras = objs.map((o,i)=>{const etapa=ETAPAS[i%ETAPAS.length]; const l=LISTA_DE[etapa]; const contratada=i%6>=3; return {numero:`${23000+i*17}/2026`,objeto:o,local:locais[i%5],etapa,lista:l[i%l.length],contratada:contratada?["Construtora Alfa Ltda","Beta Engenharia S.A.","Gama Serviços"][i%3]:null,valor:contratada?150000+i*87345.5:null,orcado:180000+i*90000,vigencia:contratada?`${10+i%18}/0${1+i%9}/2027`:null,situacao:i===4?["critico","Prazo vencido"]:null,labels:i%5===0?["Em aditivo"]:[],resumo:["Processo em acompanhamento regular pelas equipes técnica e contratual.","Documentação completa anexada ao cartão."],custom_fields:i%4===0?{"Próximo marco":"Emissão da ordem de serviço"}:{}};});
const dataset = {gerado_em:"05/10/2026 08:00", ordem_etapas:ETAPAS, obras};
const dk = c.getRandomValues(new Uint8Array(32));
const dkKey = await c.subtle.importKey("raw", dk, "AES-GCM", false, ["encrypt"]);
const ivd = c.getRandomValues(new Uint8Array(12));
const blob = new Uint8Array(await c.subtle.encrypt({name:"AES-GCM",iv:ivd}, dkKey, enc.encode(JSON.stringify(dataset))));
async function usuario(codigo,nome){const salt=c.getRandomValues(new Uint8Array(16)),iv=c.getRandomValues(new Uint8Array(12));
 const mat=await c.subtle.importKey("raw",enc.encode(codigo),"PBKDF2",false,["deriveKey"]);
 const k=await c.subtle.deriveKey({name:"PBKDF2",salt,iterations:310000,hash:"SHA-256"},mat,{name:"AES-GCM",length:256},false,["encrypt"]);
 const b=new Uint8Array(await c.subtle.encrypt({name:"AES-GCM",iv},k,enc.encode(JSON.stringify({nome,msg:"",dk:b64(dk)}))));
 return {salt:b64(salt),iv:b64(iv),blob:b64(b)};}
const payload={dados:{iv:b64(ivd),blob:b64(blob)},usuarios:[await usuario("outro999","Fulano"),await usuario("abc000","Beltrano"),await usuario("teste123","Prof. Teste")]};
const html=readFileSync(entrada,"utf8").replace(/(<script id="payload" type="application\/json">)[\s\S]*?(<\/script>)/, (_,a,b)=>a+JSON.stringify(payload)+b);
mkdirSync(dirname(saida), {recursive:true});
writeFileSync(saida, html);
console.log(`Demonstração gerada em ${saida} — código de acesso: teste123`);
