
let logUsuario = localStorage.setItem('logUsuario',0);


class Reloj{
    constructor(minutos){
        this.tiempo = minutos * 60;
        this.minutosEscogido = minutos;//util al momento de hacer Reloj.stop();
        this.intervalo;
        this.ciclos=0;
        this.break=60;//TODO minutos de receso
        this.longBreak=180;//TODO minutos de receso largo
        this.longBreakInterval=9;
        this.autoStart;//TODO tipo bool
        this.logUsuario;
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

        let minutos = parseInt(document.getElementById("minutos").value);
        let _break = parseInt(document.getElementById("break").value);
        let _longBreak = parseInt(document.getElementById("longBreak").value);
        let _longBreakInterval = parseInt(document.getElementById("longBreakInterval").value);
        
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
        this.intervalo = setInterval(() => this.play_intervalo() , 1000);
        
    }
    play_intervalo(){
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
        
    }        
    stop(){//poder hacer "stop" al contador, al hacer stop el contador se resetea a los minutos asignados por el usuario
        this.pause();
        
        //modificar el "display" del Contador     
        this.asignarTiempo(this.minutosEscogido);
        document.getElementById("contador").innerHTML = this.convertirSegundos();        
    }
    //TODO: manejo automatico de contador de breaks y de focusTime(AutoStart)
    cambiarContador(){
        this.ciclos = this.ciclos + 1;

        //manejo automiatico de break
        if(this.ciclos % this.longBreakInterval != 0 && this.ciclos % 2 == 1 ){
            this.tiempo = (this.break);
        }
        //longBreak(cada 5 sesiones de de focus)
        else if( this.ciclos % this.longBreakInterval == 0) {
            this.tiempo = this.longBreak;
        }

        else{
            this.asignarTiempo(this.minutosEscogido);
        }
        document.getElementById("contador").innerHTML = this.convertirSegundos();
    }
    

    //TODO: Log de estadisticas del usuario con json
    
}
//asignar minuto inicial, probando manipulacion DOM
document.getElementById("minutos").value = 2;
document.getElementById("break").value = 1;
document.getElementById("longBreak").value = 3;
document.getElementById("longBreakInterval").value = 5;
let minutos = parseInt(document.getElementById("minutos").value);

pomo = new Reloj(minutos);
document.getElementById("contador").innerHTML = pomo.convertirSegundos();

let play = document.getElementById("play");
play.addEventListener("click", () => {pomo.play()});
let pause = document.getElementById("pause");
pause.addEventListener("click",  () => {pomo.pause()});
let _stop = document.getElementById("stop");
_stop.addEventListener("click",  () => {pomo.stop()});
