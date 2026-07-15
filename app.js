/*
=========================================================
CONFIGURACIÓN
=========================================================
*/

const MES = 6;              // Julio (0 = Enero)
const ANIO = 2026;

const empleados = [

    {
        nombre: "Camilo",
        grupo: "A"
    },

    {
        nombre: "Johana",
        grupo: "A"
    },

    {
        nombre: "Carlos",
        grupo: "B"
    },

    {
        nombre: "Andrea",
        grupo: "B"
    }

];

/*
=========================================================
HORARIOS
=========================================================
*/

const HORARIOS = {

    apertura: {
        nombre: "Apertura",
        hora: "08:00 - 15:00",
        clase: "apertura"
    },

    cierre: {
        nombre: "Cierre",
        hora: "11:00 - 18:00",
        clase: "cierre"
    },

    normal: {
        nombre: "Normal",
        hora: "08:00 - 17:00",
        clase: "normal"
    }

};

/*
=========================================================
GENERAR PROGRAMACIÓN
=========================================================
*/

let programacion = {};

generarProgramacion();

/*
=========================================================
INICIO
=========================================================
*/

document.addEventListener("DOMContentLoaded", () => {

    dibujarCalendario();

});

/*
=========================================================
PROGRAMACIÓN JULIO
=========================================================
*/

function generarProgramacion() {

    programacion = {};

    const ultimoDia = new Date(ANIO, MES + 1, 0).getDate();

    /*
        Una bandera por cada grupo.
    */

    let rotacion = {};

    empleados.forEach(emp => {

        if (rotacion[emp.grupo] === undefined)
            rotacion[emp.grupo] = false;

    });

    for (let dia = 1; dia <= ultimoDia; dia++) {

        const fecha = new Date(ANIO, MES, dia);

        const semana = fecha.getDay();

        programacion[dia] = {};

        /*
            Lunes a Viernes
        */

        if (semana >= 1 && semana <= 5) {

            empleados.forEach(emp => {

                programacion[dia][emp.nombre] = HORARIOS.normal;

            });

        }

        /*
            Miércoles
        */

        if (semana === 3) {

            const grupos = [...new Set(

                empleados.map(e => e.grupo)

            )];

            grupos.forEach(grupo => {

                const integrantes = empleados.filter(

                    e => e.grupo === grupo

                );

                if (integrantes.length < 2)
                    return;

                const primero = integrantes[0];

                const segundo = integrantes[1];

                if (!rotacion[grupo]) {

                    programacion[dia][primero.nombre] = HORARIOS.apertura;
                    programacion[dia][segundo.nombre] = HORARIOS.cierre;

                }
                else {

                    programacion[dia][primero.nombre] = HORARIOS.cierre;
                    programacion[dia][segundo.nombre] = HORARIOS.apertura;

                }

                rotacion[grupo] = !rotacion[grupo];

            });

        }

    }

}

/*
=========================================================
DIBUJAR CALENDARIO
=========================================================
*/

function dibujarCalendario() {

    const calendario = document.getElementById("calendarBody");

    calendario.innerHTML = "";

    const primerDia = new Date(ANIO, MES, 1);

    let offset = primerDia.getDay();

    if (offset === 0)
        offset = 7;

    offset--;

    /*
        Celdas vacías
    */

    for (let i = 0; i < offset; i++) {

        calendario.appendChild(crearCeldaVacia());

    }

    const ultimoDia = new Date(ANIO, MES + 1, 0).getDate();

    for (let dia = 1; dia <= ultimoDia; dia++) {

        calendario.appendChild(

            crearCeldaDia(dia)

        );

    }

}

/*
=========================================================
CELDA VACÍA
=========================================================
*/

function crearCeldaVacia() {

    const div = document.createElement("div");

    div.className = "day empty";

    return div;

}

/*
=========================================================
CELDA DEL DÍA
=========================================================
*/

function crearCeldaDia(dia) {

    const fecha = new Date(ANIO, MES, dia);

    const semana = fecha.getDay();

    const card = document.createElement("div");

    card.className = "day";

    if (semana === 0 || semana === 6)
        card.classList.add("weekend");

    const numero = document.createElement("div");

    numero.className = "day-number";

    numero.innerText = dia;

    card.appendChild(numero);

    if (programacion[dia]) {

        empleados.forEach(emp=>{

            const nombre = emp.nombre;

            if(!programacion[dia][nombre])
                return;

            const turno = programacion[dia][nombre];

            const bloque=document.createElement("div");

            bloque.className="employee "+turno.clase;

            bloque.dataset.empleado=nombre;

            bloque.innerHTML=`
                <strong>${nombre}</strong>
                ${turno.hora}
            `;

            card.appendChild(bloque);

        });

    }

    return card;

}

/*
=========================================================
FILTRO DE EMPLEADOS
=========================================================
*/

const filtroEmpleado = document.getElementById("filtroEmpleado");

filtroEmpleado.addEventListener("change", filtrarEmpleado);

/*
=========================================================
FILTRAR
=========================================================
*/

function filtrarEmpleado(){

    const empleado = filtroEmpleado.value;

    const tarjetas = document.querySelectorAll(".employee");

    tarjetas.forEach(tarjeta=>{

        if(empleado==="todos"){

            tarjeta.style.display="block";
            return;

        }

        if(tarjeta.dataset.empleado===empleado){

            tarjeta.style.display="block";

        }else{

            tarjeta.style.display="none";

        }

    });

}


/*
=========================================================
APLICAR FILTRO AL INICIAR
=========================================================
*/

filtrarEmpleado();


/*
=========================================================
UTILIDADES
=========================================================
*/

function obtenerNombreMes(){

    const meses=[

        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre"

    ];

    return meses[MES];

}


/*
=========================================================
ACTUALIZAR TITULO
=========================================================
*/

const subtitulo=document.querySelector(".subtitulo");

if(subtitulo){

    subtitulo.innerHTML=obtenerNombreMes()+" "+ANIO;

}


/*
=========================================================
LEYENDA DINÁMICA
=========================================================
*/

function actualizarLeyenda(){

    const empleado=filtroEmpleado.value;

    const leyenda=document.querySelector(".legend");

    if(!leyenda)
        return;

    if(empleado==="todos"){

        leyenda.style.opacity=1;

    }else{

        leyenda.style.opacity=.9;

    }

}


/*
=========================================================
EVENTOS
=========================================================
*/

filtroEmpleado.addEventListener("change",actualizarLeyenda);

actualizarLeyenda();


/*
=========================================================
RESPONSIVE
=========================================================
*/

window.addEventListener("resize",()=>{

    // Reservado para futuras mejoras

});


/*
=========================================================
FIN
=========================================================
*/