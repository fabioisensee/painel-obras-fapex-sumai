# Política de segurança

## Modelo de proteção

O relatório é publicado em um repositório público. A confidencialidade depende
exclusivamente da criptografia aplicada ao conteúdo (PBKDF2-SHA256 com 310.000
iterações e AES-GCM 256) e da **qualidade dos códigos de acesso**. Como qualquer
pessoa pode copiar o arquivo, um código fraco pode ser descoberto por tentativa
e erro fora do navegador, sem limite de tentativas.

## Boas práticas de operação

- **Códigos fortes**: ao menos 12 caracteres aleatórios (letras e números) por
  pessoa. Evite nomes, datas, matrículas ou padrões previsíveis.
- **Entrega individual e por canal reservado**: nunca envie o endereço e o código
  na mesma mensagem.
- **Revogação**: ao retirar o acesso de alguém, gere uma nova chave dos dados na
  próxima publicação (não apenas remova o envelope daquele usuário). Lembre que
  versões anteriores permanecem no histórico do git e continuam abríveis pelos
  códigos que valiam na época; para revogar retroativamente, é preciso reescrever
  o histórico ou recriar o repositório.
- **Unicidade dos vetores de inicialização**: cada publicação deve usar IVs e salts
  novos e aleatórios. A verificação automática bloqueia IVs repetidos dentro de um
  mesmo arquivo.
- **Nada em claro**: o gerador deve inserir dados apenas no bloco `payload`. A
  verificação automática procura valores monetários, CNPJs e links do Trello fora
  dele.
- **Credenciais** do Trello, o script de geração e a lista de códigos nunca devem
  ser adicionados a este repositório.

## Como relatar um problema

Se você identificar uma falha de segurança ou suspeitar que um código foi exposto,
**não abra uma *issue* pública**. Comunique diretamente ao responsável pelo
repositório, que providenciará a troca dos códigos e a republicação do relatório.
