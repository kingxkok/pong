window.onload = function(){
	var menubtn = document.getElementById("menubtn");
 	menubtn.addEventListener('click', function(event) {
    	menu();
  	});
}

function menu(){
	var context = canvas.getContext('2d');
	context.fillStyle = "rgba(255,255,255,1)"; //transparency creates fade effect
    context.beginPath();
	context.rect(0, 0, canvas.width, canvas.height);
	context.fill();
	pause();

}