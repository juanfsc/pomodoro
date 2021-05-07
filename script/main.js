
class Reloj{
    constructor(minutos){
        this.tiempo = minutos * 60;
        this.minutosEscogido = minutos;//util al momento de hacer Reloj.stop();
        this.intervalo;
        this.ciclos=0;
        this.break=60;//TODO minutos de receso
        this.longBreak=180;//TODO minutos de receso largo
        this.longBreakInterval=9;
        this.tipoTiempoLog="tiempoFocus";
        this.autoStart;//TODO tipo bool
        this.flagInteval = true;
    }
    
    disablePlay(){
        this.flagInteval = false;
    }
    enablePlay(){
        this.flagInteval = true;
    }

    asignarTiempo(minutos){
        this.minutosEscogido = minutos;
        this.tiempo = minutos * 60;
    }
    asignarBreak(_break,_longBreak, _longBreakInterval ){
        this.break = _break * 60;
        this.longBreak  = _longBreak * 60;
        this.longBreakInterval = _longBreakInterval + 4;
    }
    
    modificarVariables(){
        this.pause();

        //DOM manipulation con JQuery
        let minutos = parseInt($("#minutos").val());
        let _break = parseInt($("#break").val());
        let _longBreak = parseInt($("#longBreak").val());
        let _longBreakInterval = parseInt($("#longBreakInterval").val());
        
        //estas dos lineas podrian ser una nueva funcion
        this.asignarTiempo(minutos);
        this.asignarBreak(_break,_longBreak,_longBreakInterval);
        this.ciclos = 0;
        document.getElementById("contador").innerHTML = this.convertirSegundos();

    }

    convertirSegundos(){
        let minutos = Math.floor(this.tiempo/60);
        let segundos = this.tiempo % 60;
         
        segundos = segundos < 10 ? "0" + segundos : segundos;
        
        
        return minutos + ":" + segundos;
    }

    play(){
        if(this.flagInteval){
            this.intervalo = setInterval(() => this.play_intervalo() , 1000);
            this.disablePlay();
        }
        
        
    }
    play_intervalo(){
        this.incrementarTiempoLog(this.tipoTiempoLog);
        if(this.tiempo>0){
            document.getElementById("contador").innerHTML = this.convertirSegundos();
            this.tiempo--;
            
        }   
        else if(this.tiempo==0){
            document.getElementById("contador").innerHTML = this.convertirSegundos();
            this.tiempo--;
            clearInterval(this.intervalo);
            this.cambiarContador();
        }
    }
    //nuevos requerimientos:
    pause(){//poder hacer "pause" al contador
        clearInterval(this.intervalo);
        this.enablePlay();
        
    }        
    stop(){//poder hacer "stop" al contador, al hacer stop el contador se resetea a los minutos asignados por el usuario
        this.pause();
        
        //modificar el "display" del Contador     
        this.asignarTiempo(this.minutosEscogido);
        document.getElementById("contador").innerHTML = this.convertirSegundos(); 
    
    }
    playStop(){
        if(this.flagInteval){
            this.play();
            document.getElementById("play-stop").innerHTML = "Pause";
        }
        else{
            this.pause();
            document.getElementById("play-stop").innerHTML = "Play";
        }
    }
    //TODO: manejo automatico de contador de breaks y de focusTime(AutoStart)
    cambiarContador(){
        this.ciclos = this.ciclos + 1;

        //manejo automiatico de break
        if(this.ciclos % this.longBreakInterval != 0 && this.ciclos % 2 == 1 ){
            this.tiempo = (this.break);
            this.tipoTiempoLog = "tiempoBreak";
            this.enablePlay();
        }
        //longBreak(cada 5 sesiones de de focus)
        else if( this.ciclos % this.longBreakInterval == 0) {
            this.tiempo = this.longBreak;
            this.tipoTiempoLog = "tiempoBreak";
            this.enablePlay();
        }

        else{
            this.asignarTiempo(this.minutosEscogido);
            this.tipoTiempoLog = "tiempoFocus";
            this.enablePlay();
            
        }
        document.getElementById("contador").innerHTML = this.convertirSegundos();
    }
    

    //TODO: Log de estadisticas del usuario con json
        //tipoTiempo puede ser "tiempoFocus" o "tiempoBreak"
    incrementarTiempoLog(tipoTiempo){
        let tiempoLog = parseInt((localStorage.getItem(tipoTiempo)), 10) + 1;
        localStorage.setItem(tipoTiempo, tiempoLog.toString());
    }
    tiempoLog(tipoTiempo){
        return localStorage.getItem(tipoTiempo);
    }
    mostrarTiempoLog(id,tipoTiempo){
        document.getElementById(id).innerHTML = Math.trunc(this.tiempoLog(tipoTiempo)/60);
    }
    
    
}
//asignar minuto inicial, probando manipulacion DOM
let valoresInicialesJSON = '{"minutos":2,"break":1,"longBreak":3, "longBreakInterval":5}'
let valoresInicialesOBJ = JSON.parse(valoresInicialesJSON);

document.getElementById("minutos").value = valoresInicialesOBJ.minutos;
document.getElementById("break").value = valoresInicialesOBJ.break;
document.getElementById("longBreak").value = valoresInicialesOBJ.longBreak;
document.getElementById("longBreakInterval").value = valoresInicialesOBJ.longBreakInterval;
let minutos = parseInt(document.getElementById("minutos").value);

if(localStorage.length == 0){//
    localStorage.setItem("tiempoFocus","0");
    localStorage.setItem("tiempoBreak","0");
}

pomo = new Reloj(minutos);
document.getElementById("contador").innerHTML = pomo.convertirSegundos();
document.getElementById("play-stop").innerHTML = "Play";

//Eventos con JQuery 
let play = $('#play');
play.click(()=>{pomo.play()});
let pause = $("#pause");
pause.click(() => {pomo.pause()});
let _stop = $('#stop');
_stop.click(() => {pomo.stop()});
let playStop = $('#play-stop');
playStop.click(() => {pomo.playStop()})
let _minutosFocus = $('#contenedorMinutosFocus');
_minutosFocus.click(() => {pomo.mostrarTiempoLog('minutosFocus','tiempoFocus')});
let _minutosBreak = $('#contenedorMinutosBreak');
_minutosBreak.click(() => {pomo.mostrarTiempoLog('minutosBreak','tiempoBreak')});

//Animaciones con JQuery
$("body").hide();
$(document).ready(function() {
    $("body").fadeIn(2000);
});

