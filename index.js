require('dotenv').config();

const {
    Client,
    GatewayIntentBits,
    PermissionsBitField,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

client.once('ready', () => {
    console.log(`${client.user.tag} connecté !`);
});

client.on('messageCreate', async message => {

    if (message.author.bot) return;

    // =========================
    // HELP
    // =========================

    if (message.content === '!help') {

        const embed = new EmbedBuilder()
            .setColor('#2b2d31')
            .setTitle('📖 Commandes Nova')
            .setDescription(`
🎭 **Rôles**
> !roles

🤖 **Chat IA**
> !sly bonjour

📚 **Aide**
> !help
            `)
            .setFooter({
                text: 'Nova Bot'
            });

        return message.channel.send({
            embeds: [embed]
        });
    }

    // =========================
    // SLY CHAT
    // =========================

    if (message.content.startsWith('!sly')) {

        const args = message.content.slice(5).trim();

        if (!args) {
            return message.reply('❌ Écris un message.');
        }

        const responses = [
            `👋 Salut ${message.author.username} !`,
            `🔥 Je suis là pour t'aider.`,
            `😎 Nova Bot répond présent.`,
            `🚀 Commande reçue : ${args}`,
            `🤖 Intéressant...`,
            `💬 Tu as dit : ${args}`
        ];

        const random =
            responses[Math.floor(Math.random() * responses.length)];

        return message.reply(random);
    }

    // =========================
    // PANEL ROLES
    // =========================

    if (message.content === '!roles') {

        const embed = new EmbedBuilder()
            .setColor('#2b2d31')
            .setTitle('🍀 Panel Rôles - Babar4x')
            .setDescription(
                `**Choisis tes rôles ci-dessous !**\n\n` +
                `Clique sur les boutons pour les ajouter ou les retirer.`
            )
            .setImage('https://cdn.discordapp.com/attachments/1375088553230467084/1503839124535246858/telechargement.jpg?ex=6a0771d3&is=6a062053&hm=241de30c409b07866182967a7cec6b54bbe2f5b8e4b18c5aabce7d76c3bc5b1a&');

        const row1 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('tiktok')
                    .setLabel('TikTok')
                    .setEmoji('🎵')
                    .setStyle(ButtonStyle.Primary),

                new ButtonBuilder()
                    .setCustomId('twitch')
                    .setLabel('Twitch')
                    .setEmoji('📺')
                    .setStyle(ButtonStyle.Primary)
            );

        const row2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('fivem')
                    .setLabel('𝐅𝐈𝐕𝐄𝐌')
                    .setEmoji('🚗')
                    .setStyle(ButtonStyle.Success),

                new ButtonBuilder()
                    .setCustomId('valorant')
                    .setLabel('Valorant')
                    .setEmoji('🔫')
                    .setStyle(ButtonStyle.Success),

                new ButtonBuilder()
                    .setCustomId('warzone')
                    .setLabel('Warzone')
                    .setEmoji('🎯')
                    .setStyle(ButtonStyle.Success),

                new ButtonBuilder()
                    .setCustomId('bo')
                    .setLabel('B.O')
                    .setEmoji('🛡️')
                    .setStyle(ButtonStyle.Success),

                new ButtonBuilder()
                    .setCustomId('roblox')
                    .setLabel('𝐑𝐎𝐁𝐋𝐎𝐗')
                    .setEmoji('🎮')
                    .setStyle(ButtonStyle.Success)
            );

        const row3 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('homme')
                    .setLabel('𝐇𝐎𝐌𝐌𝐄')
                    .setEmoji('👨')
                    .setStyle(ButtonStyle.Primary),

                new ButtonBuilder()
                    .setCustomId('femme')
                    .setLabel('𝐅𝐄𝐌𝐌𝐄')
                    .setEmoji('👩')
                    .setStyle(ButtonStyle.Danger)
            );

        await message.channel.send({
            embeds: [embed],
            components: [row1, row2, row3]
        });
    }
});

// =========================
// BUTTONS ROLES
// =========================

client.on('interactionCreate', async interaction => {

    if (!interaction.isButton()) return;

    const roles = {
        tiktok: '1401333763216117871',
        twitch: '1401333147903197335',
        fivem: '1401731584947654656',
        valorant: '1401732135198654524',
        warzone: '1401732932447633449',
        bo: '1401733341560049746',
        roblox: '1504609283860467853',
        homme: '1504612758887600178',
        femme: '1504612836519972874'
    };

    const roleId = roles[interaction.customId];

    if (!roleId) return;

    const member = interaction.member;
    const role = interaction.guild.roles.cache.get(roleId);

    if (!role) {
        return interaction.reply({
            content: '❌ Rôle introuvable.',
            ephemeral: true
        });
    }

    if (member.roles.cache.has(roleId)) {

        await member.roles.remove(roleId);

        await interaction.reply({
            content: `❌ Le rôle **${role.name}** a été retiré.`,
            ephemeral: true
        });

    } else {

        await member.roles.add(roleId);

        await interaction.reply({
            content: `✅ Le rôle **${role.name}** a été ajouté.`,
            ephemeral: true
        });
    }
});

client.login(process.env.TOKEN);