import { addTarget, updateTarget } from '../../managers/targets';

module.exports = async (interaction) => {
    if (!interaction.isModalSubmit()) return;

    const { customId } = interaction;

    if (customId === 'addTargetModal') addTarget({ interaction });
    if (customId.startsWith('updateTargetModal')) updateTarget({ interaction });
};