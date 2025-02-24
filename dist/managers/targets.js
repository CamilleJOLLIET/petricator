"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.editTarget = exports.editTargetModal = exports.deleteAllTargets = exports.deleteAllTargetsConfirmation = exports.deleteTarget = exports.deleteTargetModal = exports.addTarget = exports.addTargetModal = exports.showTargets = exports.getTargets = void 0;
const discord_js_1 = require("discord.js");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const filePath = path.resolve(__dirname, '../../mh.json');
const getTargets = () => {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8')).targets;
};
exports.getTargets = getTargets;
const showTargets = ({ interaction }) => {
    const targets = (0, exports.getTargets)();
    const embed = new discord_js_1.EmbedBuilder()
        .setTitle('🎯 Cibles prioritaires 🎯')
        .setColor('#FF69B4');
    if (targets.length) {
        for (const target of targets) {
            embed.addFields({
                name: `[${target.id}] ${target.name}`,
                value: target.details ? target.position + '\n' + target.details : target.position,
            });
        }
        ;
    }
    else {
        embed.setFooter({ text: 'Aucune cible définie' });
    }
    interaction.reply({ embeds: [embed] });
    return;
};
exports.showTargets = showTargets;
const addTargetModal = async ({ interaction }) => {
    const addTargetModal = new discord_js_1.ModalBuilder()
        .setCustomId('addTargetModal')
        .setTitle('Ajoute une cible prioritaire');
    const idInput = new discord_js_1.TextInputBuilder()
        .setCustomId('idInput')
        .setLabel('ID du bestiau')
        .setPlaceholder("Rend pas fou avé les brackets, juste l'ID.")
        .setStyle(discord_js_1.TextInputStyle.Short);
    const nameInput = new discord_js_1.TextInputBuilder()
        .setCustomId('nameInput')
        .setLabel('Nom du bestiau')
        .setStyle(discord_js_1.TextInputStyle.Short);
    const positionInput = new discord_js_1.TextInputBuilder()
        .setCustomId('positionInput')
        .setLabel('Position du bestiau')
        .setStyle(discord_js_1.TextInputStyle.Short);
    const detailsInput = new discord_js_1.TextInputBuilder()
        .setCustomId('detailsInput')
        .setLabel('Consignes supplémentaires')
        .setRequired(false)
        .setStyle(discord_js_1.TextInputStyle.Paragraph);
    addTargetModal
        .addComponents(new discord_js_1.ActionRowBuilder().addComponents(idInput))
        .addComponents(new discord_js_1.ActionRowBuilder().addComponents(nameInput))
        .addComponents(new discord_js_1.ActionRowBuilder().addComponents(positionInput))
        .addComponents(new discord_js_1.ActionRowBuilder().addComponents(detailsInput));
    await interaction.showModal(addTargetModal);
};
exports.addTargetModal = addTargetModal;
const addTarget = async ({ interaction }) => {
    try {
        const newTarget = {
            id: interaction.fields.getTextInputValue('idInput'),
            name: interaction.fields.getTextInputValue('nameInput'),
            position: interaction.fields.getTextInputValue('positionInput'),
            details: interaction.fields.getTextInputValue('detailsInput'),
        };
        const mhFile = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        mhFile.targets.push(newTarget);
        fs.writeFileSync(filePath, JSON.stringify(mhFile, null));
        await interaction.reply({ content: 'La cible a bien été ajoutée', ephemeral: true });
    }
    catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Une erreur est survenue, veuillez réessayer.', ephemeral: true });
    }
    return;
};
exports.addTarget = addTarget;
const deleteTargetModal = async ({ interaction }) => {
    const deleteTargetModal = new discord_js_1.ModalBuilder()
        .setCustomId('deleteTargetModal')
        .setTitle('Supprime une cible prioritaire');
    const idInput = new discord_js_1.TextInputBuilder()
        .setCustomId('idInput')
        .setLabel('ID du bestiau')
        .setPlaceholder("Rend pas fou avé les brackets, juste l'ID.")
        .setStyle(discord_js_1.TextInputStyle.Short);
    deleteTargetModal.addComponents(new discord_js_1.ActionRowBuilder().addComponents(idInput));
    await interaction.showModal(deleteTargetModal);
};
exports.deleteTargetModal = deleteTargetModal;
const deleteTarget = async ({ interaction }) => {
    try {
        const targetId = interaction.fields.getTextInputValue('idInput');
        const targetsFile = JSON.parse(fs.readFileSync(filePath, 'utf-8')).targets;
        const targetObject = targetsFile.find(target => target.id === targetId);
        if (!targetObject) {
            await interaction.reply({ content: 'Cible non trouvée.', ephemeral: true });
            return;
        }
        const updatedTargetsFile = targetsFile.filter(target => target.id !== targetId);
        fs.writeFileSync(filePath, JSON.stringify(updatedTargetsFile, null, 2));
        await interaction.reply({ content: 'La cible a bien été supprimée', ephemeral: true });
    }
    catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Une erreur est survenue, veuillez réessayer.', ephemeral: true });
    }
    return;
};
exports.deleteTarget = deleteTarget;
const deleteAllTargetsConfirmation = async ({ interaction }) => {
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
        content: `T'es bien sûr de ton coup ? On supprime toutes les cibles ?`,
        components: [row],
        withResponse: true,
        ephemeral: true,
    });
    const collectorFilter = i => i.user.id === interaction.user.id;
    try {
        const confirmation = await response.resource.message.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
        if (confirmation.customId === 'confirm') {
            console.log('confirm');
            await confirmation.update({ content: `Allez c'est parti !`, components: [] });
            await (0, exports.deleteAllTargets)({ interaction });
            await interaction.editReply({ content: `C'est bon c'est tout clean !` });
        }
        else if (confirmation.customId === 'cancel') {
            console.log('cancel');
            await confirmation.update({ content: `Y'est pas fou lui...`, components: [] });
            await interaction.editReply({ content: `Allez on fait comme si rien ne s'était passé...` });
        }
    }
    catch {
        await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
    }
    return;
};
exports.deleteAllTargetsConfirmation = deleteAllTargetsConfirmation;
const deleteAllTargets = async ({ interaction }) => {
    try {
        const mhFile = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        mhFile.targets = [];
        fs.writeFileSync(filePath, JSON.stringify(mhFile, null, 2));
    }
    catch (error) {
        console.error(error);
    }
    return;
};
exports.deleteAllTargets = deleteAllTargets;
const editTargetModal = async ({ interaction }) => { console.log('editTargetModal'); };
exports.editTargetModal = editTargetModal;
const editTarget = async ({ interaction }) => { console.log('editTarget'); };
exports.editTarget = editTarget;
