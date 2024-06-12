import { BaseElement, BaseText } from "slate"
import { ViewState } from "../../viewBase"
import { COLOR_VAR } from "@/stores/layout"
import { Action } from "./actions"


/**
 * tipi di BLOCK nel documento
 */
export enum NODE_TYPES {
	PARAGRAPH = "paragraph",
	CHAPTER = "chapter",
	CARD = "card",
	TEXT = "text",
	CODE = "code",
	IMAGE = "image",
}

/**
 * Tipi di FORMAT del testo
 */
export enum NODE_FORMATS {
	BOLD = "bold",
	ITALIC = "italic",
	STRIKETHROUGH = "strikethrough",
	CODE = "code",
	LINK = "link",
}

export type ElementType = {
	id?: string
	type?: NODE_TYPES
} & BaseElement

export type ElementCard = {
	data: Partial<ViewState>
	subtitle?: string
	colorVar?: COLOR_VAR
} & ElementType

export type ElementImage = {
	url: string,
} & ElementType

export type TextType = {
	link?: boolean
	url?: string
	bold?: boolean
	italic?: boolean
	code?: boolean
} & BaseText

/** NODE tipizzato dell'editor */
export type NodeType = Node & ElementCard & ElementImage & TextType

export interface RemoteDoc {
	children: NodeType[]
	actions: Action[]
}


export function isNodeEq(node1: NodeType, node2: NodeType): boolean {
	return node1.type == node2.type 
		&& (
			node1.children == node2.children
			|| (node1.children.length == node2.children.length && node1.children[0].text == node2.children[0].text)
		)
} 