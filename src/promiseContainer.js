/* eslint-disable react/no-did-update-set-state */
// @flow

import _ from 'lodash';
import * as React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';

const PENDING = 'PENDING';
const FULFILLED = 'FULFILLED';
const REJECTED = 'REJECTED';

import PromisePending from './PromisePending';
import PromiseFulfilled from './PromiseFulfilled';
import PromiseRejected from './PromiseRejected';

type Props = ?Object;

type State = {
  status: 'PENDING' | 'FULFILLED' | 'REJECTED',
  result: ?Object,
  error: ?Error,
};

type Config = {
  shouldPromiseRefresh?: Function,
  preventLogging?: boolean,
};

type ObjectWithPromises = {[string]: Promise<any>};
type ObjectWithResults = {[string]: any};

type GetPromises = (props: Props) => ObjectWithPromises;

export default function promiseContainer(
  getPromises: GetPromises,
  config: Config = {},
): (
  FulfilledComponent: React.ComponentType<any>,
  PendingComponent?: ?React.ComponentType<any>,
  RejectedComponent?: ?React.ComponentType<any>
) => React.ComponentType<any>
{
  return (FulfilledComponent, PendingComponent, RejectedComponent) => {
    if (!FulfilledComponent) {
      throw new Error('No FulfilledComponent set');
    }

    class PromiseContainer extends React.Component<Props, State> {
      constructor(props: Props) {
        super(props);
        this.state = {
          status: PENDING,
          result: null,
          error: null,
        };
      }

      componentDidMount() {
        const objectWithPromises = this.getPromises(this.props);
        this.executePromise(objectWithPromises);
      }

      componentDidUpdate(prevProps: Props) {
        if (config.shouldPromiseRefresh && config.shouldPromiseRefresh(this.props, prevProps)) {
          const objectWithPromises = this.getPromises(this.props);
          this.setState({status: PENDING});
          this.executePromise(objectWithPromises);
        }
      }

      componentDidCatch(error: Error) {
        console.error(error.stack);
        this.setState({status: REJECTED, error});
      }

      getPromises(props: Props): ?ObjectWithPromises {
        try {
          return getPromises(props);
        } catch (error) {
          if (!config.preventLogging) console.error(error);
          this.setState({status: REJECTED, error});
          return null;
        }
      }

      executePromise(objectWithPromises: ?ObjectWithPromises) {
        if (objectWithPromises) {
          return promisesToProps(objectWithPromises)
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

      mutate(mutationPromise: () => Promise<any>, getExpectedResult: Function) {
        const originalResult = _.cloneDeep(this.state.result);
        const expectedResult = getExpectedResult(this.state.result);

        // Update result immediately
        this.setState({result: expectedResult});

        // Trigger promise to change, but fail before the user looses attention
        // (read: https://www.smashingmagazine.com/2016/11/true-lies-of-optimistic-user-interfaces/#rules-of-thumb)
        return handleTimeout(mutationPromise, 2000).catch(error => {
          // Something went wrong, put the original result back
          this.setState({result: originalResult});
          throw error;
        });
      }

      render() {
        switch (this.state.status) {
          case PENDING:
            if (PendingComponent) {
              return <PromisePending
                ownProps={this.props}
                component={PendingComponent}
              />;
            }
            break;

          case REJECTED:
            if (RejectedComponent) {
              return <PromiseRejected
                ownProps={this.props}
                component={RejectedComponent}
                error={this.state.error}
              />;
            }
            break;

          case FULFILLED:
            if (FulfilledComponent) {
              return <PromiseFulfilled
                ownProps={this.props}
                component={FulfilledComponent}
                result={this.state.result}
                promiseContainer={{
                  refresh: (...args) => this.refresh(...args),
                  mutate: (...args) => this.mutate(...args),
                }}
              />;
            }
            break;
        }
        throw new Error(`Invalid promise status: ${this.state.status}`);
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

function promisesToProps(props: ObjectWithPromises): Promise<ObjectWithResults> {
  const keys = Object.keys(props);
  const values = Object.values(props);
  return Promise.all(values).then(results => {
    return results.reduce((acc, value, i) => ({...acc, [keys[i]]: value}), {});
  });
}

function handleTimeout<T>(promise: () => Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(reject, ms);
    promise()
      .then(resolve)
      .catch(reject)
      .then(() => clearTimeout(timeout));
  });
}
