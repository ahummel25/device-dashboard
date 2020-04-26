import React from 'react';
import { act, render, RenderResult } from '@testing-library/react';
import _fetchMock from 'isomorphic-fetch';

import { BASE_API } from '../src/services/api';
import deviceReadings from '../deviceReadings';
import App from '../src/App';

type FetchMock = typeof import('fetch-mock');

describe('App.tsx', (): void => {
  let component: RenderResult;
  const fetchMock = (_fetchMock as unknown) as FetchMock;
  afterEach(() => {
    fetchMock.restore();
  });

  beforeEach(
    async (): Promise<void> => {
      fetchMock.mock(`${BASE_API}/devices`, { data: deviceReadings });
      await act(async () => {
        component = render(<App />);
      });
    }
  );

  it('renders', (): void => {
    const { baseElement } = component;
    expect(baseElement).toBeDefined();
  });

  it('matches snapshot', (): void => {
    const { container } = component;
    expect(container.firstChild).toMatchSnapshot();
  });

  it('contains proper <h1> tag', (): void => {
    const { getAllByRole } = component;
    const headings = getAllByRole('heading');
    expect(headings[0]).toHaveTextContent('Relayr Device Dashboard');
  });
});
