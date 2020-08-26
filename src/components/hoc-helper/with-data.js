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
      this.setState({
        loading: true,
        error: false
      });

      this.props.getData()
        .then((data) => {
          this.setState({
            data,
            loading: false
          });
        })
        .catch(() => {
          this.setState({
            error: true,
            loading: false
          });
        })
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