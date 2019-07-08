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
let G, C;

function setup() {
	entrada = document.getElementById('nde');
	saida = document.getElementById('det');
}

function traduzir() {
	G = JSON.parse(entrada.value);
	C = G;
	saida.value = JSON.stringify(C, null, "\t");
}
