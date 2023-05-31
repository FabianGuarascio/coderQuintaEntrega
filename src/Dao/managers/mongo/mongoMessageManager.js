import { messageModel } from '../../models/messages.model.js'

export class MongoMessageManager {
  async getMessages() {
    const messages = await messageModel.find()
    return messages
  }

  async addMessage(message) {
    return await messageModel.create(message)
  }


}
