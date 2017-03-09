import React from 'react';

export default class PromisePending extends React.Component {
  static propTypes = {
    component: React.PropTypes.func,
    ownProps: React.PropTypes.object,
  };

  render() {
    const Component = this.props.component;
    if (Component === undefined || Component === null) {
      return null;
    }
    return <Component {...this.props.ownProps} />;
  }
}
