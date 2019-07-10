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
let G;

function setup() {
	entrada = document.getElementById('nde');
	saida = document.getElementById('det');
}

function traduzir() {
	G = JSON.parse(entrada.value);
	G = epsilon(G);
	producao_unitaria();
	G = inuteis(G);
	ch();
	saida.value = JSON.stringify(G, null, "\t");
}
function epsilon(gram) {
	let C = {
		"variaveis": gram.variaveis,
		"terminais": gram.terminais,
		"inicial": gram.inicial,
		"regras": []
	}
	let anulaveis = new Set();

	let ant;
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
			if (dir !== "") C.regras.push({ "esq": e.esq, "dir": dir });
			else if (e.esq === C.inicial) C.regras.push({ "esq": e.esq, "dir": "ε" });
		}
	}
	return C;
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

	let C1 = {
		"variaveis": [...vGeradores],
		"terminais": gram.terminais,
		"inicial": gram.inicial,
		"regras": []
	}//Cria nova gramática sem não geradores
	for (let e of gram.regras) {
		if (!vGeradores.has(e.esq)) continue;
		let g = true;
		for (let f of e.dir) {
			if (!vGeradores.has(f) && !gram.terminais.includes(f) && f !== 'ε') {
				g = false;
				break;
			}
		}
		if (g) C1.regras.push({ "esq": e.esq, "dir": e.dir });
	}

	let vAlcancaveis = new Set(C1.inicial);
	let tAlcancaveis = new Set();
	do { //Encontrar os símbolos alcançáveis
		antV = vAlcancaveis.size;
		antT = tAlcancaveis.size;
		for (let e of C1.regras) { //Para cada regra
			if (!vAlcancaveis.has(e.esq)) continue;
			for (let i of e.dir) {
				if (C1.variaveis.includes(i)) vAlcancaveis.add(i);
				else tAlcancaveis.add(i);
			}
		}
	} while (antV !== vAlcancaveis.size || antT !== tAlcancaveis.size);

	let C2 = {
		"variaveis": [...vAlcancaveis],
		"terminais": [...tAlcancaveis],
		"inicial": C1.inicial,
		"regras": []
	}//Cria nova gramática sem não alcançáveis
	for (let e of C1.regras) {
		if (!vAlcancaveis.has(e.esq)) continue;
		let g = true;
		for (let f of e.dir) {
			if (!vAlcancaveis.has(f) && !tAlcancaveis.has(f)) {
				g = false;
				break;
			}
		}
		if (g) C2.regras.push({ "esq": e.esq, "dir": e.dir });
	}

	return C2;
}

function producao_unitaria() {
	var variaveis = new Set(G.variaveis);
	var aux = true, k;
	while (aux) {
		aux = false; k = 0;
		for (let i of G.regras) {
			if (i.dir === i.esq)
				G.regras.splice(k, 1);
			else if (i.dir.length === 1 && variaveis.has(i.dir)) {
				aux = true;
				for (let j of G.regras) {
					if (j.esq === i.dir) {
						G.regras.push({ "esq": i.esq, "dir": j.dir });
					}
				}
				G.regras.splice(k, 1);
			}
			k++;
		}
	}
}


function ch() {
	troca_terminais();
	tamanho2();
}

function troca_terminais() {
	var terminais = new Set(G.terminais);
	for (let i of G.regras) {
		if (i.dir.length === 1) continue;
		for (let j = 0; j < i.dir.length; j++) {
			if (!terminais.has(i.dir[j])) continue;
			let existe = verifica(i.dir[j]);
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
					let vari = geradores_var.pop();
					G.regras.push({ "esq": vari, "dir": i.dir.slice(1) });
					i.dir = i.dir.replace(i.dir.slice(1), vari);
					G.variaveis.push(vari);
				}
			}
		}
	}
}