import React, { useState } from 'react'

import { mdiMagnify } from '@lumx/icons'

import { TextField, Theme } from '@lumx/react'

interface SearchBarProps {
    theme?: Theme
    onSearch: (searchText: string) => void
}
const SearchBar: React.FC<SearchBarProps> = ({
    theme = Theme.light,
    onSearch,
}) => {
    const [searchTerm, setValue] = useState<any>('')

    const handleSearch = (text: string) => {
        setValue(text)
        if (onSearch) {
            onSearch(text)
        }
    }

    return (
        <TextField
            title="Search"
            icon={mdiMagnify}
            value={searchTerm}
            onChange={handleSearch}
            theme={theme}
        />
    )
}

export default SearchBar
