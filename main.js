// Definimos una clase llamada 'Prestamo'
class Prestamo {
 
  constructor(monto, tasa, periodos, fecha) {
    this.monto_prestamo = monto; // Monto total del préstamo.
    this.tasa_interes = tasa / 100; // Tasa de interés expresada como una fracción decimal.
    this.num_periodos = periodos; // Número de periodos de pago.
    this.fecha = fecha; // Fecha en que se crea el préstamo.
    this.intereses_acumulados = 0; // Intereses que se han acumulado hasta ahora.
    this.cuotas = []; // Una lista vacía para almacenar la información de cada cuota.
  }

  // Método para calcular los intereses acumulados en el préstamo.
  calcularIntereses() {
    this.intereses_acumulados = this.monto_prestamo * this.tasa_interes * this.num_periodos;
  }

  // Método para calcular las cuotas de pago del préstamo.
  calcularCuotas() {
    let saldo_pendiente = this.monto_prestamo; // Cantidad que aún queda por pagar del préstamo.

    // La cuota fija es la cantidad que se paga en cada periodo, calculada según la fórmula del préstamo amortizado.
    let cuota_fija = this.monto_prestamo * (this.tasa_interes / (1 - Math.pow(1 + this.tasa_interes, -this.num_periodos)));

    // Ciclo for que recorre cada periodo del préstamo.
    for (let periodo = 1; periodo <= this.num_periodos; periodo++) {
      let intereses_periodo = saldo_pendiente * this.tasa_interes;
      let cuota_contra_capital = cuota_fija - intereses_periodo;

      saldo_pendiente -= cuota_contra_capital; // Restamos la cuota contra el capital del saldo pendiente.

      // Añadimos la información de la cuota a la lista de cuotas.

      this.cuotas.push({
        cuota_fija,
        intereses_periodo,
        cuota_contra_capital,
        saldo_pendiente,
      });
    }
  }
}

// Creamos un array vacío para almacenar los préstamos.
const prestamos = [];

// Función que se ejecuta cuando se presiona el botón de calcular.
function calculateLoan() {

  // Obtenemos los datos de los inputs en el HTML.
  const loanData = {
    loanAmount: document.getElementById('montoInput').value,
    interestRate: document.getElementById('tasaInput').value,
    loanPeriods: document.getElementById('periodosInput').value,
    loanDate: document.getElementById('fechaInput').value
  }

  // Desestructuramos loanData en variables separadas.
  const {loanAmount, interestRate, loanPeriods, loanDate} = loanData;

  // Utilizamos el operador ternario para verificar si los campos están llenos
  // antes de calcular el préstamo.
  loanAmount && interestRate && loanPeriods && loanDate
    ? createLoan(parseFloat(loanAmount), parseFloat(interestRate), parseInt(loanPeriods), loanDate)
    : alert('Por favor llena todos los campos antes de calcular.');
}

document.addEventListener('DOMContentLoaded', function() {
  cargarDatosAlmacenados();

  // Obtener referencias a los elementos del DOM
  const calcularBtn = document.getElementById('calcularBtn');
  const historialBtn = document.getElementById('historialBtn');
  const mostrarBtn = document.getElementById('mostrarBtn');

  // Asociar eventos a los botones
  calcularBtn.addEventListener('click', calculateLoan);
  historialBtn.addEventListener('click', showHistorial);
  mostrarBtn.addEventListener('click', showInteresesGuardados);

});

// Función para crear un nuevo préstamo y añadirlo al array de préstamos.
function createLoan(loanAmount, interestRate, loanPeriods, loanDate) {
  const prestamo = new Prestamo(loanAmount, interestRate, loanPeriods, loanDate); 

  prestamo.calcularIntereses();
  prestamo.calcularCuotas();
  
  // Almacenar el préstamo en Local Storage
  prestamos.push(prestamo);
  localStorage.setItem('prestamos', JSON.stringify(prestamos));

  document.getElementById('resultado').value = prestamo.intereses_acumulados.toFixed(2);

  displayLoanInstallments(prestamo);
}

// Función para mostrar las cuotas de un préstamo en el HTML.
function displayLoanInstallments(prestamo) {
  const detalleCuotas = document.getElementById('detalleCuotas');
  detalleCuotas.innerHTML = ''; // Limpiamos el contenido previo del div.

  // Recorremos la lista de cuotas del préstamo.
  prestamo.cuotas.forEach((cuota, index) => {
  
    const { cuota_fija, intereses_periodo, cuota_contra_capital, saldo_pendiente } = cuota;
    const cuotaP = document.createElement('p'); 

    cuotaP.textContent = `Cuota ${index + 1}: $${cuota_fija.toFixed(2)} (Intereses: $${intereses_periodo.toFixed(2)}, Capital: $${cuota_contra_capital.toFixed(2)}, Saldo pendiente: $${saldo_pendiente.toFixed(2)})`;

    // Añadimos el párrafo al div de detalle de cuotas.
    detalleCuotas.appendChild(cuotaP);
  });
}

// Cargamos los préstamos almacenados en el Local Storage al inicio
function cargarDatosAlmacenados() {
  const datosGuardados = localStorage.getItem('prestamos');
  if (datosGuardados) {
    const prestamosGuardados = JSON.parse(datosGuardados).map(
      prestamo =>
        new Prestamo(
          prestamo.monto_prestamo,
          prestamo.tasa_interes,
          prestamo.num_periodos,
          prestamo.fecha
        )
    );
    prestamos.push(...prestamosGuardados);
  }
}


document.getElementById('calcularBtn').addEventListener('click', calculateLoan);

document.getElementById('historialBtn').addEventListener('click', () => {
  const searchDate = document.getElementById('fechaInteres').value; 
  const resultDiv = document.getElementById('cuotasList');

  // Filtramos los préstamos que coinciden con la fecha buscada.
  const foundLoans = prestamos.filter(loan => loan.fecha === searchDate);
  resultDiv.innerHTML = '';

  foundLoans.forEach((loan, index) => {
    const liElement = document.createElement('li'); 
    liElement.textContent = `Préstamo ${index+1} - Intereses acumulados: ${loan.intereses_acumulados.toFixed(2)}`;

    // Añadimos el elemento de lista al div de resultados.
    resultDiv.appendChild(liElement);
  });
});

// Event listener para el botón de mostrar. Cuando se presione el botón, se mostrarán todos los préstamos en el HTML.
document.getElementById('mostrarBtn').addEventListener('click', () => {
  const resultDiv = document.getElementById('interesesGuardadosList'); // Obtenemos el div donde se mostrarán los préstamos.

  resultDiv.innerHTML = ''; // Limpiamos el contenido previo del div.

  // Recorremos la lista de préstamos.
  prestamos.forEach((loan, index) => {
    const liElement = document.createElement('li'); 
    
    liElement.textContent = `Préstamo ${index+1} - Fecha: ${loan.fecha} - Intereses acumulados: ${loan.intereses_acumulados.toFixed(2)}`;

  
    resultDiv.appendChild(liElement);
  });
});

