# Hiperion Bot

> Portuguese [README](./locales/pt/@README.md)

## Under Development

### Starred this repo if you liked 😉

## Overview

This repository contains a Node application that implements a bot for managing WhatsApp groups using the [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js) library. The bot supports the commands listed below and allows interaction in **English** and **Portuguese**.

> **Note**: This bot will never have a feature to send bulk messages in private to users or groups.
> **Warning**: I am not responsible for the actions of anyone who uses it.

## Requirements

Make sure you have the following requirements installed in your environment:

- Node.js 18 or higher
- Separate phone number for exclusive use by the bot
- Google Chrome
- Docker

## Configuration

1. Clone this repository to your local environment.
2. Execute the following commands to set up the environment:

   - Install the dependencies using Yarn or another package manager (e.g., npm):

     ```shell
     yarn install
     ```

   - Configure the `.env` file with the necessary information:

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

     # ACRCLOUD - https://www.acrcloud.com
     ACR_HOST=
     ACR_KEY=
     ACR_SECRET_KEY=

     # DATABASE (mongodb)
     DATABASE_URL=

     # REDIS (optional if using a local Redis)
     REDIS_URI=
     ```

   - Apply the database migrations using Prisma:

     ```shell
     yarn prisma db push
     ```

3. If you prefer to use a Dockerfile, you can build and run the Docker container separately:

   - Build the Docker:

     ```shell
     docker compose up -d
     ```

   - Run the Docker container:

     ```shell
     docker compose start
     ```

   > **Note**: See the bot log to scan qr code at the first time - `docker compose logs bot -f`.

4. To build and start the application without Docker, use the following commands:

   - Build the application:

     ```shell
     yarn build
     ```

   - Start the application:

     ```shell
     yarn start
     ```

   > **Note**: Go to startupConfig on src/config/startupConfig.ts and replace Chrome's path if necessary.

## Bot Commands

The table below lists the available commands in the bot, their description, and if any API service is required.

| Command       | Description                                                                         | API Key     |
| ------------- | ----------------------------------------------------------------------------------- | ----------- |
| `!menu`       | Shows bot's menu                                                                    |             |
| `!fs`         | Converts an image, video, or GIF into a sticker                                     |             |
| `!off`        | Turns off the bot                                                                   |             |
| `!about`      | Show informations about bot                                                         |             |
| `!link`       | Retrieves the group invitation link                                                 |             |
| `!ping`       | Checks the bot's latency                                                            |             |
| `!regras`     | Shows the group rules                                                               |             |
| `!promote`    | Promotes a user in the group                                                        |             |
| `!demote`     | Demotes a user in the group                                                         |             |
| `!join`       | Joins the group from the invitation link                                            |             |
| `!leave`      | Leaves the specified group                                                          |             |
| `!add`        | Adds a user to the group                                                            |             |
| `!ban`        | Removes the user from the group and adds them to all blacklists                     |             |
| `!ld`         | Enables/Disables the link detector in a group                                       |             |
| `!og`         | Enables/Disables the one group in a group                                           |             |
| `!md`         | Enables/Disables the malicious content detector in a group                          | SightEngine |
| `!pd`         | Enables/Disables the profanity message/voice detector in a group                    |             |
| `!td`         | Enables/Disables WhatsApp-freezing message detector in a group                      |             |
| `!bv`         | Enables/Disables the welcome message when someone joins a group                     |             |
| `!bl`         | Add the user to the blacklist of all groups                                         |             |
| `!rbl`        | Remove the user from the blacklist of the group                                     |             |
| `!rblall`     | Remove the user from all blacklists in all groups                                   |             |
| `!asticker`   | Enables/Disables automatic sticker creation in a group                              |             |
| `!ainvite`    | Enables/Disables automatic invitation in a group                                    |             |
| `!ginfo`      | Shows information about a group                                                     |             |
| `!dload`      | Downloads content from various social media platforms                               |             |
| `!totext`     | Convert a audio message to text                                                     | OpenAI      |
| `!clearchats` | Clear all chats                                                                     |             |
| `!recognize`  | Identify a music                                                                    | ACRCloud    |
| `!pv`         | Enables/Disables the private mode(allow to use command in bot's private) of the bot |             |
| `!binfo`      | Shows information about the bot                                                     |             |

## Contribution

If you want to contribute to this project, please follow the steps below:

1. Fork this repository.
2. Create a branch for your contribution: `git checkout -b sua-branch`.
3. Make the desired changes and add documentation if necessary.
4. Commit your changes: `git commit -m "Your message"`.
5. Push your changes: `git push origin sua-branch`.
6. Open a pull request in this repository.

---

Thank you in advance for your contributions!

## License

This project is licensed under the terms of the Apache 2.0 License. For more details, see the [LICENSE](./LICENSE) file.
