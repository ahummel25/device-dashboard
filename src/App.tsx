import React, { FC } from 'react';
import { hot } from 'react-hot-loader/root';

import Devices from './Devices';

const App: FC<{}> = () => (
  <div className="instructions">
    <h1>Relayr Device Dashboard</h1>
    <Devices />
  </div>
);

export default hot(App);
