<div align="center">

# Relatório Executivo de Obras e Reformas

**FAPEX · SUMAI · UFBA**

Acompanhamento institucional da carteira de obras, reformas e serviços de engenharia
conduzidos pela FAPEX em articulação com a Superintendência de Meio Ambiente e
Infraestrutura (SUMAI) da Universidade Federal da Bahia.

[![Verificação de integridade](https://github.com/fabioisensee/painel-obras-fapex-sumai/actions/workflows/validar.yml/badge.svg)](https://github.com/fabioisensee/painel-obras-fapex-sumai/actions/workflows/validar.yml)
![Dados cifrados](https://img.shields.io/badge/dados-AES--GCM%20256-123f46)
![Somente leitura](https://img.shields.io/badge/acesso-somente%20leitura-9b7a3f)
![Sem dependências](https://img.shields.io/badge/depend%C3%AAncias-nenhuma-2f684d)

</div>

---

## Finalidade

Este relatório atende à solicitação de acompanhamento da **Reitoria da UFBA** e da
alta direção da Fundação. Ele oferece, em uma única página, a posição consolidada
de cada processo — da concepção à conclusão — com a mesma informação registrada no
quadro operacional mantido pelas equipes técnica (SUMAI) e contratual (FAPEX).

| Seção | O que apresenta |
| --- | --- |
| **Contextualização** | Escopo do relatório e a divisão de responsabilidades entre SUMAI e FAPEX. |
| **Síntese executiva** | Quantitativo da carteira na data de referência. |
| **Fluxo da carteira** | Distribuição dos processos pelas oito etapas do fluxo; cada etapa é clicável e filtra a consulta detalhada. |
| **Próximos marcos** | Exibida apenas quando houver marcos informados em campo estruturado — nada é inferido. |
| **Consulta detalhada** | Busca (sem distinção de acentos), filtros por etapa e ficha individual de cada processo: empresa, valor contratado, orçamento de referência, vigência e situação. |

O documento é **informativo e somente leitura**: nenhuma alteração da carteira pode
ser feita por meio dele. Pode ser impresso ou salvo em PDF diretamente pelo botão
*Imprimir / PDF*, com diagramação própria para papel A4.

## Como acessar

1. Abra o endereço do GitHub Pages deste repositório.
2. Informe o **código de acesso pessoal** recebido. Cada pessoa autorizada tem um código próprio.
3. Ao terminar, use **Encerrar sessão** — os dados decifrados existem apenas na memória
   da aba e são descartados.

Funciona em qualquer navegador atual (Chrome, Edge, Firefox, Safari), em computador,
tablet ou celular, sem instalação.

## Segurança e confidencialidade

O repositório é público, mas **o conteúdo do relatório não é**. Todos os dados de
obras, valores e empresas ficam cifrados dentro do próprio `index.html` e só são
abertos no navegador de quem digitar um código válido.

```
código pessoal ──PBKDF2-SHA256 (310 mil iterações, salt individual)──▶ chave do usuário
chave do usuário ──AES-GCM 256──▶ chave dos dados
chave dos dados  ──AES-GCM 256──▶ relatório (obras, valores, empresas)
```

- **Criptografia padrão do navegador** (WebCrypto): nenhum código de terceiros, nenhuma
  biblioteca externa, nenhuma requisição de rede.
- **Envelope por usuário**: cada código abre apenas uma cópia da chave dos dados; os
  códigos nunca aparecem no arquivo, nem mesmo de forma cifrada.
- **Política de segurança de conteúdo (CSP)** que proíbe a página de se comunicar com
  qualquer servidor — mesmo depois de aberta, a informação não pode sair do navegador.
- **Não indexável** por mecanismos de busca (`noindex`, `noarchive`) e sem envio de
  *referrer*.
- **Verificação automática** a cada publicação ([`scripts/validar.mjs`](scripts/validar.mjs)):
  confere a estrutura do conteúdo cifrado, a unicidade dos vetores de inicialização, a
  ausência de recursos externos e de valores, CNPJs ou links do Trello em claro.

Não fazem parte deste repositório: credenciais do Trello, o script de geração e a lista
de códigos de acesso. Recomendações de operação e o canal para relatar problemas estão
em [`SECURITY.md`](SECURITY.md).

## Atualização

O `index.html` é **gerado automaticamente** a partir do quadro do Trello e republicado
periodicamente; não deve ser editado manualmente para alterar dados. A data de
referência exibida no relatório indica o momento exato da extração.

Alterações de layout devem ser feitas no **modelo** usado pelo gerador. O único trecho
que varia entre publicações é o bloco `<script id="payload" type="application/json">`;
todo o restante do arquivo é o modelo.

## Revisão de layout sem dados reais

Para avaliar mudanças visuais sem acesso aos dados reais, gere uma cópia com dados
fictícios cifrados pelo mesmo esquema (requer Node.js 18+):

```bash
node scripts/gerar-demonstracao.mjs   # cria demonstracao/index.html (código: teste123)
node scripts/validar.mjs              # verifica a integridade do index.html publicado
```

A pasta `demonstracao/` é ignorada pelo git e não é publicada.

## Estrutura

```
index.html                     relatório autocontido (modelo + conteúdo cifrado)
scripts/validar.mjs            verificação de integridade e de vazamentos
scripts/gerar-demonstracao.mjs cópia com dados fictícios para revisão de layout
.github/workflows/validar.yml  execução automática da verificação
SECURITY.md                    política de segurança e boas práticas de operação
```

## Base normativa

Manual Conjunto de Procedimentos nº 01/2019 UFBA/SUMAI–FAPEX.

---

<sub>Uso interno. Contém valores de contratos administrados pela FAPEX.
Fundação de Apoio à Pesquisa e à Extensão · Universidade Federal da Bahia.</sub>
