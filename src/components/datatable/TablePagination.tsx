import React, { useState, useEffect } from 'react'
import {
	Emphasis,
	IconButton,
	List,
	ListItem,
	Select,
	Size,
	Theme
} from '@lumx/react'

import { mdiChevronLeft, mdiChevronRight } from '@lumx/icons'
import useBooleanState from '../../hooks/useBooleanState'

export interface ITransalatedPaginationText {
	rowsPerPage?: string | React.ReactNode
	of?: string | React.ReactNode
}
interface TablePaginationProps {
	theme?: Theme
	count: number
	page: number
	rowsPerPage: number
	changeRowsPerPage: (rowsPerPage: number) => void
	changePage: (page: number) => void
	rowsPerPageOptions: Array<number>
	translatedPaginationText?: ITransalatedPaginationText
}

const TablePagination: React.FC<TablePaginationProps> = ({
	theme = Theme.light,
	count,
	page,
	rowsPerPage,
	changeRowsPerPage,
	changePage,
	rowsPerPageOptions,
	translatedPaginationText = {}
}) => {
	const handleNextPage = () => changePage(page + 1)
	const handlePreviousPage = () => changePage(page - 1)

	/*
	 * Select rowsPerPage
	 */
	const [value, setValue] = useState(rowsPerPage.toString())
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [isOpen, closeSelect, , toggleSelect] = useBooleanState(false)
	const handleChangeRowsPerPage = (_rowsPerPage: number) => {
		setValue(_rowsPerPage.toString())
		changeRowsPerPage(_rowsPerPage)
	}
	useEffect(() => {
		closeSelect()
	}, [value, closeSelect])

	const lastPage = Math.ceil(count / rowsPerPage)
	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				alignContent: 'center'
			}}
		>
			<span>
				{translatedPaginationText?.rowsPerPage
					? translatedPaginationText.rowsPerPage
					: 'Rows Per Page:'}
			</span>
			<Select
				className='lumx-spacing-margin-horizontal-huge'
				style={{ maxWidth: '100px' }}
				isOpen={isOpen}
				value={value}
				theme={theme}
				onInputClick={toggleSelect}
				onDropdownClose={closeSelect}
			>
				<List theme={theme} isClickable={isOpen}>
					{rowsPerPageOptions.length > 0
						? rowsPerPageOptions.map((choice: number, index: number) => {
								const val = choice.toString()
								return (
									<ListItem
										theme={theme}
										isSelected={value === val}
										key={index}
										onItemSelected={() => handleChangeRowsPerPage(choice)}
										size={Size.tiny}
									>
										{choice}
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
			<span>
				{(page - 1) * rowsPerPage + 1}-
				{count < rowsPerPage * page ? count : rowsPerPage * page}{' '}
				{translatedPaginationText?.of ? translatedPaginationText.of : 'of'}{' '}
				{count}
			</span>
			<IconButton
				emphasis={Emphasis.low}
				icon={mdiChevronLeft}
				theme={theme}
				disabled={page === 1}
				onClick={handlePreviousPage}
			/>
			<IconButton
				emphasis={Emphasis.low}
				icon={mdiChevronRight}
				theme={theme}
				disabled={page === lastPage}
				onClick={handleNextPage}
			/>
		</div>
	)
}

export default TablePagination
