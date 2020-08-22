import React, { useRef, useState, useEffect } from 'react'

import {
	IconButton,
	Emphasis,
	Popover,
	List,
	ListItem,
	Select,
	Size,
	Theme
} from '@lumx/react'

import { mdiFilterVariant } from '@lumx/icons'
import useBooleanState from '../../hooks/useBooleanState'
import { ITableHeader } from './DataTable'

interface FilterProps {
	theme?: Theme
	tableHeaders: Array<ITableHeader>
	tableData: Array<any>
	onFilter: any
	filters: Array<any>
	filterButtonTitle: string
}

const Filter: React.FC<FilterProps> = ({
	theme = Theme.light,
	tableHeaders,
	tableData,
	onFilter,
	filters,
	filterButtonTitle
}) => {
	const [isTooltipDisplayed, setIsTooltipDisplayed] = useState(false)
	const anchorRef = useRef(null)

	/*
	 * Filter values of the table
	 */
	const onFilterSelected = (filter: string, headerName: string) => {
		const previousFilters = filters.filter(
			(el: any) => el.headerName !== headerName
		)
		const newFilters = [
			...previousFilters,
			{ filter: filter, headerName: headerName }
		]
		if (onFilter) {
			onFilter(newFilters)
		}
	}

	return (
		<>
			<div ref={anchorRef}>
				<IconButton
					theme={theme}
					title={filterButtonTitle}
					emphasis={Emphasis.low}
					icon={mdiFilterVariant}
					onClick={() => setIsTooltipDisplayed(!isTooltipDisplayed)}
				/>
			</div>
			<Popover
				className='lumx-spacing-padding-horizontal-huge'
				anchorRef={anchorRef}
				isOpen={isTooltipDisplayed}
			>
				<div
					className='lumx-spacing-padding-vertical-huge'
					onMouseLeave={() => setIsTooltipDisplayed(false)}
					style={{ minWidth: '200px' }}
				>
					Filters
					<List theme={theme}>
						{(tableHeaders || []).map((header: any, index: number) => {
							let headerDataValues: any = new Set(
								(tableData || [])
									.map((data) => data[header.name]?.toString())
									.filter(Boolean)
							)
							headerDataValues = Array.from(headerDataValues)
							headerDataValues.unshift('ALL')
							return (
								<FilterSelects
									theme={theme}
									key={index}
									headerDataValues={headerDataValues}
									index={index}
									header={header}
									onFilterSelected={onFilterSelected}
									filters={filters}
								/>
							)
						})}
					</List>
				</div>
			</Popover>
		</>
	)
}

interface FilterSelectsProps {
	theme?: Theme
	headerDataValues: Array<any>
	onFilterSelected: any
	index: number
	header: any
	filters: Array<any>
}

const FilterSelects: React.FC<FilterSelectsProps> = ({
	theme = Theme.light,
	headerDataValues,
	onFilterSelected,
	index,
	header,
	filters
}) => {
	const [value, setValue] = useState(headerDataValues[0])
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [isOpen, closeSelect, , toggleSelect] = useBooleanState(false)

	// Reset filters when removed via chips
	useEffect(() => {
		const filterNames = filters.map((el: any) => el.filter)
		if (filterNames && filterNames.length > 0) {
			const isInFilter = filterNames.includes(value)
			if (value !== 'ALL' && !isInFilter) {
				setValue(headerDataValues[0])
			}
		} else {
			setValue(headerDataValues[0])
		}
	}, [filters])

	const handleFilterSelected = (filter: string, headerName: string) => {
		setValue([filter])
		closeSelect()
		if (onFilterSelected) {
			onFilterSelected(filter, headerName)
		}
	}
	const [highlighted, setHighlighted] = useState<any>(null)

	return (
		<ListItem theme={theme} key={index}>
			<Select
				theme={theme}
				style={{ width: '100%' }}
				label={header.label}
				value={value}
				isOpen={isOpen}
				onInputClick={toggleSelect}
				onDropdownClose={closeSelect}
			>
				<List theme={theme}>
					{headerDataValues && headerDataValues.length > 0
						? headerDataValues.map((dataValue: string) => {
								const isSelected = value === dataValue
								return (
									<ListItem
										className='lumx-spacing-padding-horizontal-big'
										theme={theme}
										key={dataValue}
										isSelected={isSelected}
										isHighlighted={highlighted && highlighted === dataValue}
										onItemSelected={() =>
											handleFilterSelected(dataValue, header.name)
										}
										size={Size.tiny}
									>
										<div onMouseEnter={() => setHighlighted(dataValue)}>
											{dataValue}
										</div>
									</ListItem>
								)
						  })
						: [
								<ListItem theme={theme} key={0} size={Size.tiny}>
									No data
								</ListItem>
						  ]}
				</List>
			</Select>
		</ListItem>
	)
}

export default Filter
