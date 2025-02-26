import { addInstruction, updateInstruction } from '../../managers/instructions';

module.exports = async (interaction) => {
    if (!interaction.isModalSubmit()) return;

    const { customId } = interaction;

    if (customId === 'addInstructionModal') addInstruction({ interaction });
    if (customId.startsWith('updateInstructionModal')) updateInstruction({ interaction });

};