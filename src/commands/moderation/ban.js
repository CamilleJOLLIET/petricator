const {
    Client,
    InteractionCallback,
    ApplicationCommandOptionType,
    PermissionFlagsBits,
    SlashCommandBuilder,
} = require('discord.js');

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {InteractionCallback} interaction 
     */
    run: async ({interaction}) => {
        console.log({interaction})
        const targetUserId = interaction.options.get('target-user').value;
        const reason = interaction.options.get('reason')?.value || 'No reason provided';

        await interaction.deferReply();

        const targetUser = await interaction.guild.members.fetch(targetUserId);

        if (!targetUser) { 
            await interaction.editReply(`The member "{targetUserId}" doesn't exist anymore.`);
            return;
        }

        if (targetUser.id === interaction.guild.ownerId) {
            await interaction.editReply("You can't ban the server owner.");
            return;
        }

        const targetUserRolePosition = targetUser.roles.highest.position; // The highest role of the target user
        const requestUserRolePosition = interaction.member.role.highest.position; // The highest role of the user running that command
        const botRolePosition = interaction.guild.members.me.roles.highest.position; // Highest role of Petricator.

        if (targetUserRolePosition >= requestUserRolePosition) {
            await interaction.editReply(`You can't ban that user because they have the same/higher role than you.`);
        }

        if (targetUserRolePosition >= botRolePosition) {
            await interaction.editReply({
                content: `I can't ban this user cause they have same/higher role than me.`,
                ephemeral: true,
            })
        }

        // Ban the target user
        try {
            await interaction.editReply(`User ${targetUser} was banned (C'est pas vrai wesh). Reason: ${reason}`)
        } catch (error) {
            console.log(`Error on ban: ${error}`)
        }
    },
    // deleted: true,
    data: new SlashCommandBuilder()
            .setName('ban')
            .setDescription('Bans a member from the server.')
            .addMentionableOption(option =>
                option.setName('target-user')
                    .setDescription('the user to ban.')
                    .setRequired(true)
            )
            .addStringOption(option =>
                option.setName('reason')
                    .setDescription('The reason for banning')
            )
            .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)                   
    // name: 'ban',
    // description: 'Bans a member from the server.',
    // // devOnly: Boolean,
    // // testOnly: Boolean,
    // options: [
    //     { 
    //         name: 'target-user',
    //         description: 'The user to ban.',
    //         required: true,
    //         type: ApplicationCommandOptionType.Mentionable
    //     },
    //     {
    //         name: 'reason',
    //         description: 'The reason for banning',
    //         type: ApplicationCommandOptionType.String
    //     }
    // ],
    // permissionsRequired: [PermissionFlagsBits.BanMembers],
    // botPermissions: [PermissionFlagsBits.BanMembers],
}; 