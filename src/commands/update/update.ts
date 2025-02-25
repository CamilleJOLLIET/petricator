import { SlashCommandBuilder } from 'discord.js';
import { updateTargetModal } from '../../managers/targets';

module.exports = {
    run: async ({ interaction }) => {
        if (!interaction.isChatInputCommand()) return;

        const subcommand = interaction.options.getSubcommand('target');

        if (subcommand === 'target') updateTargetModal({ interaction });
    },
    data: new SlashCommandBuilder()
        .setName('update')
        .setDescription('Ajouter des données au Petricator.')
        .addSubcommand(subcommand => 
            subcommand.setName('target')
                .setDescription('Mets à jour une cible prioritaire.')
        )
    ,
};