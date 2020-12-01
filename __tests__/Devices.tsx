import React from 'react';
import {
  act,
  cleanup,
  fireEvent,
  render,
  RenderResult,
  waitFor
} from '@testing-library/react';
import _fetchMock from 'isomorphic-fetch';

import { BASE_API } from '../src/services/api';
import Devices from '../src/Devices';
import mockDeviceReadings from '../__mocks__/mockDeviceReadings';

type FetchMock = typeof import('fetch-mock');

describe('Devices.tsx', (): void => {
  let component: RenderResult;
  const fetchMock = (_fetchMock as unknown) as FetchMock;
  afterEach(() => {
    const fetchCalled1 = fetchMock.called(/devices/);
    expect(fetchCalled1).toBe(true);

    const fetchCalled2 = fetchMock.called(/device\/123/);
    expect(fetchCalled2).toBe(false);

    cleanup(), fetchMock.restore();
  });

  beforeEach(
    async (): Promise<void> => {
      fetchMock.mock(`${BASE_API}/devices`, { data: mockDeviceReadings });
      await act(async () => {
        component = render(<Devices />);
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
    const { getByRole } = component;
    const heading = getByRole('heading');
    expect(heading).toHaveTextContent('Devices');
  });

  it('displays active and inactuve device counters', (): void => {
    const { getByText } = component;
    const activeCounter = getByText(/Number of active devices/);
    expect(activeCounter).toHaveTextContent('Number of active devices: 9');

    const inactiveCounter = getByText(/Number of inactive devices/);
    expect(inactiveCounter).toHaveTextContent('Number of inactive devices: 2');
  });

  it('fires button on active device change', async (): Promise<void> => {
    const { getAllByRole, getAllByText } = component;
    const buttons1 = getAllByRole('button');
    expect(buttons1.length).toBe(18);

    // Click on first pencil edit button
    fireEvent.click(buttons1[7]);

    const buttons2 = getAllByRole('button');
    expect(buttons2.length).toBe(20);

    const activeDevices1 = getAllByText('Y');
    expect(activeDevices1.length).toBe(9);

    const unactiveDevices = getAllByText('N');
    expect(unactiveDevices.length).toBe(2);

    /****
     *
     *  Intention of the below code is to change a row's active status
     *  from active to not active. It does not work due to nuances
     *  in how the material-table library updates a TabelCell value.
     *  But you can see what my intention was (update value, mock api call, etc.).
     *
     *****/

    /*
	const inputs = document.getElementsByTagName('input');

    // Click active from true to false
    fireEvent.change(inputs[1], {
      target: { value: 'false' }
    });

    const options = {
      method: 'PATCH'
    };
    const response = {
      status: 200,
      statusText: 'OK'
    };

    fetchMock.mock(
      `${BASE_API}/devices/acceleration_x?active=false`,
      response,
      options
    );

    const buttons3 = getAllByRole('button');

    await act(async () => {
      fireEvent.click(buttons3[7]);
    });

    const activeDevices2 = getAllByText('Y');
    expect(activeDevices2.length).toBe(8);

    const fetchUpdateCalled = fetchMock.called(
      /devices\/acceleration_x\?active=false/
    );
	expect(fetchUpdateCalled).toBeTruthy();

	const buttons4 = getAllByRole('button');
    expect(buttons4.length).toBe(18);
	*/
  });

  it('should test search', async (): Promise<void> => {
    const { getByPlaceholderText, getByText, queryByText } = component;
    const search = getByPlaceholderText('Search');

    fireEvent.change(search, {
      target: { value: 'zzz' }
    });

    await waitFor(() =>
      expect(getByText(/No records to display/)).toBeInTheDocument()
    );

    fireEvent.change(search, {
      target: { value: 'ori' }
    });

    await waitFor(() => {
      expect(queryByText(/No records to display/)).not.toBeInTheDocument();
      expect(getByText('orientation')).toBeInTheDocument();
    });
  });

  it('should not call api when no change is made', async (): Promise<void> => {
    const { getAllByRole } = component;
    const buttons1 = getAllByRole('button');
    expect(buttons1.length).toBe(18);

    // Click on first pencil edit button
    fireEvent.click(buttons1[7]);

    const options = {
      method: 'PATCH'
    };
    const response = {
      status: 200,
      statusText: 'OK'
    };

    fetchMock.mock(
      `${BASE_API}/devices/acceleration_x?active=true`,
      response,
      options
    );

    const buttons3 = getAllByRole('button');

    expect(buttons3.length).toBe(20);

    await act(async () => {
      fireEvent.click(buttons3[7]);
    });

    const fetchUpdateCalled = fetchMock.called(
      /devices\/acceleration_x\?active=true/
    );

    expect(fetchUpdateCalled).toBe(false);
  });
});
