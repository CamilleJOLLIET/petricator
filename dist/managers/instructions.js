"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateInstruction = exports.updateInstructionChoices = exports.deleteAllInstructions = exports.deleteAllInstructionsConfirmation = exports.deleteInstructionChoices = exports.addInstruction = exports.addInstructionModal = exports.showInstructions = void 0;
const getMh_1 = require("../utils/getMh");
const discord_js_1 = require("discord.js");
const showInstructions = ({ interaction }) => {
    const instructions = (0, getMh_1.getMh)().instructions;
    const embed = new discord_js_1.EmbedBuilder()
        .setTitle('📝 Consignes 📝')
        .setColor('#FF69B4');
    if (instructions.length) {
        for (const instruction of instructions) {
            embed.addFields({
                name: instruction.content,
                value: instruction.usersConcerned?.length ?
                    instruction.usersConcerned.join(', ') + '\n' + instruction.date :
                    instruction.date,
            });
        }
        ;
    }
    else {
        embed.setFooter({ text: 'Aucune consigne en cours. Instant free boobs !' });
    }
    interaction.reply({ embeds: [embed] });
    return;
};
exports.showInstructions = showInstructions;
const addInstructionModal = async ({ interaction }) => {
    const addInstructionModal = new discord_js_1.ModalBuilder()
        .setCustomId('addInstructionModal')
        .setTitle('Ajoute une consigne');
    const contentInput = new discord_js_1.TextInputBuilder()
        .setCustomId('contentInput')
        .setLabel('La dite consigne')
        .setStyle(discord_js_1.TextInputStyle.Paragraph);
    const usersConcerned = new discord_js_1.TextInputBuilder()
        .setCustomId('usersConcernedInput')
        .setLabel('Joueur(s) concerné(s)')
        .setRequired(false)
        .setStyle(discord_js_1.TextInputStyle.Short);
    addInstructionModal
        .addComponents(new discord_js_1.ActionRowBuilder().addComponents(contentInput))
        .addComponents(new discord_js_1.ActionRowBuilder().addComponents(usersConcerned));
    await interaction.showModal(addInstructionModal);
};
exports.addInstructionModal = addInstructionModal;
const addInstruction = async ({ interaction }) => {
    try {
        const content = interaction.fields.getTextInputValue('contentInput');
        const usersConcerned = interaction.fields.getTextInputValue('usersConcernedInput') ?
            interaction.fields.getTextInputValue('usersConcernedInput').split(', ') :
            [];
        const date = new Date().toLocaleString('fr-FR');
        const mh = (0, getMh_1.getMh)();
        mh.instructions.push({ content, usersConcerned, date });
        (0, getMh_1.saveMh)(mh);
        interaction.reply({ content: 'Consigne ajoutée !', ephemeral: true });
    }
    catch (error) {
        console.error(error);
        interaction.reply({ content: 'Erreur lors de l\'ajout de la consigne.', ephemeral: true });
        return;
    }
    return;
};
exports.addInstruction = addInstruction;
const deleteInstructionChoices = async ({ interaction }) => {
    const response = await buildInstructionsChoices({ interaction }, 'supprimer');
    const collector = response.resource.message.createMessageComponentCollector({ componentType: discord_js_1.ComponentType.StringSelect, time: 3_600_000 });
    try {
        collector.on('collect', async (i) => {
            const selection = i.values[0];
            const instructions = (0, getMh_1.getMh)().instructions;
            const instruction = instructions[parseInt(selection)];
            const mh = (0, getMh_1.getMh)();
            mh.instructions.splice(parseInt(selection), 1);
            (0, getMh_1.saveMh)(mh);
            await i.reply({
                content: `La consigne a été supprimée !`,
                ephemeral: true
            });
        });
    }
    catch (error) {
        await interaction.editReply({
            content: `Une erreur est survenue pendant le choix de l'instruction à supprimer: ${error}`,
            components: []
        });
    }
    return;
};
exports.deleteInstructionChoices = deleteInstructionChoices;
const deleteAllInstructionsConfirmation = async ({ interaction }) => {
    const confirm = new discord_js_1.ButtonBuilder()
        .setCustomId('confirm')
        .setLabel(`C'est parti !`)
        .setStyle(discord_js_1.ButtonStyle.Danger);
    const cancel = new discord_js_1.ButtonBuilder()
        .setCustomId('cancel')
        .setLabel('Oublie ça')
        .setStyle(discord_js_1.ButtonStyle.Secondary);
    const row = new discord_js_1.ActionRowBuilder()
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
            await (0, exports.deleteAllInstructions)({ interaction });
            await interaction.editReply({ content: `C'est bon c'est tout clean !` });
        }
        else if (confirmation.customId === 'cancel') {
            await confirmation.update({ content: `Y'est pas fou lui...`, components: [] });
            await interaction.editReply({ content: `Allez on fait comme si rien ne s'était passé...` });
        }
    }
    catch {
        await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
    }
    return;
};
exports.deleteAllInstructionsConfirmation = deleteAllInstructionsConfirmation;
const deleteAllInstructions = async ({ interaction }) => {
    try {
        const mhFile = (0, getMh_1.getMh)();
        mhFile.instructions = [];
        (0, getMh_1.saveMh)(mhFile);
    }
    catch (error) {
        console.error(error);
    }
    return;
};
exports.deleteAllInstructions = deleteAllInstructions;
const updateInstructionChoices = async ({ interaction }) => {
    const response = await buildInstructionsChoices({ interaction }, 'mettre à jour');
    const collector = response.resource.message.createMessageComponentCollector({ componentType: discord_js_1.ComponentType.StringSelect, time: 3_600_000 });
    try {
        collector.on('collect', async (i) => {
            const selection = i.values[0];
            const instructions = (0, getMh_1.getMh)().instructions;
            const instruction = instructions[parseInt(selection)];
            await updateInstructionModal(i, instruction, selection);
        });
    }
    catch (error) {
        await interaction.editReply({
            content: `Une erreur est survenue pendant le choix de l'instruction à supprimer: ${error}`,
            components: []
        });
    }
    return;
};
exports.updateInstructionChoices = updateInstructionChoices;
const buildInstructionsChoices = async ({ interaction }, action) => {
    const mhFile = (0, getMh_1.getMh)();
    const instructions = mhFile.instructions;
    if (!instructions.length) {
        interaction.reply({ content: 'Aucune consigne à mettre à jour.', ephemeral: true });
        return;
    }
    const selectInstructionInput = new discord_js_1.StringSelectMenuBuilder()
        .setCustomId('selectInstructionInput')
        .setPlaceholder("Liste des consignes existantes");
    for (let index = 0; index < instructions.length; index++) {
        const element = instructions[index];
        const label = element.content.length > 50 ? `${element.content.slice(0, 50)}...` : element.content;
        selectInstructionInput.addOptions(new discord_js_1.StringSelectMenuOptionBuilder()
            .setLabel(label)
            .setValue(index.toString()));
    }
    const row = new discord_js_1.ActionRowBuilder()
        .addComponents(selectInstructionInput);
    return await interaction.reply({
        content: `Choisis la consigne à ${action}`,
        components: [row],
        withResponse: true,
        ephemeral: true
    });
};
const updateInstructionModal = async (interaction, instruction, selection) => {
    const updateInstructionModal = new discord_js_1.ModalBuilder()
        .setCustomId(`updateInstructionModal-${selection}`)
        .setTitle(`Mets à jour le consigne numéro ${parseInt(selection) + 1}`);
    const contentInput = new discord_js_1.TextInputBuilder()
        .setCustomId('contentInput')
        .setLabel('La dite consigne')
        .setValue(instruction.content)
        .setStyle(discord_js_1.TextInputStyle.Paragraph);
    const usersConcerned = new discord_js_1.TextInputBuilder()
        .setCustomId('usersConcernedInput')
        .setLabel('Joueur(s) concerné(s)')
        .setRequired(false)
        .setStyle(discord_js_1.TextInputStyle.Short);
    if (instruction.usersConcerned.length) {
        usersConcerned.setValue(instruction.usersConcerned.join(', '));
    }
    updateInstructionModal
        .addComponents(new discord_js_1.ActionRowBuilder().addComponents(contentInput))
        .addComponents(new discord_js_1.ActionRowBuilder().addComponents(usersConcerned));
    await interaction.showModal(updateInstructionModal);
};
const updateInstruction = async ({ interaction }) => {
    try {
        const content = interaction.fields.getTextInputValue('contentInput');
        const usersConcerned = interaction.fields.getTextInputValue('usersConcernedInput') ?
            interaction.fields.getTextInputValue('usersConcernedInput').split(', ') :
            [];
        const date = new Date().toLocaleString('fr-FR');
        const mhFile = (0, getMh_1.getMh)();
        const instructionIndex = parseInt(interaction.customId.replace('updateInstructionModal-', ''));
        mhFile.instructions[instructionIndex] = { content, usersConcerned, date };
        (0, getMh_1.saveMh)(mhFile);
        interaction.reply({ content: 'Consigne mise à jour !', ephemeral: true });
    }
    catch (error) {
        console.error(error);
        interaction.reply({ content: 'Erreur lors de la mise à jour de la consigne.', ephemeral: true });
    }
    return;
};
exports.updateInstruction = updateInstruction;
