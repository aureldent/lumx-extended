import React, { useState, useEffect } from 'react'

import { Theme, Switch, Toolbar, Divider } from '@lumx/react'

import { GlobalTheme } from '@lumx/core/js/types'

/**
 * Please make sure that these themes are in the same order
 * as the `GLOBAL_THEMES` constant.
 */
import '@lumx/core/scss/lumx-theme-lumapps.scss'
import '@lumx/core/scss/lumx-theme-material.scss'
import '@lumx/core/lumx-theme-lumapps.css'
import '@lumx/core/lumx-theme-material.css'


const GLOBAL_THEMES = ['lumapps', 'material'] as GlobalTheme[]
const stylesNodes: Node[] = []

/**
 * This effect retrieves all the injected styles that were added
 * by storybook, and only adds the ones associated to the current theme.
 *
 * Upon clicking the theme selector chips, we can update the theme
 * currently used, and execute this effect once again to determine which
 * theme we want to use.
 *
 * In the first execution, we cache the styles that were added, in order to
 * use them later on once the theme changing starts.
 *
 * @author juanigalan91 & gcornut
 * @param globalTheme The theme to inject.
 */
export function useInjectTheme(globalTheme: GlobalTheme) {
	useEffect(() => {
        const currentStyle = GLOBAL_THEMES.indexOf(globalTheme)
        const nodes = document.querySelectorAll('style#injected-styles')
        

		if (stylesNodes.length === 0) {
			/**
			 * In the first execution, we cache the styles that were added, in order to
			 * use them later on once the theme changing starts.
			 *
			 * We also take the opportunity to remove all the other styles that are not needed.
			 */
			nodes.forEach((node, position) => {
				stylesNodes.push(node.cloneNode(true))

				if (position !== currentStyle) {
					node.remove()
				}
			})
		} else {
			/**
			 * In this step, we have already remove the initial unnecessary styles,
			 * we just need to add the selected theme. We remove all the current styles
			 * and only add the stylesheet needed from the cached list.
			 */
			nodes.forEach((node) => {
				node.remove()
			})

			document.head.appendChild(stylesNodes[currentStyle])
		}
	}, [globalTheme])
}

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
