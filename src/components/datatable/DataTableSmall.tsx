import React from 'react'
import { List, ListItem, Theme, Checkbox, Divider } from '@lumx/react'
import { ITableHeader } from './DataTable'

interface DataTableSmallProps {
    theme: Theme
    tableData: Array<any>
    tableHeaders: Array<ITableHeader>
    isSelectable: boolean
    handleClickCheckbox?: any
    selectedRows?: Array<any>
}

const DataTableSmall: React.FC<DataTableSmallProps> = ({
    theme,
    tableData,
    tableHeaders,
    isSelectable,
    handleClickCheckbox,
    selectedRows,
}) => {
    return (
        <>
            <List theme={theme}>
                {tableData.map((row: any, index: number) => {
                    return (
                        <ListItem
                            key={index}
                            before={
                                isSelectable && (
                                    <div
                                        style={{
                                            padding: '8px',
                                        }}
                                    >
                                        <Checkbox
                                            value={
                                                selectedRows &&
                                                selectedRows.indexOf(row.id) !==
                                                    -1
                                            }
                                            theme={theme}
                                            onChange={(checked: boolean) =>
                                                handleClickCheckbox(
                                                    checked,
                                                    row
                                                )
                                            }
                                        />
                                    </div>
                                )
                            }
                        >
                            {/* ROw block */}
                            <List theme={theme}>
                                {tableHeaders.map(
                                    (header: ITableHeader, hidx: number) => {
                                        return (
                                            <>
                                                {hidx > 0 &&
                                                    hidx <
                                                        tableHeaders.length && (
                                                        <Divider
                                                            style={{
                                                                backgroundColor:
                                                                    'rgba(0, 0, 0, 0.12)',
                                                            }}
                                                        />
                                                    )}

                                                <ListItem
                                                    key={header.name}
                                                    style={{
                                                        minHeight: '40px',
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            alignItems:
                                                                'center',
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                width: '50%',
                                                            }}
                                                        >
                                                            {header.label}
                                                        </div>
                                                        <div
                                                            style={{
                                                                width: '50%',
                                                            }}
                                                        >
                                                            {header.customBodyRender
                                                                ? header.customBodyRender(
                                                                      row[
                                                                          header
                                                                              .name
                                                                      ],
                                                                      index,
                                                                      hidx,
                                                                      row
                                                                  )
                                                                : row[
                                                                      header
                                                                          .name
                                                                  ]}
                                                        </div>
                                                    </div>
                                                </ListItem>
                                            </>
                                        )
                                    }
                                )}
                            </List>
                            <Divider />
                        </ListItem>
                    )
                })}
            </List>
        </>
    )
}

export default DataTableSmall
