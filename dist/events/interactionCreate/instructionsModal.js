"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const instructions_1 = require("../../managers/instructions");
module.exports = async (interaction) => {
    if (!interaction.isModalSubmit())
        return;
    const { customId } = interaction;
    if (customId === 'addInstructionModal')
        (0, instructions_1.addInstruction)({ interaction });
    if (customId.startsWith('updateInstructionModal'))
        (0, instructions_1.updateInstruction)({ interaction });
};
