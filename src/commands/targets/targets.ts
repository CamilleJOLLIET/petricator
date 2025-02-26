import { SlashCommandBuilder } from 'discord.js';
import {
    addTargetModal,
    deleteAllTargetsConfirmation,
    deleteTargetChoices,
    showTargets,
    updateTargetChoices
} from '../../managers/targets';

module.exports = {
    run: ({ interaction }) => {
        if (!interaction.isChatInputCommand()) return;

        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'show') showTargets({ interaction });
        if (subcommand === 'add') addTargetModal({ interaction });
        if (subcommand === 'delete') deleteTargetChoices({ interaction });
        if (subcommand === 'delete-all') deleteAllTargetsConfirmation({ interaction });
        if (subcommand === 'update') updateTargetChoices({ interaction });
    },
    data: new SlashCommandBuilder()
        .setName('targets')
        .setDescription('Gère les cibles.')
        .addSubcommand(subcommand => 
            subcommand.setName('show')
                .setDescription('Consulte les cibles prios.')
        )
        .addSubcommand(subcommand => 
            subcommand.setName('add')
                .setDescription('Ajoute une cible prioritaire.')
        )
        .addSubcommand(subcommand => 
            subcommand.setName('delete')
                .setDescription('Supprime une cible prioritaire.')
        )
        .addSubcommand(subcommand => 
            subcommand.setName('delete-all')
                .setDescription('Supprime toute les cibles prioritaires.')
        )
        .addSubcommand(subcommand => 
            subcommand.setName('update')
                .setDescription('Mets à jour une cible prioritaire.')
        )
    ,
};