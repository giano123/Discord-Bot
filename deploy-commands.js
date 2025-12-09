// deploy-commands.js (CommonJS, commands: /image, /chat, /video)
require('dotenv').config();
const { REST, Routes } = require('discord.js');

const commands = [
  {
    name: 'image',
    description: 'Generate an image via n8n',
    options: [
      {
        name: 'text',
        description: 'Your image prompt',
        type: 3, // STRING
        required: true,
      },
    ],
  },
  {
    name: 'chat',
    description: 'Send a chat message via n8n',
    options: [
      {
        name: 'text',
        description: 'Your chat prompt / message',
        type: 3,
        required: true,
      },
    ],
  },
  {
    name: 'video',
    description: 'Generate a video via n8n',
    options: [
      {
        name: 'text',
        description: 'Your video prompt',
        type: 3,
        required: true,
      },
    ],
  },
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

async function main() {
  try {
    console.log('Registering /image, /chat and /video commands ...');
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.DISCORD_CLIENT_ID,
        process.env.DISCORD_GUILD_ID,
      ),
      { body: commands },
    );
    console.log('Slash commands registered successfully.');
  } catch (error) {
    console.error('Error while registering commands:', error);
  }
}

main();
