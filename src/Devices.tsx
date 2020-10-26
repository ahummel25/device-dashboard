import React, { FC, forwardRef, useEffect, useState } from 'react';
import MaterialTable, { Column } from 'material-table';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Cancel from '@material-ui/icons/Clear';
import Edit from '@material-ui/icons/Edit';
import ResetSearch from '@material-ui/icons/Close';
import Save from '@material-ui/icons/Check';
import Search from '@material-ui/icons/Search';
import fetch from 'isomorphic-fetch';

import { IDeviceData } from './types';
import { useGetDevices } from './utils/hooks';
import { BASE_API } from './services/api';

const Devices: FC<{}> = () => {
  const deviceColumns: Column<IDeviceData>[] = [
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
  ];
  const [devicesUpdating, setDevicesUpdating] = useState<boolean>(false);
  const [columns, setColumns] = useState<Column<IDeviceData>[]>(deviceColumns);
  const [data, setData] = useState<IDeviceData[] | null>(null);
  const devices = useGetDevices(devicesUpdating);
  const [activeCount, setActiveCount] = useState<number>(0);
  const tableIcons = {
    Clear: forwardRef(
      (props: any, ref: React.Ref<SVGSVGElement>): JSX.Element => (
        <Cancel {...props} ref={ref} />
      )
    ),
    Edit: forwardRef(
      (props: any, ref: React.Ref<SVGSVGElement>): JSX.Element => (
        <Edit {...props} ref={ref} />
      )
    ),
    ResetSearch: forwardRef(
      (props: any, ref: React.Ref<SVGSVGElement>): JSX.Element => (
        <ResetSearch {...props} ref={ref} />
      )
    ),
    Check: forwardRef(
      (props: any, ref: React.Ref<SVGSVGElement>): JSX.Element => (
        <Save {...props} ref={ref} />
      )
    ),
    Search: forwardRef(
      (props: any, ref: React.Ref<SVGSVGElement>): JSX.Element => (
        <Search {...props} ref={ref} />
      )
    ),
    SortArrow: forwardRef(
      (props: any, ref: React.Ref<SVGSVGElement>): JSX.Element => (
        <ArrowUpward {...props} ref={ref} />
      )
    )
  };

  useEffect(() => {
    const activeDevices = devices
      ? devices.filter((device: IDeviceData): boolean => device.active)
      : [];
    setActiveCount(activeDevices.length);
    setData(devices);
  }, [devices]);

  const handleOnRowUpdate = (newData: IDeviceData): void => {
    const opts = {
      method: 'PATCH'
    };
    const active = newData.active;
    const url = `${BASE_API}/devices/${newData.name}?active=${active}`;
    fetch(url, opts)
      .then(async response => {
        const jsonResponse = await response.json();
        if (response.status !== 200) {
          throw new Error(`Error while updating device: ${jsonResponse}`);
        }
        setDevicesUpdating(false);
      })
      .catch(err => {
        setDevicesUpdating(false);
        alert(err.message);
      });
  };

  useEffect(() => {
    const savedColumnOrder = localStorage.getItem('column-order');
    if (savedColumnOrder) {
      const parsedColumns = JSON.parse(savedColumnOrder);
      setColumns(parsedColumns);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('column-order', JSON.stringify(columns));
  }, [columns]);

  const handleOnColumnDragged = (
    sourceIndex: number,
    destinationIndex: number
  ): void => {
    const columnsCopy = [...columns];
    const columnToReorder = columnsCopy.splice(sourceIndex, 1)[0];
    columnsCopy.splice(destinationIndex, 0, columnToReorder);
    setColumns(columnsCopy);
  };

  return (
    <div style={{ maxWidth: '100%', paddingBottom: '50px' }}>
      <MaterialTable
        title="Devices"
        editable={{
          onRowUpdate: (
            newData: IDeviceData,
            oldData?: IDeviceData
          ): Promise<void> => {
            return new Promise(resolve => {
              if (newData.active.toString() === oldData?.active.toString()) {
                return resolve();
              }
              setDevicesUpdating(true);
              resolve(handleOnRowUpdate(newData));
            });
          }
        }}
        columns={columns}
        data={data ? data : []}
        icons={tableIcons}
        isLoading={devicesUpdating}
        onColumnDragged={(
          sourceIndex: number,
          destinationIndex: number
        ): void => {
          handleOnColumnDragged(sourceIndex, destinationIndex);
        }}
        options={{
          paging: false
        }}
      />
      <p>Number of active devices: {activeCount}</p>
      <p>Number of inactive devices: {data ? data.length - activeCount : 0}</p>
    </div>
  );
};

export default Devices;
