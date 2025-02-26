import { SlashCommandBuilder } from 'discord.js';
import { showMissions } from '../../managers/missions';

module.exports = {
    run: ({ interaction }) => {
        if (!interaction.isChatInputCommand()) return;

        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'show') showMissions({ interaction });
        // if (subcommand === 'add') addInstructionModal({ interaction });
        // if (subcommand === 'delete') deleteInstructionChoices({ interaction });
        // if (subcommand === 'delete-all') deleteAllInstructionsConfirmation({ interaction });
        // if (subcommand === 'update') updateInstructionChoices({ interaction });
    },
    data: new SlashCommandBuilder()
        .setName('missions')
        .setDescription('Consulter Petricator.')
        .addSubcommand(subcommand => 
            subcommand.setName('show')
                .setDescription('Consultes les missions.')
        )
        .addSubcommand(subcommand => 
            subcommand.setName('add')
                .setDescription('Ajoutes une mission.')
        )
        .addSubcommand(subcommand => 
            subcommand.setName('delete')
                .setDescription('Supprimes une mission.')
        )
        .addSubcommand(subcommand => 
            subcommand.setName('delete-all')
                .setDescription('Supprimes toutes les missions.')
        )
        .addSubcommand(subcommand => 
            subcommand.setName('update')
                .setDescription('Mets à jour une mission.')
        )
    ,
};