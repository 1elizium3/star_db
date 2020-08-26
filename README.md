Обучение на платформе Udemy

STAR-DB App


-Работа с REST сервисами
-Жизненный цикл React компонентов
-Компоненты высшего порядка и render - функции
-Context API
-React Router


------Создание нового проекта

-create-react-app star-db

--ТЕМЫ ДЛЯ Bootstrap:  https://bootswatch.com/

------Создание нового проекта

-XMLHttpRequest - использовался последние 20 лет, но уже устарел

-Fetch - API который будет использоваться
-Fetch доступен во всех современных браузерах, но не все продвинутые
  возможности поддерживаются одинаково хорошо


----Как работает Fetch

-Чтобы получить данные с сервера, нужно выполнить два вызова 
  (каждый вернёт Promise):

  >res = await fetch(url);
  >body = await res.json();

-Кроме .json() есть другие функции для других типов ответа:
  arrayBuffer(), blob(), text(), formData()


https://learn.javascript.ru/async-await       async/await
https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Statements/async_function
    async function
https://learn.javascript.ru/promise-chaining  цепочки Промисов
https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Promise
    Promise

    const getResource = async (url) => {
      const res = await fetch(url);       // Return promice
      return res.json();      // return Promise json data

    };

// const prourl = "https://cors-anywhere.herokuapp.com/";

    getResource('https://swapi.co/api/people/1/')
      .then((body) => {
        console.log(body);
      });

Эти два кода идентичны

    // fetch('https://swapi.co/api/people/1/')
    //   .then((res) => {
    //     return res.json();
    //   })
    //   .then((body) => {
    //     console.log(body);
    //   });


// Асинхронное поведение программы

      const myUrl=`https://swapi.co/api/people/1`

      const getSky = async (url) => {
          const result = await fetch(url) 
          return await result.json()
      }
      getSky(myUrl)
        .then((resp) => {
          console.log("responce=", resp);
        });
      console.log("ME was");
      console.log("ME was 1");
// Очередность результататов в консоли:

// Me was
// Me was 1
// {Object }


---Обработка ошибки Fetch

-Fetch отклоняет (reject) Promise, только если произошла ошибка 
  сети (сервер не доступен)

-Чтобы проверить код результата, можно использовать result.status

-result.ok содержит true, если result.status содержит один 
  из OK - статусов (200-299)


    const getResource = async (url) => {
      const res = await fetch(url);
     // 
      if (!res.ok) {                                      <-------
        throw new Error(`Could not fetch ${url}` +        <-------
        `, received ${res.status}`);                      <-------
      };
      return res.json();
    };

// const prourl = "https://cors-anywhere.herokuapp.com/";

    getResource('https://swapi.co/api/people/1ываы/')  <------- добавленно 1ываы 
      .then((body) => {                                      для вывода ошибки
        console.log(body);
      })
      .catch((err) => {
        console.error('Could not fetch' ,err);          <---------
      });

// Если нет ответа от сервера 
// Could not fetch TypeError: Failed to fetch 

// Выводим ошибку 404 или все остальные предупреждения если result.ok false

// Could not fetch Error: Could not fetch https://swapi.co/api/people/1ываы/,
//  received 404 at getResource


---API клиент

-Код который работает с сетью лучше изолировать в отдельный класс-сервис
-Компоненты не должны знать откуда именно берутся данные
-Такой подход упростит тестирование и поддержку кода который работает с API


class SwapiService {
 // Через нижнее подчеркивание говорим другим разработчикам что это
 // приватная часть класса и ее не следует использовать или изменять снаруже 
 
    _apiBase = 'https://swapi.dev/api';

    async getResource(url) {
      const res = await fetch(`${this._apiBase}${url}`);

      if (!res.ok) {
        throw new Error(`Could not fetch ${url}` + 
        `, received ${res.status}`);
      };

      return res.json();
    };

    async getAllPeople() {
      const res = await this.getResource(`/people/`);
      return res.results;
    };

    getPerson(id) {
      return this.getResource(`/people/${id}/`);
    };

    async getAllPlanets() {
      const res = await this.getResource(`/planets/`);
      return res.results;
    };

    getPlanet(id) {
      return this.getResource(`/planets/${id}/`);
    };

      async getAllStarships() {
        const res = await this.getResource(`/starships/`);
        return res.results;https://github.com/visantinian/react-usefull-sripts/blob/master/generate-components-files.js
      };

      getStarhip(id) {
        return this.getResource(`/starships/${id}/`);
      };
    };

    const swapi = new SwapiService();

    swapi.getPerson(3).then((p) => {
      console.log(p.name);
    });



---Компоненты STAR-DB

-Начинать разработку React приложения удобно с создания разметки компонентов
-Такие компоненты ничего не дают, они просто отображают данные
-В финальной версии приложения "разбивка" на компоненты может изменится,
  но такой шаблон на React - хорошее начало!



---Как отобразить данные из API

-В Конструкторе компонента вызываем сервис, который получит данные
-В .then() обновляем состояние компонента

<!-- random-planet.js -->

    import React, { Component } from 'react';
    import SwapiService from '../../services/swapi-service';  <-------
    import './random-planet.css';

    export default class RandomPlanet extends Component {
      // Привязываем SwapiService
      // Создаём поле класса (class field)
      swapiService = new SwapiService();                      <-------

      state = {                                               <-------
        id:null,                                            <-------
        name: null,                                           <-------
        population: null,                                   <-------
        rotationPeriod: null,                               <-------
        diameter: null                                      <-------
      };
      // Вызываем updatePlanet из конструктора                <-------
      constructor () {
        super();
        this.updatePlanet();                                    <-------
      };

 // Обновляем планету с помощью swapiService и получаем       <-------
 //   данные с сервера  
 
    updatePlanet() {                                            <-------
      const id = Math.floor(Math.random() * 25) + 2;    <-Вызываем рандомно->
      this.swapiService
        .getPlanet(id)                                    <-------
        .then((planet) => {                               <-------
          this.setState({                                   <-------
            id,                                             <-------
            name: planet.name,                              <-------
            population: planet.population,                  <-------
            rotationPeriod: planet.rotation_period,         <-------
            diameter: planet.diameter                       <-------
          });
        });
    };

    render() {

      const { id, name, population,
              rotationPeriod, diameter } = this.state;      <-------

      return (
        <div className="random-planet jumbotron rounded">
          <img className="planet-image"
               src={`https://starwars-visualguide.com/assets/img/planets/${id}.jpg`} /> <--
          <div>
            <h4>{name}</h4>                                         <-------
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <span className="term">Population</span>
                <span>{population}</span>                           <-------
              </li>
              <li className="list-group-item">
                <span className="term">Rotation Period</span>
                <span>{rotationPeriod}</span>                         <-------
              </li>
              <li className="list-group-item">
                <span className="term">Diameter</span>
                <span>{diameter}</span>                               <-------
              </li>
            </ul>
          </div>
        </div>
      );
  }
};



---Трансформация данных API

-Изолируйте код, который обрабатывает данные
-Отделяейте модель данных API от модели данных приложения

-ТАКАЯ ПРАКТИКА ЧАЩЕ ВСЕГО ПРИМЕНЯЕТСЯ ДЛЯ КРУПНЫХ ПРОЕКТОВ 
  СО СЛОЖНЫМИ МОДЕЛЯМИ ДАННЫХ, КОТОРЫЕ МОГУТ ИЗМЕНЯТЬСЯ!

<!-- random-planet.js -->

    import React, { Component } from 'react';
    import SwapiService from '../../services/swapi-service';

    import './random-planet.css';

    export default class RandomPlanet extends Component {
      // Привязываем SwapiService
      // Создаём поле класса (class field)
      swapiService = new SwapiService();

      state = {                                     <-------
        planet: {}                                  <-------
      };
      // Вызываем updatePlanet из конструктора
      constructor () {
        super();
        this.updatePlanet();
      };

      onPlanetLoaded = (planet) => {         <-Отрефакторили код->
        this.setState({ planet });              <-------
      };

 // Обновляем планету с помощью swapiService и получаем
 //   данные с сервера  
 
    updatePlanet() {
      const id = Math.floor(Math.random() * 25) + 2;
      this.swapiService
        .getPlanet(id)
        .then(this.onPlanetLoaded);
    };

    render() {

      const { planet: { id, name, population,           <-------
              rotationPeriod, diameter } } = this.state;

      return (
        <div className="random-planet jumbotron rounded">
          <img className="planet-image"
               src={`https://starwars-visualguide.com/assets/img/planets/${id}.jpg`} />
          <div>
            <h4>{name}</h4>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <span className="term">Population</span>
                <span>{population}</span>
              </li>
              <li className="list-group-item">
                <span className="term">Rotation Period</span>
                <span>{rotationPeriod}</span>
              </li>
              <li className="list-group-item">
                <span className="term">Diameter</span>
                <span>{diameter}</span>
              </li>
            </ul>
          </div>
        </div>
      );
    };
    };

<!-- swapi-service.js -->

    export default class SwapiService {
      // Через нижнее подчеркивание говорим другим разработчикам что это
      // приватная часть класса и ее не следует использовать или изменять снаруже   

      _apiBase = 'https://swapi.dev/api';

      async getResource(url) {
        const res = await fetch(`${this._apiBase}${url}`);

        if (!res.ok) {
          throw new Error(`Could not fetch ${url}` + 
            `, received ${res.status}`);
        };

        return res.json();
      };

      async getAllPeople() {                                          <-------
        const res = await this.getResource(`/people/`);
        return res.results.map(this._transformPerson);
      };                                                              <-------

      async getPerson(id) {                                           <-------
        const person = await this.getResource(`/people/${id}/`);
        return this._transformPerson(person);
      };                                                              <-------

      async getAllPlanets() {                                         <-------
        const res = await this.getResource(`/planets/`);
        return res.results.map(this._transformPlanet);  
      }; /*Передаём уже изменённую коллекцию*/                        <-------

      async getPlanet(id) {                                           <-------
        const planet = await this.getResource(`/planets/${id}/`);
        return this._transformPlanet(planet);
      };                                                              <-------

      async getAllStarships() {                                       <-------
        const res = await this.getResource(`/starships/`);
        return res.results.map(this._transformStarship);
      };                                                              <-------

      async getStarhip(id) {                                          <-------
        const starship = await this.getResource(`/starships/${id}/`);
        return this._transformStarship(starship);
      };                                                              <-------

      _extractId(item) {                          <-------
        const idRegExp = /\/([0-9]*)\/$/;    <-Применили RegExp для отлова ID из url->
        return item.url.match(idRegExp)[1];  <-[1] это та группа id которая нужна. [0] всё выражение->
      };

      _transformPlanet(planet) {                  <-------
        return {
          id: this._extractId(planet),
          name: planet.name,
          population: planet.population,
          rotationPeriod: planet.rotation_period,
          diameter: planet.diameter
        };
      };                                          <-------

      _transformStarship(starship) {              <-------
        return {
          id: this._extractId(starship),
          name: starship.name,
          model: starship.model,
          manufacturer: starship.manufacturer,
          costInCredits: starship.costInCredits,
          length: starship.length,
          crew: starship.crew,
          passengers: starship.passengers,
          cargoCapacity: starship.cargoCapacity
        };
      };                                          <-------

      _transformPerson(person) {                  <-------
        return {
          id: this._extractId(person),
          name: person.name,
          gender: person.gender,
          birthYear: person.birthYear,
          eyeColor: person.eyeColor
        };
      };                                           <-------
    };


---Создаем индикатор загрузки

-Хорошее приложение не отображает элементы для которых 
  нет данных
-Создаем спиннер используя CSS код с https://loading.io 


---Логика индикатора загрузки

-Состояние "загрузки" можно хранить в state
-В зависимости от этого состояния рендерим индикатор загрузки 
  или содержимое компонента (уже с данными)
-Старайтесь разделять логику и рендеринг
-React.Fragment позволяет групировать элементы не создавая
  лишних DOM-объектов

<!-- random-planet.js -->

    import React, { Component } from 'react';

    import SwapiService from '../../services/swapi-service';

    import './random-planet.css';
    import Spinner from '../spinner/spinner';               <------

    export default class RandomPlanet extends Component {
      // Привязываем SwapiService
      // Создаём поле класса (class field)
      swapiService = new SwapiService();

      state = {
        planet: {},
        loading: true                                       <------
      };
      // Вызываем updatePlanet из конструктора
      constructor () {
        super();
        this.updatePlanet();
      };

      onPlanetLoaded = (planet) => {
        this.setState({ 
          planet,
          loading: false                                    <------
        }); // Спиннер пропадает когда данные появляются
      };
     // Обновляем планету с помощью swapiService и получаем
     //   данные с сервера  
      updatePlanet() {
        const id = Math.floor(Math.random() * 25) + 2;
        this.swapiService
          .getPlanet(id)
          .then(this.onPlanetLoaded);
      };

      render() {

        const { planet, loading } = this.state;                         <------
     // Если идет загрузка то возвращаем Спиннер или отображаем Контент
        const spinner = loading ? <Spinner /> : null;                       <------
        const content = !loading ? <PlanetView planet={planet} /> : null;   <------

        return (
          <div className="random-planet jumbotron rounded">
            {spinner}                                                       <------
            {content}                                                       <------
         </div>
        );
      };
    };

    const PlanetView = ({ planet }) => {

      const { id, name, population,                                         <------
              rotationPeriod, diameter } = planet;                          <------

      return (

        <React.Fragment>                                                    <------
          <img className="planet-image"
              src={`https://starwars-visualguide.com/assets/img/planets/${id}.jpg`} />
          <div>
            <h4>{name}</h4>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <span className="term">Population</span>
                  <span>{population}</span>
                </li>
                <li className="list-group-item">
                  <span className="term">Rotation Period</span>
                  <span>{rotationPeriod}</span>
                </li>
                <li className="list-group-item">
                  <span className="term">Diameter</span>
                  <span>{diameter}</span>
                </li>
              </ul>
          </div>
        </React.Fragment>                                                     <------
      );
    };


---Обработка ошибок

-В state добавляется поле где будет хранится флаг: нужно ли отобразить ошибку!
-В зависимости от этого флага отображаем ошибку, или нормальное 
  содержимое компонента

-Будьте внимательны с async/await - код с await может выбросить Error

<!-- random-planet.js -->

    import React, { Component } from 'react';

    import SwapiService from '../../services/swapi-service';

    import './random-planet.css';
    import Spinner from '../spinner/spinner';
    import ErrorIndicator from '../error-indicator';

    export default class RandomPlanet extends Component {
      // Привязываем SwapiService
      // Создаём поле класса (class field)
      swapiService = new SwapiService();

      state = {
        planet: {},
        loading: true,
        error: false                                              <------
      };
      // Вызываем updatePlanet из конструктора
      constructor () {
        super();
        this.updatePlanet();
      };

      onPlanetLoaded = (planet) => {
        this.setState({ 
          planet,
          loading: false                                            <------
        }); // Спиннер пропадает когда данные появляются
      };

      onError = (err) => {                                          <------
        this.setState({
          error: true,
          loading:false
        });
      };                                                            <------

     // Обновляем планету с помощью swapiService и получаем
     //   данные с сервера  
      updatePlanet() {
        // const id = Math.floor(Math.random() * 25000) + 2;
        const id = 1300;                                              <------
        this.swapiService
          .getPlanet(id)
          .then(this.onPlanetLoaded)
          .catch(this.onError);                                       <------
      };

      render() {

        const { planet, loading, error } = this.state;                  <------

        const hasDate = !(loading || error);                            <------

        const errorMessage = error ? <ErrorIndicator /> : null;         <------

     // Если идет загрузка то возвращаем Спиннер или отображаем Контент
        const spinner = loading ? <Spinner /> : null;
        const content = hasDate ? <PlanetView planet={planet} /> : null;  <------

        return (
          <div className="random-planet jumbotron rounded">
            {errorMessage}                                    <------
            {spinner}
            {content}
         </div>
        );
      };
    };

    const PlanetView = ({ planet }) => {

      const { id, name, population,
              rotationPeriod, diameter } = planet;

      return (

        <React.Fragment>
    ........
        </React.Fragment>
      );
    };

    <!-- error-indicator.js -->
    import React from 'react';

    import './error-indicator.css';
    import icon from './death-star.jpeg';         <-Добавленна картинка->

    const ErrorIndicator = () => {
      return (
        <div className='error-indicator'>
          <img src={icon} alt="error icon"/>
          <span className="boom">BOOM!!!</span>
          <span>
            something has gone terribly wrong
          </span>
          <span>
            (but we already sent droids to fix it problrm)
          </span>
        </div>
      );
    };

    export default ErrorIndicator;

    <!-- error-indicator.css -->
    .error-indicator {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      color: aqua;
    }

    .error-indicator img {
      margin-bottom: 1rem;
    }

    .error-indicator .boom {
      font-size: 1.8rem;
    }



---Жизненный цикл

-Компонентам нужно выполнять код в определённый момент своей жизни
-К примеру, перед тем как компонент будет удален, неообхлдимо очистить ресурсы
-В React для этого есть механизм - Методы Жизненного Цикла (lifecycle hooks)

    <!-- app.js -->
    import React, { Component } from 'react';

    import Header from '../header';
    import RandomPlanet from '../random-planet';
    import ItemList from '../item-list';
    import PersonDetails from '../person-details';

    import './app.css';

    export default class App extends Component {                  <-------

      state = {                                                     <-------
        showRandomPlanet: true                              
      };                                                          <-------

      toggleRandomPlanet = () => {                                <-------
        this.setState((state) => {
          return {
            showRandomPlanet: !state.showRandomPlanet
          };
        });
      };                                                          <-------

      render() {

        const planet = this.state.showRandomPlanet ? <RandomPlanet /> : null;  <-------

        return (
          <div className="stardb-app">
            <Header />
            { planet }

            <button                                                   <-------
              className="toggle-planet btn btn-warning btn-1g"
              onClick={this.toggleRandomPlanet}>
              Toggle Random Planet                                <-------
            </button>                                                 <-------

            <div className="row mb2">
              <div className="col-md-6">
                <ItemList />
              </div>
              <div className="col-md-6">
                <PersonDetails />
              </div>
            </div>
          </div>
        );
      };  
    };


---Методы жизненного цикла

-componentDidMount() - компонент "подключен" 
  (DOM дерево элементов уже на странице)
-componentDidUpdate() - компонент обновляется
-componentWillUnmount() - компонент будет удалён 
  (но DOM еще на странице)
-componentDidCatch() - когда в компоненте
  (или в его child-компонентах) произошла ошибка


---Какие функции жизненного цикла будет вызывать React на разных этапах 
  жизненного цикла:

Mounting
--Это то когда компонент создается и он первый раз отображается на странице
constructor() => render() => componentDidMount()

Update
--Это после того как компонент отобразился, он в работе и он может получать 
  обновления
New Props
  или       => render() => componentDidMount()
setState()

Unmounting
--Это когда компонент становится НЕ нужным и он удаляется со страници
componentWillUnmount()

Error
--Это когда компонент получает какую то ошибку которая не была поймана раньше
componentDidCatch()

    <!-- random-planet.js -->
    import React, { Component } from 'react';
    ......

    export default class RandomPlanet extends Component {
      // Привязываем SwapiService
      // Создаём поле класса (class field)
      swapiService = new SwapiService();

      state = {
        planet: {},
        loading: true,
        error: false
      };
      // Вызываем updatePlanet из конструктора
      constructor () {
        super();
        console.log('constructor()')                           <-------
        this.updatePlanet();
        this.interval = setInterval(this.updatePlanet, 10000);  <-------
        // clearInterval(this.interval);                        <-------
      };

      componentDidMount() {                                       <-------
        console.log('componentDidMount()');
      };

      componentWillUnmount() {                                    <-------
        console.log('componentWillUnmount()');
      };

      onPlanetLoaded = (planet) => {
        this.setState({ 
          planet,
          loading: false 
        }); // Спиннер пропадает когда данные появляются
      };

      onError = (err) => {
        this.setState({
          error: true,
          loading:false
        });
      };

     // Обновляем планету с помощью swapiService и получаем
     //   данные с сервера  
      updatePlanet = () => {
        console.log('update');                                  <-------
        const id = Math.floor(Math.random() * 18) + 3;
        // const id = 1300;
        this.swapiService
          .getPlanet(id)
          .then(this.onPlanetLoaded)
          .catch(this.onError);
      };

      render() {
        console.log('render()');                                  <-------
        const { planet, loading, error } = this.state;

        const hasDate = !(loading || error);

        const errorMessage = error ? <ErrorIndicator /> : null;
        const spinner = loading ? <Spinner /> : null;
        const content = hasDate ? <PlanetView planet={planet} /> : null;

        return (
          <div className="random-planet jumbotron rounded">
            {errorMessage}
            {spinner}
            {content}
         </div>
        );
      };
    };

    const PlanetView = ({ planet }) => {

      const { id, name, population,
              rotationPeriod, diameter } = planet;

      return (
        <React.Fragment>
     .....
      );
    };



---componentDidMount()

-componentDidMount() - компонент "подключен" 
  (DOM дерево элементов уже на странице)
-Используется для инициализации (полученные данные, работа с DOM, и тд.)
-
-Не используйте КОНСТРУКТОР для кода, который создает побочные эфекты

    <!-- random-planet.js -->
    import React, { Component } from 'react';

    .........

    export default class RandomPlanet extends Component {
      // Привязываем SwapiService
      // Создаём поле класса (class field)
      swapiService = new SwapiService();

      state = {
        planet: {},
        loading: true,
        error: false
      };
                                            <-КОНСТРУКТОР УДАЛЕН->
      componentDidMount() {
        this.updatePlanet();                        <-ДАННЫЕ ИЗ КОНСТРУКТОРА->
        this.interval = setInterval(this.updatePlanet, 10000);
        // clearInterval(this.interval);
      };

      componentWillUnmount() {
        console.log('componentWillUnmount()');
      };

      onPlanetLoaded = (planet) => {
        this.setState({ 
          planet,
          loading: false 
        }); // Спиннер пропадает когда данные появляются
      };

      onError = (err) => {
        this.setState({
          error: true,
          loading:false
        });
      };

     // Обновляем планету с помощью swapiService и получаем
     //   данные с сервера  
      updatePlanet = () => {
        console.log('update');
        const id = Math.floor(Math.random() * 18) + 3;
        // const id = 1300;
        this.swapiService
          .getPlanet(id)
          .then(this.onPlanetLoaded)
          .catch(this.onError);
      };

      render() {
      .........
    };

    const PlanetView = ({ planet }) => {

      const { id, name, population,
              rotationPeriod, diameter } = planet;

      return (
        <React.Fragment>
    ...
      );
    };



---componentDidMount()

-componentDidMount() - хорошее место, для того что бы получать данные 

    <!-- item-list.js -->
    import React, { Component } from 'react';

    import SwapiService from '../../services/swapi-service';
    ......

    export default class ItemList extends Component {

      swapiService = new SwapiService();               <--------

      state = {                                     <--------
        peopleList: null                            <--------
      };

      componentDidMount() {                         <--------
        this.swapiService
          .getAllPeople()
          .then((peopleList) => {
            this.setState({
              peopleList
            });
          });
      };                                            <--------

      renderItem(arr) {                                   <--------
        return arr.map(({id, name}) => {
          return (
            <li className="list-group-item"
                key={id}
                onClick={() => this.props.onItemSelected(id)}>
              {name}
            </li>
          );
        });
      };                                                    <--------

      render() {

        const { peopleList } = this.state;                  <--------

        if (!peopleList) {                                <--------
          return <Spinner />                                <--------
        };

        const items = this.renderItem(peopleList);        <--------

        return (
          <ul className="item-list list-group">
            {items}                                       <--------
          </ul>
        );
      };
    };

    <!-- app.js -->
    import React, { Component } from 'react';
    .............

    import './app.css';

    export default class App extends Component {

      state = {
        showRandomPlanet: true,
        selectedPerson: null                          <--------
      };

      toggleRandomPlanet = () => {
        this.setState((state) => {
          return {
            showRandomPlanet: !state.showRandomPlanet
          };
        });
      };

      onPersonSelected = (id) => {                    <--------
        this.setState({
          selectedPerson: id
        });
      };                                              <--------

      render() {

        const planet = this.state.showRandomPlanet ? <RandomPlanet /> : null;

        return (
          <div className="stardb-app">
            <Header />
            { planet }

            <button 
              className="toggle-planet btn btn-warning btn-1g"
              onClick={this.toggleRandomPlanet}>
              Toggle Random Planet
            </button>

            <div className="row mb2">
              <div className="col-md-6">
                <ItemList onItemSelected={this.onPersonSelected} />       <--------
              </div>
              <div className="col-md-6">
                <PersonDetails personId={this.state.selectedPerson} />    <--------
              </div>
            </div>
          </div>
        );
      };  
    };



---componentDidUpdate()

-componentDidUpdate() - вызывается после того, как 
  компонент обновится

-Компонент обновляется после того, как получает новые 
  свойства или state

-Этот метод вызывается после render() - в нем можно, к примеру,
  запрашивать новые данные для обновленных свойств

---componentDidUpdate()

-Мы использовали этот метод, что бы подгрузить новые данные, когда
  personId изменился

-ОЧЕНЬ ВАЖНО: ЕСЛИ В ЭТОМ МЕТОДЕ МОЖЕТ ИЗМЕНЯТЬСЯ state - ОБЯЗАТЕЛЬНО ПРОВЕРЯТЬ
  КАКОЕ ИМЕННО СВОЙСТВО ИЗМЕНИЛОСЬ
-... иначе компонент рискует уйти в "вечный цикл" обновления

    <!-- person-details.js -->
    import React, { Component } from 'react';

    import SwapiService from '../../services/swapi-service';

    import './person-details.css';
    import Spinner from '../spinner/spinner';             <-добавлен Спинер->
    import ErrorIndicator from '../error-indicator'       <-Доб. отлов ошибок->


    export default class PersonDetails extends Component {

      swapiService = new SwapiService();              <---------

      state = {
        person: null,
        loading: true,                              <---------
        error: false                                <---------
      };

      componentDidMount() {                             <---------
        this.updatePerson();                            <---------
      };

      componentDidUpdate(prevProps) {                       <---------
        if (this.props.personId !== prevProps.personId) {   <-ОЧЕНЬ ВАЖНО->
          this.setState({                                   <---------
            loading: true                                   <---------
          });
          this.updatePerson();                              <---------
        }
      };

      onPersenLoaded = (person) => {                        <---------
        this.setState({ 
          person,                                               ...
          loading: false 
        });
      };                                                    <---------

      onError = (err) => {                                  <---------
        this.setState({
          loading: false, 
          error: true                                         ...
        });
      };                                                      <---------

      updatePerson() {                                      <---------
        const { personId } = this.props;                    <---------

        if (!personId) {                                    <---------
          return;                                           <---------
        }

        this.swapiService                                   <---------
          .getPerson(personId)
          .then(this.onPersenLoaded)                        ...
          .catch(this.onError)  
      };                                                    <---------

      render() {

        if (!this.state.person) {                           <---------
          return <Spinner />                              <---------
        };

        //  if (!this.state.person) {
        //   return <span>Select a person from a list</span>

        const { person, loading, error } = this.state;        <---------

        const hasError = !(loading || error);                   <---------

        const errorMessage = error ? <ErrorIndicator /> : null;     <---------
        const spinner = loading ? <Spinner /> : null;                       <---------
        const content = hasError ? <PersonView person={person} /> : null;   <---------

        return (                                              <---------
          <div className="person-details card">
            {errorMessage}                                
            {spinner}                                           .....
            {content}
          </div>
        )                                                       <---------
      }
    };

    const PersonView = ({ person }) => {

      const { id, name, gender,
        birthYear, eyeColor } = person;                           <---------

      return (

        <React.Fragment>                                            <---------
          <img className="person-image"
              src={`https://starwars-visualguide.com/assets/img/characters/${id}.jpg`}
              alt="character"/>

            <div className="card-body">
              <h4>{name}</h4>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <span className="term">Gender</span>
                  <span>{gender}</span>
                </li>
                <li className="list-group-item">
                  <span className="term">Birth Year</span>
                  <span>{birthYear}</span>
                </li>
                <li className="list-group-item">
                  <span className="term">Eye Color</span>
                  <span>{eyeColor}</span>
                </li>
              </ul>
            </div>
        </React.Fragment>                                             <---------
      );
    };



---componentWillUnmount

-componentWillUnmount() - компонент будет удален

-используется для отчистки ресурсяов (таймеры, интервалы, запросы к серверу)

-в момент вызова DOM все еще находится на странице

<!-- random-planet.js -->
........
 state = {
  .......
  };
  
  componentDidMount() {
    this.updatePlanet();
    this.interval = setInterval(this.updatePlanet, 10000);
  };

  componentWillUnmount() {
    console.log('componentWillUnmount()');
    clearInterval(this.interval);                     <----------
  };
........



---componentDidCatch() 

-componentDidCatch() - отлавливает ошибки, которые произошли в методах 
  жизненного цикла ниже по иерархии

-принцип работы похож на try/catch - ошибку отлавливает ближайший блок

-НЕ обрабатываются ошибки в event listener'ах и в асинхронном коде
  (запросы к серверу и тд.)

    <!-- error-button.js -->
    import React, {Component} from 'react';                              <-------
    import './error-button.css';

    export default class ErrorButton extends Component {

      state = {
        renderError: false
      };

      render() {

        console.log('render');                                  .........
        if (this.state.renderError) {
          this.foo.bar = 0;
        };

        return (
          <button
            className="error-button btn btn-danger btn-lg"
            onClick={() => this.setState({renderError: true})}>
              Throw Error
          </button>
        );

      };
    };                                                                    <-------

    <!-- app.js -->
    import React, { Component } from 'react';
    ........

    import ErrorButton from '../error-button';              <-------
    import ErrorIndicator from '../error-indicator';

    export default class App extends Component {

      state = {
        showRandomPlanet: true,
        selectedPerson: 1,
        hasError: false                                     <-------
      };


      componentDidCatch() {                                 <-------
        console.log('componentDidCatch');
        this.setState({                                 ......
          hasError: true 
        });
      };                                                    <-------

      render() {

        if (this.state.hasError) {                          <-------
          return <ErrorIndicator />
        };                                                  <-------

        const planet = this.state.showRandomPlanet ? <RandomPlanet /> : null;

        return (
          <div className="stardb-app">
          .......
        );
      };  
    };



---componentDidCatch()

-Чтобы определить границы ошибок, нужны компоненты, которые будут 
  разделять независимые блоки приложения

-componentDidCatch()  принимает два аргумента - error и info с
  дополнительной информацией об источнике ошибок

    <!-- people-page.js -->
    import React, { Component } from 'react';

    import './people-page.css';

    import ItemList from '../item-list';
    import PersonDetails from '../person-details';
    import ErrorIndicator from '../error-indicator';
    import ErrorButton from '../error-button';

    export default class PeoplePage extends Component {

      state = {
        selectedPerson: 3,
        hasError: false
      };

      componentDidCatch(error, info) {
        debugger;

        this.setState({
          hasError: true
        });
      };

      onPersonSelected = (selectedPerson) => {
        this.setState({
          selectedPerson,
        });
      };

      render() {

        if (this.state.hasError) {
          return <ErrorIndicator />
        };

        return (
          <div className="row mb2">
            <div className="col-md-6">
              <ItemList onItemSelected={this.onPersonSelected} />
            </div>

          <div className="col-md-6">
            <PersonDetails personId={this.state.selectedPerson} />
          </div>
        </div>
        )
      };
    };

    <!-- app.js -->
    import React, { Component } from 'react';

    import Header from '../header';
    import RandomPlanet from '../random-planet';

    import './app.css';

    import ErrorButton from '../error-button';
    import ErrorIndicator from '../error-indicator';
    import PeoplePage from '../people-page/people-page';

    export default class App extends Component {

      state = {
        showRandomPlanet: true,
        hasError: false
      };                  <-selectedPerson -перенесено в people-page->

      toggleRandomPlanet = () => {
        this.setState((state) => {
          return {
            showRandomPlanet: !state.showRandomPlanet
          };
        });
      };

      componentDidCatch() {
        console.log('componentDidCatch');
        this.setState({
          hasError: true 
        });
      };

      render() {

        if (this.state.hasError) {
          return <ErrorIndicator />
        };

        const planet = this.state.showRandomPlanet ? <RandomPlanet /> : null;

        return (
          <div className="stardb-app">
            <Header />
            { planet }

            <div className="mb2 button-row">
              <button 
                className="toggle-planet btn btn-warning btn-lg"
                onClick={this.toggleRandomPlanet}>
                  Toggle Random Planet
              </button>
              <ErrorButton />
            </div>
                            <-Данные перенесены в people-page.js->
            <PeoplePage />                            <------
            <PeoplePage />                            <------

          </div>
        );
      };  
    };

    <!-- person-details.js -->
    import React, { Component } from 'react';
    .........
    export default class PersonDetails extends Component {
    .............

    const PersonView = ({ person }) => {

      const { id, name, gender,
        birthYear, eyeColor } = person;                           

      return (

        <React.Fragment>                                            
          <img className="person-image"
              src={`https://starwars-visualguide.com/assets/img/characters/${id}.jpg`}
              alt="character"/>

            <div className="card-body">
              <h4>{name}</h4>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <span className="term">Gender</span>
                  <span>{gender}</span>
                </li>
                <li className="list-group-item">
                  <span className="term">Birth Year</span>
                  <span>{birthYear}</span>
                </li>
                <li className="list-group-item">
                  <span className="term">Eye Color</span>
                  <span>{eyeColor}</span>
                </li>
              </ul>
              <ErrorButton />                             <----------
            </div>
        </React.Fragment>                                        
      );
    };



---Использование функций

-Функции которые мы передаем компоненту могут быть НЕ только 
  быть обработчиками событий

-Функция к примеру, может инкапсулировать получение данных (тогда компонент
  становится независимым от источника данных)

     <!--item-list.js  -->
    import React, { Component } from 'react';
    ......

    export default class ItemList extends Component {
                                                      <-Убран SwapiService->
      state = {
        itemList: null
      };

      componentDidMount() {

        const { getData } = this.props;           <-----------

        getData()                                 <-----------
          .then((itemList) => {                   <-----------
            this.setState({
              itemList                            <-----------
            });
        });
      };

      renderItem(arr) {
        return arr.map(({id, name}) => {
          return (
            <li className="list-group-item"
                key={id}
                onClick={() => this.props.onItemSelected(id)}>
              {name}
            </li>
          );
        });
      };

      render() {

        const { itemList } = this.state;              <-----------

        if (!itemList) {                              <-----------
          return <Spinner />
        };

        const items = this.renderItem(itemList);

        return (
          <ul className="item-list list-group">
            {items}
          </ul>
        );
      };
    };

    <!-- people-page.js -->
    import React, { Component } from 'react';

    ......

    export default class PeoplePage extends Component {

      swapiService = new SwapiService();

      state = {
     ........

      render() {

        if (this.state.hasError) {
          return <ErrorIndicator />
        };

        return (
          <div className="row mb2">
            <div className="col-md-6">
              <ItemList 
                onItemSelected={this.onPersonSelected}
                getData={this.swapiService.getAllPeople} />     <--------
            </div>

            <div className="col-md-6">
              <PersonDetails personId={this.state.selectedPerson} />
            </div>
          </div>
        )
      };
    };

    <!-- app.js -->
    render() {

     ......
            <PeoplePage />

            <div className="row mb2">
              <div className="col-md-6">
                <ItemList 
                  onItemSelected={this.onPersonSelected}
                  getData={this.swapiService.getAllPlanets} />        <----------
              </div>
              <div className="col-md-6">
                <PersonDetails personId={this.state.selectedPerson} />
              </div>
            </div>

            <div className="row mb2">
              <div className="col-md-6">
                <ItemList 
                  onItemSelected={this.onPersonSelected}
                  getData={this.swapiService.getAllStarships} />        <----------
              </div>
              <div className="col-md-6">
                <PersonDetails personId={this.state.selectedPerson} />
              </div>
            </div>

          </div>
        );
      };  
    };

<!-- swapi-service.js -->
Все функции установлены как стрелочные () => {} что бы не терялся this



---Render-функция

-Паттерн React - в компонент передается функция, которая 
  рендерит часть компонента (или весь компонент)

< Card renderBody={() => <p>hello</p>} />

-Такая функция обычно возвращает строку или React элементов

    <!-- app.js -->
    import React, { Component } from 'react';
    ........

    export default class App extends Component {

      .......

      render() {

        if (this.state.hasError) {
          return <ErrorIndicator />
        };

        const planet = this.state.showRandomPlanet ? <RandomPlanet /> : null;

        return (
          .........

            <PeoplePage />

            <div className="row mb2">
              <div className="col-md-6">
                <ItemList 
                  onItemSelected={this.onPersonSelected}
                  getData={this.swapiService.getAllPlanets}
                  renderItem={(item) =>                            <-------
                    <span>{item.name} <button>!</button></span>     <-------
                  } />
              </div>
              <div className="col-md-6">
                <PersonDetails personId={this.state.selectedPerson} />
              </div>
            </div>

            <div className="row mb2">
              <div className="col-md-6">
                <ItemList 
                  onItemSelected={this.onPersonSelected}
                  getData={this.swapiService.getAllStarships}
                  renderItem={(item) => item.name} />               <-------
              </div>
              <div className="col-md-6">
                <PersonDetails personId={this.state.selectedPerson} />
              </div>
            </div>

          </div>
        );
      };  
    };

    <!-- people-page.js -->
    import React, { Component } from 'react';
    .....

    export default class PeoplePage extends Component {

      .........

      render() {

        if (this.state.hasError) {
          return <ErrorIndicator />
        };

        return (
          <div className="row mb2">
            <div className="col-md-6">
              <ItemList 
                onItemSelected={this.onPersonSelected}
                getData={this.swapiService.getAllPeople}
                renderItem={({name,gender,birthYear}) =>        <-------
                  `${name} (${gender}, ${birthYear})`} />       <-------
            </div>

            <div className="col-md-6">
              <PersonDetails personId={this.state.selectedPerson} />
            </div>
          </div>
        )
      };
    };

    <!-- item-list.js -->
    import React, { Component } from 'react';
    ......

    export default class ItemList extends Component {

    .......

      renderItem(arr) {                                         <--------
        return arr.map((item) => {
          const { id } = item;                                  <--------

          const lable = this.props.renderItem(item);            <--------

          return (                                              
            <li className="list-group-item"
                key={id}
                onClick={() => this.props.onItemSelected(id)}>
              {lable}                                           <--------
            </li>
          );
        });
      };                                                          

      render() {

        const { itemList } = this.state;

        if (!itemList) {
          return <Spinner />
        };

        const items = this.renderItem(itemList);

        return (
          <ul className="item-list list-group">
            {items}
          </ul>
        );
      };
    };


---Свойства-элементы

-В качестве значения свойства можно передавать React элементы

< Card title={<h1>HI</h1>} />

-Так можно создавать элементы - "контейнеры"

-...или элементы, которые умеют выбирать, что рендерить в зависимости
  от условия (загрузка, ошибка и тд.)

    <!-- row.js -->
    import React, { Component } from 'react';

    .......

    const Row = ({left, right}) => {                    <-------
      return (
        <div className="row mb2">
            <div className="col-md-6">
              {left}                      <-------
            </div>                                      .......
            <div className="col-md-6">
              {right}                     <-------
            </div>
          </div>
      )
    };                                                  <-------

    <!-- people-page.js -->
    export default class PeoplePage extends Component {

     ........

      render() {

        if (this.state.hasError) {
          return <ErrorIndicator />
        };

        const itemList = (                              <-Отдельная константа->
          <ItemList 
            onItemSelected={this.onPersonSelected}
            getData={this.swapiService.getAllPeople}        .......
            renderItem={({name, gender, birthYear}) => 
              `${name} (${gender}, ${birthYear})`} />
        );                                                <--------

        const personDetails = (                                   <-Отдельная константа->
          <PersonDetails personId={this.state.selectedPerson} />  <-------
        );

        return (
          <div>
            <Row left={itemList} right={personDetails} />       <-------
            <Row left='left_leg' right='right_leg' />           <-Пример->
            <Row left={<p>Hello</p>} right={<span>Duo</span>}/>   <-Пример->
          </div>
        );
      };
    };



---Children

-Компоненту можно передать одно из свойств, поместив его в тело элемента

<Card>Hi</Card>

-Это свойство доступно через props.children

-Поддерживает любые типы данных: элементы, функции, объекты и др.

    <!-- people-page.js -->
    import React, { Component } from 'react';

    .......

    export default class PeoplePage extends Component {

      swapiService = new SwapiService();

      ..........

      render() {

        if (this.state.hasError) {
          return <ErrorIndicator />
        };

        const itemList = (
          <ItemList 
            onItemSelected={this.onPersonSelected}
            getData={this.swapiService.getAllPeople} >

            {(i) => (                                      <-------
              `${i.name}  (${i.birthYear})`
            )}                                              <-------

          </ItemList>
        );

        const personDetails = (
          <PersonDetails personId={this.state.selectedPerson} />
        );

        return (
          <ErrorBoundry>
            <Row left={itemList} right={personDetails} />
          </ErrorBoundry>
        );
      };
    };

    <!-- item-list.js -->
    import React, { Component } from 'react';
    ............

    export default class ItemList extends Component {

      state = {
        itemList: null
      };

      componentDidMount() {
        const { getData } = this.props;

        getData()
          .then((itemList) => {
            this.setState({
              itemList
            });
        });
      };

      renderItem(arr) {
        return arr.map((item) => {
          const { id } = item;

          const label = this.props.children(item);        <-children->

          return (
            <li className="list-group-item"
                key={id}
                onClick={() => this.props.onItemSelected(id)}>
              {label}
            </li>
          );
        });
      };

      render() {

        const { itemList } = this.state;

        if (!itemList) {
          return <Spinner />
        };

        const items = this.renderItem(itemList);

        return (
          <ul className="item-list list-group">
            {items}
          </ul>
        );
      };
    };

    <!-- error-boundry.js -->
    import React, { Component } from 'react';               <---------

    import './error-boundry.css';

    import ErrorIndicator from '../error-indicator';

    export default class ErrorBoundry extends Component {

      state = {
        hasError: false
      };

      componentDidCatch(error, info) {                ..........
        debugger;

        this.setState({
          hasError: true
        });
      };

      render() {                                        ..........

        if (this.state.hasError) {
          return <ErrorIndicator />
        }

        return this.props.children;
      }
    };                                                  <---------

    <!-- app.js -->
    import React, { Component } from 'react';
    ..........

    export default class App extends Component {

    ..........

      render() {

       ...........

            { planet }

            <PeoplePage />

            <div className="row mb2">
              <div className="col-md-6">
                <ItemList 
                  onItemSelected={this.onPersonSelected}
                  getData={this.swapiService.getAllPlanets} >

                  {(i) => (
                    `${i.name}  (${i.birthYear})`                 <---------
                  )}

                </ItemList>
              </div>
              <div className="col-md-6">
                <PersonDetails personId={this.state.selectedPerson} />
              </div>
            </div>

            <div className="row mb2">
              <div className="col-md-6">
                <ItemList 
                  onItemSelected={this.onPersonSelected}
                  getData={this.swapiService.getAllStarships} >

                  {(i) => (
                    `${i.name}  (${i.birthYear})`                   <---------
                  )}

                </ItemList>
             ................

          </div>
        );
      };  
    };



---Рефакторинг компонента

-Мы вынесли детали получения данных и адреса картинки 
  в отдельные функции

-В таком виде компонент может работать с разными объектами

-Осталось решить, как сконфигурировать, какие именон данные 
  будет отображать компонент 


    <!-- swapi-service.js -->
    export default class SwapiService {
      // Через нижнее подчеркивание говорим другим разработчикам что это
      // приватная часть класса и ее не следует использовать или изменять снаруже   
      _apiBase = 'https://swapi.co/api';
      _imageBase = 'https://starwars-visualguide.com/assets/img';  <-----

      getResource = async (url) => {
        const res = await fetch(`${this._apiBase}${url}`);

        if (!res.ok) {
          throw new Error(`Could not fetch ${url}` + 
            `, received ${res.status}`);
        };

        return res.json();
      };

      getAllPeople = async () => {
        const res = await this.getResource(`/people/`);
        return res.results
          .map(this._transformItem)
          .slice(0, 5);
      };

      getPerson = async (id) => {
        const item = await this.getResource(`/people/${id}/`);
        return this._transformItem(item);
      };

      getAllPlanets = async () => {
        const res = await this.getResource(`/planets/`);
        return res.results
          .map(this._transformPlanet)
          .slice(0, 5);  
      }; /*Передаём уже изменённую коллекцию*/

      getPlanet = async(id) => {
        const planet = await this.getResource(`/planets/${id}/`);
        return this._transformPlanet(planet);
      };

      getAllStarships = async () => {
        const res = await this.getResource(`/starships/`);
        return res.results
          .map(this._transformStarship)
          .slice(0, 5);
      };

      getStarship = async (id) => {
        const starship = await this.getResource(`/starships/${id}/`);
        return this._transformStarship(starship);
      };

      getPersonImage = ({id}) => {                            <-----
        return `${this._imageBase}/characters/${id}.jpg`  
      };                                                      <-----

      getStarshipImage = ({id}) => {                          <-----
        return `${this._imageBase}/starships/${id}.jpg`
      };                                                      <-----

      getPlanetImage = ({id}) => {                            <-----
        return `${this._imageBase}/planets/${id}.jpg`
      };                                                      <-----

      // doesImageExist = async id => {
      //   const data = await fetch(`https://starwars-visualguide.com/assets/img/planets/${id}.jpg`);
      //   if (!data.ok) {
      //     return "https://www.pnglot.com/pngfile/detail/12-120147_venus-planet-pics-about-space-transparent-image-clipart.png";
      //   }
      //   const imgURL = data.url;
      //   return imgURL;
      // };

      _extractId = (item) => {
        // const idRegExp = /\/([0-9]*)\/$/;
        const idRegExp = /\/(\d+)*\/$/;
        return item.url.match(idRegExp)[1];
      };

      _transformPlanet = (planet) => {
        return {
          id: this._extractId(planet),
          name: planet.name,
          population: planet.population,
          rotationPeriod: planet.rotation_period,
          diameter: planet.diameter
        };
      };

      _transformStarship = (starship) => {
        return {
          id: this._extractId(starship),
          name: starship.name,
          model: starship.model,
          manufacturer: starship.manufacturer,
          costInCredits: starship.costInCredits,
          length: starship.length,
          crew: starship.crew,
          passengers: starship.passengers,
          cargoCapacity: starship.cargoCapacity
        };
      };

      _transformItem = (item) => {
        return {
          id: this._extractId(item),
          name: item.name,
          gender: item.gender,
          birthYear: item.birth_year,
          eyeColor: item.eye_color
        };
      };
    };

    <!-- app.js -->
    import React, { Component } from 'react';

    ............

    export default class App extends Component {

      swapiService = new SwapiService();

      state = {
        showRandomPlanet: true,
        hasError: false
      };

      toggleRandomPlanet = () => {
        this.setState((state) => {
          return {
            showRandomPlanet: !state.showRandomPlanet
          };
        });
      };

      componentDidCatch() {
        console.log('componentDidCatch');
        this.setState({
          hasError: true 
        });
      };

      render() {

        if (this.state.hasError) {
          return <ErrorIndicator />
        };

        const planet = this.state.showRandomPlanet ? <RandomPlanet /> : null;

        const { getPerson, getStarship, 
                getPersonImage, getStarshipImage } = this.swapiService;   <-----

        const personDetails = (                         <-----
          <ItemDetails 
            itemId={11}                                 .......
            getData={getPerson}
            getImageUrl={getPersonImage} />
        );                                              <-----

        const starshipDetails = (                       <-----
          <ItemDetails 
            itemId={5}
            getData={getStarship}                       ......
            getImageUrl={getStarshipImage} />
        );                                              <-----

        return (
          <div className="stardb-app">
            <Header />



            <Row                                        <-----
              left={personDetails}                        <---------
              right={starshipDetails} />                <-----

          </div>
        );
      };  
    };

    <!-- item-details.js -->
    import React, { Component } from 'react';

    ...........

    export default class ItemDetails extends Component {

      swapiService = new SwapiService();

      state = {
        item: null,
        loading: true,
        error: false,
        image: null                                   <-------
      };

      componentDidMount() {
        this.updateItem();
      };

      componentDidUpdate(prevProps) {
        if (this.props.itemId !== prevProps.itemId) {
          this.setState({
            loading: true
          });
          this.updateItem();
        }
      };

      onPersenLoaded = (item) => {
        const { getImageUrl } = this.props;           <-------

        this.setState({ 
          item,
          loading: false,
          image: getImageUrl(item)                    <-------
        });
      };

      onError = (err) => {
        this.setState({
          loading: false,
          error: true
        });
      };

      updateItem() {
        const { itemId, getData } = this.props;

        if (!itemId) {
          return;
        }

        getData(itemId)                             <-------
          .then(this.onPersenLoaded)
          .catch(this.onError)
      };

      render() {

        const { item, loading, error, image } = this.state;     <-------

        const hasError = !(loading || error);

        const errorMessage = error ? <ErrorIndicator /> : null;
        const spinner = loading ? <Spinner /> : null;

        const content = hasError 
              ? <PersonView 
                  item={item} 
                  image={image} />                      <-------
              : null;

        return (
          <div className="item-details card">
            {errorMessage}
            {spinner}
            {content}
          </div>
        )
      }
    };

    const PersonView = ({ item, image }) => {           <-------

      const { id, name, gender,
        birthYear, eyeColor } = item;


      return (

        <React.Fragment>
          <img className="item-image"
              src={image}                                 <-------
              alt="character"/>

          <div className="card-body">
            <h4>{name}</h4>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <span className="term">Gender</span>
                <span>{gender}</span>
              </li>
              <li className="list-group-item">
                <span className="term">Birth Year</span>
                <span>{birthYear}</span>
              </li>
              <li className="list-group-item">
                <span className="term">Eye Color</span>
                <span>{eyeColor}</span>
              </li>
            </ul>
            <ErrorButton />
          </div>
        </React.Fragment>
      );
    };



---Работа с props.children

-Компонент может решать, как именно использовать children

-Функция React.Children.map() упрощает обработку props.children

-Child элементы можно заменять, оборачивать в другие компоненты 
  или скрывать (если вернуть null)



---Клонирование элементов

-React элементы нельзя изменять (они считаются immutable)!!!

-...но можно создавать модифицырованные копии при помощи React.cloneElement()

-К примеру, элементам можно добавлять новые свойства

    <!-- app.js -->
    import React, { Component } from 'react';

    import './app.css';

    import Header from '../header';
    import RandomPlanet from '../random-planet';
    import ErrorIndicator from '../error-indicator';

    import ItemDetails, { Record } from '../item-details';      <-Record->
    import SwapiService from '../../services/swapi-service';
    import Row from '../row';

    export default class App extends Component {

      .........

      render() {

        if (this.state.hasError) {
          return <ErrorIndicator />
        };

        const planet = this.state.showRandomPlanet ? <RandomPlanet /> : null;

        const { getPerson, getStarship, 
                getPersonImage, getStarshipImage } = this.swapiService;

        const personDetails = (
          <ItemDetails 
            itemId={11}
            getData={getPerson}
            getImageUrl={getPersonImage} >

            <Record field="gender" label="Gender" />            <---------
            <Record field="eyeColor" label="Eye Color" />       <---------

          </ItemDetails>
        );

        const starshipDetails = (
          <ItemDetails 
            itemId={5}
            getData={getStarship}
            getImageUrl={getStarshipImage} >

            <Record field="model" label="Model" />              <---------
            <Record field="length" label="Length" />            <---------
            <Record field="costInCredits" label="Cost" />       <---------

          </ItemDetails>
        );

        return (
          <div className="stardb-app">
            <Header />

            <Row 
              left={personDetails}
              right={starshipDetails} />

          </div>
        );
      };  
    };

    <!-- item-details.js -->
    import React, { Component } from 'react';

    ..........

    const Record = ({ item, field, label }) => {        <--------
      return (
        <li className="list-group-item">
        <span className="term">{label}</span>           <--------
        <span>{item[field]}</span>                      <--------
      </li>
      )
    };                                                    <--------
    export {Record}                               <--------

    export default class ItemDetails extends Component {

      swapiService = new SwapiService();

      state = {
        item: null,
        loading: true,
        error: false,
        image: null
      };

      componentDidMount() {
        this.updateItem();
      };

      componentDidUpdate(prevProps) {
        if (this.props.itemId !== prevProps.itemId) {
          this.setState({
            loading: true
          });
          this.updateItem();
        }
      };

      onPersenLoaded = (item) => {
        const { getImageUrl } = this.props;

        this.setState({ 
          item,
          loading: false,
          image: getImageUrl(item)
        });
      };

      onError = (err) => {
        this.setState({
          loading: false,
          error: true
        });
      };

      updateItem() {
        const { itemId, getData } = this.props;

        if (!itemId) {
          return;
        }

        getData(itemId)
          .then(this.onPersenLoaded)
          .catch(this.onError)
      };

      render() {

        const { item, loading, error, image } = this.state;
        const { children } = this.props                         <--------

        const hasError = !(loading || error);

        const errorMessage = error ? <ErrorIndicator /> : null;
        const spinner = loading ? <Spinner /> : null;

        const content = hasError 
              ? <PersonView 
                  item={item} 
                  image={image}
                  children={children} />                        <--------
              : null;

        return (
          <div className="item-details card">
            {errorMessage}
            {spinner}
            {content}
          </div>
        )
      }
    };

    const PersonView = ({ item, image, children }) => {     <--------

      const { id, name, gender,
        birthYear, eyeColor } = item;

      return (
        <React.Fragment>
          <img className="item-image"
              src={image}
              alt="character"/>

          <div className="card-body">
            <h4>{name}</h4>
            <ul className="list-group list-group-flush">
            {                                                   <--------
              React.Children.map(children, (child, idx) => {     <--------
                return React.cloneElement(child, {item});       <--------
              })                                                <--------
            }                                                   <--------
            </ul>
            <ErrorButton />
          </div>
        </React.Fragment>
      );
    };



---Компоненты высшего порядка (HOC)

  const hoc = (Wrapper) => {
    return class extends Component {
      render() {
        return <Wrapper {...this.props}/>
      }
    }
  }
  const MyWrappedComponent = hoc (InnerComponent);

-Функция, которая создаёт компоненты и оборачивает существующие

    <!-- item-list.js -->
    import React, { Component } from 'react';

    import './item-list.css';
    import { withData } from '../hoc-helper';                   <---------
    import SwapiService from '../../services/swapi-service';

    const ItemList = (props) => {                                     <---------

      const { data, onItemSelected, children: renderLable } = props;  <---------

      const items = data.map((item) => {                              <---------
        const { id } = item;                                          <---------
        const label = renderLable(item);                              <---------

        return (                                              <---------
          <li className="list-group-item"
              key={id}                                    ......
              onClick={() => onItemSelected(id)}>             <---------
            {label}                                           .........
          </li>
        );                                                    <---------
      });

      return (
          <ul className="item-list list-group">
            {items}
          </ul>
      );
    };

    const { getAllPeople } = new SwapiService();            <---------

    export default withData(ItemList, getAllPeople);        <---------

    <!-- with-data.js --> Новый фаил
    import React, { Component } from 'react';               <---------

    import Spinner from '../spinner';
    import ErrorIndicator from '../error-indicator';

    const withData = (View, getData) => {
      return class extends Component {

        state = {
          data: null                                      ........
        };

        componentDidMount() {

          getData()                             
          .then((data) => {
              this.setState({
                data
              });
          });
        };

        render() {                                      .........

        const { data } = this.state;

        if (!data) {
        return <Spinner />
        };

        return <View {...this.props} data={data}/>
        }
      };
    };

    export default withData;                                <---------





---Рефакторинг компонентоВ

-Обратная сторона "гибкости" это громоздкая конфигурация

-Код будет более читабельным, если вынести детали конфигурации 
  в отдельный компонент

-Для этого можно использовать HOC (компонент высшего порядка) или
  просто написать компонент-обертку вручную

    <!-- app.js -->
    import React, { Component } from 'react';

    import './app.css';

    import Header from '../header';
    import RandomPlanet from '../random-planet';
    import ErrorIndicator from '../error-indicator';

    import ItemDetails, { Record } from '../item-details';             <------
    import SwapiService from '../../services/swapi-service';
    import Row from '../row';
    import ItemList from '../item-list/item-list';

    import {                                                      <------
      PersonDetails, 
      PlanetDetails, 
      StarshipDetails,                                      ........
      PersonList, 
      PlanetList,                                           ..........
      StarshipList 
    } from '../sw-components'                                     <------

    export default class App extends Component {

      swapiService = new SwapiService();

      state = {
        showRandomPlanet: true,
        hasError: false
      };

      toggleRandomPlanet = () => {
        this.setState((state) => {
          return {
            showRandomPlanet: !state.showRandomPlanet
          };
        });
      };

      componentDidCatch() {
        console.log('componentDidCatch');
        this.setState({
          hasError: true 
        });
      };

      render() {

        if (this.state.hasError) {
          return <ErrorIndicator />
        };

        const planet = this.state.showRandomPlanet ? <RandomPlanet /> : null;


        return (
          <div className="stardb-app">
            <Header />

            <PersonDetails itemId={11} />                                     <------

            <PlanetDetails itemId={5} />                                      <------

            <StarshipDetails itemId={9} />                                    <------

            <PersonList>                                                  <------
              {({name}) => <span>{name}</span> }    
            </PersonList>                                                 <------

            <StarshipList>                                              <------
              {({name}) => <span>{name}</span> }
            </StarshipList>                                             <------

            <PlanetList>                                                <------
              {({name}) => <span>{name}</span> }
            </PlanetList>                                               <------


            {/* <Row 
              left={personDetails}
              right={starshipDetails} /> */}

          </div>
        );
      };  
    };

    <!-- item-list.js -->
    import React from 'react';

    import './item-list.css';

    const ItemList = (props) => {

      const { data, onItemSelected, children: renderLable } = props;

      const items = data.map((item) => {
        const { id } = item;
        const label = renderLable(item);

        return (
          <li className="list-group-item"
              key={id}
              onClick={() => onItemSelected(id)}>
            {label}
          </li>
        );
      });

      return (
          <ul className="item-list list-group">
            {items}
          </ul>
      );
    };
    export default ItemList;

    <!-- item-listS.js -->
    import React from 'react';                                  <-------

    import ItemList from '../item-list';
    import { withData } from '../hoc-helper';
    import SwapiService from '../../services/swapi-service';

    const swapiService = new SwapiService();                    ........

    const {
      getAllPeople,
      getAllStarships,
      getAllPlanets
    } = swapiService;                                           ........

    const PersonList = withData(ItemList, getAllPeople);

    const PlanetList = withData(ItemList, getAllPlanets);

    const StarshipList = withData(ItemList, getAllStarships);

    export { 
      PersonList, 
      PlanetList, 
      StarshipList 
    };                                                          <------

    <!-- details.js -->
    import React from 'react';                                  <------

    import ItemDetails, {Record} from '../item-details';
    import SwapiService from '../../services/swapi-service';

    const swapiService = new SwapiService();

    const {
      getPerson,
      getPlanet,
      getStarship,                                          ........
      getPersonImage,
      getPlanetImage,
      getStarshipImage
    } = swapiService;

    const PersonDetails = ({itemId}) => {
      return (
        <ItemDetails 
          itemId={itemId}                                   .........
          getData={getPerson}
          getImageUrl={getPersonImage} >

          <Record field="gender" label="Gender" />
          <Record field="eyeColor" label="Eye Color" />

        </ItemDetails>
      );
    };

    const PlanetDetails = ({itemId}) => {                     .........
      return (
        <ItemDetails 
          itemId={itemId}
          getData={getPlanet}
          getImageUrl={getPlanetImage} >

          <Record field="population" label="Population" />
          <Record field="rotationPerion" label="Rotation Period" />
          <Record field="diameter" label="Diameter" />

        </ItemDetails>
      );
    };

    const StarshipDetails = ({itemId}) => {                   ........
      return (
        <ItemDetails 
          itemId={itemId}
          getData={getStarship}
          getImageUrl={getStarshipImage} >

          <Record field="model" label="Model" />
          <Record field="length" label="Length" />
          <Record field="costInCredits" label="Cost" />

        </ItemDetails>
      );
    };

    export { 
      PersonDetails, 
      PlanetDetails, 
      StarshipDetails 
    };                                                     <------ 




---Композиция HOC и композиция функции
-НОС = HIgher Order Component

-Композиция - применение одной функции к результату другой: f(g(x));
  const comp = (x) => f(g(x))

-Компоненты высшего порядка это обычные функции, который возвращают
  компоненты. 

-Так мы можем применять несколько "эффектов" 

    <!-- app.js -->
    import React, { Component } from 'react';

    ............

    export default class App extends Component {

     ............

      render() {

        if (this.state.hasError) {
          return <ErrorIndicator />
        };

        const planet = this.state.showRandomPlanet ? <RandomPlanet /> : null;


        return (
          <ErrorBoundry>
            <div className="stardb-app">
              <Header />

              <PersonDetails itemId={11} />

              <PlanetDetails itemId={5} />

              <StarshipDetails itemId={9} />

              <PersonList />                           <----------

              <StarshipList />                          <----------

              <PlanetList />                            <----------

            </div>
          </ErrorBoundry>
        );
      };  
    };

    <!-- item-listS.js -->
    import React from 'react';

    import ItemList from '../item-list';
    import { withData } from '../hoc-helper';
    import SwapiService from '../../services/swapi-service';

    const swapiService = new SwapiService();

    const {
      getAllPeople,
      getAllStarships,
      getAllPlanets
    } = swapiService;

    const withChildFunction = (Wrapped, fn) => {      <----------
      function WithChildFunction(props) {             <---------
        return (
          <Wrapped {...props}>                      <----------
            {fn}
          </Wrapped>                                  <----------
        )
      };
      return WithChildFunction;
    };                                                <----------

    const renderName = ({name}) => <span>{name}</span>;                           <----------
    const renderModelAndName = ({model, name}) => <span>{name} ({model})</span>;  <----------

    // const ListWithChildren = withChildFunction(ItemList, renderName);      <----------
    const PersonList = withData( 
                        withChildFunction(ItemList, renderName), 
                        getAllPeople);                                        <----------

    const PlanetList = withData(                                            <----------
                        withChildFunction(ItemList, renderName), 
                        getAllPlanets);                                       <----------

    const StarshipList = withData(                                            <----------
                        withChildFunction(ItemList, renderModelAndName), 
                        getAllStarships);                                     <----------

    export { 
      PersonList, 
      PlanetList, 
      StarshipList 
    };



---Контекст (Context) ч.1

-Контекст нужен для того что бы решить проблему "глобальных" данный

-Вместо того чтобы передавать props через все слои приложение, 
  данные можно передавать через Контекст

-С помощью контекста мы можем сделать так, чтобы компоненты не создавали
  объекты сервиса, а получили его


---Контекст (Context) ч.2

--Использование Context API

const {Provider, Consumer} = React.createService()

<Provider value={someValue}>
   ........ провайдер оборачивает часть приложения
</Provider>


<Consumer>
{
  (someValue) => <MyComponent data={someValue}/>
}
</Consumer>


    <!-- app.js -->
    import React, { Component } from 'react';

    .......

    import { SwapiServiceProvider } from '../swapi-service-context'; <-------
    ........

    render() {

        if (this.state.hasError) {
          return <ErrorIndicator />
        };

        return (
          <ErrorBoundry>                                      
            <SwapiServiceProvider value={this.swapiService}>  <------
              <div className="stardb-app">
                <Header />

                <PersonDetails itemId={11} />

                <PlanetDetails itemId={5} />

                <StarshipDetails itemId={9} />

                <PersonList />

                <StarshipList />

                <PlanetList />

              </div>
            </SwapiServiceProvider>                           <------
          </ErrorBoundry>
        );
      };  

    <!-- swapi-service-context.js -->
    import React from 'react';                <-------

    const {
      Provider: SwapiServiceProvider,
      Consumer: SwapiServiceConsumer        .........
    } = React.createContext();

    export {
      SwapiServiceProvider,
      SwapiServiceConsumer
    };                                          <-------

    <!-- details.js -->
    import React from 'react';

    import ItemDetails, { Record } from '../item-details';
    import { SwapiServiceConsumer } from '../swapi-service-context';   <-----

    //  const swapiService = new SwapiService()     <-Удален->

    const PersonDetails = ({itemId}) => {
      return (
        <SwapiServiceConsumer>                              <-------
          {
            ({getPerson, getPersonImage}) => {              <-------
              return (
                <ItemDetails 
                  itemId={itemId}
                  getData={getPerson}
                  getImageUrl={getPersonImage} >

                  <Record field="gender" label="Gender" />
                  <Record field="eyeColor" label="Eye Color" />
                </ItemDetails>
              )
            } 
          }
        </SwapiServiceConsumer>                           <-------
      );
    };

    const PlanetDetails = ({itemId}) => {
      return (
        <SwapiServiceConsumer>                            <-------
          {
            ({getPlanet, getPlanetImage}) => {            <-------
              return (
                <ItemDetails 
                  itemId={itemId}
                  getData={getPlanet}
                  getImageUrl={getPlanetImage} >

                  <Record field="population" label="Population" />
                  <Record field="rotationPerion" label="Rotation Period" />
                  <Record field="diameter" label="Diameter" />
                </ItemDetails>
              )
            }
          }
        </SwapiServiceConsumer>                           <-------

      );
    };

    const StarshipDetails = ({itemId}) => {
      return (
        <SwapiServiceConsumer>                            <-------
          {
            ({getStarship, getStarshipImage}) => {        <-------
              return (
                <ItemDetails 
                  itemId={itemId}
                  getData={getStarship}
                  getImageUrl={getStarshipImage} >

                  <Record field="model" label="Model" />
                  <Record field="length" label="Length" />
                  <Record field="costInCredits" label="Cost" />

                </ItemDetails>
              )
            }
          }
        </SwapiServiceConsumer>                           <-------

      );
    };

    export { 
      PersonDetails, 
      PlanetDetails, 
      StarshipDetails 
    };



---HOC + Context

-Обязанность получать данные из контекста можно вынести в компонент
  высшего порядка

const withValueFromContext = (Wrapper) => {
  return (
    <Consumer>
      { (value) => <Wrapped value={value} /> }
    </Consumer>
  )
}

    <!-- details.js -->
    <-Удален->

    <!-- with-swapi-service.js -->
    import React from 'react';                                      <------
    import { SwapiServiceConsumer } from '../swapi-service-context';

    const withSwapiService = (Wrapped) => {
      function WithSwapiService(props) {                            <-------
        return (
          <SwapiServiceConsumer>
            {
              (swapiService) => {
                return (
                  <Wrapped {...props} swapiService={swapiService} />  .....
                )
              }
            }
          </SwapiServiceConsumer>
        )
      };
      return WithSwapiService;
    };

    export default withSwapiService;                              <------


    <!-- person-details.js -->
    import React from 'react';                                <-------
    import ItemDetails, { Record } from '../item-details';
    import { withSwapiService } from '../hoc-helper';

    const PersonDetails = ({itemId, swapiService}) => {       <-------
      const {getPerson, getPersonImage} = swapiService;       <-------

      return (
        <ItemDetails 
          itemId={itemId}
          getData={getPerson}
          getImageUrl={getPersonImage} >

          <Record field="gender" label="Gender" />
          <Record field="eyeColor" label="Eye Color" />
        </ItemDetails>
      )   
    };

    export default withSwapiService(PersonDetails);             <-------

    <!--  planet-details.js -->
    import React from 'react';                                      <------
    import ItemDetails, { Record } from '../item-details';
    import { SwapiServiceConsumer } from '../swapi-service-context';

    const PlanetDetails = ({itemId}) => {
      return (
        <SwapiServiceConsumer>
          {
            ({getPlanet, getPlanetImage}) => {                      .....
              return (
                <ItemDetails 
                  itemId={itemId}
                  getData={getPlanet}
                  getImageUrl={getPlanetImage} >                    .......

                  <Record field="population" label="Population" />
                  <Record field="rotationPerion" label="Rotation Period" />
                  <Record field="diameter" label="Diameter" />
                </ItemDetails>
              )
            }
          }
        </SwapiServiceConsumer>

      );
    };

    export default PlanetDetails;                             <------

    <!-- starship-details.js -->
    import React from 'react';                                      <------
    import ItemDetails, { Record } from '../item-details';
    import { SwapiServiceConsumer } from '../swapi-service-context';

    const StarshipDetails = ({itemId}) => {
      return (
        <SwapiServiceConsumer>
          {
            ({getStarship, getStarshipImage}) => {
              return (
                <ItemDetails 
                  itemId={itemId}                               .......
                  getData={getStarship}                     
                  getImageUrl={getStarshipImage} >

                  <Record field="model" label="Model" />
                  <Record field="length" label="Length" />
                  <Record field="costInCredits" label="Cost" />   .......

                </ItemDetails>
              )
            }
          }
        </SwapiServiceConsumer>

      );
    };

    export default StarshipDetails;                           <------



---Трансформация свойств в HOC

-HOC может переобразовывать свойства перед тем, как передавать
  их компоненту

-Например, изменять их имена и выбирать, какие именно свойства 
  нужно передать

-При помощи дополнитеоьной функции (mapMethodsToProps) можно определять
  это поведение для каждого компонента

    <!-- app.js -->
    ........

    export default class App extends Component {

      // swapiService = new SwapiService();       
      swapiService = new DummySwapiService();       <-Для Теста->

      ........
    }

    <!-- person-details.js -->
    import React from 'react';
    import ItemDetails, { Record } from '../item-details';
    import { withSwapiService } from '../hoc-helper';

    const PersonDetails = (props) => {                    <--------
      return (
        <ItemDetails {...props} >                         <--------
          <Record field="gender" label="Gender" />
          <Record field="eyeColor" label="Eye Color" />
        </ItemDetails>
      )   
    };

    const mapMethodsToProps = (swapiService) => {         <--------
      return {
        getData: swapiService.getPerson,
        getImageUrl: swapiService.getPersonImage        ......
      }
    };                                                    <--------

    export default withSwapiService(PersonDetails, mapMethodsToProps); <------

    <!-- planet-details.js -->
    import React from 'react';
    import ItemDetails, { Record } from '../item-details';
    import { withSwapiService } from '../hoc-helper';

    const PlanetDetails = (props) => {                            <------
      return (
        <ItemDetails {...props} >                                   <------
          <Record field="population" label="Population" />
          <Record field="rotationPeriod" label="Rotation Period" />
          <Record field="diameter" label="Diameter" />
        </ItemDetails>
      )
    };

    const mapMethodsToProps = (swapiService) => {                 <------
      return {
        getData: swapiService.getPlanet,
        getImageUrl: swapiService.getPlanetImage                ......
      }
    };                                                            <------

    export default withSwapiService(PlanetDetails, mapMethodsToProps); <-----

    <!-- starship-details.js -->
    import React from 'react';
    import ItemDetails, { Record } from '../item-details';
    import { withSwapiService } from '../hoc-helper'; 

    const StarshipDetails = (props) => {                  <------
      return (
        <ItemDetails {...props} >                         <------
          <Record field="model" label="Model" />
          <Record field="length" label="Length" />
          <Record field="costInCredits" label="Cost" />
        </ItemDetails>
      )
    };

    const mapMethodsToProps = (swapiService) => {           <------
      return {
        getData: swapiService.getStarship,
        getImageUrl: swapiService.getStarshipImage        .......
      }
    };                                                      <------

    export default withSwapiService(StarshipDetails, mapMethodsToProps); <---

    <!-- item-listS.js -->
    import React from 'react';
    import ItemList from '../item-list';
    import { withData, withSwapiService } from '../hoc-helper';   <-----

    ..........


    const mapPersonMethodsToProps = (swapiService) => {         <-----
      return {
        getData: swapiService.getAllPeople,                   ......
      }
    };                                                          <-----

    const mapPlanetMethodsToProps = (swapiService) => {       <-----
      return {
        getData: swapiService.getAllPlanets,                  .....
      }
    };                                                        <-----

    const mapStarshipMethodsToProps = (swapiService) => {     <-----
      return {
        getData: swapiService.getAllStarships,                .....
      }
    };                                                        <-----

    const PersonList = withSwapiService(                      <-----
                          withData( 
                            withChildFunction(ItemList, renderName)),
                        mapPersonMethodsToProps);                     <-----

    const PlanetList = withSwapiService(                              <-----
                          withData( 
                            withChildFunction(ItemList, renderName)),
                        mapPlanetMethodsToProps);                     <-----

    const StarshipList = withSwapiService(                            <-----
                            withData( 
                              withChildFunction(ItemList, renderModelAndName)),
                          mapStarshipMethodsToProps);                 <-----

    export { 
      PersonList, 
      PlanetList, 
      StarshipList 
    };

    <!-- with-data.js -->
    ........

    const withData = (View) => {              <--------
      return class WithData extends Component {   <--------

        state = {
          data: null,
          error: false,
          loading: true
        };

        componentDidMount() {
          this.props.getData()                  <--------
          .then((data) => {
              this.setState({
                data,
                loading: false
              });
          });
        };

        onError = (err) => {
          this.setState({
            loading: false,
            error: true
          });
        };

        render() { .... }



---Обновление контекста

-Значение и контекст можно обновлять, как любое другое свойство компонента

-Компоненты должны поддерживать изменение нужных свойств

-componentDidUpdate() - функция в которой можно проверить, 
  какие свойства изменились

    <!-- app.js -->
    import React, { Component } from 'react';

    .......

    import { SwapiServiceProvider } from '../swapi-service-context';

    import {
      PersonDetails, 
      PlanetDetails, 
      StarshipDetails,
      PersonList, 
      PlanetList, 
      StarshipList 
    } from '../sw-components'

    export default class App extends Component {

                    <-new swapiService-перенесён в state->  
      state = {
        showRandomPlanet: true,
        hasError: false,
        // swapiService: new SwapiService(),      <--------
        swapiService: new DummySwapiService()     <--------
      };

      onServiceChange = () => {
        this.setState(({ swapiService }) => {

          const Service = swapiService instanceof SwapiService ?  <--------
                            DummySwapiService : SwapiService;     <--------

          console.log('switched to', Service.name);

          return {
            swapiService: new Service()                 <--------
          };
        });
      };

      toggleRandomPlanet = () => {
        this.setState((state) => {
          return {
            showRandomPlanet: !state.showRandomPlanet
          };
        });
      };

      componentDidCatch() {
        console.log('componentDidCatch');
        this.setState({
          hasError: true 
        });
      };

      render() {

        if (this.state.hasError) {
          return <ErrorIndicator />
        };

        return (
          <ErrorBoundry>
            <SwapiServiceProvider value={this.state.swapiService}>  <--------
              <div className="stardb-app">
                <Header onServiceChange={this.onServiceChange} />

                <PersonDetails itemId={11} />

                <PlanetDetails itemId={5} />

                <StarshipDetails itemId={9} />

                <PersonList />

                <StarshipList />

                <PlanetList />
              </div>
            </SwapiServiceProvider>
          </ErrorBoundry>
        );
      };  
    };

    <!-- header.js -->
    import React from 'react';

    import './header.css';

    const Header = ({ onServiceChange }) => {
      return (
        <div className="header d-flex">
          <h3>
            <a href="#">
              Star DB
            </a>
          </h3>
          <ul className="d-flex">
            <li>
              <a href="#">People</a>
            </li>
            <li>
              <a href="#">Planets</a>
            </li>
            <li>
              <a href="#">Starships</a>
            </li>
          </ul>

          <button                                   <--------
              onClick={onServiceChange}
              className="btn btn-primary btn-sm">   .......
            Change Service
          </button>
        </div>                                      <--------
      );
    };

    export default Header;

    <!-- with-data.js -->
    import React, { Component } from 'react';

    import Spinner from '../spinner';
    import ErrorIndicator from '../error-indicator';

    const withData = (View) => {
      return class WithData extends Component {

        state = {
          data: null,
          error: false,
          loading: true
        };

        componentDidUpdate(prevProps) {                     <--------
          if (this.props.getData !== prevProps.getData) {
            this.setState({
              loading: true                                 <--------
            });
            this.update();                                  <--------
          };
        };                            

        componentDidMount() {                               <--------
          this.update();                                    <--------
        };

        update() {                                          <--------
          this.props.getData()
            .then((data) => {
                this.setState({
                  data,
                  loading: false
                });
            });
        };                                                  <--------

        onError = (err) => {
          this.setState({
            loading: false,
            error: true
          });
        };

        render() {
          const { data, error, loading } = this.state;

          const hasError = !(loading || error);
          const errorMessage = error ? <ErrorIndicator /> : null;
          const spinner = loading ? <Spinner /> : null;

          const content = hasError
                ? <View {...this.props} data={data} /> 
                : null;

          return (
            <div>
              {errorMessage}
              {spinner}
              {content}
            </div>
          )
        }
      };
    };

    export default withData;

    <!-- item-details.js -->
    ..........

    export default class ItemDetails extends Component {

      state = {
        item: null,
        loading: true,
        error: false,
        image: null
      };

      componentDidMount() {
        this.updateItem();
      };

      componentDidUpdate(prevProps) {
        if (this.props.itemId !== prevProps.itemId ||
            this.props.getData !== prevProps.getData ||           <-------
            this.props.getImageUrl !== prevProps.getImageUrl) {   <-------
          this.setState({
            loading: true
          });
          this.updateItem();
        }
      };

      onPersenLoaded = (item) => {

        ..............
    }



---Рефакторинг

Опытные программисты рассматривают систему как историю, которую они должны 
  рассказать, а не как программу, которую нужно написать.
Они используют средства выбранного ими языка программирования для 
  конструирования гораздо более богатого и выразительного языка,
  подходящего для этого повествования.
                                                Robert Martin

    <!-- app.js -->
    import React, { Component } from 'react';
    import './app.css';

    import Header from '../header';
    import RandomPlanet from '../random-planet';
    import ErrorIndicator from '../error-indicator';
    import SwapiService from '../../services/swapi-service';
    import DummySwapiService from '../../services/dummy-swapi-service';
    import ErrorBoundry from '../error-boundry';

    import { PeoplePage, PlanetPage, StarshipPage } from '../pages';      <-----
    import { SwapiServiceProvider } from '../swapi-service-context';

    export default class App extends Component {

      state = {
        hasError: false,
        swapiService: new SwapiService(),
        // swapiService: new DummySwapiService()
      };

      onServiceChange = () => {
        this.setState(({ swapiService }) => {

          const Service = swapiService instanceof SwapiService ?
                            DummySwapiService : SwapiService;

          return {
            swapiService: new Service()
          };
        });
      };

      componentDidCatch() {
        this.setState({
          hasError: true 
        });
      };

      render() {

        if (this.state.hasError) {
          return <ErrorIndicator />
        };

        return (
          <ErrorBoundry>
            <SwapiServiceProvider value={this.state.swapiService}>
              <div className="stardb-app">
                <Header onServiceChange={this.onServiceChange} />

                <RandomPlanet />                                    <-----

                <PeoplePage />                                      <-----
                <PlanetPage />                                      <-----
                <StarshipPage />                                    <-----

              </div>
            </SwapiServiceProvider>
          </ErrorBoundry>
        );
      };  
    };

    <!-- people-page.js -->
    import React, { Component } from 'react';                       <-----

    import Row from '../row';
    import { PersonDetails, PersonList } from '../sw-components'

    export default class PeoplePage extends Component {

      state = {
        selectedItem: null
      };

      onItemSelected = (selectedItem) => {                         ........
        this.setState({ selectedItem });
      };

      render() {
        const { selectedItem } = this.state;
        return (
          <Row 
            left={<PersonList onItemSelected={this.onItemSelected}/>}
            right={<PersonDetails itemId={selectedItem} />} />
        )
      };
    };                                                              <-----

    <!-- planet-page.js -->
    import React, { Component } from 'react';                       <------

    import Row from '../row';
    import { PlanetDetails, PlanetList } from '../sw-components'

    export default class PlanetPage extends Component {

      state = {
        selectedItem: null
      };

      onItemSelected = (selectedItem) => {
        this.setState({ selectedItem });                          ........
      };

      render() {
        const { selectedItem } = this.state;
        return (
          <Row 
            left={<PlanetList onItemSelected={this.onItemSelected}/>}
            right={<PlanetDetails itemId={selectedItem} />} />
        )
      };
    };                                                              <------

    <!-- starship-page.js -->
    import React, { Component } from 'react';                         <-----

    import Row from '../row';
    import { StarshipDetails, StarshipList } from '../sw-components'

    export default class StarshipPage extends Component {

      state = {
        selectedItem: null
      };

      onItemSelected = (selectedItem) => {                            ......
        this.setState({ selectedItem });
      };

      render() {
        const { selectedItem } = this.state;
        return (
          <Row 
            left={<StarshipList onItemSelected={this.onItemSelected}/>}
            right={<StarshipDetails itemId={selectedItem} />} />
        )
      };
    };                                                                <-----

    <!-- with-data.js -->
    import React, { Component } from 'react';

    import Spinner from '../spinner';
    import ErrorIndicator from '../error-indicator';

    const withData = (View) => {
      return class WithData extends Component {

        state = {
          data: null,
          error: false,
          loading: true
        };

        componentDidUpdate(prevProps) {
          if (this.props.getData !== prevProps.getData) {
            this.setState({
              loading: true
            });
            this.update();
          };
        };

        componentDidMount() {
          this.update();
        };

        update() {
          this.setState({                                         <--------
            loading: true,
            error: false
          });                                                     <--------

          this.props.getData()
            .then((data) => {
              this.setState({
                data,
                loading: false
              });
            })
            .catch(() => {                                         <--------
              this.setState({
                error: true,
                loading: false
              });
            })                                                    <--------
        };

        onError = (err) => {
          this.setState({
            loading: false,
            error: true
          });
        };

        render() {
          const { data, error, loading } = this.state;

          const hasError = !(loading || error);
          const errorMessage = error ? <ErrorIndicator /> : null;
          const spinner = loading ? <Spinner /> : null;

          const content = hasError
                ? <View {...this.props} data={data} /> 
                : null;

          return (
            <div>
              {errorMessage}
              {spinner}
              {content}
            </div>
          )
        }
      };
    };

    export default withData;



---Рефакторинг НОС

-Техника, которую используем называется "частично примененные функции"
  (partially applied functions)

const add = (a, b) => a + b;
add(1, 2);

Или:

cosnt add = (a) => (b) => a + b  --> пример функции
add(1)(2);

-Такие функции принимают часть аргументов и возвращают 
  новые функции - с меньшим количеством аргументов

    <!-- item-listS.js -->
    ........


    const PersonList = withSwapiService(mapPersonMethodsToProps)(         <-------
      withData( 
        withChildFunction(renderName)(                                    <-------
          ItemList)));                                                    <-------

    const PlanetList = withSwapiService(mapPlanetMethodsToProps)(         <-------
        withData( 
          withChildFunction(renderName)(                                  <-------
            ItemList)));                                                  <-------

    const StarshipList = withSwapiService(mapStarshipMethodsToProps)(     <-------
          withData( 
            withChildFunction(renderModelAndName)(                        <-------
              ItemList)));                                                <-------


    // const PersonList = withSwapiService(
    //                       withData( 
    //                         withChildFunction(ItemList, renderName)),
    //                     mapPersonMethodsToProps);
    // const PlanetList = withSwapiService(
    //                       withData( 
    //                         withChildFunction(ItemList, renderName)),
    //                     mapPlanetMethodsToProps);

    // const StarshipList = withSwapiService(
    //                         withData( 
    //                           withChildFunction(ItemList, renderModelAndName)),
    //                       mapStarshipMethodsToProps);

    export { 
      PersonList, 
      PlanetList, 
      StarshipList 
    };

    <!-- with-swapi-service.js -->
    import React from 'react';
    import { SwapiServiceConsumer } from '../swapi-service-context';

    const withSwapiService = (mapMethodsToProps) => (Wrapped) => {        <-------
      function WithSwapiService(props) {
        return (
          <SwapiServiceConsumer>
            {
              (swapiService) => {
                const serviceProps = mapMethodsToProps(swapiService);

                return (
                  <Wrapped {...props} {...serviceProps} />
                )
              }
            }
          </SwapiServiceConsumer>
        )
      };
      return WithSwapiService;
    };

    export default withSwapiService;

    <!-- starship-details.js -->
    ......

    const mapMethodsToProps = (swapiService) => {
      return {
        getData: swapiService.getStarship,
      ..........
    };

    export default withSwapiService(mapMethodsToProps)(StarshipDetails);  <-------

    <!-- person-details.js -->
    ........

    const mapMethodsToProps = (swapiService) => {
      return {
        getData: swapiService.getPerson,
        getImageUrl: swapiService.getPersonImage
      }
    };

    export default withSwapiService(mapMethodsToProps)(PersonDetails);  <--------

    <!-- planet-details.js -->
    .......

    const mapMethodsToProps = (swapiService) => {
      return {
        getData: swapiService.getPlanet,
        getImageUrl: swapiService.getPlanetImage
      }
    };

    export default withSwapiService(mapMethodsToProps)(PlanetDetails);  <------



---Функция compose()

-Реализует композицию в виде функции

const = (...funcs) => (comp) => {
  return funcs.reduceRight(
    (wrapped, f) => f(wrapped), comp);
};

const MyComp = compose(
                  withService,
                  withData,
                  withChild(renderName)
                )(SimpleComponent);

Пример:
compose(a, b, c)(value);
  эквивалентен:
a(b(c(value)));

Пример:
const arr = ['a', 'b', 'c'];
const res = arr.reduceRight((prevResult, value) => {
  return prevResult + value;
});
console.log(res);
Получим: cba

Пример:
const arr = ['a', 'b', 'c'];
const res = arr.reduceRight((prevResult, value) => {
  console.log(`prevResult=${prevResult}`,
                `value=${value}`,
                `will return ${prevResult + value}`)
  return prevResult + value;
});
console.log('result is', res);

Получим:
prevResult=c value=b will return cb
prevResult=cb value=a will return cba
result is cba

    <!-- item-listS.js -->
    ........

    <-withChildFunction перенесена в отдьльный файл->


    const PersonList = compose(                                       <-----
                          withSwapiService(mapPersonMethodsToProps),  <-----
                          withData,                                   <-----
                          withChildFunction(renderName)               <-----
                        )(ItemList);                                  <-----

    const PlanetList = compose(                                       <-----
                          withSwapiService(mapPlanetMethodsToProps),  <-----
                          withData,                                   <-----
                          withChildFunction(renderName)               <-----
                        )(ItemList);                                  <-----

    const StarshipList = compose(                                       <-----
                            withSwapiService(mapStarshipMethodsToProps),  <-----
                            withData,                                   <-----
                            withChildFunction(renderModelAndName)         <-----
                          )(ItemList);                                  <-----

    // const PersonList = withSwapiService(mapPersonMethodsToProps)(
    //                     withData( 
    //                       withChildFunction(renderName)(
    //                         ItemList)));

    // const PlanetList = withSwapiService(mapPlanetMethodsToProps)(
    //                     withData( 
    //                       withChildFunction(renderName)(
    //                         ItemList)));

    // const StarshipList = withSwapiService(mapStarshipMethodsToProps)(
    //                       withData( 
    //                         withChildFunction(renderModelAndName)(
    //                           ItemList)));

    export { 
      PersonList, 
      PlanetList, 
      StarshipList 
    };

    <!-- with-child-function.js -->
    import React from 'react';                        <-------

    const withChildFunction = (fn) => (Wrapped) => {
      function WithChildFunction(props) {
        return (
          <Wrapped {...props}>                        .........
          <Wrapped {...props}>                        .........
          <Wrapped {...props}>                        .........
            {fn}
          </Wrapped>
        )
      }
      return WithChildFunction;
    };

    export default withChildFunction;                   <-------

    <!-- compose.js -->
    const compose = (...funcs) => (comp) => {         <-------
      return funcs.reduceRight(
        (prevResult, f) => f(prevResult), comp);      ........
    };

    export default compose;                           <-------



---defaultProps

-Позволяет установить значения по-умолчанию для свойств

const Comp = ({ name }) => (<p>{name}<p>);
Comp.defaultProps = {
  name: 'AAA'
}
или:
static defaultProps = {
  name: 'AAA'
}

>Отрендерит Hi AAA
<Comp />

    <!-- item-list.js -->
    import React from 'react';

    import './item-list.css';

    const ItemList = (props) => {

      const { data, onItemSelected, children: renderLable } = props;

      const items = data.map((item) => {
     .........

    };

    ItemList.defaultProps = {                           <-------
      onItemSelected: () => {}
    };                                                  <-------

    export default ItemList;

    <!-- people-page.js -->
    .......
    .....
    <Row 
      left={<PersonList onItemSelected={this.onItemSelected} />} <-При отсутствии onItemSelected не будет ошибки->
      right={<PersonDetails itemId={selectedItem} />} />
    };

    <!-- random-planet.js -->
    .......
    export default class RandomPlanet extends Component {

      static defaultProps = {                   <-------
        updateInterval: 6000
      };                                        <-------

      swapiService = new SwapiService();

      state = {
        planet: {},
        loading: true,
        error: false
      };

      componentDidMount() {
        const { updateInterval } = this.props;                    <-------
        this.updatePlanet();
        this.interval = setInterval(this.updatePlanet, updateInterval); <-------
      };
      ........
    }
    // RandomPlanet.defaultProps = {                    <------
    //   updateInterval: 6000
    // };                                               <------



---propTypes

-Позволяет проверить значения свойств (props), которые получает компонент

const Comp = ({ name }) => (<p>{name}<p>);
Comp.propTypes = {
  name: (props, propName, compName) => {...}
}

-Проверка срабатывает После defaultProps

-Функция-валидатор возвращает null или Error

    <!-- random-planet.js -->
    ........
    export default class RandomPlanet extends Component {

      static defaultProps = {
        updateInterval: 6000
      };

      static propTypes = {                                      <-------
        updateInterval: (props, propName, componentName) => {
          const value = props[propName];

          if (typeof value === 'number' && !isNaN(value)) {         ......
            return null;
          }
          return new TypeError(`${componentName}: ${propName} must be number`);
        }
      };                                                          <-------
    .......



---NPM Установка пакета prop-types

-npm install prop-types



---Библиотека prop-types

-Библиотека prop-types - набор стандартных функций-валидаторов

MyComponent.propTypes = {
  'some_number': PropTypes.number,
  'some_mandatory_number': PropTypes.number.isRequired
}

-Есть другие библиотеки, с дополнительными валидаторами.
  Пример: airbnb-prop-types

    <!-- random-planet.js -->
    import React, { Component } from 'react';
    import PropTypes from 'prop-types';                       <------

    import SwapiService from '../../services/swapi-service';

    import './random-planet.css';
    import Spinner from '../spinner/spinner';
    import ErrorIndicator from '../error-indicator';

    export default class RandomPlanet extends Component {

      static defaultProps = {
        updateInterval: 6000
      };

      static propTypes = {                              <------
        updateInterval: PropTypes.number                <------
      };
    ........

    <!-- row.js -->
    import React from 'react';
    import PropTypes from 'prop-types';       <-------

    import './row.css'

    const Row = ({left, right}) => {
      return (
        .......
      )
    };

    Row.propTypes = {                         <-------
      left: PropTypes.node,
      right: PropTypes.node
    };                                        <-------

    export default Row;

    <!-- item-list.js -->
    import React from 'react';
    import PropTypes from 'prop-types';             <-------

    import './item-list.css';

    const ItemList = (props) => {

      const { data, onItemSelected, children: renderLable } = props;

        ............

    };

    ItemList.defaultProps = {                   
      onItemSelected: () => {}
    };

    ItemList.propTypes = {                                  <-------
      onItemSelected: PropTypes.func,                         <-------
      data: PropTypes.arrayOf(PropTypes.object).isRequired,   <-------
      children: PropTypes.func.isRequired                       <-------
    }

    export default ItemList;



---React Hooks

-Хуки дают возможность компонентам-функциям работать со состоянием,
  жизненным циклом и контекстом.

-Пример Хука:
const HookSwitcher = () => {
  const [num, setNum] = useState(42);
  return <button onClick={setNum(100)}>{num} ....
}




-------Routing (МАРШРУТИЗАЦИЯ)

-Роутинг - переключение между виртуальными "страницами" UI приложения

-Роутинг нужен, чтобы упростить структуру приложения и организовать 
  навигацию

-В (SPG) Single Page Applicatino страница, одна и она не перезагружается



---Основы React Router

-Пример роутинга для приложения:

<Router>
  <Route path="/blog" component={Blog} />
  <Route path="/about" component={About} />
  <Route path="/shop" component={Shop} />
</Router>

-React Router это не часть React - это дополнительная библиотека.
  Есть и другие библиотеки для роутинга (к примеру, UI-Router)

    <!-- app.js -->
    import React, { Component } from 'react';

    ........

    import { BrowserRouter as Router, Route } from 'react-router-dom';  <--------

    export default class App extends Component {

      ...............

      render() {

        if (this.state.hasError) {
          return <ErrorIndicator />
        };

        return (
          <ErrorBoundry>
            <SwapiServiceProvider value={this.state.swapiService}>
              <Router>
                <div className="stardb-app">
                  <Header onServiceChange={this.onServiceChange} />
                  <RandomPlanet />

                  <Route path="/people" component={PeoplePage} />         <--------
                  <Route path="/planets" component={PlanetPage} />      <----------
                  <Route path="/starships" component={StarshipPage} />    <---------

                  {/* <PeoplePage />
                  <PlanetPage />
                  <StarshipPage /> */}

                </div>
              </Router>
            </SwapiServiceProvider>
          </ErrorBoundry>
        );
      };  
    };



---Link

-Чтобы переключать страницы, нужно использовать Link из react-router

  <Link to="/anywhere">Anywhere</Link>

-Link работает почти как тэг <a>, но он не перезагружает страницу
  (и при этом обновляет URL в адрестной строке)

    <!-- header.js -->
    import React from 'react';
    import { Link } from 'react-router-dom';                <---------

    import './header.css';

    const Header = ({ onServiceChange }) => {
      return (
        <div className="header d-flex">
          <h3>
            <Link to="/">                                 <--------
              Star DB
            </Link>                                       <---------
          </h3>
          <ul className="d-flex">
            <li>
              <Link to="/people">People</Link>              <---------
            </li>
            <li>
            <Link to="/planets">Planets</Link>              <---------
            </li>
            <li>
            <Link to="/starships">Starships</Link>          <---------
            </li>
          </ul>

          <button
              onClick={onServiceChange}
              className="btn btn-primary btn-sm">
            Change Service
          </button>
        </div>
      );
    };

    export default Header;



---Как работает Route (Маршрут)

-В Route можно передавать render функцию 

  <Route path='/hi' render={() => <p>Hi</p>} />

-Route работает как фильтр - сравнивая path (путь) с текущим адресом он решает,
  отсортировать содержимое или нет

-Параметр exact (точный, актуальный, верный) говорит, что нужно использовать
  точное совпадение (а не "path является частью адреса")

    <!-- app.js -->
    export default class App extends Component {

      ........

        return (
          <ErrorBoundry>
            <SwapiServiceProvider value={this.state.swapiService}>
              <Router>
                <div className="stardb-app">
                  <Header onServiceChange={this.onServiceChange} />
                  <RandomPlanet />

                  <Route path="/"                                       <-------
                         render={() => <h2>Welcom to StarWars DB</h2>}  <------
                         exact={true} />                                <--------
                  <Route path="/people" component={PeoplePage} />
                  <Route path="/planets" component={PlanetPage} />
                  <Route path="/starships" component={StarshipPage} />

                </div>
              </Router>
            </SwapiServiceProvider>
          </ErrorBoundry>
        );
      };  
    };



---Динамические пути

-В Route можно передать параметры:

  <Route path="/people/:id" 
          render={({ match }) => <p>{match.params.id</p>} />

-:id может быть любой строкой, которая идет после /people/

-Если не установить exact, то путь /people будет срабатывать всегда,
  когда срабатывает /people/:id

    <!-- app.js -->

    .......

    render() {

      if (this.state.hasError) {
        return <ErrorIndicator />
      };

      return (
        <ErrorBoundry>
          <SwapiServiceProvider value={this.state.swapiService}>
            <Router>
              <div className="stardb-app">
                <Header onServiceChange={this.onServiceChange} />
                <RandomPlanet />

                <Route path="/" 
                        render={() => <h2>Welcom to StarWars DB</h2>}
                        exact={true} />
                <Route path="/people" 
                        render={() => <h2>People</h2>}
                        exact={true} />       
                <Route path="/people" component={PeoplePage} />
                <Route path="/planets" component={PlanetPage} />
                <Route path="/starships" exact component={StarshipPage} />  <------
                <Route path="/starships/:id"                                <-------
                        render={({ match }) => {                            <-------
                        const { id } = match.params;                        <-------
                        return <StarshipDetails itemId={id}/>}} />        <-------

              </div>
            </Router>
          </SwapiServiceProvider>
        </ErrorBoundry>
        );
      };  



---withRouter()

-withRouter это компонент высшего порядка, он передает компоненту 
  объекты react router:

  const MyComponent = ({ match, location, history }) => {
    return (
      <Button
        onClick={() => history.push(`/new/path`)} >
          Click
      </Button>
    )
  }

  export default withRouter(MyComponent);

    <!-- starship-page.js -->

    // ИЗ КОМПОНЕНТА КЛАССА ПЕРЕПИСАЛ В КОМПОНЕНТ ФУНКЦИЮ

    import React from 'react';
    import { StarshipList } from '../sw-components'
    import { withRouter } from 'react-router-dom';    <-------

    const StarshipPage = ({ history }) => {             <-------
      return (
        <StarshipList 
          onItemSelected={(itemId) => {
            history.push(`/starships/${itemId}`);     ........
          }} />
      )
    };                                                  <-------

    export default withRouter(StarshipPage);



---Относительные пути 

-В react-router можно использовать относительные пути

  history.push(`/person`);    // абсолютный путь
  history.push(`/person/`);    // относительный путь

-Закрывающий слеш - Очень важен

  history.push(`person`);
  //  текущий адрес - /site/catalog
  //  результата - /site/catalog/person

  //  текущий адрес - /site/catalog       (Без слеша)
  //  результата - /site/person 

<!-- starship-page.js -->

........

const StarshipPage = ({ history }) => {
  return (
    <StarshipList 
      onItemSelected={(itemId) => {
        history.push(itemId);         // Относительный путь   <------
      }} />
  )
};

<!-- header.js -->

........

 <ul className="d-flex">
        <li>
          <Link to="/people/">People</Link>       <-------
        </li>
        <li>
        <Link to="/planets/">Planets</Link>       <-------
        </li>
        <li>
        <Link to="/starships/">Starships</Link>   <-------
        </li>
      </ul>

........



---Опциональные параметры

-В path параметры могут быть опциональными:

  <Route path="/people/:id?">

-Приложение должно позволять перезагружать страницы, или передавать 
  URL другим пользователям

-Адрес должен содержать ID открытого элемента (тогда открыв тот же 
  URL пользователь попадает на тот же "экран")

    <!-- people-page.js -->

    // ИЗ КОМПОНЕНТА КЛАССА ПЕРЕПИСАЛ В КОМПОНЕНТ ФУНКЦИЮ

    import React from 'react';
    import Row from '../row';
    import { PersonDetails, PersonList } from '../sw-components'
    import { withRouter } from 'react-router-dom';                        <--------

    const PeoplePage = ({ history, match }) => {                            <--------
      const { id } = match.params;                                          <--------

      return (
        <Row 
          left={<PersonList onItemSelected={(id) => history.push(id)} />}   <--------
          right={<PersonDetails itemId={id} />} />                          <--------
      )
    };

    export default withRouter(PeoplePage);                            <--------

    <!-- APP.JS -->

    ........

    return (
      <ErrorBoundry>
        <SwapiServiceProvider value={this.state.swapiService}>
          <Router>
            <div className="stardb-app">
              <Header onServiceChange={this.onServiceChange} />
              <RandomPlanet />

              <Route path="/" 
                      render={() => <h2>Welcom to StarWars DB</h2>}
                      exact={true} />
              <Route path="/people" 
                      render={() => <h2>People</h2>}
                      exact={true} />       
              <Route path="/people/:id?" component={PeoplePage} />        <-Добавил:  /:id?->
              <Route path="/planets" component={PlanetPage} />
              <Route path="/starships" exact component={StarshipPage} />
              <Route path="/starships/:id" 
                      render={({ match }) => {
                      const { id } = match.params;
                      return <StarshipDetails itemId={id}/>}} />

            </div>
          </Router>
        </SwapiServiceProvider>
      </ErrorBoundry>
    );


    ........



---Авторизация и "закрытые" страницы

-Можно использовать компонент Redirect, чтобы переслать пользователя
  на логин-страницу:

  <Redirect to="/login" />

-Система авторизации, которая расмотренна в данном уроке,
  НЕ ОБЕСПЕЧИВАЕТ БЕЗОПАСНОСТЬ в приложении (проверка прав 
  должна проводится на сервере)

    <!-- secret-page.js -->
    import React from 'react';                                <-------
    import { Redirect } from 'react-router-dom';

    const SecretPage = ({ isLoggedIn }) => {

      if (isLoggedIn) {
        return (
          <div className="jumbotron text-center">           .........
            <h3>This page is full of decrets!</h3>
          </div>
        )
      };

      return <Redirect to="/login" />
    };                                                        <-------

    export default SecretPage;

    <!-- login-page.js -->
    import React from 'react';                              <-------
    import { Redirect } from 'react-router-dom';

    const LoginPage = ({ isLoggedIn, onLogin }) => {

      if (isLoggedIn) {
        return <Redirect to="/" />
      }

      return (
        <div className="jumbotron">
          <p>Login to see secret page!</p>                .......
          <button 
            className="btn btn-primary"
            onClick={onLogin} >
              Login
          </button>
        </div>
      );
    };

    export default LoginPage;                               <-------

    <!-- header.js -->

    .......

    const Header = ({ onServiceChange }) => {
      return (
        <div className="header d-flex">
          <h3>
            <Link to="/">
              Star DB
            </Link>
          </h3>
          <ul className="d-flex">
            <li>
              <Link to="/people/">People</Link>
            </li>
            <li>
            <Link to="/planets/">Planets</Link>
            </li>
            <li>
            <Link to="/starships/">Starships</Link>
            </li>
            <li>
            <Link to="/login">Login</Link>              <--------
            </li>
            <li>
            <Link to="/secret">Secret</Link>            <--------
            </li>
          </ul>

          <button
              onClick={onServiceChange}
              className="btn btn-primary btn-sm">
            Change Service
          </button>
        </div>
      );
    };

    .......

    <!-- app.js -->
    import React, { Component } from 'react';

    ........

    import { 
      PeoplePage, 
      PlanetPage, 
      StarshipPage, 
      LoginPage,                                                      <-------
      SecretPage } from '../pages';                                     <-------

    .........

    export default class App extends Component {

      state = {
        hasError: false,
        swapiService: new SwapiService(),
        // swapiService: new DummySwapiService()
        isLoggedIn: false,                                        <-------
      };

      onLogin = () => {                                             <-------
        this.setState({
          isLoggedIn: true                                          ........
        });
      } ;                                                           <-------

      ....................

      render() {

        const { isLoggedIn } = this.state;                            <-------

        if (this.state.hasError) {
          return <ErrorIndicator />
        };

        return (
          <ErrorBoundry>
            <SwapiServiceProvider value={this.state.swapiService}>
              <Router>
                <div className="stardb-app">
                  <Header onServiceChange={this.onServiceChange} />
                  <RandomPlanet />

                 ...................

                  <Route                                          <-------
                    path="/login"
                    render={() => (
                      <LoginPage                                ........
                      isLoggedIn={isLoggedIn}
                      onLogin={this.onLogin} />
                    )} />                                           <-------
                  <Route                                            <-------
                    path="/secret"
                    render={() => (                               .........
                      <SecretPage isLoggedIn={isLoggedIn}/>
                    )} />                                           <-------

                </div>
              </Router>
            </SwapiServiceProvider>
          </ErrorBoundry>
        );
      };  
    };

