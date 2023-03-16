import { ROOT_URL } from './api'

export enum ChatHubMethod {
  JoinRoom = 'JoinRoom',
  ReceiveMessage = 'ReceiveMessage',
  SendMessage = 'SendMessage',
  UsersInRoom = 'UsersInRoom',
  ReceiveMessageHistory = 'ReceiveMessageHistory',
}

export const CHAT_API_URL = `${ROOT_URL}/chat`
