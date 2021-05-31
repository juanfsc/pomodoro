
//asignar minuto inicial, probando manipulacion DOM
//let valoresInicialesJSON = '{"minutos":2,"break":1,"longBreak":3, "longBreakInterval":5}'
//let valoresInicialesOBJ = JSON.parse(valoresInicialesJSON);

if (localStorage.length != 6) {//
    //primer setUp de localStorage
    localStorage.clear();
    localStorage.setItem("tiempoFocus", parseInt("0"));
    localStorage.setItem("tiempoBreak", parseInt("0"));
    localStorage.setItem("minutos", parseInt("30"));
    localStorage.setItem("break", parseInt("5"));
    localStorage.setItem("longBreak", parseInt("10"));
    localStorage.setItem("longBreakInterval", parseInt("5"));
}

document.getElementById("minutos").value = localStorage.minutos;
document.getElementById("break").value = localStorage.break;
document.getElementById("longBreak").value = localStorage.longBreak;
document.getElementById("longBreakInterval").value = localStorage.longBreakInterval;

pomo = new Clock(localStorage.minutos, localStorage.break, localStorage.longBreak, localStorage.longBreakInterval);
document.getElementById("contador").innerHTML = pomo.convertirSegundos();
document.getElementById("play-stop").innerHTML = "Play";

//Eventos con JQuery 
let play = $('#play');
play.click(() => { pomo.play() });

let pause = $("#pause");
pause.click(() => { pomo.pause() });

let _stop = $('#stop');
_stop.click(() => { pomo.stop() });

let playStop = $('#play-stop');
playStop.click(() => { pomo.playStop() })

let _buttonPomodoro = $('#buttonPomodoro');
_buttonPomodoro.click(() => { pomo.setPomodoro() })

let _buttonShortBreak = $('#buttonShortBreak');
_buttonShortBreak.click(() => { pomo.setShortBreak() })

let _buttonLongBreak = $('#buttonLongBreak');
_buttonLongBreak.click(() => { pomo.setLongBreak() })

let _userStats = $('#userStats');
_userStats.click(() => {
    pomo.mostrarTiempoLog('minutosFocus', 'tiempoFocus');
    pomo.mostrarTiempoLog('minutosBreak', 'tiempoBreak');
});

let _modificarVariables = $('#modificarVariables');
_modificarVariables.click(() => { pomo.modificarVariables() });

//Animaciones con JQuery
$("body").hide();
$(document).ready(function () {
    $("body").fadeIn(2000);
});


let autoStartPomodoro = $('#autoStartPomodoro');
let autoStartBreak = $('#autoStartBreak');
let dark_Mode = $('#darkMode');

function checked(checkBox,func1,func2) {  
    checkBox.on('click',function () {
        if (checkBox.is(':checked')) {
            console.log('You have Checked it');
            func1();
        } else {
            console.log('You Un-Checked it');
            func2();
        }
    });
}
checked(autoStartPomodoro,(() => { pomo.enableAutoStartPomodoro()}) , (() => { pomo.disableAutoStartPomodoro() }) );
checked(autoStartBreak, (() => { pomo.enableAutoStartBreak()}), (() => { pomo.disableAutoStartBreak()}));
checked(dark_Mode, darkMode, lightMode);
function darkMode(){
    $("body").css("background-color","black");
    $("circle").attr("stroke","white");
    $(".navbar-brand").css("color","white");
    $("text").attr("fill","white");
    //pomo.darkMode();
}
function lightMode(){
    $("body").css("background-color","white");
    $("circle").attr("stroke","black");
    $(".navbar-brand").css("color","black");
    $("text").attr("fill","black");
    //pomo.darkMode();
}