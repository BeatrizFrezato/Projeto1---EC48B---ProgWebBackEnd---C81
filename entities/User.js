class User {
  constructor(name, email, id = null) {
    this.name = name;
    this.email = email;
    this.id = id; // ID pode ser string ou null
  }

  static validateName(name) {
    const regex = /^[A-Za-zÀ-ÿ\s]+$/;
    if (!regex.test(name)) throw new Error("O nome deve conter apenas letras e espaços.");
  }

  async save(db) {
    if (!this.name || !this.email) throw new Error("Campos obrigatórios ausentes em Usuário");
    User.validateName(this.name);

    let userDoc = { name: this.name.trim(), email: this.email.trim() };
    if (this.id) userDoc._id = this.id; // usa string como _id

    return db.collection("users").insertOne(userDoc);
  }

  static async findAll(db) {
    return db.collection("users").find().toArray();
  }

  static async findByName(db, name) {
    return db.collection("users").findOne({ name });
  }

  static async updateByName(db, name, newData) {
    if (newData.name) {
      User.validateName(newData.name);
      newData.name = newData.name.trim();
    }
    if (newData.email) newData.email = newData.email.trim();
    return db.collection("users").updateOne({ name }, { $set: newData });
  }

  static async deleteByName(db, name) {
    return db.collection("users").deleteOne({ name });
  }
}

module.exports = User;
