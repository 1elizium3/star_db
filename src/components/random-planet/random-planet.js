/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SwapiService from '../../services/swapi-service';

import './random-planet.css';
import Spinner from '../spinner/spinner';
import ErrorIndicator from '../error-indicator';

export default class RandomPlanet extends Component {

  static defaultProps = {
    updateInterval: 6000
  };

  static propTypes = {
    updateInterval: PropTypes.number
  };

  swapiService = new SwapiService();

  state = {
    planet: {},
    loading: true,
    error: false
  };
  
  componentDidMount() {
    const { updateInterval } = this.props;
    this.updatePlanet();
    this.interval = setInterval(this.updatePlanet, updateInterval);
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  };
// Проверка на отсутствие картинки
  // updateImage = (img) => {
  //   this.setState((prevState) => ({
  //     planet: {
  //       ...prevState.planet,
  //       img: img
  //     }
  //   }));
  // };

  onPlanetLoaded = (planet) => {
    this.setState({
      planet,
      loading: false
    });
    // this.swapiService.doesImageExist(planet.id)
    //   .then(this.updateImage);
  };

  onError = (err) => {
    this.setState({
      error: true,
      loading: false
    });
  };

 // Обновляем планету с помощью swapiService и получаем
 //   данные с сервера  
  updatePlanet = () => {
    const id = Math.floor(Math.random() * 17) + 3;
    // const id = 1300;
    this.swapiService
      .getPlanet(id)
      .then(this.onPlanetLoaded)
      .catch(this.onError);
  };

  render() {
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
    </React.Fragment>
  );
};