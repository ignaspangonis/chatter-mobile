import { ExtendedMessageDto } from '../../types/dtos'
import { MessageModel } from '../../types/models'

export const transformMessage = (dto: ExtendedMessageDto): MessageModel => ({
  _id: dto.id.timestamp * dto.id.increment,
  user: {
    _id: dto.author,
    name: dto.author,
    avatar: 'https://placeimg.com/140/140/any',
  },
  text: dto.content,
  createdAt: new Date(dto.createdAt),
  system: dto.author === 'ChatBot',
})

export const transformMessages = (messages: ExtendedMessageDto[]): MessageModel[] =>
  messages.map(transformMessage)
