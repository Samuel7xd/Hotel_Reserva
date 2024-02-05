// Presentación/index.js
const express = require('express');
const bodyParser = require('body-parser');
const negocio = require('../capa_datos/index');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index');
});

// Endpoint para realizar una reserva
app.post('/reservarHabitacion', async (req, res) => {
    const { personas, dias, camas, numeroHabitacion } = req.body;
  
    try {
      const disponibilidad = await negocio.verificarDisponibilidad(numeroHabitacion);
      if (!disponibilidad) {
        throw new Error('La habitación no está disponible para la reserva.');
      }
  
      const resultado = await negocio.reservarHabitacion(personas, dias, camas, numeroHabitacion);
      res.json({ mensaje: resultado.mensaje, costoTotal: resultado.costoTotal });
    } catch (error) {
      console.error('error en la reserva: ', error);
      res.status(400).json({ error: error.message });
    }
});
  

app.get('/listarReservas', async (req, res) => {
  try {
    const reservas = await negocio.listarReservas();
    res.json({ reservas });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la lista de reservas.' });
  }
});

app.listen(port, () => {
  console.log(`Servidor de presentación en http://localhost:${port}`);
});



