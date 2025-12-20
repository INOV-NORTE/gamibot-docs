---
title: Configuração do Moodle
description: Como instalar e configurar o GamiBot no Moodle.
---

# Configuração do Moodle

O GamiBot foi desenhado para funcionar com o **Moodle 4.2 ou superior**. Se estiver a utilizar uma versão mais antiga do Moodle, precisará de atualizar para uma versão compatível antes de instalar o GamiBot.

O GamiBot requer a instalação de dois plugins na sua instância do Moodle:

- **Plugin GamiBot Manager** - Este é um plugin local utilizado para gerir a instância do GamiBot.
- **Plugin GamiBot Chat** - Este é um plugin de bloco utilizado para exibir a interface de chat.

---

## Plugin GamiBot Manager

### Instalação

Para instalar o plugin GamiBot Manager, siga estes passos:

1. Descarregue o Plugin Manager em [Plugin GamiBot Manager](/downloads/moodle-local_gamibot_manager.zip).
2. Inicie sessão no seu site Moodle como administrador.
3. Navegue até **Administração do site** > **Plugins** > **Instalar plugins**, selecione o plugin descarregado e carregue-o.
4. Clique em **Instalar plugin a partir do ficheiro ZIP**.
5. Siga as instruções no ecrã para concluir a instalação.

### Configuração

Comece por configurar as definições básicas do Plugin GamiBot Manager navegando até **Administração do site** > **Plugins** > **Plugins locais** > **GamiBot Manager** > **Definições Básicas**.

A maioria das definições está pré-preenchida com valores predefinidos que devem funcionar para a maioria dos casos de utilização. No entanto, poderá ser necessário ajustar algumas definições com base nos seus requisitos específicos.

A primeira definição refere-se à navegação.

- **Adicionar entrada de navegação** - Esta opção adiciona uma nova entrada de navegação à navegação primária para administradores, permitindo-lhes gerir a instância do GamiBot. Pode desativar esta opção após a configuração inicial se não pretender adicionar uma entrada de navegação à navegação primária.

As próximas duas definições estão relacionadas com todas as chamadas para serviços externos.

- **Verificar certificados SSL** - Esta opção verifica os certificados SSL de todos os pedidos para serviços externos (por exemplo, endpoint da Gami API, endpoint do LangFlow). Pode desativar esta opção se estiver a utilizar uma instância da Gami API ou do LangFlow auto-hospedada.

- **Tempo limite para pedidos** - Esta opção define o tempo limite (timeout) para pedidos para o endpoint da Gami API e endpoint do LangFlow. O valor predefinido é 60 segundos.

As definições seguintes estão relacionadas com a Gami API. Se pretender utilizar o servidor do CIP/INOV-Norte, solicite-nos credenciais para se ligar a ele (ver [Solicitar Credenciais](/pt/setup/request-credentials)).

- **Endpoint da Gami API** - Este é o URL da Gami API. O valor predefinido aponta para a instância da Gami API do CIP/INOV-Norte.
- **Segredo da Gami API** - Esta é a chave de API que utilizará para se autenticar na Gami API. Se pretender utilizar o servidor do CIP/INOV-Norte, solicite-nos credenciais para se ligar a ele (ver [Solicitar Credenciais](/pt/setup/request-credentials)).

Nota: Se estiver a utilizar uma instância da Gami API auto-hospedada, consulte **Gamificação > Auto-hospedagem** (brevemente) para mais informações.

As próximas definições estão relacionadas com o processo de ingestão de dados. Se pretender utilizar o servidor do CIP/INOV-Norte, solicite-nos credenciais para se ligar a ele (ver [Solicitar Credenciais](/pt/setup/request-credentials)).

- **Endpoint de ingestão** - Este é o URL da API de ingestão de dados. O valor predefinido aponta para a instância da API de ingestão de dados do CIP/INOV-Norte.
- **Segredo do webhook** - Este é o segredo que utilizará para se autenticar na API de ingestão de dados. Se pretender utilizar o servidor do CIP/INOV-Norte, solicite-nos credenciais para se ligar a ele (ver [Solicitar Credenciais](/pt/setup/request-credentials)). **Precisa de preencher este campo** com o segredo que receber de nós.

A última definição em **Definições Básicas** é o **Número de perguntas** que devem ser incluídas num quiz. O valor predefinido é 5.

Após efetuar as alterações necessárias, clique em **Guardar alterações** para guardar a configuração.

---

Após configurar as **Definições Básicas**, pode agora configurar as **Ferramentas/Modos de Chat**. Para isso, navegue até **Administração de ferramentas Gamibot** no menu principal.

Estão disponíveis três ferramentas/modos de chat:

- **Langflow - Clarify** - Esta ferramenta/modo de chat permite aos utilizadores colocar questões sobre os conteúdos da disciplina à instância do GamiBot e receber respostas.
- **Langflow - Summarize** - Esta ferramenta/modo de chat permite aos utilizadores solicitar resumos dos conteúdos da disciplina à instância do GamiBot e receber respostas.
- **Langflow - Quiz** - Esta ferramenta/modo de chat permite aos utilizadores solicitar quizzes sobre os conteúdos da disciplina à instância do GamiBot, enviar as suas respostas e receber feedback sobre o seu desempenho e como podem melhorar.

Cada ferramenta/modo de chat pode ser configurado de forma independente. As definições disponíveis são:

- **Identificador interno** - Este é o identificador interno da ferramenta/modo de chat. É utilizado para identificar a ferramenta/modo de chat.
- **Ferramenta GamiBot** - Esta é a ferramenta GamiBot que será utilizada (apenas Langflow está disponível de momento).
- **Endpoint da API** - Este é o endpoint da API do fluxo do LangFlow que será utilizado. Por defeito, aponta para o endpoint da API do fluxo do LangFlow do CIP/INOV-Norte.
- **Chave da API** - Esta é a chave da API da instância do LangFlow que será utilizada para se autenticar no endpoint do LangFlow. Se pretender utilizar o servidor do CIP/INOV-Norte, solicite-nos credenciais para se ligar a ele (ver [Solicitar Credenciais](/pt/setup/request-credentials)). **Precisa de preencher este campo** com a chave da API que receber de nós.
- **ID do campo de domínio** - Este é o ID do campo de entrada utilizado para passar o domínio do Moodle para filtrar os conteúdos da disciplina.
- **ID do campo de ID da disciplina** - Este é o ID do campo de entrada utilizado para passar o ID da disciplina para filtrar os conteúdos da disciplina.
- **ID do campo adicional (por exemplo, para quizzes, o ID do campo do número de perguntas)** - Este é o ID do campo de entrada utilizado para passar o campo adicional para filtrar os conteúdos da disciplina ou outros fins.

Nota: Se estiver a utilizar uma instância do LangFlow auto-hospedada, consulte **Fluxos de Trabalho > Auto-hospedagem** (brevemente) para mais informações.

---

## Plugin GamiBot Chat

### Instalação

Para instalar o plugin GamiBot Chat, siga estes passos:

1. Descarregue o Plugin Chat em [Plugin GamiBot Chat](/downloads/moodle-blocks_gamibot.zip).
2. Inicie sessão no seu site Moodle como administrador.
3. Navegue até **Administração do site** > **Plugins** > **Instalar plugins**, selecione o plugin descarregado e carregue-o.
4. Clique em **Instalar plugin a partir do ficheiro ZIP**.
5. Siga as instruções no ecrã para concluir a instalação.

### Configuração

Para configurar o plugin GamiBot Chat, navegue até **Administração do site** > **Plugins** > **Blocos** > **GamiBot Chat**.

As definições disponíveis são:

- **Tipos de página em que o botão flutuante do chat bot deve ser exibido** - Estes são os tipos de página em que o botão flutuante do chat bot deve ser exibido. Insira uma lista de tipos de página (uma string por linha) em que o botão flutuante deve ser exibido. Recomenda-se inserir `*` para mostrar sempre o bloco.
- **Substituir botão de ajuda pelo botão block_gamibot** - Selecione esta opção para substituir o botão de ajuda pelo botão flutuante do GamiBot.
- **Tema de cores** - Este é o tema de cores do chat GamiBot. Existem três opções: `Blue`, `Purple` e `Green`.

Após efetuar as alterações necessárias, clique em **Guardar alterações** para guardar a configuração.

---

## Ativar o Plugin GamiBot Chat

O GamiBot Chat está desativado por defeito em todas as disciplinas. Para o ativar, navegue até à página da disciplina, clique em **Definições**, vá à secção **Funcionalidades GamiBot** e ative a opção **Adicionar um Chat GamiBot a esta disciplina**.

Finalmente, clique em **Guardar e exibir** para guardar a configuração.
