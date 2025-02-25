import { SlashCommandBuilder } from 'discord.js';
import { addTargetModal } from '../../managers/targets';
import { addInstructionModal } from '../../managers/instructions';

module.exports = {
    run: async ({ interaction }) => {
        if (!interaction.isChatInputCommand()) return;

        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'target') addTargetModal({ interaction });
        if (subcommand === 'instruction') addInstructionModal({ interaction });
    },
    data: new SlashCommandBuilder()
        .setName('add')
        .setDescription('Ajouter des données au Petricator.')
        .addSubcommand(subcommand => 
            subcommand.setName('target')
                .setDescription('Ajoute une cible prioritaire.')
        )
        .addSubcommand(subcommand => 
            subcommand.setName('instruction')
                .setDescription('Ajoute une consigne.')
        )
    ,
};