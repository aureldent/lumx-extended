import React, { useState } from 'react'

import { Theme, Switch, Toolbar, Divider } from '@lumx/react'

import { useInjectTheme } from './useInjectTheme'



const withThemeProvider = (Story, context) => {
	useInjectTheme(context.globals.globalTheme)

	const [lumxTheme, setLumxTheme] = useState<Theme>(Theme.light)
	const dark = 'lumx-color-background-dark-N'
	const className = lumxTheme == Theme.dark ? dark : ''

	context.args.theme = lumxTheme
	return (
		<>
			<div className={className}>
				<Story {...context} />
			</div>
			<Divider/>
			<Toolbar
				after={
					<Switch
						checked={lumxTheme === Theme.dark}
						onToggle={() => {
							lumxTheme === Theme.dark
								? setLumxTheme(Theme.light)
								: setLumxTheme(Theme.dark)
						}}
					>Background</Switch>
				}
			/>
		</>
	)
}
export default withThemeProvider
