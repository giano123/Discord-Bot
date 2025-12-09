// index.js (CommonJS, handles /image, /chat, /video)
require('dotenv').config();
const { Client, GatewayIntentBits, Events } = require('discord.js');
const axios = require('axios');

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once(Events.ClientReady, (c) => {
  console.log(`Bot logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  try {
    if (!interaction.isChatInputCommand()) return;

    let type;
    if (interaction.commandName === 'image') {
      type = 'image';
    } else if (interaction.commandName === 'chat') {
      type = 'chat';
    } else if (interaction.commandName === 'video') {
      type = 'video';
    } else {
      return;
    }

    const promptText = interaction.options.getString('text', true);

    await interaction.reply({
      content: `Your ${type} request is being sent to n8n...`,
      ephemeral: true,
    });

    try {
      await axios.post(process.env.N8N_WEBHOOK_URL, {
        type,                    // "image", "chat" or "video"
        content: promptText,     // the actual prompt/message
        command: interaction.commandName,
        user: interaction.user.username,
        userId: interaction.user.id,
        channelId: interaction.channelId,
        guildId: interaction.guildId,
      });

      await interaction.followUp({
        content: `✅ ${type} request successfully sent to n8n.`,
        ephemeral: true,
      });
    } catch (apiError) {
      console.error('Error sending to n8n:', apiError?.response?.data || apiError.message);
      await interaction.followUp({
        content: '❌ Error sending to n8n. Please try again later.',
        ephemeral: true,
      });
    }
  } catch (err) {
    console.error('Error in Interaction handler:', err);
    if (interaction.isRepliable()) {
      try {
        await interaction.reply({
          content: '❌ Unexpected bot error.',
          ephemeral: true,
        });
      } catch {
        // ignore
      }
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
