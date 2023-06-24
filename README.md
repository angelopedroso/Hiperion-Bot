# Hiperion Bot

Este repositório contém uma aplicação Node que implementa um bot para gerenciamento de grupos do WhatsApp usando a biblioteca whatsapp-web.js. O bot oferece suporte aos comandos listados abaixo e permite a interação em inglês e português.

## Requisitos

Certifique-se de ter os seguintes requisitos instalados em seu ambiente:

- Node.js 16 ou superior
- Número de celular separado para uso exclusivo do bot
- Google Chrome

## Configuração

1. Clone este repositório para o seu ambiente local.
2. Execute o seguinte comando para instalar as dependências usando o Yarn:

   ```shell
   yarn install
   ```

3. Configure o arquivo `.env` com as informações necessárias:

   ```plaintext
   BOT_NAME=
   OWNER_NUM=
   BOT_NUM=
   LANGUAGE=

   # SightEngine - https://dashboard.sightengine.com/login
   API_SIGHTENGINE_USER=
   API_SIGHTENGINE_SECRET=

   # OPENAI - https://platform.openai.com - OFF
   OPENAI_API_KEY=
   OPENAI_PASSWORD=

   # DATABASE (mysql) Exemplo: "mysql://root:docker@localhost:3306/hiperion"
   DATABASE_URL=

   # REDIS (opcional se você estiver usando um redis local)
   REDIS_URI=
   ```

   > **Observação**: O arquivo `.env` será gerado automaticamente na primeira execução do bot. O bot solicitará uma reinicialização após a criação do `.env`.

4. Para executar o MySQL e o Redis no Docker, utilize o Docker Compose. Certifique-se de que o Docker Compose esteja instalado em seu ambiente.

   - Na raiz do projeto, execute o seguinte comando:

     ```shell
     docker-compose up -d
     ```

   > **Observação**: Isso iniciará os serviços do MySQL e do Redis no Docker, conforme configurado no arquivo `docker-compose.yml` que já está na raiz do projeto.

5. Inicie o aplicativo com o seguinte comando:

   ```shell
   yarn start
   ```

## Comandos do Bot

A tabela abaixo lista os comandos disponíveis no bot, sua descrição e se algum serviço de API é necessário.

| Comando     | Descrição                                                                   | API Key     |
| ----------- | --------------------------------------------------------------------------- | ----------- |
| `!fs`       | Converte imagem, vídeo ou GIF em adesivo                                    |             |
| `!off`      | Desliga o bot                                                               |             |
| `!link`     | Recebe o link de convite do grupo                                           |             |
| `!ping`     | Verifica a latência do bot                                                  |             |
| `!regras`   | Mostra as regras do grupo                                                   |             |
| `!ban`      | Remove o usuário do grupo e adiciona em todas as listas negras              |             |
| `!ld`       | Ativa/Desativa o detector de links em algum grupo                           |             |
| `!md`       | Ativa/Desativa o detector de conteúdo malicioso em algum grupo              | SightEngine |
| `!td`       | Ativa/Desativa o detector de mensagens que travam o WhatsApp em algum grupo |             |
| `!bv`       | Ativa/Desativa a mensagem de boas-vindas quando alguém entra em algum grupo |             |
| `!asticker` | Ativa/Desativa a criação automática de adesivos em algum grupo              |             |
| `!ainvite`  | Ativa/Desativa o convite automático em algum grupo                          |             |
| `!ginfo`    | Mostra as informações de um grupo                                           |             |
| `!blist`    | Adiciona o usuário à lista negra de grupos                                  |             |

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

Este projeto está licenciado nos termos da Licença Apache 2.0. Para obter mais detalhes, consulte o arquivo [LICENSE](./LICENSE).
