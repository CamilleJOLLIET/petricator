import { getMh, saveMh } from "../utils/getMh";
import { 
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
    EmbedBuilder,
    ModalActionRowComponentBuilder,
    ModalBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuInteraction,
    StringSelectMenuOptionBuilder,
    TextInputBuilder,
    TextInputStyle } from "discord.js";
import { Instruction } from "../types/Instruction";

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
        .setCustomId('usersConcernedInput')
        .setLabel('Joueur(s) concerné(s)')
        .setRequired(false)
        .setStyle(TextInputStyle.Short);

    addInstructionModal
        .addComponents(new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(contentInput))
        .addComponents(new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(usersConcerned))

    await interaction.showModal(addInstructionModal);
};

export const addInstruction = async ({ interaction }): Promise<void> => {
    try {
        const content = interaction.fields.getTextInputValue('contentInput');
        const usersConcerned = interaction.fields.getTextInputValue('usersConcernedInput') ? 
            interaction.fields.getTextInputValue('usersConcernedInput').split(', ') :
            [];
        const date = new Date().toLocaleString('fr-FR');
        const mh = getMh();
    
        mh.instructions.push({ content, usersConcerned, date });
        saveMh(mh);
        
        interaction.reply({ content: 'Consigne ajoutée !', ephemeral: true });

    } catch (error) {
        console.error(error);
        interaction.reply({ content: 'Erreur lors de l\'ajout de la consigne.', ephemeral: true });
        return;
    }
    return;
};

export const deleteInstructionChoices = async ({ interaction }): Promise<void> => {
    const response = await buildInstructionsChoices({ interaction }, 'supprimer');
    const collector = response.resource.message.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 3_600_000 });
    
    try {
        collector.on('collect', async i => {
            const selection = i.values[0];
            const instructions = getMh().instructions;
            const instruction = instructions[parseInt(selection)];
            const mh = getMh();
            
            mh.instructions.splice(parseInt(selection), 1);
            saveMh(mh);
            
            await i.reply({
                content: `La consigne a été supprimée !`,
                ephemeral: true
            });
        });
    } catch (error) {
        await interaction.editReply({ 
            content: `Une erreur est survenue pendant le choix de l'instruction à supprimer: ${error}`,
            components: [] 
        });
    }

    return;
};

export const deleteAllInstructionsConfirmation = async ({ interaction }): Promise<void> => {
    const confirm = new ButtonBuilder()
        .setCustomId('confirm')
        .setLabel(`C'est parti !`)
        .setStyle(ButtonStyle.Danger);

    const cancel = new ButtonBuilder()
        .setCustomId('cancel')
        .setLabel('Oublie ça')
        .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder()
        .addComponents(cancel, confirm);

    const response = await interaction.reply({
        content: `T'es bien sûr de ton coup ? On supprime toutes les consignes ?`,
        components: [row],
        withResponse: true,
        ephemeral: true,
    });

    const collectorFilter = i => i.user.id === interaction.user.id;

    try {
        const confirmation = await response.resource.message.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });

        if (confirmation.customId === 'confirm') {
            await confirmation.update({ content: `Allez c'est parti !`, components: [] });
            await deleteAllInstructions({ interaction });
            await interaction.editReply({ content: `C'est bon c'est tout clean !` });
        } else if (confirmation.customId === 'cancel') {
            await confirmation.update({ content: `Y'est pas fou lui...`, components: [] });
            await interaction.editReply({ content: `Allez on fait comme si rien ne s'était passé...` });
        }
    } catch {
        await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
    }

    return;
}

export const deleteAllInstructions = async ({ interaction }): Promise<void> => {
    try {
        const mhFile = getMh();
        mhFile.instructions = [];

        saveMh(mhFile);
    } catch (error) {
        console.error(error);
    }

    return;
};

export const updateInstructionChoices = async ({ interaction }): Promise<void> => {
    const response = await buildInstructionsChoices({ interaction }, 'mettre à jour');
    const collector = response.resource.message.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 3_600_000 });
    
    try {
        collector.on('collect', async i => {
            const selection = i.values[0];
            const instructions = getMh().instructions;
            const instruction = instructions[parseInt(selection)];

            await updateInstructionModal(i, instruction, selection);
        });
    } catch (error) {
        await interaction.editReply({ 
            content: `Une erreur est survenue pendant le choix de l'instruction à supprimer: ${error}`,
            components: [] 
        });
    }

    return;
};

const buildInstructionsChoices = async ({ interaction }, action) => {
    const mhFile = getMh();
    const instructions = mhFile.instructions;

    if (!instructions.length) {
        interaction.reply({ content: 'Aucune consigne à mettre à jour.', ephemeral: true });
        return;
    }

    const selectInstructionInput = new StringSelectMenuBuilder()
        .setCustomId('selectInstructionInput')
        .setPlaceholder("Liste des consignes existantes")

    for (let index = 0; index < instructions.length; index++) {
        const element = instructions[index];
        const label = element.content.length > 50 ? `${element.content.slice(0, 50)}...` : element.content;
        
        selectInstructionInput.addOptions(
            new StringSelectMenuOptionBuilder()
            .setLabel(label)
            .setValue(index.toString())
        )
    }
        
    const row = new ActionRowBuilder()
        .addComponents(selectInstructionInput);

    return await interaction.reply({
        content: `Choisis la consigne à ${action}`,
        components: [row],
        withResponse: true,
        ephemeral: true
    });
}

const updateInstructionModal = async (interaction, instruction, selection): Promise<void> => {   
    const updateInstructionModal = new ModalBuilder()
        .setCustomId(`updateInstructionModal-${selection}`)
        .setTitle(`Mets à jour le consigne numéro ${parseInt(selection) + 1}`);

    const contentInput = new TextInputBuilder()
        .setCustomId('contentInput')
        .setLabel('La dite consigne')
        .setValue(instruction.content)
        .setStyle(TextInputStyle.Paragraph);

    const usersConcerned = new TextInputBuilder()
        .setCustomId('usersConcernedInput')
        .setLabel('Joueur(s) concerné(s)')
        .setRequired(false)
        .setStyle(TextInputStyle.Short);

    if (instruction.usersConcerned.length) {
        usersConcerned.setValue(instruction.usersConcerned.join(', '));
    }

    updateInstructionModal
        .addComponents(new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(contentInput))
        .addComponents(new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(usersConcerned))

    await interaction.showModal(updateInstructionModal);
}

export const updateInstruction = async ({ interaction }): Promise<void> => {
    try {
        const content = interaction.fields.getTextInputValue('contentInput');
        const usersConcerned = interaction.fields.getTextInputValue('usersConcernedInput') ? 
            interaction.fields.getTextInputValue('usersConcernedInput').split(', ') :
            [];
        const date = new Date().toLocaleString('fr-FR');
        const mhFile = getMh();
        const instructionIndex = parseInt(interaction.customId.replace('updateInstructionModal-', ''));
        
        mhFile.instructions[instructionIndex] = { content, usersConcerned, date };
        saveMh(mhFile);
        
        interaction.reply({ content: 'Consigne mise à jour !', ephemeral: true });
    } catch (error) {
        console.error(error);
        interaction.reply({ content: 'Erreur lors de la mise à jour de la consigne.', ephemeral: true });
    }
    return;
}