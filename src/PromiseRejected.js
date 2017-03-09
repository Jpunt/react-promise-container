import React from 'react';

export default class PromiseRejected extends React.Component {
  static propTypes = {
    component: React.PropTypes.func,
    ownProps: React.PropTypes.object,
    error: React.PropTypes.object,
  };

  render() {
    const Component = this.props.component;
    if (Component === undefined || Component === null) {
      return null;
    }
    return <Component {...this.props.ownProps} error={this.props.error} />;
  }
}
