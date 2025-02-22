import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import mh from '../../../mh.json';

module.exports = {
    run: ({ interaction }) => {
        if (!interaction.isChatInputCommand()) return;

        const subcommand = interaction.options.getSubcommand('targets');

        if (subcommand === 'targets') {
            const targets = mh.targets;
            const embed = new EmbedBuilder()
                .setTitle('🎯 Cibles prioritaires 🎯')
                .setColor('#FF69B4');

            if (targets.length) {
                for (const target of targets) {
                    embed.addFields({ 
                        name: `[${target.id}] ${target.name}`,
                        value: target.position,
                    })
                };
            } else {
                embed.setFooter({ text: 'Aucune cible définie'});
            }
            interaction.reply({ embeds: [embed] });
        }
        return;
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