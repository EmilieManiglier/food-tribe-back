import vine from '@vinejs/vine'

export const placeValidator = vine.compile(
  vine.object({
    name: vine.string(),
    lng: vine.number(),
    lat: vine.number(),
    categories: vine.array(
      vine.object({
        id: vine.number(),
        name: vine.string(),
      })
    ),
    friendGroupId: vine.number(),
    description: vine.string().optional(),
    streetAddress: vine.string().optional(),
    zipCode: vine.string().optional(),
    city: vine.string().optional(),
  })
)
