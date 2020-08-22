import React, { useEffect } from 'react'
import {
	Select,
	List,
	ListItem,
	Progress,
	ProgressVariant,
	Size,
	ListSubheader,
	TextField,
	Theme,
	Icon
} from '@lumx/react'
import { mdiMagnify } from '@lumx/icons'

import useBooleanState from '../../hooks/useBooleanState'
import useDebounce from '../../hooks/useDebounce'

interface SelectChoice {
	/**
	 * The label of the choice that will be displayed
	 */
	label: string
	/**
	 * The value used internally for comparisons
	 */
	value: string
	/**
	 * The whole data
	 */
	data: any
	/**
	 * An mdi icon to put before the choice
	 */
	icon?: string
}

export interface SimpleSelectProps {
	/**
	 * The label displayed above the select
	 */
	label: string | React.ReactNode
	/**
	 * The value currently selected
	 */
	value: SelectChoice | undefined
	/**
	 * Handler called when a value is picked by the user
	 */
	onPicked: (pickedValue: SelectChoice | undefined) => void
	/**
	 * Handler called when a value is picked by the user
	 */
	choices: Array<SelectChoice> | undefined
	isRequired?: boolean
	isLoading?: boolean
	withSearch?: boolean
	helper?: React.ReactNode | string
	hasError?: boolean
	onInfiniteScroll?: () => void
	onSearch?: (filterValue: string) => void
	isSearching?: boolean
	noDataFiller?: string | React.ReactNode
	isDisabled?: boolean
	theme?: Theme
}

export const SimpleSelect: React.FC<SimpleSelectProps> = ({
	choices,
	isRequired = false,
	value,
	onPicked: setValue,
	label,
	isLoading = false,
	withSearch = true,
	helper = '',
	hasError = false,
	onInfiniteScroll = undefined,
	onSearch = undefined,
	isSearching = undefined,
	noDataFiller = undefined,
	isDisabled = false,
	theme = undefined
}) => {
	const [isOpen, closeSelect, , toggleSelect] = useBooleanState(false)
	const clearSelectedvalues = (event: any) => {
		event.stopPropagation()
		setValue(undefined)
	}
	theme = theme || Theme.light

	const onItemSelectedHandler = (item: any) => {
		closeSelect()
		if (item) {
			setValue(item)
		}
	}

	const [filterValue, setFilterValue] = React.useState<string | undefined>(
		undefined
	)
	const [filteredChoices, setFilteredChoices] = React.useState<
		Array<any> | undefined
	>(undefined)

	const handleOnSearch = async () => {
		if (onSearch && filterValue !== undefined) {
			onSearch(filterValue)
		}
	}

	useEffect(() => {
		let filteredChoices: any = []
		if (!onSearch && filterValue) {
			filteredChoices = choices?.filter((choice: SelectChoice) =>
				choice?.label
					.replace(' ', '')
					.toLowerCase()
					.includes(filterValue.replace(' ', '').toLowerCase())
			)
		} else {
			filteredChoices = choices
		}

		setFilteredChoices(filteredChoices ? filteredChoices : undefined)
	}, [filterValue, choices])

	const onInfScroll = () => {
		if (onInfiniteScroll) {
			onInfiniteScroll()
		}
	}

	const [,] = useDebounce(
		() => {
			handleOnSearch()
		},
		500,
		[filterValue]
	)

	return (
		<Select
			theme={theme}
			label={label as any}
			value={value?.label || ''}
			isOpen={isOpen}
			onClear={clearSelectedvalues}
			isRequired={isRequired}
			onInputClick={toggleSelect}
			onDropdownClose={closeSelect}
			onInfiniteScroll={onInfScroll}
			helper={helper as any}
			hasError={hasError}
			isDisabled={isDisabled}
		>
			<List isClickable={isOpen}>
				{withSearch && (
					<ListSubheader className='toolbox-select-wrapper-search-list-subheader'>
						<div style={{ display: 'flex' }}>
							<TextField
								style={{ width: '100%', padding: 0 }}
								value={filterValue}
								onChange={setFilterValue}
								icon={mdiMagnify}
								size={Size.tiny}
							/>{' '}
							{isSearching && <Progress />}
						</div>
					</ListSubheader>
				)}
				{!isLoading &&
					filteredChoices &&
					filteredChoices.length > 0 &&
					filteredChoices.map((choice: SelectChoice, index: number) => {
						return (
							<ListItem
								before={choice.icon && <Icon icon={choice.icon} />}
								isSelected={choice.value === value?.value}
								onItemSelected={() => onItemSelectedHandler(choice)}
								key={index}
							>
								{choice.label}
							</ListItem>
						)
					})}
			</List>
			{!isLoading && (!choices || choices.length === 0) && (
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center'
					}}
				>
					{noDataFiller ? noDataFiller : 'No data'}
				</div>
			)}
			{isLoading && <Progress theme={theme} variant={ProgressVariant.linear} />}
		</Select>
	)
}
