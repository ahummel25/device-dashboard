import { useEffect, useState } from 'react';
import fetch from 'isomorphic-fetch';

import { BASE_API } from '../services/api';
import { IDeviceData, IDeviceResponse } from '../types';

export const useGetDevices = (
  devicesUpdated: boolean
): IDeviceData[] | null => {
  const [devicesResponse, setDevicesResponse] = useState<IDeviceData[] | null>(
    null
  );

  useEffect(() => {
    let mounted = true;
    const getDevices = async (): Promise<void> => {
      if (mounted) {
        const response = await fetch(`${BASE_API}/devices`);
        const devices: IDeviceResponse = await response.json();
        setDevicesResponse(devices.data);
      }
    };

    getDevices();

    return (): void => {
      mounted = false;
    };
  }, [devicesUpdated]);

  return devicesResponse;
};
