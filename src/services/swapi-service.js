export default class SwapiService {
  // Через нижнее подчеркивание говорим другим разработчикам что это
  // приватная часть класса и ее не следует использовать или изменять снаруже   

  _apiBase = 'https://swapi.dev/api';
  // _apiBase = 'https://pokeapi.co/api/v2/pokemon';
  _imageBase = 'https://starwars-visualguide.com/assets/img';

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

  getPersonImage = ({id}) => {
    return `${this._imageBase}/characters/${id}.jpg`
  };

  getStarshipImage = ({id}) => {
    return `${this._imageBase}/starships/${id}.jpg`
  };

  getPlanetImage = ({id}) => {
    return `${this._imageBase}/planets/${id}.jpg`
  };

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
      costInCredits: starship.cost_in_credits,
      length: starship.length,
      crew: starship.crew,
      passengers: starship.passengers,
      cargoCapacity: starship.cargo_capacity
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



