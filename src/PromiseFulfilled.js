import React from 'react';

export default class PromiseFulfilled extends React.Component {
  state = {
    error: null,
  };

  render() {
    if (this.state.error) {
      return null;
    }
    const {ownProps, result, promiseContainer} = this.props;
    return <this.props.component {...ownProps} {...result} promiseContainer={promiseContainer} />;
  }

  // De promise kan geslaagd zijn, maar het renderen van de fulfilled-state niet.
  // Dit is een nieuwe feature van React die ervoor zorgt dat we iets anders kunnen
  // renderen en de error kunnen afhandelen. Lijkt voor nu in ieder geval goed te
  // werken, maar voor meer info zie: https://github.com/facebook/react/issues/2461
  unstable_handleError(error) {
    console.error(error.stack);
    this.setState({error});
  }
}
