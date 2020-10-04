const { mongoUtils, dataBase } = require("../lib/utils/mongo.js");
const collection = "messages";

function getMessages() {
  return mongoUtils.conn().then((client) => {
    return client
      .db(dataBase)
      .collection(collection)
      .find({})
      .toArray()
      .finally(() => client.close());
  });
}

function getMessage(messageTs) {
  return mongoUtils.conn().then((client) => {
    return client
      .db(dataBase)
      .collection(collection)
      .findOne({ ts: parseInt(messageTs) })
      .finally(() => client.close());
  });
}

function insertMessage(new_message) {
  return mongoUtils.conn().then((client) => {
    return client
      .db(dataBase)
      .collection(collection)
      .insertOne({
        author: new_message.author,
        message: new_message.message,
        ts: 1 + Math.floor(Math.random() * 1000),
      })
      .finally(() => client.close());
  });
}

function updateMessage(messageTs, modified_message) {
  return mongoUtils.conn().then((client) => {
    return client
      .db(dataBase)
      .collection(collection)
      .updateOne(
        {
          ts: parseInt(messageTs),
        },
        {
          $set: { author: modified_message.author, message: modified_message.message },
        }
      )
      .finally(() => client.close());
  });
}

function deleteMessage(messageTs) {
  return mongoUtils.conn().then((client) => {
    client
      .db(dataBase)
      .collection(collection)
      .deleteOne({ ts: parseInt(messageTs) })
      .finally(() => client.close());
  });
}

module.exports = [getMessages, getMessage, insertMessage, updateMessage, deleteMessage,];