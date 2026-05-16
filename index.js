console.log("VERSION PANEL V2");

require('dotenv').config();

const {
    Client,
    GatewayIntentBits,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionsBitField
} = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildMessageReactions
    ]
});

const snipes = new Map();

client.once('ready', () => {
    console.log(`${client.user.tag} connecté !`);
});

// =========================
// SNIPE DELETE
// =========================

client.on('messageDelete', message => {

    if (!message.content) return;

    snipes.set(message.channel.id, {
        content: message.content,
        author: message.author
    });
});

client.on('messageCreate', async message => {

    if (message.author.bot) return;

    // =========================
    // HELP
    // =========================

    if (message.content === '!help') {

        const embed = new EmbedBuilder()
            .setColor('#2b2d31')
            .setTitle('📖 Commandes Support Babar')
            .setDescription(`
🎭 **Rôles**
> !roles

🤖 **Chat IA**
> !sly bonjour

🏆 **Invitations**
> !topinvite

📊 **Sondage**
> !poll question

📢 **Annonce**
> !annonce texte

🗑️ **Snipe**
> !snipe

📚 **Aide**
> !help
            `)
            .setImage('https://cdn.discordapp.com/attachments/1375088553230467084/1503839124535246858/telechargement.jpg?ex=6a08c353&is=6a0771d3&hm=be68bbbc4eec6a9fa33560e6d89ae968ce5094fcf5b52c7f6f41ef329ab73493&')
            .setFooter({
                text: 'Support Babar'
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
            `😎 Support Babar répond présent.`,
            `🚀 Commande reçue : ${args}`,
            `🤖 Intéressant...`,
            `💬 Tu as dit : ${args}`
        ];

        const random =
            responses[Math.floor(Math.random() * responses.length)];

        return message.reply(random);
    }

    // =========================
    // TOP INVITE
    // =========================

    if (message.content === '!topinvite') {

        try {

            const invites = await message.guild.invites.fetch();

            const inviteArray = [...invites.values()];

            inviteArray.sort((a, b) => b.uses - a.uses);

            const top = inviteArray.slice(0, 10);

            let description = '';

            top.forEach((invite, index) => {

                description += `**${index + 1}.** ${invite.inviter} • \`${invite.uses}\` invitations\n`;

            });

            const embed = new EmbedBuilder()
                .setColor('#5865F2')
                .setTitle('🏆 Top Invitations')
                .setDescription(description || 'Aucune invitation trouvée.')
                .setImage('https://cdn.discordapp.com/attachments/1375088553230467084/1503839124535246858/telechargement.jpg?ex=6a08c353&is=6a0771d3&hm=be68bbbc4eec6a9fa33560e6d89ae968ce5094fcf5b52c7f6f41ef329ab73493&')
                .setFooter({
                    text: `Demandé par ${message.author.username}`
                });

            message.channel.send({
                embeds: [embed]
            });

        } catch (err) {

            console.log(err);

            message.reply(
                '❌ Impossible de récupérer les invitations.'
            );
        }
    }

    // =========================
    // POLL
    // =========================

    if (message.content.startsWith('!poll')) {

        const question = message.content.slice(6);

        if (!question) {
            return message.reply(
                '❌ Écris une question.'
            );
        }

        const embed = new EmbedBuilder()
            .setColor('#5865F2')
            .setTitle('📊 Nouveau Sondage')
            .setDescription(`
╔════════════════════╗

📝 **Question :**
> ${question}

👥 **Participants :** \`0\`

✅ = Oui
❌ = Non

╚════════════════════╝
            `)
            .setImage('https://cdn.discordapp.com/attachments/1375088553230467084/1503839124535246858/telechargement.jpg?ex=6a08c353&is=6a0771d3&hm=be68bbbc4eec6a9fa33560e6d89ae968ce5094fcf5b52c7f6f41ef329ab73493&')
            .setFooter({
                text: `Sondage créé par ${message.author.username}`
            });

        const pollMessage = await message.channel.send({
            embeds: [embed]
        });

        await pollMessage.react('✅');
        await pollMessage.react('❌');

        const filter = (reaction, user) =>
            ['✅', '❌'].includes(reaction.emoji.name) && !user.bot;

        const collector = pollMessage.createReactionCollector({
            filter
        });

        collector.on('collect', async () => {

            const fetchedMessage = await pollMessage.fetch();

            const yes =
                fetchedMessage.reactions.cache.get('✅')?.count - 1 || 0;

            const no =
                fetchedMessage.reactions.cache.get('❌')?.count - 1 || 0;

            const total = yes + no;

            const newEmbed = new EmbedBuilder()
                .setColor('#5865F2')
                .setTitle('📊 Nouveau Sondage')
                .setDescription(`
╔════════════════════╗

📝 **Question :**
> ${question}

👥 **Participants :** \`${total}\`

✅ **Oui :** \`${yes}\`
❌ **Non :** \`${no}\`

╚════════════════════╝
                `)
                .setImage('https://cdn.discordapp.com/attachments/1375088553230467084/1503839124535246858/telechargement.jpg?ex=6a08c353&is=6a0771d3&hm=be68bbbc4eec6a9fa33560e6d89ae968ce5094fcf5b52c7f6f41ef329ab73493&')
                .setFooter({
                    text: `Sondage créé par ${message.author.username}`
                });

            pollMessage.edit({
                embeds: [newEmbed]
            });
        });
    }

    // =========================
    // ANNONCE
    // =========================

    if (message.content.startsWith('!annonce')) {

        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply(
                '❌ Tu dois être administrateur.'
            );
        }

        const annonce = message.content.slice(10);

        if (!annonce) {
            return message.reply(
                '❌ Écris une annonce.'
            );
        }

        const embed = new EmbedBuilder()
            .setColor('#ff0000')
            .setTitle('📢 Nouvelle Annonce')
            .setDescription(`
╭━━━━━━━━━━━━━━━━━━╮

${annonce}

╰━━━━━━━━━━━━━━━━━━╯
            `)
            .setImage('https://cdn.discordapp.com/attachments/1375088553230467084/1503839124535246858/telechargement.jpg?ex=6a08c353&is=6a0771d3&hm=be68bbbc4eec6a9fa33560e6d89ae968ce5094fcf5b52c7f6f41ef329ab73493&')
            .setFooter({
                text: `Annonce par ${message.author.username}`
            });

        return message.channel.send({
            embeds: [embed]
        });
    }

    // =========================
    // SNIPE
    // =========================

    if (message.content === '!snipe') {

        const snipe = snipes.get(message.channel.id);

        if (!snipe) {
            return message.reply(
                '❌ Aucun message supprimé.'
            );
        }

        const embed = new EmbedBuilder()
            .setColor('#2b2d31')
            .setTitle('🗑️ Message supprimé')
            .setDescription(snipe.content)
            .setFooter({
                text: `Message de ${snipe.author.tag}`
            });

        return message.channel.send({
            embeds: [embed]
        });
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
            .setImage('https://cdn.discordapp.com/attachments/1375088553230467084/1503839124535246858/telechargement.jpg');

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

client.on('interactionCreate', async interaction => {

    if (!interaction.isButton()) return;

    const roles = {
        tiktok: '1401333763216117871',
        twitch: '1401333147903197335',
        fivem: '1401731584947654656',
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
