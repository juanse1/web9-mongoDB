const WebSocket = require("ws");
const Joi = require("joi");
var [getMessages, getMessage, insertMessage, updateMessage, deleteMessage,] = require("./controllers/message.js");

const clients = [];

const wsConnection = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    clients.push(ws);
    sendMessages();

    ws.on("message", (message) => {
    message = JSON.parse(message);

    const schema = Joi.object({
      message: Joi.string().min(5).required(),
      author: Joi.string().pattern(/^[a-zA-Z]+\s[a-zA-Z]+$/).required(),
      ts: Joi.number().required(),
    });

    const { error } = schema.validate(message.body);

    if(error)
    {
      console.log("esta sacando error el validate")
    }
    else
    {
      insertMessage(message)
    }
    sendMessages();
    });
  });
};

const sendMessages = () => {
  clients.forEach((client) => {
    getMessages().then((result) => {
      result = JSON.stringify(result);
      client.send(result);
    });
  });
};

exports.wsConnection = wsConnection;
exports.sendMessages = sendMessages;