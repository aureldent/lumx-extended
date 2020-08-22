import React, { useState } from 'react'

import { SimpleSelect } from './SimpleSelect'
import { Theme } from '@lumx/react'
import { mdiMagnify, mdiAccessPoint } from '@lumx/icons'

export default {
	title: 'components/simpleselect/SimpleSelect',
	component: SimpleSelect
}

/**
 * Avatar story showing a simple avatar with different actions.
 * @return component with different actions.
 */
export const simpleSelectBasic = (props: any) => {

    const [pickedVal, setPickedVal] = useState(undefined)
	return (
		<SimpleSelect
            label='Label'
            {...props}
			choices={[
				{
					value: '1',
					label: 'choice1',
					icon: mdiMagnify,
					data: {}
                },
                {
					value: '2',
					label: 'choice2',
					icon: mdiAccessPoint,
					data: {}
				}
            ]}
            onPicked={setPickedVal}
            value={pickedVal}
		/>
	)
}
