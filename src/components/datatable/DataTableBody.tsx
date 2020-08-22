import React from 'react'

import { TableBody, Theme } from '@lumx/react'

import DataTableRow from './DataTableRow'
import { SelectableRowsOptions } from './DataTable'

interface DataTableBody0Props {
    theme?: Theme
    tableData: Array<any>
    tableHeaders: Array<any>
    selectedRows: Array<any>
    handleClickCheckbox: (checked: boolean, row: any) => void
    customRowRender?: (data: Array<any>, index: number) => React.Component
    selectableRows: SelectableRowsOptions
}

const DataTableBody: React.FC<DataTableBody0Props> = ({
    theme = Theme.light,
    tableData,
    tableHeaders,
    selectedRows,
    handleClickCheckbox,
    customRowRender,
    selectableRows,
}) => {
    return (
        <>
            <TableBody>
                {tableData &&
                    tableData.map((row: any, index: number) => {
                        return (
                            <DataTableRow
                                theme={theme}
                                row={row}
                                index={index}
                                tableHeaders={tableHeaders}
                                selectedRows={selectedRows}
                                handleClickCheckbox={handleClickCheckbox}
                                customRowRender={customRowRender}
                                selectableRows={selectableRows}
                            />
                        )
                    })}
            </TableBody>
        </>
    )
}

export default DataTableBody
