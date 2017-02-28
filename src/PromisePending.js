import React from 'react';

export default class PromisePending extends React.Component {
  static propTypes = {
    component: React.PropTypes.func,
    ownProps: React.PropTypes.object,
  };

  render() {
    if (typeof this.props.component != 'undefined') {
      return this.props.component == null ? null :
        <this.props.component {...this.props.ownProps} />;
    }

    // TODO: Translate to english when PromiseContainer becomes a seperate package:
    return <p>Even geduld...</p>;
  }
}
