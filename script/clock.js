class Clock{
    constructor(minutos,_break,longBreak){
        this.tiempo = minutos * 60;
        this.minutosEscogido = minutos;//util al momento de hacer Reloj.stop();
        this.intervalo;
        this.ciclos=0;
        this.break=_break*60;//TODO minutos de receso
        this.longBreak=longBreak*60;//TODO minutos de receso largo
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
        this.longBreakInterval = _longBreakInterval + 4;//?
    }
    
    modificarVariables(){
        this.pause();

        //DOM manipulation con JQuery
        localStorage.minutos = parseInt($("#minutos").val())
        let minutos = localStorage.minutos;
        localStorage.break = parseInt($("#break").val()); 
        let _break = localStorage.break;
        localStorage.longBreak = parseInt($("#longBreak").val());
        let _longBreak = localStorage.longBreak;
        localStorage.longBreakInterval = parseInt($("#longBreakInterval").val()); 
        let _longBreakInterval = localStorage.longBreakInterval;
        
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
            this.intervalo = setInterval(() => this.play_intervalo() , 10);
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
    setPomodoro(){
        this.asignarTiempo(this.minutosEscogido);
        this.tipoTiempoLog = "tiempoFocus";
        document.getElementById("contador").innerHTML = this.convertirSegundos();
    }
    setShortBreak(){
        this.tiempo = (this.break);
        this.tipoTiempoLog = "tiempoBreak";
        document.getElementById("contador").innerHTML = this.convertirSegundos();
    }
    setLongBreak(){
        this.tiempo = this.longBreak;
        this.tipoTiempoLog = "tiempoBreak";
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
            this.setShortBreak();
            this.enablePlay();
        }
        //longBreak(cada 5 sesiones de de focus)
        else if( this.ciclos % this.longBreakInterval == 0) {
            this.setLongBreak();
            this.enablePlay();
        }

        else{
            this.setPomodoro();
            this.enablePlay();
            
        }
        
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