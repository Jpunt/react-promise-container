import React from 'react';

export default class PromiseRejected extends React.Component {
  static propTypes = {
    component: React.PropTypes.func,
    ownProps: React.PropTypes.object,
    error: React.PropTypes.object,
  };

  render() {
    if (typeof this.props.component != 'undefined') {
      return this.props.component == null ? null :
        <this.props.component {...this.props.ownProps} error={this.props.error} />;
    }

    return <div>
      <h1>Er is iets misgegaan</h1>
      <p>{this.props.error.message}</p>
      <pre>{this.props.error.stack}</pre>
    </div>;
  }
}
