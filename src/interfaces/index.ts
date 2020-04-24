export interface IDeviceResponse {
	  name: string;
	  unit: string;
	  value: number;
	  timestamp: number;
	  active: boolean;
}

export interface IDevicesResponse {
	data: IDeviceResponse[];
}