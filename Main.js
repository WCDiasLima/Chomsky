/*
 Copyright 2019 Joyce Emanuele, Wellington Cesar

 This file is part of Chomsky.

 Chomsky is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 Chomsky is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with Chomsky. If not, see <https://www.gnu.org/licenses/>.
 */

let entrada, saida;
let C;

function setup() {
	entrada = document.getElementById('nde');
	saida = document.getElementById('det');
}

function traduzir() {
	G = JSON.parse(entrada.value);
	C = G;
	saida.value = JSON.stringify(C, null, "\t");
}

let G = {
	"variaveis": [
		"A",
		"B",
		"C",
		"D"
	],
	"terminais": [
		"a",
		"b",
		"c"
	],
	"inicial": "A",
	"regras": [
		{
			"esq": "A",
			"dir": "ca"
		},
		{
			"esq": "B",
			"dir": "b"
		},
		{
			"esq": "C",
			"dir": "ABD"
		},
		{
			"esq": "D",
			"dir": "BBD"
		}
	]
}

function producao_unitaria() {
	var variaveis = new Set(G.variaveis);
	var aux = 1, k;
	while (aux) {
		aux = 0; k = 0;
		for (let i of G.regras) {
			if (i.dir.length == 1 && variaveis.has(i.dir)) {
				aux = 1;
				for (let j of G.regras) {
					if (j.esq == i.dir) {
						G.regras.push({ "esq": i.esq, "dir": j.dir });
					}
				}
				G.regras.splice(k, 1);
			} k++;
		}
	}
}

var geradores_var = ['α', ' β', 'γ', 'δ', 'ζ', 'η', 'θ', 'Ϸ', 'λ', 'Σ', 'Ω', 'Δ', 'Λ', 'μ', 'π', 'σ', 'φ', 'ψ', 'ω', 'א', 'ב', 'ג', 'ש', '该', '大', '号', 'и', 'Я'];

function ch() {
	troca_terminais();
	tamanho2();
}

function troca_terminais() {
	var terminais = new Set(G.terminais);
	for (let i of G.regras) {
		if (i.dir.length > 1) {
			for (let j = 0; j < i.dir.length; j++) {
				if (terminais.has(i.dir[j])) {
					var existe = verifica(i.dir[j]);
					if (existe) {
						i.dir = i.dir.replace(i.dir[j], existe.esq);
					}
					else {
						var vari = geradores_var.pop();
						G.regras.push({ "esq": vari, "dir": i.dir[j] });
						G.variaveis.push(vari);
						i.dir = i.dir.replace(i.dir[j], vari);
					}
				}
			}
		}

	}
}

function verifica(aux) {
	for (let i of G.regras) {
		if (i.dir === aux) return i;
	}
	return 0;
}

function tamanho2() {
	var aux = 1;
	while (aux) {
		aux = 0;
		for (let i of G.regras) {
			if (i.dir.length > 2) {
				aux = 1;
				var existe = verifica(i.dir.slice(1));
				if (existe) {
					i.dir = i.dir.replace(i.dir.slice(1), existe.esq);
				}
				else {
					var vari = geradores_var.pop();
					G.regras.push({ "esq": vari, "dir": i.dir.slice(1) });
					i.dir = i.dir.replace(i.dir.slice(1), vari);
					G.variaveis.push(vari);
				}
			}
		}
	}
}