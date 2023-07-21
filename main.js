// Clase para representar un préstamo
class Prestamo {
  constructor(monto, tasa, periodos) {

    // Propiedades del préstamo
    this.monto_prestamo = monto;
    this.tasa_interes = tasa;
    this.num_periodos = periodos;
    this.intereses_acumulados = 0;
    this.fechas = [];
    this.intereses = [];
  }

  // Método para calcular los intereses acumulados
  calcularIntereses() {

    // Reiniciar el contador de intereses acumulados
    this.intereses_acumulados = 0;

    // Calcular los intereses acumulados por cada período
    for (var periodo = 1; periodo <= this.num_periodos; periodo++) {
      var intereses_periodo = this.monto_prestamo * (this.tasa_interes / 100);
      this.intereses_acumulados += intereses_periodo;
    }

    // Guardar la tasa de interés y la fecha en los arrays
    this.intereses.push(this.tasa_interes);
    var fechaInteres = prompt("Ingrese la fecha de los intereses (Formato: DD/MM/AAAA):");
    this.fechas.push(fechaInteres);

    // Mostrar los intereses acumulados en el resultado del formulario y en la consola
    document.getElementById("resultado").value = "$" + this.intereses_acumulados.toFixed(2);
    console.log("El total de intereses acumulados es: $" + this.intereses_acumulados.toFixed(2));
  }

  // Método para buscar un interés por fecha
  buscarInteresPorFecha(fecha) {
    var interesEncontrado = null;
    for (var i = 0; i < this.fechas.length; i++) {
      if (this.fechas[i] === fecha) {
        interesEncontrado = this.intereses[i];
        break;
      }
    }
    return interesEncontrado;
  }
}

document.addEventListener("DOMContentLoaded", function() {
  // Obtener la lista para mostrar los intereses guardados
  var interesesGuardadosList = document.getElementById("interesesGuardadosList");

  // Array para almacenar los objetos "Prestamos"
  var prestamos = [];

  // Evento click en el botón "Calcular"
  document.getElementById("calcularBtn").addEventListener("click", function() {

    // Obtener los valores ingresados por el usuario
    var monto_prestamo = parseFloat(document.getElementById("montoInput").value);
    var tasa_interes = parseFloat(document.getElementById("tasaInput").value);
    var num_periodos = parseInt(document.getElementById("periodosInput").value);

    // Crear un nuevo objeto "Prestamo" y agregarlo al array
    var nuevoPrestamo = new Prestamo(monto_prestamo, tasa_interes, num_periodos);
    prestamos.push(nuevoPrestamo);

    // Calcular intereses para el nuevo préstamo
    nuevoPrestamo.calcularIntereses();
  });

  // Evento click en el botón "Historial de Intereses"
  document.getElementById("historialBtn").addEventListener("click", function() {

    // Pedir al usuario la fecha de interés a buscar
    var fechaBusqueda = prompt("Ingrese la fecha de interés a buscar (Formato: DD/MM/AAAA):");

    // Búsqueda de intereses correspondientes a la fecha ingresada en todos los préstamos almacenados
    var interesEncontrado = null;
    for (var i = 0; i < prestamos.length; i++) {
      var prestamo = prestamos[i];
      interesEncontrado = prestamo.buscarInteresPorFecha(fechaBusqueda);
      if (interesEncontrado !== null) {
        break;
      }
    }

    // Mostrar el interés encontrado o un mensaje de no encontrado
    if (interesEncontrado !== null) {
      alert("La tasa de interés para la fecha " + fechaBusqueda + " es: " + interesEncontrado + "%");
    } else {
      alert("No se encontró ninguna tasa de interés para la fecha " + fechaBusqueda);
    }
  });

  // Evento click en el botón "Mostrar Intereses Guardados"
  document.getElementById("mostrarBtn").addEventListener("click", function() {
    // Mostrar los intereses guardados para todos los préstamos en una lista
    interesesGuardadosList.innerHTML = ""; // Limpiar la lista antes de mostrar nuevos datos

    for (var i = 0; i < prestamos.length; i++) {
      var prestamo = prestamos[i];
      var interesesGuardados = document.createElement("li");
      interesesGuardados.textContent = "Fecha: " + prestamo.fechas.join(", ") + " - Porcentaje de interés: " + prestamo.intereses.join("%, ");
      interesesGuardadosList.appendChild(interesesGuardados);
    }
  });
});
