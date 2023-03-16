import { ROOT_URL } from '../../constants/api'
import { WeatherDto } from '../../types/dtos'
import api from '../../libs/api-client'

import * as response from './response'

export const getCurrentWeather = () => api.get<WeatherDto>(`${ROOT_URL}/weather`)
export const deleteMessageRoom = (roomName: string) =>
  api.delete<response.DeleteMessageRoomResponse>(`${ROOT_URL}/message-room/${roomName}`)
