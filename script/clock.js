class Clock{
    constructor(minutos,_break,longBreak,_longBreakInterval,quote){
        this.tiempo = minutos * 60;
        this.minutosEscogido = this.tiempo;//util al momento de hacer Reloj.stop();
        this.intervalo;
        this.ciclos=0;
        this.pomodoro=minutos*60;
        this.break=_break*60;//TODO minutos de receso
        this.longBreak=longBreak*60;//TODO minutos de receso largo
        this.longBreakInterval=_longBreakInterval;
        this.tipoTiempoLog="tiempoFocus";
        this.autoStartPomodoro=false;
        this.autoStartBreak=false;
        this.flagInteval = false;
        this.bell = document.querySelector("audio");
        this.quote = quote;
    }
    
    disablePlay(){
        this.flagInteval = false;
    }
    enablePlay(){
        this.flagInteval = true;
    }
    disableAutoStartPomodoro(){
        this.autoStartPomodoro = false;
    }
    enableAutoStartPomodoro(){
        this.autoStartPomodoro = true;
    }
    disableAutoStartBreak(){
        this.autoStartBreak = false;
    }
    enableAutoStartBreak(){
        this.autoStartBreak = true;
    }
    autoStart(checkBox,tipoBreak) {  
        checkBox.on('click',function () {
            if (checkBox.is(':checked')) {
                tipoBreak = true;
            } else {
                tipoBreak = false;
            }
        });
    }
    asignarTiempo(minutos){
        this.pomodoro = minutos*60;
        this.tiempo = minutos * 60;
        this.minutosEscogido= this.pomodoro;
    }
    asignarBreak(_break,_longBreak, _longBreakInterval ){
        this.break = _break * 60;
        this.longBreak  = _longBreak * 60;
        this.longBreakInterval = _longBreakInterval;//?
    }
    
    modificarVariables(){
        //this.pause();

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
        
        minutos = minutos <  10 ? "0" + minutos : minutos;
        
        return minutos + ":" + segundos;
    }

    play(){
        if(this.flagInteval){
            this.intervalo = setInterval(() => this.play_intervalo() , 1000);
            this.disablePlay();
        }
        
    }
    progress(){
        let circle = document.querySelector('circle');
        let radius = circle.r.baseVal.value;
        let circumference = radius * 2 * Math.PI;

        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = `${circumference}`;

        function setProgress(percent) {
            let offset = (circumference - percent / 100 * circumference);
            circle.style.strokeDashoffset = offset;
        }
        
        let inputt =Math.min(100,((100*(this.minutosEscogido - this.tiempo))/(this.minutosEscogido)));

        setProgress(inputt); 
        
    }

    play_intervalo(){
        this.incrementarTiempoLog(this.tipoTiempoLog);
        if(this.tiempo>0){
            document.getElementById("contador").innerHTML = this.convertirSegundos();
            this.progress();
            this.tiempo--;
            
        }   
        else if(this.tiempo==0){
            document.getElementById("contador").innerHTML = this.convertirSegundos();
            this.tiempo--;
            this.progress();
            clearInterval(this.intervalo);
            this.cambiarContador();
            this.bell.play();
            this.quote.displayQuote();
        }
    }
    //nuevos requerimientos:
    pause(){//poder hacer "pause" al contador
        clearInterval(this.intervalo);
        this.enablePlay();
        
    }        
    setPomodoro(){
        //this.pause();
        this.tiempo = (this.pomodoro);
        this.minutosEscogido = this.tiempo;
        this.tipoTiempoLog = "tiempoFocus";
        document.getElementById("contador").innerHTML = this.convertirSegundos();
        document.getElementById("play-stop").innerHTML = "Play";
    }
    setShortBreak(){
        //this.pause();
        document.getElementById("play-stop").innerHTML = "Play";
        this.tiempo = (this.break);
        this.minutosEscogido = this.tiempo;
        this.tipoTiempoLog = "tiempoBreak";
        document.getElementById("contador").innerHTML = this.convertirSegundos();
        
    }
    setLongBreak(){
        //this.pause();
        document.getElementById("play-stop").innerHTML = "Play";
        this.tiempo = this.longBreak;
        this.minutosEscogido = this.tiempo;
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
        if(this.ciclos % (2*this.longBreakInterval - 1) != 0 && this.ciclos % 2 == 1 ){
            if(this.autoStartBreak){
                this.setShortBreak();
                this.enablePlay();
                this.play();
            }
            else{
                this.setShortBreak();
                this.enablePlay();
            }
            
        }
        //longBreak(cada 5 sesiones de de focus)
        else if(this.ciclos % (2*this.longBreakInterval - 1) == 0) {
            if(this.autoStartBreak){
                this.setLongBreak();
                this.ciclos = 0;
                this.enablePlay();
                this.play();
            }
            else{
                this.setLongBreak();
                this.ciclos = 0;
                this.enablePlay();
            }
        }

        else{
            if(this.autoStartPomodoro){
                this.setPomodoro();
                this.enablePlay();
                this.play();
            }
            else{
                this.setPomodoro();
                this.enablePlay();
            }
            
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