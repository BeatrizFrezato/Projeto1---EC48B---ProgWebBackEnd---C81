class Event {
  constructor(title, date, time, location, calendarName) {
    this.title = title;
    this.date = date;       // formato DD/MM/YYYY
    this.time = time;       // HH:MM
    this.location = location;
    this.calendarName = calendarName; // nome do calendário
  }

  async save(db) {
    if (!this.title || !this.date || !this.time || !this.location || !this.calendarName) {
      throw new Error("Campos obrigatórios ausentes: title, date, time, location, calendarName");
    }

    // Validação de data DD/MM/YYYY
    const dateRegex = /^([0-2]\d|3[0-1])\/(0\d|1[0-2])\/\d{4}$/;
    if (!dateRegex.test(this.date)) throw new Error("Data inválida. Use o formato DD/MM/YYYY");

    // Validação de hora
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(this.time)) throw new Error("Hora inválida. Use o formato HH:MM");

    // Busca o calendário pelo nome
    const calendar = await db.collection("calendars").findOne({ name: this.calendarName });
    if (!calendar) throw new Error(`Calendário "${this.calendarName}" não existe!`);

    // Salva o evento com _id do calendário
    return db.collection("events").insertOne({
      title: this.title,
      date: this.date,
      time: this.time,
      location: this.location,
      calendarId: calendar._id
    });
  }

  static async findAll(db) {
    return db.collection("events").find().toArray();
  }

  static async findByTitle(db, title) {
    return db.collection("events").findOne({ title });
  }

  static async updateByTitle(db, title, newData) {
    if (!newData || Object.keys(newData).length === 0) throw new Error("Nenhum dado enviado para atualização");
    return db.collection("events").updateOne({ title }, { $set: newData });
  }

  static async deleteByTitle(db, title) {
    return db.collection("events").deleteOne({ title });
  }
}

module.exports = Event;


