import vine from "@vinejs/vine";

export const activitySchema = vine.object({
  when: vine.string().transform((value) => new Date(value).toISOString()),
  kindId: vine.string().minLength(20).maxLength(50).trim(),
  title: vine.string().maxLength(50).trim(),
  description: vine.string().maxLength(255).trim().optional(),
  distance: vine.number().decimal([0, 2]).nonNegative().optional(),
  duration: vine.number().nonNegative().optional(),
  elevation: vine.number().nonNegative().optional(),
  calories: vine.number().nonNegative().optional(),
});
