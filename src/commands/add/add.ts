import { SlashCommandBuilder } from 'discord.js';
import { addTargetModal } from '../../managers/targets';

module.exports = {
    run: async ({ interaction }) => {
        if (!interaction.isChatInputCommand()) return;

        const subcommand = interaction.options.getSubcommand('target');

        if (subcommand === 'target') addTargetModal({ interaction });
    },
    data: new SlashCommandBuilder()
        .setName('add')
        .setDescription('Ajouter des données au Petricator.')
        .addSubcommand(subcommand => 
            subcommand.setName('target')
                .setDescription('Ajouter une cible prioritaire.')
        )
    ,
};