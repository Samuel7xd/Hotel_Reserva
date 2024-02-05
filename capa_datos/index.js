// Datos/index.js
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run('CREATE TABLE habitaciones (numero INTEGER, disponible INTEGER)');
  db.run('INSERT INTO habitaciones VALUES (101, 1)');
  db.run('INSERT INTO habitaciones VALUES (102, 1)');
  db.run('INSERT INTO habitaciones VALUES (103, 1)');

  db.run('CREATE TABLE reservas (numero INTEGER PRIMARY KEY AUTOINCREMENT, costoTotal INTEGER)');
});

function verificarDisponibilidad(numeroHabitacion) {
  return new Promise((resolve, reject) => {
    db.get('SELECT disponible FROM habitaciones WHERE numero = ?', [numeroHabitacion], (err, row) => {
      if (err) {
        console.error('Error en la consulta:', err);
        reject(err);
      } else {
        console.log('Resultado de la consulta:', row);
        if (row) {
          resolve(row.disponible === 1);
        } else {
          reject(new Error('La habitación no existe.'));
        }
      }
    });
  });
}
 
function calcularCostoTotal(personas, dias, camas) {
  // Lógica de cálculo del costo total
  const costoPorPersona = 50;
  const costoPorCama = 20;

  return (costoPorPersona * personas) + (costoPorCama * camas * dias);
}

function actualizarDisponibilidad(numeroHabitacion, disponible) {
  db.run('UPDATE habitaciones SET disponible = ? WHERE numero = ?', [disponible ? 1 : 0, numeroHabitacion]);
}

function almacenarReserva(costoTotal) {
  return new Promise((resolve, reject) => {
    db.run('INSERT INTO reservas (costoTotal) VALUES (?)', [costoTotal], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.lastID);
      }
    });
  });
}

function obtenerReservas() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM reservas', (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

module.exports = {
  verificarDisponibilidad,
  calcularCostoTotal,
  actualizarDisponibilidad,
  almacenarReserva,
  obtenerReservas,
};
