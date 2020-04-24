import { useEffect, useState } from 'react';
import { IDevicesResponse } from '../interfaces'

const BASE_API = 'http://localhost:8888'

export const useGetDevices = (): IDevicesResponse | null => {
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
	}, []);
  
	return devicesResponse;
  };