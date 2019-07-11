let geradores_var = ["Я", "и", "号", "大", "该", "ש", "ג", "ב", "א", "ω", "ψ", "φ", "σ", "π", "μ", "Λ", "Δ", "Ω", "Σ", "λ", "Ϸ", "θ", "η", "ζ", "δ", "γ", "β", "α"];

String.prototype.rem = function (n) { //Romeve char na nª posição
    return this.slice(0, n) + this.slice(n + 1);
}
String.prototype.copy = function() { //Retorna uma cópia de si
    return (' ' + this).slice(1);
}
Array.prototype.temRegra = function(regra) { //Retorno se o vetor possui aquela regra
    for(let e of this) {
        if(e.esq === regra.esq && e.dir === regra.dir) return true;
    }
    return false;
}

function verifica(aux) {
	for (let i of G.regras) {
		var k = true;
		if (i.dir === aux) {
			for (let j of G.regras) {
				if (j.esq == i.esq && j.dir !== aux) {
					k = false;
					break;
				}
			}
			if (k) return i;
		}
	}
	return 0;
}
