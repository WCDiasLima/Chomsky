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
let G, indice;

function setup() {
	entrada = document.getElementById('nde');
	saida = document.getElementById('det');
}

function traduzir() {
	indice = 0;
	G = JSON.parse(entrada.value);
	epsilon(G);
	producao_unitaria(G);
	inuteis(G);
	ch(G);
	saida.value = JSON.stringify(G, null, "\t");
}
function epsilon(gram) {
	let anulaveis = new Set(), ant, regras = [];
	do { //Achar os símbolos anuláveis
		ant = anulaveis.size;
		for (let e of gram.regras) {
			if (e.dir === "ε") anulaveis.add(e.esq);
			else {
				let fica = false;
				for (let f of e.dir) {
					if (!anulaveis.has(f)) {
						fica = true;
						break;
					}
				}
				if (!fica) {
					anulaveis.add(e.esq);
				}
			}
		}
	} while (ant !== anulaveis.size);

	for (let e of gram.regras) {//Para cada regra
		if (e.dir === "ε") continue;
		let a = [];
		for (let i = 0; i < e.dir.length; i++) {//Contar o nº de anuláveis nessa regra
			if (anulaveis.has(e.dir[i])) a.push(i);
		}
		for (let i = 0; i < Math.pow(2, a.length); i++) {//Combinações
			let dir = e.dir.copy();
			for (let j = a.length - 1; j >= 0; j--) {//Para cada bit
				if ((i & Math.pow(2, j)) === 0) {
					dir = dir.rem(a[j]);
				}
			}
			let nDir;
			if (dir !== "") nDir = dir;
			else if (e.esq === gram.inicial) nDir = 'ε';
			if (nDir && !regras.temRegra({ "esq": e.esq, "dir": nDir })) regras.push({ "esq": e.esq, "dir": nDir });
		}
	}
	gram.regras = regras;
}
function inuteis(gram) {
	let vGeradores = new Set();
	let ant;
	do { //Encontrar os símbolos geradores
		ant = vGeradores.size;
		for (let e of gram.regras) { //Para cada regra
			let g = true;
			for (let i of e.dir) {
				if (!vGeradores.has(i) && !gram.terminais.includes(i)) {
					g = false;
					break;
				}
			}
			if (g || e.dir === "ε") vGeradores.add(e.esq);
		}
	} while (ant !== vGeradores.size);

	//Cria nova gramática sem não geradores
	gram.variaveis = [...vGeradores];
	let regras = [];
	for (let e of gram.regras) {
		if (!vGeradores.has(e.esq)) continue;
		let g = true;
		for (let f of e.dir) {
			if (!vGeradores.has(f) && !gram.terminais.includes(f) && f !== 'ε') {
				g = false;
				break;
			}
		}
		if (g) regras.push({ "esq": e.esq, "dir": e.dir });
	}
	gram.regras = regras;

	let vAlcancaveis = new Set(gram.inicial);
	let tAlcancaveis = new Set();
	do { //Encontrar os símbolos alcançáveis
		antV = vAlcancaveis.size;
		antT = tAlcancaveis.size;
		for (let e of gram.regras) { //Para cada regra
			if (!vAlcancaveis.has(e.esq)) continue;
			for (let i of e.dir) {
				if (gram.variaveis.includes(i)) vAlcancaveis.add(i);
				else tAlcancaveis.add(i);
			}
		}
	} while (antV !== vAlcancaveis.size || antT !== tAlcancaveis.size);

	//Cria nova gramática sem não alcançáveis
	gram.variaveis = [...vAlcancaveis];
	gram.terminais = [...tAlcancaveis];
	regras = [];
	for (let e of gram.regras) {
		if (!vAlcancaveis.has(e.esq)) continue;
		let g = true;
		for (let f of e.dir) {
			if (!vAlcancaveis.has(f) && !tAlcancaveis.has(f)) {
				g = false;
				break;
			}
		}
		if (g) regras.push({ "esq": e.esq, "dir": e.dir });
	}
	gram.regras = regras;
}

function producao_unitaria(gram) {
	let repete = true, k;
	while (repete) {
		repete = false; k = 0;
		for (let i of gram.regras) {
			if (i.dir === i.esq)
				gram.regras.splice(k, 1);
			else if (i.dir.length === 1 && gram.variaveis.includes(i.dir)) {
				repete = true;
				for (let j of gram.regras) {
					if (j.esq === i.dir) {
						gram.regras.push({ "esq": i.esq, "dir": j.dir });
					}
				}
				gram.regras.splice(k, 1);
			}
			k++;
		}
	}
}


function ch(gram) {
	troca_terminais(gram);
	tamanho2(gram);
}

function troca_terminais(gram) {
	for (let i of gram.regras) {
		if (i.dir.length === 1) continue;
		for (let j = 0; j < i.dir.length; j++) {
			if (!gram.terminais.includes(i.dir[j])) continue;
			let existe = verifica(i.dir[j], gram);
			if (existe) {
				i.dir = i.dir.replace(i.dir[j], existe.esq);
			}
			else {
				var vari = geradores_var[indice++];
				gram.regras.push({ "esq": vari, "dir": i.dir[j] });
				gram.variaveis.push(vari);
				i.dir = i.dir.replace(i.dir[j], vari);
			}
		}
	}
}

function tamanho2(gram) {
	var aux = true;
	while (aux) {
		aux = false;
		for (let i of gram.regras) {
			if (i.dir.length <= 2) continue;
			aux = true;
			var existe = verifica(i.dir.slice(1), gram);
			if (existe) {
				i.dir = i.dir.replace(i.dir.slice(1), existe.esq);
			}
			else {
				let vari = geradores_var[indice++];
				gram.regras.push({ "esq": vari, "dir": i.dir.slice(1) });
				i.dir = i.dir.replace(i.dir.slice(1), vari);
				gram.variaveis.push(vari);
			}
		}
	}
}
