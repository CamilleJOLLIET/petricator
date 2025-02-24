import { SlashCommandBuilder } from 'discord.js';
import mh from '../../../mh.json';
import { showTargets } from '../../managers/targets';

module.exports = {
    run: ({ interaction }) => {
        if (!interaction.isChatInputCommand()) return;

        const subcommand = interaction.options.getSubcommand('targets');

        if (subcommand === 'targets') showTargets({ interaction });
    },
    data: new SlashCommandBuilder()
        .setName('show')
        .setDescription('Consulter Petricator.')
        .addSubcommand(subcommand => 
            subcommand.setName('targets')
                .setDescription('Consulter les cibles prio.')
        )
    ,
};