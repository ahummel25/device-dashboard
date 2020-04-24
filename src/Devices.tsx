import React, { FC, forwardRef, useEffect, useState } from 'react';
import styled from '@emotion/styled'
import MaterialTable from 'material-table'
import Cancel from '@material-ui/icons/Clear';
import Edit from '@material-ui/icons/Edit';
import ResetSearch from '@material-ui/icons/Close';
import Save from '@material-ui/icons/Check';
import Search from '@material-ui/icons/Search';
import { IDeviceResponse } from './interfaces'
import { useGetDevices } from './utils/hooks'

const MaterialTableStyled = styled(({ ...rest }) => <MaterialTable {...rest} />)`
`
const Devices: FC<{}> = () => {
	const devices = useGetDevices();
	const [activeCount, setActiveCount] = useState<number>(0);
	const tableIcons = {
		Clear: forwardRef((props: any, ref: React.Ref<SVGElement>) => <Cancel {...props} ref={ref} />),
		Edit: forwardRef((props: any, ref: React.Ref<SVGElement>) => <Edit {...props} ref={ref} />),
		ResetSearch: forwardRef((props: any, ref: React.Ref<SVGElement>) => <ResetSearch {...props} ref={ref} />),
		Check: forwardRef((props: any, ref: React.Ref<SVGElement>) => <Save {...props} ref={ref} />),
		Search: forwardRef((props: any, ref: React.Ref<SVGElement>) => <Search {...props} ref={ref} />),
	}
	
	useEffect(() => {
		const activeDevices = devices ? devices.data.map((device: IDeviceResponse) => device.active) : []
		setActiveCount(activeDevices.length)
	  });

    return (
		<div style={{ maxWidth: '100%' }}>
		<MaterialTableStyled
			editable={{
				onRowUpdate: (newData, oldData) =>
				{
					console.log(newData, oldData)
				}
			}}
			title="Devices"
			columns={[
				{ title: 'Name', field: 'name', editable: 'never' },
				{ title: 'Unit', field: 'unit', editable: 'never' },
				{ title: 'Value', field: 'value', editable: 'never', type: 'numeric' },
				{ title: 'Timestamp', field: 'timestamp', editable: 'never', type: 'numeric', },
				{ title: 'Active', field: 'active', editable: 'always', lookup: { true: 'Y', false: 'N' } },
			]}
			data={devices ? devices.data : []}
			icons={tableIcons}
			options={{
				paging: false
			}}
		/>
 		<p>Number of active devices: {activeCount}</p>
		</div>
    );
}

export default Devices;
