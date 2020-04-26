export interface IDeviceData {
  name: string;
  unit: string;
  value: number;
  timestamp: number;
  active: boolean;
}

export interface IDeviceResponse {
  data: IDeviceData[];
}
