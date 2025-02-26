import { SlashCommandBuilder } from 'discord.js';
import {
    addInstructionModal,
    deleteAllInstructionsConfirmation,
    deleteInstructionChoices,
    showInstructions,
    updateInstructionChoices
} from '../../managers/instructions';

module.exports = {
    run: ({ interaction }) => {
        if (!interaction.isChatInputCommand()) return;

        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'show') showInstructions({ interaction });
        if (subcommand === 'add') addInstructionModal({ interaction });
        if (subcommand === 'delete') deleteInstructionChoices({ interaction });
        if (subcommand === 'delete-all') deleteAllInstructionsConfirmation({ interaction });
        if (subcommand === 'update') updateInstructionChoices({ interaction });
    },
    data: new SlashCommandBuilder()
        .setName('instructions')
        .setDescription('Consulter Petricator.')
        .addSubcommand(subcommand => 
            subcommand.setName('show')
                .setDescription('Consulte les cibles prio.')
        )
        .addSubcommand(subcommand => 
            subcommand.setName('add')
                .setDescription('Ajoute une consigne.')
        )
        .addSubcommand(subcommand => 
            subcommand.setName('delete')
                .setDescription('Supprime une consigne.')
        )
        .addSubcommand(subcommand => 
            subcommand.setName('delete-all')
                .setDescription('Supprime toutes les consignes.')
        )
        .addSubcommand(subcommand => 
            subcommand.setName('update')
                .setDescription('Mets à jour une consigne.')
        )
    ,
};