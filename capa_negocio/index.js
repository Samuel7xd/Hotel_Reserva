// Negocio/index.js
const hotelService = require('../capa_datos/index');

async function reservarHabitacion(personas, dias, camas, numeroHabitacion) {
    // Lógica de negocio del hotel, aplicando reglas necesarias
    if (personas <= 0 || dias <= 0 || camas <= 0 || numeroHabitacion <= 0) {
      throw new Error('Ingrese valores válidos para la reserva.');
    }
  
    const disponibilidad = await hotelService.verificarDisponibilidad(numeroHabitacion);
    console.log('Disponibilidad:', disponibilidad);
    if (!disponibilidad) {
      throw new Error('La habitación no está disponible para la reserva.');
    }
  
    const costoTotal = hotelService.calcularCostoTotal(personas, dias, camas);
    console.log('Costo Total:', costoTotal);
    await hotelService.actualizarDisponibilidad(numeroHabitacion, false);
  
    return { mensaje: 'Reserva exitosa', costoTotal };
}

async function listarReservas() {
  try {
    const reservas = await hotelService.obtenerReservas();
    return reservas;
  } catch (error) {
    throw new Error('Error al obtener la lista de reservas.');
  }
}

module.exports = {
  reservarHabitacion,
  listarReservas,
};



