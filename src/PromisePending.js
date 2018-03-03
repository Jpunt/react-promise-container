import React from 'react';

export default class PromisePending extends React.Component {
  render() {
    const Component = this.props.component;
    if (Component === undefined || Component === null) {
      return null;
    }
    return <Component {...this.props.ownProps} />;
  }
}
