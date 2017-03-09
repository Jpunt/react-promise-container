import React from 'react';
import {mount} from 'enzyme';

import PromisePending from './PromisePending';

function renderWithProps(props) {
  const promiseContainer = {
    refresh: () => {},
    mutate: () => {},
  };
  return mount(
    <PromisePending promiseContainer={promiseContainer} {...props} />
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
    component: () => <p>loading...</p>,
  });
  expect(wrapper.find('p').text()).toEqual('loading...');
});
