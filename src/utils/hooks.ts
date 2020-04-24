import { useEffect, useState } from 'react';

import { BASE_API } from '../services/api';
import { IDevicesResponse } from '../types';

export const useGetDevices = (devicesUpdated): IDevicesResponse | null => {
  const [
    devicesResponse,
    setDevicesResponse
  ] = useState<IDevicesResponse | null>(null);

  useEffect(() => {
    let mounted = true;
    const getDevices = async (): Promise<void> => {
      if (mounted) {
        const response = await fetch(`${BASE_API}/devices`);
        const devices: IDevicesResponse = await response.json();
        setDevicesResponse(devices);
      }
    };

    getDevices();

    return (): void => {
      mounted = false;
    };
  }, [devicesUpdated]);

  return devicesResponse;
};
