#!/usr/bin/env node
// Verificação de integridade do relatório publicado (index.html).
// Garante que a regeneração automática produziu um arquivo íntegro e que
// nenhum dado em claro ou recurso externo foi introduzido por engano.
// Uso: node scripts/validar.mjs [caminho/do/index.html]
import {readFileSync} from "node:fs";

const arquivo = process.argv[2] ?? "index.html";
const html = readFileSync(arquivo, "utf8");
const falhas = [], avisos = [];
const ok = (cond, msg) => { if (!cond) falhas.push(msg); };
const recomenda = (cond, msg) => { if (!cond) avisos.push(msg); };
const b64valido = s => typeof s === "string" && s.length > 0 && /^[A-Za-z0-9+/]+={0,2}$/.test(s);

// 1. Estrutura do payload cifrado
const m = html.match(/<script id="payload" type="application\/json">([\s\S]*?)<\/script>/);
ok(m, "bloco <script id=\"payload\"> não encontrado");
let payload = null;
if (m) {
  try { payload = JSON.parse(m[1]); } catch (e) { falhas.push("payload não é JSON válido: " + e.message); }
}
if (payload) {
  const chaves = Object.keys(payload).sort().join(",");
  ok(chaves === "dados,usuarios", `payload deve conter somente "dados" e "usuarios" (encontrado: ${chaves})`);
  ok(b64valido(payload.dados?.iv) && b64valido(payload.dados?.blob), "dados.iv/dados.blob ausentes ou fora do formato base64");
  ok(Buffer.from(payload.dados?.iv ?? "", "base64").length === 12, "dados.iv deve ter 12 bytes (AES-GCM)");
  ok(Array.isArray(payload.usuarios) && payload.usuarios.length > 0, "lista de usuários vazia ou ausente");
  (payload.usuarios ?? []).forEach((u, i) => {
    ok(Object.keys(u).sort().join(",") === "blob,iv,salt", `usuário #${i}: campos inesperados (${Object.keys(u).join(",")})`);
    ok(b64valido(u.salt) && b64valido(u.iv) && b64valido(u.blob), `usuário #${i}: salt/iv/blob fora do formato base64`);
    ok(Buffer.from(u.salt ?? "", "base64").length >= 16, `usuário #${i}: salt com menos de 16 bytes`);
  });
  const ivs = [payload.dados?.iv, ...(payload.usuarios ?? []).map(u => u.iv)];
  ok(new Set(ivs).size === ivs.length, "IVs repetidos no payload (reutilização de IV compromete o AES-GCM)");
}

// 2. Parâmetros criptográficos (obrigatórios) e salvaguardas da página (recomendadas)
ok(/iterations:\s*310000/.test(html), "PBKDF2 deve usar 310.000 iterações");
recomenda(/http-equiv="Content-Security-Policy"/.test(html), "política de segurança de conteúdo (CSP) ausente");
recomenda(/connect-src 'none'/.test(html), "CSP deve bloquear conexões de rede (connect-src 'none')");
recomenda(/name="robots" content="noindex/.test(html), "meta robots noindex ausente");

// 3. Nenhum recurso externo (o arquivo deve ser autocontido)
const externos = [...html.matchAll(/\b(?:src|href)\s*=\s*["'](https?:)?\/\/[^"']+/gi)].map(x => x[0]);
ok(externos.length === 0, "recursos externos encontrados: " + externos.join(", "));

// 4. Indícios de vazamento de dados em claro fora do payload
const semPayload = m ? html.replace(m[0], "") : html;
ok(!/trello\.com\/(?:b|c)\//i.test(semPayload), "link de quadro/cartão do Trello encontrado em claro");
ok(!/R\$\s?\d{1,3}(?:\.\d{3})+,\d{2}/.test(semPayload), "valor monetário encontrado em claro fora do payload");
ok(!/\b\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}\b/.test(semPayload), "CNPJ encontrado em claro fora do payload");

avisos.forEach(a => console.warn("⚠ aviso: " + a));
if (falhas.length) {
  console.error(`✗ ${arquivo}: ${falhas.length} problema(s) encontrado(s)`);
  falhas.forEach(f => console.error("  - " + f));
  process.exit(1);
}
console.log(`✓ ${arquivo}: íntegro (${payload.usuarios.length} código(s) de acesso cadastrados, ${(html.length / 1024).toFixed(0)} KB)`);
