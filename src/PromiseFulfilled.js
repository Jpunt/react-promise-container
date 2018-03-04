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

export default class PromiseFulfilled extends React.Component<Props> {
  render() {
    const {ownProps, result, promiseContainer} = this.props;
    const Component = this.props.component;
    return <Component {...ownProps} {...result} promiseContainer={promiseContainer} />;
  }
}
