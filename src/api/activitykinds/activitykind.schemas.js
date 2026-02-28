import vine from '@vinejs/vine';

export const activitykindSchema = vine.object({
  name: vine.string().minLength(2).maxLength(50).trim(),
  iconName: vine.string().minLength(2).maxLength(50).trim().optional(),
  description: vine.string().maxLength(255).trim().optional(),
});
