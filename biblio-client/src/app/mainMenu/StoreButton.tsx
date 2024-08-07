import { deckCardsSo } from "@/stores/docs/cards"
import { menuSo } from "@/stores/docs/links"
import { ViewStore } from "@/stores/stacks/viewBase"
import { useStore } from "@priolo/jon"
import { FunctionComponent } from "react"
import CardIcon from "../../components/cards/CardIcon"
import { DOC_TYPE } from "../../types"
import MenuButton from "./MenuButton"



interface Props {
	label?: string
	badge?: React.ReactNode
	store?: ViewStore
}

const StoreButton: FunctionComponent<Props> = ({
	label,
	badge,
	store,
}) => {

	// STORE
	const state = useStore(store)
	if ( !state ) return null
	// HOOKs

	// HANDLER
	const handleOpenStoreClick = (view: ViewStore) => deckCardsSo.add({ view, anim: true })
	const handleDeleteButtonClick = (view: ViewStore) => menuSo.remove(view)

	// RENDER
	if (!store) return null
	const type = store.state.type as DOC_TYPE
	//const colorVar = getColorFromViewType(type)
	const style = {
		'--dialog-bg': "black",
		'--dialog-fg': "white",
	} as React.CSSProperties;
	const canDelete = store.state.pinnable
	if (!label) label = store.getSubTitle()

	return (
		<MenuButton
			style={style}
			title={store.getTitle()}
			subtitle={label}
			badge={badge}
			onClick={() => handleOpenStoreClick(store)}
			onClose={canDelete ? () => handleDeleteButtonClick(store) : null}
		>
			<CardIcon type={type} style={{ width: 20 }} />
		</MenuButton>
	)
}

export default StoreButton
