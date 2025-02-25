import { updateTarget } from '../../managers/targets';

module.exports = async (interaction) => {
    if (!interaction.isModalSubmit()) return;

    const { customId } = interaction;

    if (customId === 'updateTargetModal') updateTarget({ interaction });
};