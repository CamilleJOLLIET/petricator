import { getMh } from "../utils/getMh";
import { ActionRowBuilder, EmbedBuilder, ModalActionRowComponentBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { Instruction } from "../types/Instructions";

export const showInstructions = ({ interaction }): void => {
    const instructions: Instruction[] = getMh().instructions;
    const embed = new EmbedBuilder()
        .setTitle('📝 Consignes 📝')
        .setColor('#FF69B4');

    if (instructions.length) {
        for (const instruction of instructions) {
            embed.addFields({ 
                name: instruction.content,
                value: instruction.usersConcerned?.length ?
                    instruction.usersConcerned.join(', ') + '\n' + instruction.date :
                    instruction.date,
            })
        };
    } else {
        embed.setFooter({ text: 'Aucune consigne en cours. Instant free boobs !'});
    }
    interaction.reply({ embeds: [embed] });
    return;
}

export const addInstructionModal = async ({ interaction }): Promise<void> => {
    const addInstructionModal = new ModalBuilder()
        .setCustomId('addInstructionModal')
        .setTitle('Ajoute une consigne');

    const contentInput = new TextInputBuilder()
        .setCustomId('contentInput')
        .setLabel('La dite consigne')
        .setStyle(TextInputStyle.Paragraph);

    const usersConcerned = new TextInputBuilder()
        .setCustomId('usersConcerned')
        .setLabel('Joueur(s) concerné(s)')
        .setRequired(false)
        .setStyle(TextInputStyle.Short);

    addInstructionModal
        .addComponents(new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(contentInput))
        .addComponents(new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(usersConcerned))

    await interaction.showModal(addInstructionModal);
};