import React, { useState, useRef } from 'react'

import { mdiViewWeek } from '@lumx/icons'

import {
	IconButton,
	Popover,
	Emphasis,
	List,
	ListItem,
	ListSubheader,
	Checkbox,
	Theme
} from '@lumx/react'
import { ITableHeader } from './DataTable'

interface ViewColumnsProps {
	theme?: Theme
	displayedHeaders: Array<ITableHeader>
	setDisplayedHeaders: (headers: Array<ITableHeader>) => void
	tableHeaders: Array<ITableHeader>
}

const ViewColumns: React.FC<ViewColumnsProps> = ({
	theme = Theme.light,
	setDisplayedHeaders,
	tableHeaders,
	displayedHeaders
}) => {
	/*
	 * ViewColumns filter
	 */

	const [isTooltipDisplayed, setIsTooltipDisplayed] = useState(false)
	const anchorRef = useRef(null)

	/*
	 * Add or remove a headers when checking or unchecking it in the
	 * filter popover
	 */
	const changeDisplayedHeaders = (checked: boolean, header: any) => {
		if (checked) {
			setDisplayedHeaders([
				...displayedHeaders.filter((h: any) => h.name !== header.name)
			])
		} else {
			let toFilter = [...tableHeaders]
			toFilter.filter((h: any) => h.name === header.name)
			setDisplayedHeaders(
				toFilter.sort(
					(a, b) => tableHeaders.indexOf(a) - tableHeaders.indexOf(b)
				)
			)
		}
	}
	return (
		<div>
			<div ref={anchorRef}>
				<IconButton
					title='View Columns'
					theme={theme}
					emphasis={Emphasis.low}
					icon={mdiViewWeek}
					onClick={() => setIsTooltipDisplayed(!isTooltipDisplayed)}
				/>
			</div>
			<Popover
				className='lumx-spacing-padding-horizontal-huge'
				anchorRef={anchorRef}
				isOpen={isTooltipDisplayed}
			>
				<List onMouseLeave={() => setIsTooltipDisplayed(false)} theme={theme}>
					<ListSubheader>Show Columns</ListSubheader>
					{tableHeaders.map((header: any, index: number) => {
						const checked =
							displayedHeaders.findIndex((i: any) => i.name === header.name) !==
							-1
						return (
							<ListItem theme={theme} key={index}>
								<Checkbox
									theme={theme}
									value={checked}
									onChange={() => changeDisplayedHeaders(checked, header)}
									label={header.label}
								/>
							</ListItem>
						)
					})}
				</List>
			</Popover>
		</div>
	)
}

export default ViewColumns
