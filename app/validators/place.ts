import vine from '@vinejs/vine'

export const placeValidator = vine.compile(
  vine.object({
    name: vine.string(),
    lng: vine.number(),
    lat: vine.number(),
  })
)
