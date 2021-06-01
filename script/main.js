
//asignar minuto inicial, probando manipulacion DOM
//let valoresInicialesJSON = '{"minutos":2,"break":1,"longBreak":3, "longBreakInterval":5}'
//let valoresInicialesOBJ = JSON.parse(valoresInicialesJSON);

function formatQuote(quote,author){
    let template = 
        `<div id="rawData" class="flexr">
            Quote: ${quote}
            Author: ${author}
        </div>`;
    $("#quoteOfTheDay").empty();
    $("#quoteOfTheDay").append(template);
}
function saveQuote(data){
    localStorage.setItem("quote",data.contents.quotes[0].quote);
    localStorage.setItem("author",data.contents.quotes[0].author);       
}
function ajaxGet(url,urlFail){
    $.ajax({
        url: url,
    })
    .done(function (data) {
        console.log(data);
        saveQuote(data);
        formatQuote(data.contents.quotes[0].quote,data.contents.quotes[0].author); 
    })
    .fail(function(jqXHR, textStatus){
        console.log(jqXHR);
        console.log(textStatus);
        $.ajax({
            url: urlFail,
        })
        .done(function (data) {
            console.log(data);
            saveQuote(data);
            formatQuote(data.contents.quotes[0].quote,data.contents.quotes[0].author); 
        })
        .fail(function(jqXHR, textStatus){
            console.log(jqXHR);
            console.log(textStatus);
        })
        .always(function(){
            console.log("completo Por Fail");
        });
    })
    .always(function(){
        console.log("completo");
    });
}
class Quote{
    constructor(){
        this.api_url = `https://quotes.rest/qod?category=`;
        this.latestQuote;
        
    }
    displayQuote(){ 
        let quote = $("#quote").val();
        console.log(quote);
        this.getQuote(`${this.api_url}`);
    } 
    getRandomCategory(){
        let categories = ["inspire","management","sports","life","funny","love","art","students"];
        let index = Math.floor(Math.random()*(categories.length-1));
        console.log(index);
        let category = categories[index];
        console.log(category);
        return categories[index];
    }

    getQuote(url) { 
        let category = this.getRandomCategory();
        ajaxGet(`${url}${category}`,"../json/default.json");
    }
       
}
let quote = new Quote; 

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

pomo = new Clock(localStorage.minutos, localStorage.break, localStorage.longBreak, localStorage.longBreakInterval,quote);
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

