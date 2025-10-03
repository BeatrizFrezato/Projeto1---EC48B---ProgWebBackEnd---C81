/*const { MongoClient } = require("mongodb");

const url = "mongodb://127.0.0.1:27017"; //servidor local do Mongo
const dbName = "agendaEletronica";

let client;

async function connect() {
  if (!client) {
    client = new MongoClient(url, { useUnifiedTopology: true });
    await client.connect();
    console.log("Conectado ao MongoDB!");
  }
  return client.db(dbName);
}

module.exports = { connect };
*/