import FrameworkCard from "@/components/cards/FrameworkCard"
import { TextEditorStore } from "@/stores/stacks/editor"
import { biblioOnKeyDown } from "@/stores/stacks/editor/utils/onkeydown"
import { useStore } from "@priolo/jon"
import { FunctionComponent } from "react"
import { Editable, Slate } from "slate-react"
import MessageIcon from "../../../icons/cards/MessageIcon"
import clsCard from "../CardCyanDef.module.css"
import ActionsCmp from "./Actions"
import cls from "./View.module.css"
import BiblioElement from "./elements/BiblioElement"
import BiblioLeaf from "./leafs/BiblioLeaf"
import EditorIcon from "../../../icons/EditorIcon"

import Prism from "prismjs";
//import { SetNodeToDecorations, useDecorate } from "./elements/Code"

import { Node } from "slate"
console.log(Object.keys(Prism.languages));
interface Props {
	store?: TextEditorStore
}

const EditorView: FunctionComponent<Props> = ({
	store,
}) => {

	// STORE
	useStore(store)

	// HOOKs

	// HANDLER
	const handleFocus = () => {
		store.setFormatOpen(true)
	}
	const handleBlur = () => {
		//store.setFormatOpen(false)
	}
	const handleStartDrag = (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
	}

	const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		biblioOnKeyDown(event, editor)
	}

	const handleValueChange = () => {
		store.onValueChange()
	}

	// RENDER
	const editor = store.state.editor
	//const decorate = useDecorate(editor)

	return <FrameworkCard
		className={clsCard.root}
		icon={<EditorIcon />}
		store={store}
		//actionsRender={<ActionsCmp store={store} />}
		iconizedRender={null}
	>
		<Slate
			editor={editor}
			initialValue={editor.children}
			onValueChange={handleValueChange}
		>

			<ActionsCmp store={store} style={{ margin: '-10px -10px 5px -10px' }} />
			{/* <SetNodeToDecorations /> */}
			<Editable
				decorate={decorateCode}
				className={cls.editor}
				style={{ flex: 1, overflowY: "auto" }}
				spellCheck={false}
				renderElement={props => <BiblioElement {...props} />}
				renderLeaf={props => <BiblioLeaf {...props} />}
				onKeyDown={handleKeyDown}
				onFocus={handleFocus}
				onBlur={handleBlur}
				onDragStart={handleStartDrag}
			/>

		</Slate>

	</FrameworkCard>
}

export default EditorView

const decorateCode = ([node, path]) => {
	const ranges = []
	if (node.type === 'code') {
		const text = Node.string(node)
		const tokens = Prism.tokenize(text, Prism.languages.markdown)
		let start = 0

		for (const token of tokens) {
			const length = token.length
			const end = start + length

			if (typeof token !== 'string') {
				ranges.push({
					anchor: { path, offset: start },
					focus: { path, offset: end },
					className: `token ${token.type}`,
				})
			}

			start = end
		}
	}
	return ranges
}