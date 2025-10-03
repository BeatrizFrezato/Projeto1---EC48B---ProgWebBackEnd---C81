const { MongoClient } = require("mongodb");
const readline = require("readline");
const Logger = require("./logger");

const User = require("./entities/User");
const Calendar = require("./entities/Calendar");
const Event = require("./entities/Event");

// Tratamento global de erros
process.on('unhandledRejection', (reason) => {
  Logger.error(`Unhandled Rejection`, reason && reason.stack ? reason.stack : String(reason));
});

process.on('uncaughtException', (err) => {
  Logger.error(`Uncaught Exception`, err.stack || String(err));
  process.exit(1);
});

class AgendaApp {
  constructor() {
    this.url = "mongodb://127.0.0.1:27017";
    this.dbName = "agendaDB";
    this.rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  }

  async start() {
    try {
      this.client = new MongoClient(this.url);
      await this.client.connect();
      this.db = this.client.db(this.dbName);
      Logger.info("Conectado ao MongoDB!");
      this.showMenu();
    } catch (err) {
      Logger.error("Erro ao conectar no MongoDB", err.stack || err);
      process.exit(1);
    }
  }

  showMenu() {
    const menu = `
-----------------------
    Agenda Eletrônica
-----------------------
1 - Criar Usuário
2 - Listar Usuários
3 - Buscar Usuário por nome
4 - Atualizar Usuário
5 - Deletar Usuário
--------------------
6 - Criar Calendário
7 - Listar Calendários
8 - Buscar Calendário por nome
9 - Atualizar Calendário
10 - Deletar Calendário
--------------------
11 - Criar Evento
12 - Listar Eventos
13 - Buscar Evento por título
14 - Atualizar Evento
15 - Deletar Evento
--------------------
0 - Sair
Escolha: `;
    
    this.rl.question(menu, async (option) => {
      switch(option) {
        // Usuário
        case "1": return this.createUser();
        case "2": return this.listUsers();
        case "3": return this.searchUser();//
        case "4": return this.updateUser();
        case "5": return this.deleteUser();

        // Calendário
        case "6": return this.createCalendar();
        case "7": return this.listCalendars();
         case "8": return this.searchCalendar();//
        case "9": return this.updateCalendar();
        case "10": return this.deleteCalendar();

        // Evento
        case "11": return this.createEvent();
        case "12": return this.listEvents();
        case "13": return this.searchEvent();
        case "14": return this.updateEvent();
        case "15": return this.deleteEvent();

        case "0": return this.exit();
        default:
          console.log("Opção inválida");
          this.showMenu();
      }
    });
  }

  // ------------------- Usuário -------------------
  createUser() {
    this.rl.question("ID do usuário (opcional, deixe vazio para gerar automático): ", id => {
      this.rl.question("Nome: ", name => {
        if (!/^[A-Za-zÀ-ÿ\s]+$/.test(name)) {
          Logger.error("Nome inválido: deve conter apenas letras e espaços");
          return this.showMenu();
        }
        this.rl.question("Email: ", async email => {
          if (!email || !email.includes("@")) {
            Logger.error("Email inválido");
            return this.showMenu();
          }
          try {
            const user = new User(name.trim(), email.trim(), id || null);
            await user.save(this.db); // AQUI: await protegido
            Logger.info(`Usuário criado: ${name}`);
          } catch(err) {
            Logger.error(err.message, err.stack);
          }
          this.showMenu();
        });
      });
    });
  }

  async listUsers() {
    try {
      const users = await User.findAll(this.db); // AQUI: await protegido
      console.table(users);
      Logger.info("Listagem de usuários");
    } catch(err) {
      Logger.error(err.message, err.stack);
    }
    this.showMenu();
  }

  //
    async searchUser() {
    this.rl.question("Nome do usuário: ", async name => {
      try {
        const user = await User.findByName(this.db, name.trim());
        console.log(user || "Usuário não encontrado");
        Logger.info(`Busca de usuário: ${name}`);
      } catch(err) {
        Logger.error(err.message, err.stack);
      }
      this.showMenu();
    });
  }
//

  updateUser() {
    this.rl.question("Nome do usuário a atualizar: ", name => {
      this.rl.question("Novo email: ", async email => {
        if (!email || !email.includes("@")) {
          Logger.error("Email inválido");
          return this.showMenu();
        }
        try {
          const result = await User.updateByName(this.db, name, { email: email.trim() }); // AQUI
          Logger.info(result.modifiedCount > 0 ? `Usuário atualizado: ${name}` : `Usuário não encontrado: ${name}`);
        } catch(err) {
          Logger.error(err.message, err.stack);
        }
        this.showMenu();
      });
    });
  }

  deleteUser() {
    this.rl.question("Nome do usuário a deletar: ", async name => {
      try {
        const result = await User.deleteByName(this.db, name); // AQUI
        Logger.info(result.deletedCount > 0 ? `Usuário deletado: ${name}` : `Usuário não encontrado: ${name}`);
      } catch(err) {
        Logger.error(err.message, err.stack);
      }
      this.showMenu();
    });
  }

  // ------------------- Calendário -------------------
  createCalendar() {
    this.rl.question("Nome do calendário: ", name => {
      if (!name || name.trim() === "") {
        Logger.error("Nome do calendário é obrigatório");
        return this.showMenu();
      }
      this.rl.question("ID do dono: ", async ownerId => {
        try {
          const calendar = new Calendar(name.trim(), ownerId);
          await calendar.save(this.db); // AQUI
          Logger.info(`Calendário criado: ${name}`);
        } catch(err) {
          Logger.error(err.message, err.stack);
        }
        this.showMenu();
      });
    });
  }

  async listCalendars() {
    try {
      const calendars = await Calendar.findAll(this.db); // AQUI
      console.table(calendars);
      Logger.info("Listagem de calendários");
    } catch(err) {
      Logger.error(err.message, err.stack);
    }
    this.showMenu();
  }
//
  async searchCalendar() {
    this.rl.question("Nome do calendário: ", async name => {
      try {
        const calendar = await Calendar.findByName(this.db, name.trim());
        console.log(calendar || "Calendário não encontrado");
        Logger.info(`Busca de calendário: ${name}`);
      } catch(err) {
        Logger.error(err.message, err.stack);
      }
      this.showMenu();
    });
  }

//
  updateCalendar() {
    this.rl.question("Nome do calendário a atualizar: ", name => {
      this.rl.question("Novo nome: ", async newName => {
        if (!newName || newName.trim() === "") {
          Logger.error("Novo nome inválido");
          return this.showMenu();
        }
        try {
          const result = await Calendar.updateByName(this.db, name, { name: newName.trim() }); // AQUI
          Logger.info(result.modifiedCount > 0 ? `Calendário atualizado: ${name}` : `Calendário não encontrado: ${name}`);
        } catch(err) {
          Logger.error(err.message, err.stack);
        }
        this.showMenu();
      });
    });
  }

  deleteCalendar() {
    this.rl.question("Nome do calendário a deletar: ", async name => {
      try {
        const result = await Calendar.deleteByName(this.db, name); // AQUI
        Logger.info(result.deletedCount > 0 ? `Calendário deletado: ${name}` : `Calendário não encontrado: ${name}`);
      } catch(err) {
        Logger.error(err.message, err.stack);
      }
      this.showMenu();
    });
  }

  // ------------------- Evento -------------------
  createEvent() {
    this.rl.question("Título do evento: ", title => {
      if (!title || title.trim() === "") {
        Logger.error("Título é obrigatório");
        return this.showMenu();
      }
      this.rl.question("Data (DD/MM/YYYY): ", date => {
        if (!date || !/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
          Logger.error("Data inválida. Use DD/MM/YYYY");
          return this.showMenu();
        }
        this.rl.question("Hora (HH:MM): ", time => {
          if (!time || !/^[0-2]\d:[0-5]\d$/.test(time)) {
            Logger.error("Hora inválida. Use HH:MM");
            return this.showMenu();
          }
          this.rl.question("Localização: ", location => {
            if (!location || location.trim() === "") {
              Logger.error("Localização é obrigatória");
              return this.showMenu();
            }
            this.rl.question("Nome do calendário: ", async calendarName => {
              if (!calendarName || calendarName.trim() === "") {
                Logger.error("Nome do calendário é obrigatório");
                return this.showMenu();
              }
              try {
                const event = new Event(title.trim(), date.trim(), time.trim(), location.trim(), calendarName.trim());
                await event.save(this.db); // AQUI
                Logger.info(`Evento criado: ${title}`);
              } catch(err) {
                Logger.error(err.message, err.stack);
              }
              this.showMenu();
            });
          });
        });
      });
    });
  }

//
  async listEvents() {
    try {
      const events = await Event.findAll(this.db); // AQUI
      console.table(events);
      Logger.info("Listagem de eventos");
    } catch(err) {
      Logger.error(err.message, err.stack);
    }
    this.showMenu();
  }

  async searchEvent() {
    this.rl.question("Título do evento: ", async title => {
      try {
        const evt = await Event.findByTitle(this.db, title); // AQUI
        console.log(evt || "Evento não encontrado");
        Logger.info(`Busca de evento: ${title}`);
      } catch(err) {
        Logger.error(err.message, err.stack);
      }
      this.showMenu();
    });
  }

  updateEvent() {
    this.rl.question("Título do evento a atualizar: ", title => {
      this.rl.question("Novo horário (HH:MM): ", async newTime => {
        if (!newTime || !/^\d{2}:\d{2}$/.test(newTime)) {
          Logger.error("Hora inválida. Use HH:MM");
          return this.showMenu();
        }
        try {
          const result = await Event.updateByTitle(this.db, title, { time: newTime.trim() }); // AQUI
          Logger.info(result.modifiedCount > 0 ? `Evento atualizado: ${title}` : `Evento não encontrado: ${title}`);
        } catch(err) {
          Logger.error(err.message, err.stack);
        }
        this.showMenu();
      });
    });
  }

  async deleteEvent() {
    this.rl.question("Título do evento a deletar: ", async title => {
      try {
        const result = await Event.deleteByTitle(this.db, title); // AQUI
        Logger.info(result.deletedCount > 0 ? `Evento deletado: ${title}` : `Evento não encontrado: ${title}`);
      } catch(err) {
        Logger.error(err.message, err.stack);
      }
      this.showMenu();
    });
  }

  // ------------------- Sair -------------------
  async exit() {
    Logger.info("Saindo do sistema...");
    try {
      await this.client.close();
    } catch(err) {
      Logger.error("Erro ao fechar conexão", err.stack);
    }
    this.rl.close();
    process.exit();
  }
}

const app = new AgendaApp();
app.start();