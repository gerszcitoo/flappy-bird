let scoresContainer = document.getElementById("scores-container");

let bestScores = JSON.parse(localStorage.getItem("flappy-best-scores")) || [];

function generarTabla() {
  // Limpiar contenido existente
  scoresContainer.innerHTML = "";
  let i = 0;

  // Crear tabla y encabezados de columna
  const tabla = document.createElement("table");
  const encabezado = tabla.createTHead();
  const filaEncabezado = encabezado.insertRow();

  const encabezadoPosicion = document.createElement("th");
  encabezadoPosicion.textContent = "Posicion";
  filaEncabezado.appendChild(encabezadoPosicion);

  const encabezadoNombre = document.createElement("th");
  encabezadoNombre.textContent = "Nombre";
  filaEncabezado.appendChild(encabezadoNombre);

  const encabezadoPuntaje = document.createElement("th");
  encabezadoPuntaje.textContent = "Puntaje";
  filaEncabezado.appendChild(encabezadoPuntaje);

  // Crear filas de datos
  const cuerpoTabla = tabla.createTBody();
  bestScores.forEach((puntuacion) => {
    i++;
    const fila = cuerpoTabla.insertRow();

    const celdaPosicion = fila.insertCell();
    celdaPosicion.textContent = i;

    const celdaNombre = fila.insertCell();
    celdaNombre.textContent = puntuacion.player;

    const celdaPuntaje = fila.insertCell();
    celdaPuntaje.textContent = puntuacion.points;
  });

  // Agregar tabla al contenedor
  scoresContainer.appendChild(tabla);
}

if (bestScores.length > 0) {
  generarTabla();
} else {
  scoresContainer.innerHTML += "No hay puntuaciones guardadas.";
}
