---
title: Solicitar Credenciais
description: Como solicitar credenciais para se ligar ao servidor do CIP/INOV-Norte.
---

# Solicitar Credenciais

Não precisa de auto-hospedar a Gami API e a infraestrutura de IA do GamiBot. Se desejar utilizar os serviços fornecidos pelo CIP/INOV-Norte, envie-nos um pedido de credenciais para o nosso email: [cip@sc.ipp.pt](mailto:cip@sc.ipp.pt).

Por favor, inclua a seguinte informação no seu pedido:

- O seu nome
- O seu endereço de email
- Nome da sua instituição
- URL da sua instituição
- O URL da instância Moodle onde pretende utilizar o GamiBot
- Um token de Serviço Web do Moodle (ver [Token de Serviço Web do Moodle](#token-de-servico-web-do-moodle)) com as seguintes permissões:
  - moodle/course:view
- Quantas disciplinas irão utilizar o GamiBot
- Quantos utilizadores irão utilizar o GamiBot (aproximadamente)

Responderemos ao seu pedido o mais breve possível.

---

## Token de Serviço Web do Moodle

Para criar um token de Serviço Web do Moodle, siga estes passos:

1. Inicie sessão no seu site Moodle como administrador.
2. Navegue até **Administração do site** > **Servidor** > **Serviços web** > **Gerir tokens**.
3. Clique em **Criar token**.
4. Preencha o formulário com a seguinte informação:
   - **Nome**: Introduza um nome para o token.
   - **Utilizador**: Selecione o utilizador que será utilizado para se autenticar no Serviço Web do Moodle. Recomenda-se criar um novo utilizador para este fim e conceder-lhe as permissões para visualizar disciplinas para poder ingerir o conteúdo das mesmas.
   - **Restrição de IP**: Deixe este campo vazio. Forneceremos o endereço IP do servidor após o pedido de credenciais ser aprovado.
   - **Válido até**: Selecione a data até à qual o token será válido. Recomenda-se desativar esta opção.
5. Clique em **Guardar alterações**.
6. Copie o token gerado e guarde-o num local seguro. De seguida, envie-o no seu pedido de credenciais.
