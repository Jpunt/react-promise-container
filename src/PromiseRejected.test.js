import './initTests';

import React from 'react';
import {mount} from 'enzyme';

import PromiseRejected from './PromiseRejected';

function renderWithProps(props) {
  const promiseContainer = {
    refresh: () => {},
    mutate: () => {},
  };
  return mount(
    <PromiseRejected promiseContainer={promiseContainer} {...props} />
  )
}

test('renders nothing when no component is given', () => {
  const wrapper = renderWithProps();
  expect(wrapper.children().length).toEqual(0);
});

test('renders nothing when component is null', () => {
  const wrapper = renderWithProps({component: null});
  expect(wrapper.children().length).toEqual(0);
});

test('renders the component which is given', () => {
  const wrapper = renderWithProps({
    component: () => <p>there is an error</p>,
  });
  expect(wrapper.find('p').text()).toEqual('there is an error');
});

test('passes error to component', () => {
  const wrapper = renderWithProps({
    component: props => <p>{props.error.message}</p>, // eslint-disable-line react/prop-types
    error: {
      message: 'something is undefined or whatever',
    },
  });
  expect(wrapper.find('p').text()).toEqual('something is undefined or whatever');
})
