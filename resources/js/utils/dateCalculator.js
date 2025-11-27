/**
 * Utilidad para cálculos de fechas
 * Especialmente para calcular fecha de entrega basada en tiempo estimado
 */

/**
 * Calcula la fecha de entrega sumando el tiempo estimado a la fecha actual
 *
 * @param {number} tiempoEstimado - Cantidad de tiempo (ej: 3)
 * @param {string} unidad - Unidad de tiempo: 'horas', 'dias', 'semanas'
 * @param {Date} fechaBase - Fecha base para el cálculo (default: ahora)
 * @returns {Date} Fecha de entrega calculada
 */
export function calcularFechaEntrega(tiempoEstimado, unidad = 'dias', fechaBase = new Date()) {
  if (!tiempoEstimado || tiempoEstimado <= 0) {
    return fechaBase;
  }

  const fecha = new Date(fechaBase);

  switch (unidad.toLowerCase()) {
    case 'horas':
      fecha.setHours(fecha.getHours() + tiempoEstimado);
      break;
    case 'dias':
      fecha.setDate(fecha.getDate() + tiempoEstimado);
      break;
    case 'semanas':
      fecha.setDate(fecha.getDate() + tiempoEstimado * 7);
      break;
    default:
      fecha.setDate(fecha.getDate() + tiempoEstimado);
  }

  return fecha;
}

/**
 * Formatea una fecha al formato local (YYYY-MM-DD)
 *
 * @param {Date} fecha - Fecha a formatear
 * @returns {string} Fecha formateada
 */
export function formatearFecha(fecha) {
  if (!fecha) return '';

  const d = new Date(fecha);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * Formatea una fecha para mostrar en interfaz (formato legible)
 *
 * @param {Date} fecha - Fecha a formatear
 * @returns {string} Fecha formateada legible (ej: "25 de noviembre de 2025")
 */
export function formatearFechaLegible(fecha) {
  if (!fecha) return '';

  const opciones = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    locale: 'es-ES'
  };

  return new Date(fecha).toLocaleDateString('es-ES', opciones);
}

/**
 * Valida que una fecha sea futura
 *
 * @param {Date} fecha - Fecha a validar
 * @returns {boolean} true si es futura, false si no
 */
export function esFechaFutura(fecha) {
  if (!fecha) return false;
  return new Date(fecha) > new Date();
}

/**
 * Obtiene la diferencia en días entre dos fechas
 *
 * @param {Date} fecha1 - Primera fecha
 * @param {Date} fecha2 - Segunda fecha
 * @returns {number} Diferencia en días
 */
export function diferenciaEnDias(fecha1, fecha2) {
  const d1 = new Date(fecha1);
  const d2 = new Date(fecha2);

  const diferencia = d2.getTime() - d1.getTime();
  return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
}
