export type MessageModel = {
  _id: number
  user: {
    _id: string
    name: string
    avatar?: string
  }
  text: string
  createdAt: Date
  system?: boolean
}
// interface IMessage {
//   _id: string | number
//   text: string
//   createdAt: Date | number
//   user: {
//     _id: string | number
//     name?: string
//     avatar?: string | number
//   }
//   image?: string
//   video?: string
//   audio?: string
//   system?: boolean
//   sent?: boolean
//   received?: boolean
//   pending?: boolean
// }
