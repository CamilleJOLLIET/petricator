"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const targets_1 = require("../../managers/targets");
module.exports = async (interaction) => {
    if (!interaction.isModalSubmit())
        return;
    const { customId } = interaction;
    if (customId === 'addTargetModal')
        (0, targets_1.addTarget)({ interaction });
    if (customId.startsWith('updateTargetModal'))
        (0, targets_1.updateTarget)({ interaction });
};
