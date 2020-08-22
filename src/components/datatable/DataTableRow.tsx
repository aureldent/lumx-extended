import React from 'react'
import { TableRow, Theme, TableCell, Checkbox } from '@lumx/react'
import { ITableHeader, SelectableRowsOptions } from './DataTable'

interface DataTableRow {
    theme: Theme
    row: any
    index: number
    tableHeaders: Array<any>
    selectedRows: Array<any>
    handleClickCheckbox: (checked: boolean, row: any) => void
    customRowRender?: (data: Array<any>, index: number) => React.Component
    selectableRows: SelectableRowsOptions
}

const DataTableRow: React.FC<DataTableRow> = ({
    theme,
    row,
    index,
    tableHeaders,
    selectedRows,
    handleClickCheckbox,
    customRowRender,
    selectableRows,
}) => {
    return (
        <TableRow key={index}>
            {selectableRows !== SelectableRowsOptions.none && (
                <TableCell key={-1 * (index + 1)}>
                    <Checkbox
                        value={
                            selectedRows && selectedRows.indexOf(row.id) !== -1
                        }
                        theme={theme}
                        onChange={(checked: boolean) =>
                            handleClickCheckbox(checked, row)
                        }
                    />
                </TableCell>
            )}
            {customRowRender && customRowRender(row, index)}
            {!customRowRender &&
                tableHeaders.map((header: ITableHeader, hidx: number) => (
                    <TableCell key={hidx}>
                        {header.customBodyRender
                            ? header.customBodyRender(
                                  row[header.name],
                                  index,
                                  hidx,
                                  row
                              )
                            : row[header.name]}
                    </TableCell>
                ))}
        </TableRow>
    )
}

export default DataTableRow
