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

export type IRowUpdateNewDataResponse = Omit<IDeviceResponse, 'active'> & {
  active: boolean | string;
};
