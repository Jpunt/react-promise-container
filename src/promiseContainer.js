import _ from 'lodash';
import React from 'react';
import Promise from 'bluebird';
import hoistNonReactStatic from 'hoist-non-react-statics';

const PENDING = 'PENDING';
const FULFILLED = 'FULFILLED';
const REJECTED = 'REJECTED';

import PromisePending from './PromisePending';
import PromiseFulfilled from './PromiseFulfilled';
import PromiseRejected from './PromiseRejected';

export default function promiseContainer(getPromises, config = {}) {
  return (FulfilledComponent, PendingComponent, RejectedComponent) => {
    if (!FulfilledComponent) {
      throw new Error('No FulfilledComponent set');
    }

    class PromiseContainer extends React.Component {
      state = {
        status: PENDING,
        result: null,
        error: null,
      };

      componentWillMount() {
        const objectWithPromises = this.getPromises(this.props);
        this.executePromise(objectWithPromises);
      }

      componentWillReceiveProps(nextProps) {
        if (config.shouldPromiseRefresh && config.shouldPromiseRefresh(this.props, nextProps)) {
          const objectWithPromises = this.getPromises(nextProps);
          this.setState({status: PENDING});
          this.executePromise(objectWithPromises);
        }
      }

      getPromises(props) {
        try {
          return getPromises(props);
        } catch (error) {
          if (!config.preventLogging) console.error(error);
          this.setState({status: REJECTED, error});
          return null;
        }
      }

      executePromise(objectWithPromises) {
        if (objectWithPromises) {
          return Promise.props(objectWithPromises)
            .then(result => {
              this.setState({status: FULFILLED, result});
              return result;
            })
            .catch(error => {
              if (!config.preventLogging) console.error(error);
              this.setState({status: REJECTED, error});
            });
        }
      }

      refresh() {
        // TODO: Only refresh specific promises?
        const objectWithPromises = this.getPromises(this.props);
        return this.executePromise(objectWithPromises);
      }

      mutate(mutationPromise, getExpectedResult) {
        const originalResult = _.cloneDeep(this.state.result);
        const expectedResult = getExpectedResult(this.state.result);

        // Update result immediately
        this.setState({result: expectedResult});

        // Trigger promise to change
        return mutationPromise()
          // fail before user looses attention (read: https://www.smashingmagazine.com/2016/11/true-lies-of-optimistic-user-interfaces/#rules-of-thumb)
          .timeout(2000)
          // Something went wrong, put the original result back
          .catch(error => {
            this.setState({result: originalResult});
            throw error;
          });
      }

      render() {
        switch (this.state.status) {
          case PENDING:
            return <PromisePending
              ownProps={this.props}
              component={PendingComponent}
            />;

          case REJECTED:
            return <PromiseRejected
              ownProps={this.props}
              component={RejectedComponent}
              error={this.state.error}
            />;

          case FULFILLED:
            return <PromiseFulfilled
              ownProps={this.props}
              component={FulfilledComponent}
              result={this.state.result}
              promiseContainer={{
                refresh: (...args) => this.refresh(...args),
                mutate: (...args) => this.mutate(...args),
              }}
            />;

          default:
            throw new Error(`Invalid promise status: ${this.state.status}`);
        }
      }
    }

    hoistNonReactStatic(PromiseContainer, FulfilledComponent);
    PromiseContainer.displayName = `PromiseContainer(${getDisplayName(FulfilledComponent)})`;
    return PromiseContainer;
  };
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}
