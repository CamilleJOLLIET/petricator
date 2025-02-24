import { SlashCommandBuilder } from 'discord.js';
import { deleteAllTargetsConfirmation, deleteTargetModal } from '../../managers/targets';

module.exports = {
    run: async ({ interaction }) => {
        if (!interaction.isChatInputCommand()) return;

        const subcommand = interaction.options.getSubcommand('target');

        if (subcommand === 'target') deleteTargetModal({ interaction });
        if (subcommand === 'all-targets') deleteAllTargetsConfirmation({ interaction });
    },
    data: new SlashCommandBuilder()
        .setName('delete')
        .setDescription('Supprime des données du Petricator.')
        .addSubcommand(subcommand => 
            subcommand.setName('target')
                .setDescription('Supprime une cible prioritaire.')
        )
        .addSubcommand(subcommand => 
            subcommand.setName('all-targets')
                .setDescription('Supprime toute les cibles prioritaires.')
        )
    ,
};