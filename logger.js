/*const fs = require("fs");
const path = require("path");

// garante que a pasta logs existe
const logDir = path.join(__dirname, "logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

class Logger {
  static systemLogFile = path.join(logDir, "system.log");
  static errorLogFile = path.join(logDir, "error.log");

  static info(message) {
    const logMessage = `[${new Date().toISOString()}] [INFO] ${message}\n`;
    console.log(logMessage.trim());
    fs.appendFileSync(Logger.systemLogFile, logMessage);
  }

  static error(message, stack = "") {
    const logMessage = `[${new Date().toISOString()}] [ERROR] ${message}\n${stack}\n`;
    console.error(logMessage.trim());
    fs.appendFileSync(Logger.errorLogFile, logMessage);
  }
}

module.exports = Logger;
*/
const fs = require("fs");
const path = require("path");

class Logger {
  //grava diretamente na raiz do projeto
  static systemLogFile = path.join(process.cwd(), "system.log");
  static errorLogFile = path.join(process.cwd(), "error.log");

  static info(message) {
    const logMessage = `[${new Date().toISOString()}] [INFO] ${message}\n`;
    console.log(logMessage.trim());
    fs.appendFileSync(Logger.systemLogFile, logMessage);
  }

  static error(message, stack = "") {
    const logMessage = `[${new Date().toISOString()}] [ERROR] ${message}\n${stack}\n`;
    console.error(logMessage.trim());
    fs.appendFileSync(Logger.errorLogFile, logMessage);
  }
}

module.exports = Logger;
