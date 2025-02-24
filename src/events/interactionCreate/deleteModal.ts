import { deleteAllTargets, deleteTarget } from '../../managers/targets';

module.exports = async (interaction) => {
    if (!interaction.isModalSubmit()) return;

    const { customId } = interaction;

    if (customId === 'deleteTargetModal') deleteTarget({ interaction });
    if (customId === 'deleteAllTargetsModal') deleteAllTargets({ interaction });
};