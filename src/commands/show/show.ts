import { SlashCommandBuilder } from 'discord.js';
import { showTargets } from '../../managers/targets';
import { showInstructions } from '../../managers/instructions';

module.exports = {
    run: ({ interaction }) => {
        if (!interaction.isChatInputCommand()) return;

        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'targets') showTargets({ interaction });
        if (subcommand === 'instructions') showInstructions({ interaction });
    },
    data: new SlashCommandBuilder()
        .setName('show')
        .setDescription('Consulter Petricator.')
        .addSubcommand(subcommand => 
            subcommand.setName('targets')
                .setDescription('Consulte les cibles prio.')
        )
        .addSubcommand(subcommand => 
            subcommand.setName('instructions')
                .setDescription('Consulte les consignes.')
        )
    ,
};