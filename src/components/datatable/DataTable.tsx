import React, { FC, useState, useEffect, useCallback } from 'react'

import { mdiClose, mdiDownload } from '@lumx/icons'

import {
	Chip,
	Checkbox,
	Icon,
	Size,
	Table,
	TableCell,
	TableCellVariant,
	TableHeader,
	TableRow,
	ThOrder,
	ThScope,
	Theme,
	Toolbar,
	Emphasis,
	IconButton
} from '@lumx/react'

import DataTableBody from './DataTableBody'
import TablePagination, { ITransalatedPaginationText } from './TablePagination'
import ViewColumns from './ViewColumns'
import Filter from './Filter'
import SearchBar from './SearchBar'

// For the Download to csv
//@ts-ignore
import { buildURI } from './toCsv'
import DataTableSmall from './DataTableSmall'
import useWindowSize from '../../hooks/useWindowSize'

export enum SelectableRowsOptions {
	multiple = 'multiple',
	single = 'single',
	none = 'none'
}
export interface ITableHeader {
	label: string
	name: string
	searchable?: boolean
	isSortable?: boolean
	scope?: ThScope
	download?: boolean
	customBodyRender?: (
		cellValue: string,
		rowIndex: number,
		headerIndex: number,
		row: any
	) => React.ReactNode | string
}
interface DataTableOptions {
	paginated?: boolean
	serverSide?: boolean
	count?: number
	rowsPerPage?: number
	rowsPerPageOptions?: Array<number>
	viewColumns?: boolean
	filter?: boolean
	search?: boolean
	sort?: boolean
	download?: boolean
	selectableRows?: SelectableRowsOptions
	baseToolbar?: (theme?: Theme) => React.Component
	actionToolbar?: (
		selectedRows: Array<any>,
		displayData: Array<any>,
		setSelectedRows: (selectedRows: Array<any>) => void,
		theme: Theme
	) => React.Component
	footerToolbar?: (
		count: number,
		page: number,
		rowsPerPage: number,
		changeRowsPerPage: (rowsPerPage: number) => void,
		changePage: (page: number) => void,
		theme: Theme
	) => React.Component
	customRowRender?: (data: Array<any>, index: number) => React.Component
	onRowSelected?: (selectedRows: Array<any>) => void
	onColumnSortChange?: (changedColumn: string, direction: string) => void
	noDataFiller?: any
	customToolbar?: (
		tableData: Array<any>,
		tableHeaders: Array<ITableHeader>,
		displayedHeaders: Array<ITableHeader>,
		setDisplayedHeaders: (headers: Array<ITableHeader>) => void
	) => React.Component
	translatedPaginationText?: ITransalatedPaginationText
	filterButtonTitle?: any
}

export interface DataTableProps {
	theme?: Theme
	title?: string
	options?: DataTableOptions
	tableData: Array<any>
	tableHeaders: Array<ITableHeader>
}

export const DataTable: FC<DataTableProps> = ({
	theme = Theme.light,
	title = undefined,
	options: {
		onRowSelected,
		baseToolbar,
		actionToolbar,
		footerToolbar,
		paginated,
		rowsPerPage: rpp,
		rowsPerPageOptions,
		viewColumns,
		filter,
		search,
		sort,
		download,
		serverSide,
		onColumnSortChange,
		customRowRender,
		selectableRows,
		noDataFiller,
		customToolbar,
		translatedPaginationText,
		filterButtonTitle
	} = {
		onRowSelected: undefined,
		baseToolbar: undefined,
		actionToolbar: undefined,
		footerToolbar: undefined,
		paginated: false,
		rpp: 10,
		rowsPerPageOptions: [10, 25, 50],
		viewColumns: true,
		filter: true,
		search: true,
		sort: true,
		download: false,
		serverSide: false,
		onColumnSortChange: undefined,
		customRowRender: undefined,
		selectableRows: SelectableRowsOptions.multiple,
		noDataFiller: undefined,
		customToolbar: undefined,
		translatedPaginationText: undefined,
		filterButtonTitle: 'Filter Table'
	},
	tableData,
	tableHeaders
}) => {
	selectableRows = selectableRows || SelectableRowsOptions.multiple
	rpp = rpp || 10
	rowsPerPageOptions = rowsPerPageOptions || [10, 25, 50]
	theme = theme || Theme.light

	const [displayedHeaders, setDisplayedHeaders] = useState<Array<ITableHeader>>(
		tableHeaders
	)
	const [displayData, setDisplayData] = useState<Array<any>>([...tableData])
	const [filterData, setFilterData] = useState<Array<any>>([])
	const [selectedRows, setSelectedRows] = useState<Array<any>>([])

	const [filters, setFilters] = useState<any>([])

	const [page, setPage] = useState<number>(1)
	const [rowsPerPage, setRowsPerPage] = useState<number>(rpp)

	const [count, setCount] = useState(tableData.length)

	const { width } = useWindowSize()

	/*
	 * Handle setting correctly the table data
	 * when filtering/searching
	 */
	const setCorrectData = useCallback(
		(resetPage: boolean) => {
			let sourceData = [...tableData]
			if (filterData && filterData.length > 0) {
				sourceData = [...filterData]
				if (resetPage && !serverSide) {
					setPage(1)
				}
			}
			setDisplayData(
				sourceData.slice((page - 1) * rowsPerPage, page * rowsPerPage)
			)
			setCount(sourceData.length)
		},
		[
			filterData,
			tableData,
			page,
			rowsPerPage,
			setCount,
			setDisplayData,
			setPage,
			serverSide
		]
	)

	/*
	 * Handle what happend when the left side checkbox is clicked
	 */
	const handleClickCheckbox = (checked: boolean, row: any) => {
		var index = selectedRows.indexOf(row.id)
		if (selectableRows === SelectableRowsOptions.multiple) {
			if (checked) {
				setSelectedRows([...selectedRows, row.id])
			} else {
				const array = [...selectedRows]
				if (index !== -1) {
					array.splice(index, 1)
					setSelectedRows(array)
				}
			}
		} else if (selectableRows === SelectableRowsOptions.single) {
			if (selectedRows.length === 0) {
				if (checked) {
					setSelectedRows([row.id])
				}
			} else {
				if (!checked && selectedRows[0] === row.id) {
					setSelectedRows([])
				}
			}
		}
	}

	/*
	 * If a user give a onRowSelected function
	 * call it each time selectedRows is updated
	 */
	useEffect(() => {
		if (onRowSelected) {
			onRowSelected(selectedRows)
		}
	}, [selectedRows, onRowSelected])

	/*
	 * Pagination handling
	 */

	const changeRowsPerPage = (_rowsPerPage: number) => {
		if (_rowsPerPage < 0) {
			return
		}
		setRowsPerPage(_rowsPerPage)
	}

	const changePage = (_page: number) => {
		if (_page <= 0 || _page > Math.ceil(count / rowsPerPage)) {
			return
		}
		setPage(_page)
	}

	useEffect(() => {
		setCorrectData(false)
	}, [page, rowsPerPage, setCorrectData])

	/*
	 * Select all
	 */
	const [allRowsSelected, setAllRowsSelected] = useState(false)
	const handleAllRowsSelected = () => {
		const newVal = !allRowsSelected
		setAllRowsSelected(newVal)
		if (newVal) {
			const newData = [...displayData]
				.slice((page - 1) * rowsPerPage, page * rowsPerPage)
				.map((el: any) => el.id)
			setSelectedRows(newData)
		} else {
			setSelectedRows([])
		}
	}

	/*
	 * Search
	 */
	const onSearch = (searchText: string) => {
		if (searchText && searchText.length) {
			const searchResults = tableData.filter((elem: any) => {
				for (let field of tableHeaders) {
					if (
						field.searchable &&
						elem[field.name] &&
						elem[field.name].toString().includes(searchText)
					) {
						return true
					}
				}
				return false
			})
			setFilterData(searchResults)
		} else {
			setFilterData([])
		}
		setCorrectData(true)
	}

	/*
	 * Filter
	 */
	const onFilter = (filters: any) => {
		setFilters(filters)

		if (filters && filters.length > 0) {
			let filterResults = [...tableData]
			filters.forEach((filter: any) => {
				filterResults = [
					...filterResults.filter((el: any) =>
						filter.filter === 'ALL'
							? true
							: el[filter.headerName].toString() === filter.filter
					)
				]
			})
			setFilterData([...filterResults])
		} else {
			setFilterData([])
		}
		setCorrectData(true)
	}

	const dismissFilter = (filter: any) => {
		onFilter([...filters.filter((el: any) => el !== filter)])
	}

	/*
	 * Sort
	 */

	/*
	 * Function to sort alphabetically an array of objects by some specific key.
	 *
	 * @param {String} property Key of the object to sort.
	 */
	const dynamicSort = (property: string, sortOrder: string) => {
		return (a: any, b: any) => {
			if (sortOrder === 'asc') {
				return b[property] < a[property] ? 1 : -1
			} else {
				return a[property] > b[property] ? -1 : 1
			}
		}
	}

	const handleSort = useCallback(
		(header) => {
			const sortOrder =
				header.sortOrder === ThOrder.asc ? ThOrder.desc : ThOrder.asc
			setDisplayedHeaders(
				displayedHeaders.map((h: any) => ({
					...h,
					sortOrder: h.name === header.name ? sortOrder : null
				}))
			)
			setDisplayData([...displayData.sort(dynamicSort(header.name, sortOrder))])
			if (onColumnSortChange) {
				onColumnSortChange(header.name, sortOrder)
			}
		},
		[displayedHeaders, displayData, onColumnSortChange]
	)

	/*
	 * Download Csv
	 */

	const handleDownload = () => {
		let csvData: any = new Set()
		tableData.forEach((row: any) => {
			tableHeaders.forEach((header: any) => {
				if (header.download && row[header.name]) {
					csvData.add(row)
				}
			})
		})
		csvData = [...csvData]
		const csvHeaders = tableHeaders
			.map((header: any) => (header.download ? header.name : false))
			.filter(Boolean)
		const csvUrl = buildURI(csvData, false, csvHeaders, ',', '')
		const a = document.createElement('a')
		a.download = 'file'
		a.href = csvUrl || ''
		a.click()
	}

	const baseActionBarDisplayed = !selectedRows || selectedRows.length === 0
	const isSelectable =
		selectableRows === SelectableRowsOptions.multiple ||
		selectableRows === SelectableRowsOptions.single

	const activeToolbar = (
		<>
			{search && <SearchBar theme={theme} onSearch={onSearch} />}
			{download && (
				<IconButton
					theme={theme}
					title='Download CSV'
					icon={mdiDownload}
					onClick={handleDownload}
					emphasis={Emphasis.low}
				/>
			)}
			{!customRowRender && viewColumns && (
				<ViewColumns
					theme={theme}
					tableHeaders={tableHeaders}
					setDisplayedHeaders={setDisplayedHeaders}
					displayedHeaders={displayedHeaders}
				/>
			)}
			{filter && (
				<Filter
					theme={theme}
					tableHeaders={tableHeaders}
					tableData={tableData}
					onFilter={onFilter}
					filters={filters}
					filterButtonTitle={filterButtonTitle}
				/>
			)}
		</>
	)
	return (
		<>
			{/* Table Actions */}
			<div>
				{/* Action Bar when rows are selected */}
				{selectedRows.length > 0 && (
					<div
						style={{
							boxShadow:
								'0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)',
							borderRadius: '4px'
						}}
					>
						<Toolbar
							before={`${selectedRows.length} row(s) selected`}
							after={
								actionToolbar ? (
									actionToolbar(selectedRows, tableData, setSelectedRows, theme)
								) : baseToolbar ? (
									baseToolbar(theme)
								) : (
									<></>
								)
							}
						/>
					</div>
				)}

				{/* Base action bar (no row selected) */}
				{baseActionBarDisplayed && (
					<>
						{customToolbar ? (
							<>
								{customToolbar(
									tableData,
									tableHeaders,
									displayedHeaders,
									setDisplayedHeaders
								)}
							</>
						) : (
							<Toolbar
								before={title}
								after={
									<div
										style={{
											display: 'flex',
											alignContent: 'center',
											alignItems: 'center'
										}}
									>
										{activeToolbar}
									</div>
								}
							/>
						)}
					</>
				)}
			</div>

			<div style={{ display: 'flex', alignItems: 'center' }}>
				{filters.map((filter: any, idx: number) => (
					<Chip
						key={idx}
						theme={theme}
						size={Size.s}
						after={<Icon icon={mdiClose} size={Size.xxs} />}
						onClick={() => {
							dismissFilter(filter)
						}}
					>
						{filter.filter}
					</Chip>
				))}
			</div>

			{/* Table */}
			{width && width > 950 && (
				<Table hasBefore={isSelectable} hasDividers theme={theme}>
					<TableHeader>
						<TableRow>
							{/* Checkbox Column */}
							{isSelectable && (
								<TableCell
									key={-1}
									isSortable={false}
									scope={ThScope.col}
									variant={TableCellVariant.head}
								>
									<Checkbox
										theme={theme}
										disabled={selectableRows === SelectableRowsOptions.single}
										value={allRowsSelected}
										onChange={handleAllRowsSelected}
									/>
								</TableCell>
							)}

							{/* Other Columns */}
							{displayedHeaders.map((header: any, index: number) => (
								<TableCell
									key={index}
									icon={header.icon}
									scope={header.scope}
									variant={TableCellVariant.head}
									sortOrder={sort ? header.sortOrder : undefined}
									isSortable={sort ? header.isSortable : false}
									onHeaderClick={sort ? () => handleSort(header) : undefined}
								>
									{header.label}
								</TableCell>
							))}
						</TableRow>
					</TableHeader>

					{displayData && displayData.length > 0 && (
						<>
							<DataTableBody
								theme={theme}
								tableData={displayData}
								tableHeaders={displayedHeaders}
								selectedRows={selectedRows}
								handleClickCheckbox={handleClickCheckbox}
								customRowRender={customRowRender}
								selectableRows={selectableRows}
							/>
						</>
					)}
				</Table>
			)}

			{width && width <= 950 && displayData && displayData.length > 0 && (
				<DataTableSmall
					theme={theme}
					tableData={displayData}
					tableHeaders={displayedHeaders}
					isSelectable={isSelectable}
					selectedRows={selectedRows}
					handleClickCheckbox={handleClickCheckbox}
				/>
			)}

			{noDataFiller && displayData && displayData.length === 0 && (
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center'
					}}
				>
					{noDataFiller}
				</div>
			)}

			{/* Footer Bar */}
			{displayData && displayData.length > 0 && (
				<Toolbar
					after={
						paginated && !footerToolbar ? (
							<TablePagination
								theme={theme}
								count={count}
								page={page}
								rowsPerPage={rowsPerPage}
								changeRowsPerPage={changeRowsPerPage}
								changePage={changePage}
								rowsPerPageOptions={rowsPerPageOptions}
								translatedPaginationText={translatedPaginationText}
							/>
						) : footerToolbar ? (
							footerToolbar(
								count,
								page,
								rowsPerPage,
								changeRowsPerPage,
								changePage,
								theme
							)
						) : (
							<></>
						)
					}
				/>
			)}
		</>
	)
}

export default DataTable
