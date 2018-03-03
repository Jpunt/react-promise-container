// @flow

import * as React from 'react';

type Props = {
  component: React.ComponentType<any>,
  ownProps: ?Object,
  result: ?Object,
  promiseContainer: {
    refresh: Function,
    mutate: Function,
  },
};

type State = {
  error: ?Error;
};

export default class PromiseFulfilled extends React.Component<Props, State> {
  state = {
    error: null,
  };

  componentDidCatch(error: Error) {
    console.error(error.stack);
    this.setState({error});
  }

  render() {
    if (this.state.error) {
      return null;
    }
    const {ownProps, result, promiseContainer} = this.props;
    const Component = this.props.component;
    return <Component {...ownProps} {...result} promiseContainer={promiseContainer} />;
  }
}
