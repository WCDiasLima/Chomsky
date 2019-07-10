let geradores_var = ["Я", "и", "号", "大", "该", "ש", "ג", "ב", "א", "ω", "ψ", "φ", "σ", "π", "μ", "Λ", "Δ", "Ω", "Σ", "λ", "Ϸ", "θ", "η", "ζ", "δ", "γ", "β", "α"];

String.prototype.rem = function (n) {
    return this.slice(0, n) + this.slice(n + 1);
}
String.prototype.copy = function() {
    return (' ' + this).slice(1);
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
