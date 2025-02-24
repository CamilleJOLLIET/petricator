"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const targets_1 = require("../../managers/targets");
module.exports = async (interaction) => {
    if (!interaction.isModalSubmit())
        return;
    const { customId } = interaction;
    if (customId === 'deleteTargetModal')
        (0, targets_1.deleteTarget)({ interaction });
    if (customId === 'deleteAllTargetsModal')
        (0, targets_1.deleteAllTargets)({ interaction });
};
