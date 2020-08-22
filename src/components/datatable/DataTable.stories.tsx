import React from 'react'

import { DataTable } from './DataTable'
import { ThScope } from '@lumx/react'

export default {
	title: 'components/DataTable',
	component: DataTable
}

const dateFormatterOptions = {
	timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
	year: 'numeric',
	month: 'numeric',
	day: 'numeric',
	hour: 'numeric',
	minute: 'numeric'
}
const dateFormatter = new Intl.DateTimeFormat(
	window.navigator.language,
	dateFormatterOptions
)

export const dataTableBasic = (props: any) => {
	const tableData = [
		{
			id: 1,
			firstName: 'John',
			lastName: 'Rambo',
			birthDate: new Date()
		},
		{
			id: 2,
			firstName: 'Jack',
			lastName: 'Dorsay',
			birthDate: new Date()
		},
		{
			id: 2,
			firstName: 'Johnny',
			lastName: 'Haliday',
			birthDate: new Date()
		}
	]

	const tableHeaders = [
		{
			isSortable: true,
			label: 'Id',
			name: 'id',
			scope: ThScope.col,
			searchable: true
		},
		{
			isSortable: true,
			label: 'First Name',
			name: 'firstName',
			scope: ThScope.col,
			searchable: true
		},
		{
			isSortable: true,
			label: 'Last Name',
			name: 'lastName',
			scope: ThScope.col,
			searchable: true
		},
		{
			isSortable: true,
			label: 'Birth Date',
			name: 'birthDate',
			scope: ThScope.col,
			searchable: true,
			customBodyRender: (cellValue: Date) => {
				return <b>{dateFormatter.format(cellValue)}</b>
			}
		}
	]
	return (
		<DataTable
			{...props}
			tableData={tableData}
			tableHeaders={tableHeaders}
			options={{
				search: true,
				filter: true,
				sort: true,
				viewColumns: true,
				download: true
			}}
		/>
	)
}
