import { ExtendedMessageDto } from '../../types/dtos'
import { MessageModel } from '../../types/models'

export const transformMessage = (dto: ExtendedMessageDto): MessageModel => ({
  id: dto.id,
  userName: dto.author,
  content: dto.content,
  createdAt: dto.createdAt,
  roomName: dto.roomName,
})

export const transformMessages = (messages: ExtendedMessageDto[]): MessageModel[] =>
  messages.map(transformMessage)
