var express = require("express");
var router = express.Router();

const ws = require("../wslib");
const Joi = require("joi");

var [getMessages, getMessage, insertMessage, updateMessage, deleteMessage,] = require("../controllers/message.js");

router.get("/", async function (req, res, next) {
    const messages = await getMessages();
      res.send(messages);
});

router.get("/:id", async function(req, res, next) {
    const message = await getMessage(req.params.id);
    if (message === null) return res.status(404).send("The message with the given ts was not found.");
    res.send(message);
});

router.post("/", async function (req, res, next) {

    const schema = Joi.object({
        message: Joi.string().min(5).required(),
        author: Joi.string().pattern(/^[a-zA-Z]+\s[a-zA-Z]+$/).required(),
        ts: Joi.number().required(),
    });

    const { error } = schema.validate(req.body);
  
    if (error) {return res.status(400).send(error);}

    const newMessage = await insertMessage(req.body);
    ws.sendMessages();
    res.send(newMessage);
});

router.put("/:id", async function (req, res, next){
    
    const schema = Joi.object({
        message: Joi.string().min(5).required(),
        author: Joi.string().pattern(/^[a-zA-Z]+\s[a-zA-Z]+$/).required(),
        ts: Joi.number().required(),
    });

    const { error } = schema.validate(req.body);
  
    if (error) {
      return res.status(400).send(error);
    }

    const message = await getMessage(req.params.id);
    if(message === null) return res.status(404).send("The message with the given ts was not found.");

    await updateMessage(req.params.id, req.body);
    ws.sendMessages();
    res.send({ message: "Message updated" });
});

router.delete("/:id", async function (req, res, next){

    const message = await getMessage(req.params.id);
    if(message === null) {return res.status(404).send("The message with the given ts was not found.");}
    await deleteMessage(req.params.id);
    ws.sendMessages(); 
    res.status(204).send();
});

module.exports = router;