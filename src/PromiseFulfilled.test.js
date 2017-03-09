import React from 'react';
import {mount} from 'enzyme';

import PromiseFulfilled from './PromiseFulfilled';

function renderWithProps(props) {
  const promiseContainer = {
    refresh: () => {},
    mutate: () => {},
  };
  return mount(
    <PromiseFulfilled promiseContainer={promiseContainer} {...props} />
  )
}

test('renders the component which is given', () => {
  const wrapper = renderWithProps({
    component: () => <p>loading is done</p>,
  });
  expect(wrapper.find('p').text()).toEqual('loading is done');
});

test('passes the result', () => {
  const wrapper = renderWithProps({
    component: props => <p>value is {props.value}</p>, // eslint-disable-line react/prop-types
    result: {value:42},
  });
  expect(wrapper.find('p').text()).toEqual('value is 42');
});
