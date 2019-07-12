let geradores_var = [ "Δ", "Ω", "Σ", "λ", "Ϸ", "θ", "η", "ζ", "δ", "γ", "β", "α", "Я", "и", "号", "大", "该", "ש", "ג", "ב", "א", "ω", "ψ", "φ", "σ", "π", "μ", "Λ"];

String.prototype.rem = function (n) { //Romeve char na nª posição
    return this.slice(0, n) + this.slice(n + 1);
}
String.prototype.copy = function() { //Retorna uma cópia de si
    return (' ' + this).slice(1);
}
Array.prototype.temRegra = function(regra) { //Retorna se o vetor possui aquela regra
    for(let e of this) {
        if(e.esq === regra.esq && e.dir === regra.dir) return true;
    }
    return false;
}

function verifica(aux, gram) {
	for (let i of gram.regras) {
		var k = true;
		if (i.dir === aux) {
			for (let j of gram.regras) {
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
