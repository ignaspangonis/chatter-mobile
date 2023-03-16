export type WeatherDto = {
  temperature: number
  time: string
  summary: string
}

export type ExtendedMessageDto = {
  id: string
  author: string
  content: string
  createdAt: string
  roomName: string
}
