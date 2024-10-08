//import srcBg from "@/assets/bg4.jpg"
import MainMenu from "@/app/mainMenu/MainMenu"
import authSo from "@/stores/auth"
import docsSo from "@/stores/docs"
import { DragCmp, TooltipCmp, ZenCard } from "@priolo/jack"
import { useStore } from "@priolo/jon"
import { FunctionComponent, useEffect } from "react"
import cls from "./App.module.css"
import DeckGroup from "./DeckGroup"
import DrawerGroup from "./DrawerGroup"
import { delay } from "../utils/time"



const App: FunctionComponent = () => {

	// STORES
	const docsSa = useStore(docsSo)

	// HOOKS
	useEffect(() => {
		async function fn() {
			await delay(1000)
			// spostare in start session
			await authSo.current()
		}
		fn() 
	}, [])

	// HANDLERS

	// RENDER
	const clsContent = `${cls.content} ${cls[docsSa.drawerPosition]}`

	return (
		<div className={cls.root}>

			<ZenCard />

			<MainMenu />

			<div className={clsContent}>
				<DeckGroup />
				<DrawerGroup />
			</div>

			<DragCmp />
			<TooltipCmp />
		</div>
	)
}

export default App
