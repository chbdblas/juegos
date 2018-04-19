$(function() {
  setInterval(titulo_color,1000);
  $(".btn-reinicio").click(function () {
    var nombre=$(".btn-reinicio").html();
    if (nombre=="Iniciar") {
      init_juego();
      $(".btn-reinicio").html("Reiniciar");
      deterner_juego();
      _checkAndDestroy();
    }else if(nombre=="Reiniciar"){
      limpiar_imagenes();
      $("#timer").timer("remove");
      init_juego();
      deterner_juego();
      $("#score-text").html(0);
      $("#movimientos-text").html("0");
      _checkAndDestroy();
    }else{
      $('body').load("index.html");
    }
    //==================
  });
});

//funcion para deterner_juego
function deterner_juego() {
  $("#timer").timer({
    duration:'2m',//2m en minutos
    callback:function() {
      $(".panel-tablero").addClass("nuevo1",500,"easeInQuint");
      $(".panel-score").addClass("nuevo2",5000);
      $(".time").addClass("nuevo1",500);
      $(".btn-reinicio").html("Nuevo Juego");
      //esto para el titulo
      var titulo=$("<h2>");
      titulo.text("Juego terminado");
      titulo.addClass("main-final",5000);
      $(".score").before(titulo);
    }
  });
}
//animacion del titulo
function titulo_color() {
  var color=$(".main-titulo").css("color");
  console.log(color);
  if (color=="rgb(220, 255, 14)") {
    $(".main-titulo").css("color","white");
  }else{
    $(".main-titulo").css("color","#DCFF0E");
  }
}
//declaramos variables
  var fila=7;
  var columna=7;
  var movi=0;
  var puntoHorizontal;
  var puntoVertical;
  var grilla=[];
  var validFigures=0;
  var levelGoal = 0;

  //limipiarimagenes
  function limpiar_imagenes() {
    for (var c = 0; c < columna; c++) {
      $('.col-'+(c+1)).empty();
    }
  }

//esto es imagenes aleatorias
var matriz_aleatoriamente=[];
matriz_aleatoriamente[0]="image/1.png";
matriz_aleatoriamente[1]="image/2.png";
matriz_aleatoriamente[2]="image/3.png";
matriz_aleatoriamente[3]="image/4.png";

// dulces aleatoriamente
function src_aleatoriamente(){
    var numero_aleatorio = Math.floor((Math.random()*4));
    //console.log("Picked " + pickInt);
    return matriz_aleatoriamente[numero_aleatorio];
}

//esto es un constructor
function dulces(r,c,obj,src){
  return {
    r: r,
    c: c,
    src:src,
    locked:false,
    isInCombo:false,
    o:obj
  }
}
//inicia el juego
function init_juego() {
  for (var r = 0; r < fila; r++){
        grilla[r]=[];
        for (var c =0; c< columna; c++) {
        grilla[r][c]=new dulces(r,c,null,src_aleatoriamente());
        }
      }

      for (var r = 0; r < fila; r++){
        for (var c =0; c< columna; c++) {
          var cell = $("<img id='dulce_"+r+"_"+c+"' r='"+r+"' ondrop='_onDrop(event)' ondragover='_onDragOverEnabled(event)' c='"+c+"' src='"+grilla[r][c].src+"'/>");
          cell.attr("ondragstart","_ondragstart(event)");
          $('.col-'+(c+1)).append(cell);
          grilla[r][c].o = cell;
        }
      }
};

//esto es para acciones
function _ondragstart(a){
console.log("Moving dulce: " + a.target.id);
a.dataTransfer.setData("text/plain", a.target.id);
movi+=1;
console.log(movi);
$("#movimientos-text").html(movi);
}

function _onDragOverEnabled(e){
  e.preventDefault();
  console.log("drag over " + e.target);
}
//funciones
function _onDrop(e){

   console.log("ondrop" + e);
   var src = e.dataTransfer.getData("text");
   var sr = src.split("_")[1];
   var sc = src.split("_")[2];
   var dst = e.target.id;
   var dr = dst.split("_")[1];
   var dc = dst.split("_")[2];

   // check distance (max 1)
   var ddx = Math.abs(parseInt(sr)-parseInt(dr));
   var ddy = Math.abs(parseInt(sc)-parseInt(dc));

   if (ddx > 1 || ddy > 1)
   {
     console.log("invalid! distance > 1");
     return;
   }

   console.log("swap " + sr + "," + sc+ " to " + dr + "," + dc);

   // execute swap
   var tmp = grilla[sr][sc].src;
   grilla[sr][sc].src = grilla[dr][dc].src;
   grilla[sr][sc].o.attr("src",grilla[sr][sc].src);
   grilla[dr][dc].src = tmp;
   grilla[dr][dc].o.attr("src",grilla[dr][dc].src);

   // busca combinaciones
   _checkAndDestroy();
 }

//esta aca las animaciones
function _checkAndDestroy(){
	//HORIZONTAL COMBO
	for (var r = 0; r < fila; r++){
		var prevCell = null;
		var figureLen = 0;
		var figureStart = null;
		var figureStop = null;
		for (var c=0; c< columna; c++){
			if (grilla[r][c].locked || grilla[r][c].isInCombo){
				figureStart = null;
				figureStop = null;
				prevCell = null;
				figureLen = 1;
				continue;
			}
			// first cell of combo!
			if (prevCell==null){
				//console.log("FirstCell: " + r + "," + c);
				prevCell = grilla[r][c].src;
				figureStart = c;
				figureLen = 1;
				figureStop = null;
				continue;
			}else
			{
				//second or more cell of combo.
				var curCell = grilla[r][c].src;
				if (!(prevCell==curCell)){
					prevCell = grilla[r][c].src;
					figureStart = c;
					figureStop=null;
					figureLen = 1;
					continue;
				}
				else{
					figureLen+=1;
					if (figureLen==3){
						validFigures+=1;
						figureStop = c;
            puntoHorizontal=1;
						console.log("Combo from " + figureStart + " to " + figureStop + "!");
            var puntoinicio=$("#score-text").html();
            $("#score-text").html(parseInt(puntoHorizontal)+parseInt(puntoinicio));
            console.log(puntoHorizontal);
						for (var ci=figureStart;ci<=figureStop;ci++){

							grilla[r][ci].isInCombo=true;
							grilla[r][ci].src=null;
						}
						prevCell=null;
						figureStart = null;
						figureStop = null;
						figureLen = 1;
						continue;
					}
				}
			}
		}
	}
//VERTICAL COMBO!


	for (var c=0; c< columna; c++)
	{
		var prevCell = null;
		var figureLen = 0;
		var figureStart = null;
		var figureStop = null;
		for (var r = 0; r < fila; r++)
		{
			if (grilla[r][c].locked || grilla[r][c].isInCombo){
				figureStart = null;
				figureStop = null;
				prevCell = null;
				figureLen = 1;
				continue;
			}

			if (prevCell==null)
			{
				prevCell = grilla[r][c].src;
				figureStart = r;
				figureLen = 1;
				figureStop = null;
				continue;
			}
			else
			{
				var curCell = grilla[r][c].src;
				if (!(prevCell==curCell))
				{

					prevCell = grilla[r][c].src;
					figureStart = r;
					figureStop=null;
					figureLen = 1;
					continue;
				}
				else{
					figureLen+=1;
					if (figureLen==3){
						validFigures+=1;
						figureStop = r;
          puntoVertical=1;
						console.log("Combo from " + figureStart + " to " + figureStop + "!");
          var puntoinicio=$("#score-text").html();
          $("#score-text").html(parseInt(puntoVertical)+parseInt(puntoinicio));
          console.log(puntoVertical);
						for (var ci=figureStart;ci<=figureStop;ci++){

							grilla[ci][c].isInCombo=true;
							grilla[ci][c].src=null;
							//grid[ci][c].o.attr("src","");

						}
						prevCell=null;
						figureStart = null;
						figureStop = null;
						figureLen = 1;
						continue;
					}
				}
			}

		}
	}
	// if there is combo then execute destroy
	 var isCombo=false;
	 for (var r = 0;r<fila;r++)
		for (var c=0;c<columna;c++)
			if (grilla[r][c].isInCombo)
		{
			console.log("There are a combo");
		 	isCombo=true;
		}

if (isCombo)
	_executeDestroy();
else
console.log("NO COMBO");
}

//=======destruccion

function _executeDestroy(){
for (var r=0;r<fila;r++)
for (var c=0;c<columna;c++)
if (grilla[r][c].isInCombo)  // this is an empty cell
{

  grilla[r][c].o.animate({
    opacity:0
  },1000);

}

$(":animated").promise().done(function() {
 _executeDestroyMemory();
});
}

function _executeDestroyMemory() {
    // move empty cells to top
   for (var r=0;r<fila;r++)
   {
    for (var c=0;c<columna;c++)
    {

      if (grilla[r][c].isInCombo)
      {
         grilla[r][c].o.attr("src","")
         grilla[r][c].isInCombo=false;

        for (var sr=r;sr>=0;sr--)
        {
          if (sr==0) break;
          if (grilla[sr-1][c].locked)
            break;
            var tmp = grilla[sr][c].src;
              grilla[sr][c].src=grilla[sr-1][c].src;
            grilla[sr-1][c].src=tmp;
        }
      }
    }
  }
    console.log("End of movement");
    for (var r=0;r<fila;r++){
      for (var c = 0;c<columna;c++){
        grilla[r][c].o.attr("src",grilla[r][c].src);
        grilla[r][c].o.css("opacity","1");
        grilla[r][c].isInCombo=false;
        if (grilla[r][c].src==null)
          grilla[r][c].respawn=true;
         if (grilla[r][c].respawn==true){
          grilla[r][c].o.off("ondragover");
          grilla[r][c].o.off("ondrop");
          grilla[r][c].o.off("ondragstart");
          grilla[r][c].respawn=false; // respawned!
          grilla[r][c].src=src_aleatoriamente();
          grilla[r][c].locked=false;
          grilla[r][c].o.attr("src",grilla[r][c].src);
          grilla[r][c].o.attr("ondragstart","_ondragstart(event)");
          grilla[r][c].o.attr("ondrop","_onDrop(event)");
          grilla[r][c].o.attr("ondragover","_onDragOverEnabled(event)");

        }
      }
    }
    _checkAndDestroy();
}
