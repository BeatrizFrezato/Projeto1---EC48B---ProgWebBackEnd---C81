class Calendar {
  constructor(name, ownerId) {
    this.name = name;
    this.ownerId = ownerId; //pode ser string
  }

  async save(db) {
    if (!this.name || !this.ownerId) {
      throw new Error("Campos obrigatórios ausentes em Calendar (name, ownerId)");
    }

    // verifica se o usuário existe (usando string como _id)
    const user = await db.collection("users").findOne({ _id: this.ownerId });
    if (!user) throw new Error(`Usuário com ID ${this.ownerId} não existe!`);

    return db.collection("calendars").insertOne({
      name: this.name,
      ownerId: this.ownerId
    });
  }

  static async findAll(db) {
    return db.collection("calendars").find().toArray();
  }

  static async findByName(db, name) {
    return db.collection("calendars").findOne({ name });
  }

  static async updateByName(db, name, newData) {
    return db.collection("calendars").updateOne({ name }, { $set: newData });
  }

  static async deleteByName(db, name) {
    return db.collection("calendars").deleteOne({ name });
  }
}

module.exports = Calendar;
