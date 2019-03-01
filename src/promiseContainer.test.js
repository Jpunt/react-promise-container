import './initTests';

import React from 'react';
import {mount} from 'enzyme';

import promiseContainer from './promiseContainer';

function renderWithPromises(mapPromisesToProps) {
  const FulfilledComponent = ({value}) => ( // eslint-disable-line react/prop-types
    <p>done with value: {value}</p>
  );

  const PendingComponent = () => (
    <p>loading</p>
  );

  const RejectedComponent = ({error}) => ( // eslint-disable-line react/prop-types
    <p>failed with message: {error.message}</p>
  );

  const WithPromiseContainer = promiseContainer(mapPromisesToProps, {preventLogging:true})(
    FulfilledComponent,
    PendingComponent,
    RejectedComponent,
  );

  return mount(<WithPromiseContainer />);
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

test('renders PromisePending while pending', () => {
  const wrapper = renderWithPromises(() => ({
    value: delay(1).then(() => 42),
  }));

  expect(wrapper.find('p').text()).toEqual('loading');
});

test('renders PromiseFulfilled when fulfilled', () => {
  const wrapper = renderWithPromises(() => ({
    value: delay(1).then(() => 42),
  }));

  expect(wrapper.find('p').text()).toEqual('loading');
  return delay(3).then(() => {
    wrapper.update();
    expect(wrapper.find('p').text()).toEqual('done with value: 42');
  });
});

test('renders PromiseRejected when rejected', () => {
  const wrapper = renderWithPromises(() => ({
    value: delay(1).then(() => { throw new Error('failed') }),
  }));

  expect(wrapper.find('p').text()).toEqual('loading');
  return delay(3).then(() => {
    wrapper.update();
    expect(wrapper.find('p').text()).toEqual('failed with message: failed');
  });
});
