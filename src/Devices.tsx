import React, { FC, forwardRef, useEffect, useState } from 'react';
import MaterialTable from 'material-table';
import Cancel from '@material-ui/icons/Clear';
import Edit from '@material-ui/icons/Edit';
import ResetSearch from '@material-ui/icons/Close';
import Save from '@material-ui/icons/Check';
import Search from '@material-ui/icons/Search';
import fetch from 'isomorphic-fetch';

import {
  IDeviceResponse,
  IDevicesResponse,
  IRowUpdateNewDataResponse
} from './types';
import { useGetDevices } from './utils/hooks';
import { BASE_API } from './services/api';

const Devices: FC<{}> = () => {
  const [devicesUpdating, setDevicesUpdating] = useState<boolean>(false);
  const [devicesState, setDevicesState] = useState<IDevicesResponse | null>(
    null
  );
  const devices = useGetDevices(devicesUpdating);
  const [activeCount, setActiveCount] = useState<number>(0);
  const tableIcons = {
    Clear: forwardRef(
      (props: any, ref: React.Ref<SVGElement>): JSX.Element => (
        <Cancel {...props} ref={ref} />
      )
    ),
    Edit: forwardRef(
      (props: any, ref: React.Ref<SVGElement>): JSX.Element => (
        <Edit {...props} ref={ref} />
      )
    ),
    ResetSearch: forwardRef(
      (props: any, ref: React.Ref<SVGElement>): JSX.Element => (
        <ResetSearch {...props} ref={ref} />
      )
    ),
    Check: forwardRef(
      (props: any, ref: React.Ref<SVGElement>): JSX.Element => (
        <Save {...props} ref={ref} />
      )
    ),
    Search: forwardRef(
      (props: any, ref: React.Ref<SVGElement>): JSX.Element => (
        <Search {...props} ref={ref} />
      )
    )
  };

  useEffect(() => {
    const activeDevices = devices
      ? devices.data.filter((device: IDeviceResponse) => device.active)
      : [];
    setActiveCount(activeDevices.length);
    setDevicesState(devices);
  }, [devices]);

  const handleOnRowUpdate = (newData: IRowUpdateNewDataResponse): void => {
    const opts = {
      method: 'PATCH'
    };
    const active = newData.active;
    const url = `${BASE_API}/devices/${newData.name}?active=${active}`;
    fetch(url, opts)
      .then(response => {
        if (response.status !== 200) {
          throw new Error(
            `Error while updating device: ${response.statusText}`
          );
        }
      })
      .then(() => {
        setDevicesUpdating(false);
      })
      .catch(err => {
        setDevicesUpdating(false);
        alert(err.message);
      });
  };

  return (
    <div style={{ maxWidth: '100%', paddingBottom: '50px' }}>
      <MaterialTable
        editable={{
          onRowUpdate: (newData: IRowUpdateNewDataResponse): Promise<void> => {
            return new Promise(resolve => {
              setDevicesUpdating(true);
              resolve(handleOnRowUpdate(newData));
            });
          }
        }}
        title="Devices"
        columns={[
          { title: 'Name', field: 'name', editable: 'never' },
          { title: 'Unit', field: 'unit', editable: 'never' },
          {
            title: 'Value',
            field: 'value',
            editable: 'never',
            type: 'numeric'
          },
          {
            title: 'Timestamp',
            field: 'timestamp',
            editable: 'never',
            type: 'numeric'
          },
          {
            title: 'Active',
            field: 'active',
            editable: 'always',
            lookup: { true: 'Y', false: 'N' }
          }
        ]}
        data={devicesState ? devicesState.data : []}
        icons={tableIcons}
        isLoading={devicesUpdating}
        options={{
          paging: false
        }}
      />
      <p>Number of active devices: {activeCount}</p>
      <p>
        Number of inactive devices:{' '}
        {devicesState ? devicesState.data.length - activeCount : 0}
      </p>
    </div>
  );
};

export default Devices;
