import React, { Component } from 'react';

import './item-details.css';
import Spinner from '../spinner';
import ErrorIndicator from '../error-indicator'
import ErrorButton from '../error-button';


const Record = ({ item, field, label }) => {
  return (
    <li className="list-group-item">
    <span className="term">{label}</span>
    <span>{item[field]}</span>
  </li>
  )
};
export {Record}

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
        this.props.getData !== prevProps.getData ||
        this.props.getImageUrl !== prevProps.getImageUrl) {
      this.setState({
        loading: true
      });
      this.updateItem();
    }
  };

  componentDidCatch() {
    this.setState({
      error: true
    });
  }

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
    const { children } = this.props

    const hasError = !(loading || error);

    const errorMessage = error ? <ErrorIndicator /> : null;
    const spinner = loading ? <Spinner /> : null;
    
    const content = hasError 
          ? <PersonView 
              item={item} 
              image={image}
              children={children} /> 
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

const PersonView = ({ item, image, children }) => {

  const { name } = item;

  
  return (
    <React.Fragment>
      <img className="item-image"
          src={image}
          alt="character"/>

      <div className="card-body">
        <h4>{name}</h4>
        <ul className="list-group list-group-flush">
        {
          React.Children.map(children, (child) => {
            return React.cloneElement(child, {item});
          })
        }
        </ul>
        <ErrorButton />
      </div>
    </React.Fragment>
  );
};