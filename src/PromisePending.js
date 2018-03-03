// @flow

import * as React from 'react';

type Props = {
  component: React.ComponentType<any>,
  ownProps: ?Object,
};

export default class PromisePending extends React.Component<Props> {
  render() {
    const Component = this.props.component;
    if (Component === undefined || Component === null) {
      return null;
    }
    return <Component {...this.props.ownProps} />;
  }
}
