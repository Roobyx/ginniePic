function multiplyNode(node, count, deep, width, height) {
	for (var i = 0, copy; i < count - 1; i++) {
		copy = node.cloneNode(deep);
		randomizer = i + Math.floor((Math.random() * 3000) + 1);
		node.style.backgroundImage = "url(" + width + "/" + width + randomizer + ")";
		node.style.width = width.toString() + 'px';
		node.style.height = height.toString() + 'px';
		node.parentNode.insertBefore(copy, node);
	}
}

var pageWidth = window.innerWidth;
var neededPigWidth = pageWidth / 9;
var fixedPigs = neededPigWidth.toFixed(4);

var pageHeight = window.innerHeight;
var neededPigsH = pageHeight / 5;
var fixedHeightPigs = neededPigsH.toFixed(4);

for (var r = 0; r < 7; r++) {
	multiplyNode(document.querySelector('.guinea-invasion'), 9, true, fixedPigs, fixedHeightPigs);
}
