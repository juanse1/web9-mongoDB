const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://juanse:Kf2e4Mv5EttrXkX@cluster0.lnz2j.gcp.mongodb.net/chat?retryWrites=true&w=majority";
const dataBase = "chat";

function MongoUtils() {
    const mu = {};
  
    // Esta función retorna una nueva conexión a MongoDB.
    // Tenga presente que es una promesa que deberá ser resuelta.
    mu.conn = () => {
      const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      return client.connect();
    };
    return mu;
}

process.on("SIGINT", async function () {
  console.log("connection ended");
  const client = await MongoUtils().conn();
  client.close().then((data) => console.log("conn ended"));
});

exports.mongoUtils = MongoUtils();
exports.dataBase = dataBase;