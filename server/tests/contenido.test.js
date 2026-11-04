const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const RAIZ = path.join(__dirname, "..", "..", "code");

function cargar(archivo, nombre) {
  const fuente = fs.readFileSync(path.join(RAIZ, archivo), "utf8");
  return new Function(fuente + "\nreturn " + nombre + ";")();
}

const cursos = cargar("contenido-cursos.js", "CONTENIDO_CURSOS");
const teorias = cargar("contenido-teorias.js", "TEORIAS_EXTRA");
const preguntas = cargar("contenido-repaso.js", "PREGUNTAS_EXTRA");
const retos = cargar("contenido-retos.js", "RETOS_ESCUDO");

function claveNivel(cursoId, numero) {
  return String(cursoId * 100 + numero);
}

test("hay 5 cursos con 4 niveles y contenido base completo", () => {
  assert.equal(cursos.length, 5);

  cursos.forEach(function (curso) {
    assert.equal(curso.modulos.length, 4, "Curso " + curso.id + " debe tener 4 niveles");
    curso.modulos.forEach(function (modulo) {
      assert.equal(modulo.pasos.length, 4, "Nivel " + claveNivel(curso.id, modulo.numero) + " debe tener 4 teorías base");
      assert.equal(modulo.examen.length, 3, "Nivel " + claveNivel(curso.id, modulo.numero) + " debe tener 3 preguntas base");
    });
  });
});

test("cada nivel tiene 6 teorías y 3 preguntas complementarias", () => {
  cursos.forEach(function (curso) {
    curso.modulos.forEach(function (modulo) {
      const clave = claveNivel(curso.id, modulo.numero);
      assert.equal(teorias[clave] && teorias[clave].length, 6, "Teorías extra del nivel " + clave);
      assert.equal(preguntas[clave] && preguntas[clave].length, 3, "Preguntas extra del nivel " + clave);
    });
  });
});

test("el campus reúne 200 teorías y 120 preguntas", () => {
  let totalTeorias = 0;
  let totalPreguntas = 0;

  cursos.forEach(function (curso) {
    curso.modulos.forEach(function (modulo) {
      const clave = claveNivel(curso.id, modulo.numero);
      totalTeorias += modulo.pasos.length + teorias[clave].length;
      totalPreguntas += modulo.examen.length + preguntas[clave].length;
    });
  });

  assert.equal(totalTeorias, 200);
  assert.equal(totalPreguntas, 120);
});

test("cada pregunta tiene exactamente una respuesta correcta", () => {
  let revisadas = 0;

  funcionesPreguntas().forEach(function (pregunta) {
    const correctas = pregunta.opciones.filter(function (opcion) {
      return opcion.valor === "correcto";
    });
    assert.equal(correctas.length, 1, "Pregunta con respuesta ambigua: " + pregunta.texto);
    assert.equal(pregunta.opciones.length, 3);
    revisadas += 1;
  });

  assert.equal(revisadas, 120);
});

function funcionesPreguntas() {
  const todas = [];
  cursos.forEach(function (curso) {
    curso.modulos.forEach(function (modulo) {
      const clave = claveNivel(curso.id, modulo.numero);
      todas.push.apply(todas, modulo.examen);
      todas.push.apply(todas, preguntas[clave]);
    });
  });
  return todas;
}

test("no hay títulos de teoría repetidos", () => {
  const titulos = [];
  cursos.forEach(function (curso) {
    curso.modulos.forEach(function (modulo) {
      modulo.pasos.forEach(function (paso) {
        titulos.push(paso.titulo);
      });
      teorias[claveNivel(curso.id, modulo.numero)].forEach(function (teoria) {
        titulos.push(teoria.titulo);
      });
    });
  });

  const repetidos = titulos.filter(function (titulo, indice) {
    return titulos.indexOf(titulo) !== indice;
  });

  assert.deepEqual(repetidos, [], "Títulos repetidos: " + repetidos.join(", "));
});

test("el Escudo tiene 15 retos: 12 estafas y 3 legítimos", () => {
  assert.equal(retos.length, 15);
  assert.equal(retos.filter(function (reto) { return reto.esEstafa; }).length, 12);
  assert.equal(retos.filter(function (reto) { return !reto.esEstafa; }).length, 3);

  retos.forEach(function (reto, indice) {
    assert.ok(reto.canal, "Reto " + (indice + 1) + " sin canal");
    assert.ok(reto.mensaje, "Reto " + (indice + 1) + " sin mensaje");
    assert.ok(reto.explicacion, "Reto " + (indice + 1) + " sin explicación");
    assert.ok(reto.consejo, "Reto " + (indice + 1) + " sin consejo");
    if (reto.esEstafa) {
      assert.equal(reto.tipos.length, 3, "Reto " + (indice + 1) + " debe tener 3 tipos");
      assert.equal(reto.tipos.filter(function (tipo) { return tipo.correcto; }).length, 1);
    } else {
      assert.equal(reto.tipos.length, 0, "Reto legítimo " + (indice + 1) + " no debe pedir tipo");
    }
  });
});

test("no quedan referencias al dominio viejo de AFIP", () => {
  const fuente = fs.readFileSync(path.join(RAIZ, "contenido-teorias.js"), "utf8");
  assert.doesNotMatch(fuente, /@afip\.gob\.ar/i);
  assert.doesNotMatch(fuente, /titulo:\s*"[^"]*AFIP/);
});
