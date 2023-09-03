# Hiperion Bot

## Em desenvolvimento

### Dê uma estrela (star) para esse repositório, se você gostou 😉

## Overview

Este repositório contém uma aplicação Node que implementa um bot para gerenciamento de grupos do WhatsApp usando a biblioteca [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js). O bot oferece suporte aos comandos listados abaixo e permite a interação em **inglês (english)** e **português**.

> **Observação**: Esse bot jamais terá uma feature para enviar mensagens em massa no privado dos usuários ou em grupos.
> **Aviso**: Não me responsabilizo pelas as ações de quem for utilizá-lo.

## Requisitos

Certifique-se de ter os seguintes requisitos instalados em seu ambiente:

- Node.js 18 ou superior
- Número de celular separado para uso exclusivo do bot
- Google Chrome
- Docker

## Configuração

1. Clone este repositório para o seu ambiente local.
2. Execute o seguinte comando para instalar as dependências usando o Yarn:

   ```shell
   yarn install
   ```

   - Aplique as migrations do banco de dados usando o Prisma:

     ```shell
     yarn prisma db push
     ```

   - Configure o arquivo `.env` com as informações necessárias:

      ```plaintext
      BOT_NAME=
      OWNER_NUM=
      BOT_NUM=
      LANGUAGE=

      # SightEngine - https://dashboard.sightengine.com/login
      API_SIGHTENGINE_USER=
      API_SIGHTENGINE_SECRET=

      # OPENAI - https://platform.openai.com
      OPENAI_API_KEY=
      OPENAI_PASSWORD=

      # ACRCLOUD - www.acrcloud.com/
      ACR_HOST=
      ACR_KEY=
      ACR_SECRET_KEY=

      # DATABASE (mysql) Exemplo: "mysql://root:docker@localhost:3306/hiperion"
      DATABASE_URL=

      # REDIS (opcional se você estiver usando um redis local)
      REDIS_URI=
      ```

3. Se você preferir usar o DockerFile, você pode buildar e iniciar o container do Docker separadamente:
   - Build a imagem para o docker:

     ```shell
     docker build -t nome-da-imagem .
     ```

   - Run o container do docker:

     ```shell
     docker run -d nome-da-imagem
     ```

4. Para buildar e iniciar o bot sem o Docker, use os seguintes comandos:
   - Build a imagem para o docker:

     ```shell
     yarn build
     ```

   - Run o container do docker:

     ```shell
     yarn start
     ```

   > **Note**: Vá até startupConfig (src/config/startupConfig.ts) e substitua o caminho para o chrome se for preciso (caso o seu diretório for diferente).

## Comandos do Bot

A tabela abaixo lista os comandos disponíveis no bot, sua descrição e se algum serviço de API é necessário.

| Comando       | Descrição                                                                     | API Key     |
| ------------- | ----------------------------------------------------------------------------- | ----------- |
| `!menu`       | Mostra o menu do bot                                                          |             |
| `!fs`         | Converte imagem, vídeo ou GIF em sticker                                      |             |
| `!off`        | Desliga o bot                                                                 |             |
| `!about`      | Mostra os créditos                                                            |             |
| `!link`       | Recebe o link de convite do grupo                                             |             |
| `!ping`       | Verifica a latência do bot                                                    |             |
| `!regras`     | Mostra as regras do grupo                                                     |             |
| `!promote`    | Promove um usuário no grupo                                                   |             |
| `!demote`     | Rebaixa um usuário no grupo                                                   |             |
| `!join`       | Entra no grupo do convite                                                     |             |
| `!leave`      | Sai do grupo em questão                                                       |             |
| `!add`        | Adiciona um usuário ao grupo                                                  |             |
| `!ban`        | Remove o usuário do grupo e adiciona em todas as listas negras                |             |
| `!ld`         | Ativa/Desativa o detector de links em algum grupo                             |             |
| `!og`         | Ativa/Desativa o apenas em um grupo em algum grupo                            |             |
| `!md`         | Ativa/Desativa o detector de conteúdo malicioso em algum grupo                | SightEngine |
| `!td`         | Ativa/Desativa o detector de mensagens que travam o WhatsApp em algum grupo   |             |
| `!bv`         | Ativa/Desativa a mensagem de boas-vindas quando alguém entra em algum grupo   |             |
| `!bl`         | Adiciona o usuário à lista negra de todos os grupos                           |             |
| `!rbl`        | Remove o usuário da lista negra do grupo                                      |             |
| `!rblall`     | Remove o usuário de todas as lista negras dos grupos                          |             |
| `!asticker`   | Ativa/Desativa a criação automática de stickers em algum grupo                |             |
| `!ainvite`    | Ativa/Desativa o convite automático em algum grupo                            |             |
| `!ginfo`      | Mostra as informações de um grupo                                             |             |
| `!dload`      | Baixa conteúdos de diversas redes sociais                                     |             |
| `!totext`     | Converte uma mensagem de áudio para texto                                     | OpenAI      |
| `!clearchats` | Apaga a conversa de todos os chats                                            |             |
| `!recognize`  | Identifica uma música                                                         | ACRCloud    |
| `!pv`         | Ativa/Desativa o modo privado(permite usar comandos no privado do bot) do bot |             |
| `!binfo`      | Mostra as informações do bot                                                  |             |

## Contribuição

Se você quiser contribuir para este projeto, siga as etapas abaixo:

1. Faça um fork deste repositório.
2. Crie um branch para sua contribuição: `git checkout -b sua-branch`.
3. Faça as alterações desejadas e adicione a documentação, se necessário.
4. Envie suas alterações: `git push origin sua-branch`.
5. Abra um pull request neste repositório.

---

Agradeço antecipadamente por suas contribuições!

## Licença

Este projeto está licenciado nos termos da Licença Apache 2.0. Para obter mais detalhes, consulte o arquivo [LICENSE](../../LICENSE).
