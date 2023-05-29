var lati;
var long;
var city;
var country;

var VarLatitude;
var VarLongitude;
var VarCidade;
var VarPais;

var temp_min = [];
var temp_max = [];
var date = [];
var descricao = [];
var foto = [];

var i = 0;
var j = 0;
var l = 0;

function pesquisar0() {
  navigator.geolocation.getCurrentPosition(position =>{

    var lat = position.coords.latitude;
		var lon = position.coords.longitude;
    var url0 = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=ac36c20ebfde5c8ecffb303dad85aa6e`;

    fetch(url0)
    .then(response => response.json())
    .then(data => {
      var lati = data[0].lat;
      var long = data[0].lon;
      var city = data[0].name;
      var estado = data[0].state;

      VarLatitude = lati;
      VarLongitude = long;
      VarCidade = city;
      VarPais = estado;

      pesquisar2();
    })
    .catch(error => {
      alert('Ocorreu um erro ao obter as informações da cidade.');
      console.error(error);
    });
  })
}

function pesquisar1() {
  var city = document.getElementById('cidade').value;

   if (city == '' ){
    alert('Por favor, preencha todos os campos.');
  } else {

    var url1 = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=ac36c20ebfde5c8ecffb303dad85aa6e`;

    fetch(url1)
    .then(response => response.json())
    .then(data => {
      var lati = data[0].lat;
      var long = data[0].lon;
      var city = data[0].name;
      var estado = data[0].state;

      VarLatitude = lati;
      VarLongitude = long;
      VarCidade = city;
      VarPais = estado;

      pesquisar2();
    })
    .catch(error => {
      alert('Ocorreu um erro ao obter as informações da cidade.');
      console.error(error);
    });
  }
}


function pesquisar2() {
  if( l>=7 ){
    limpaResultado();
  }

  var url2 = `https://api.openweathermap.org/data/3.0/onecall?lat=${VarLatitude}&lon=${VarLongitude}&units=metric&appid=ac36c20ebfde5c8ecffb303dad85aa6e&lang=pt_br&exclude=minutely,hourly`;

  fetch(url2)
  .then(response => response.json())
  .then(data => {

    var cidade = VarCidade;
    var pais = VarPais;  

    var temperatura = data.current.temp;
    var umidade = data.current.humidity;
    var vento = data.current.wind_speed;
    var imagem = data.current.weather[0].icon;
    var descricao1 = data.current.weather[0].description;

    i=0;

    while(i<=7){
      var array_data = data.daily[i].dt;
      date.push(array_data);

      var array_temp_min = data.daily[i].temp.min;
      temp_min.push(array_temp_min);

      var array_temp_max = data.daily[i].temp.max;
      temp_max.push(array_temp_max);

      var array_descricao = data.daily[i].weather[0].description;
      descricao.push(array_descricao);
      
      var array_imagem = data.daily[i].weather[0].icon;
      foto.push(array_imagem);   
            
      i++;
    }
    
    exibirDados(cidade, pais, descricao1, temperatura, umidade, vento, imagem);

    j=0;

    while(j<=7){
      exibePrevisao(date[j], foto);

      j++;
    }
  })
  .catch(error => {
    alert('Ocorreu um erro ao obter as informações do tempo.');
    console.error(error);
  });
}

function montaData(data){
  var a = new Date(data * 1000);
  var meses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  var ano = a.getFullYear();
  var mes = meses[a.getMonth()];
  var data = a.getDate();
  var time = data + ' ' + mes + ' ' + ano;

  return time;
}

function exibirDados(cidade, pais, descricao, temperatura, umidade, vento, imagem) {
  var caixa = document.createElement('div');
  caixa.classList.add('caixa-clima');

  var titulo = document.createElement('h2');
  titulo.textContent = `Tempo atual em ${cidade}, ${pais}:`;
  caixa.appendChild(titulo);

  var lista = document.createElement('ul');
  
  var itemDescricao = document.createElement('li');
  itemDescricao.textContent = `Clima Atual: ${descricao}`;
  lista.appendChild(itemDescricao);

  var itemTemperatura = document.createElement('li');
  itemTemperatura.textContent = `Temperatura: ${temperatura}°C`;
  lista.appendChild(itemTemperatura);

  var itemUmidade = document.createElement('li');
  itemUmidade.textContent = `Umidade: ${umidade}%`;
  lista.appendChild(itemUmidade);

  var itemVento = document.createElement('li');
  itemVento.textContent = `Vento: ${vento} m/s`;
  lista.appendChild(itemVento);

  caixa.appendChild(lista);

  var resultado = document.getElementById('resultado');
  resultado.innerHTML = '';
  resultado.appendChild(caixa);

  var itemImg = document.createElement('img');
  itemImg.src = `../Novo site de clima/src/${imagem}.png`;
  caixa.appendChild(itemImg);
}

function exibePrevisao(date, foto) {
  if(date != date + 777600){
    var resultado = document.getElementById('resultado2');

    var box = document.createElement('div');
    box.classList.add('previsao-box');

    var list = document.createElement('ul');

    var data = document.createElement('li');
    data.textContent = `${montaData(date)}`;
    list.appendChild(data);
      
    var imgMin = document.createElement('li');
    imgMin.innerHTML = `<img src="../Novo site de clima/src/temperatura-baixa.png">${temp_min[l]}`;
    list.appendChild(imgMin);
    
    var imgMax = document.createElement('li');
    imgMax.innerHTML = `<img src="../Novo site de clima/src/temperatura-alta.png">${temp_max[l]}`;
    list.appendChild(imgMax);

    var imgClima = document.createElement('li');
    imgClima.innerHTML = `<img src="../Novo site de clima/src/${foto[l]}.png">`;
    list.appendChild(imgClima);

    var clima = document.createElement('li');
    clima.textContent = `${descricao[l]}`;
    list.appendChild(clima);
      
    box.appendChild(list);
    resultado.appendChild(box);

    l++;
  }

}

function limpaResultado() {
  var resultado = document.getElementById('resultado2');
  resultado.innerHTML = '';

  temp_min.length = 0;
  temp_max.length = 0;
  date.length = 0;
  descricao.length = 0;
  foto.length = 0;
    
  l = 0;
}