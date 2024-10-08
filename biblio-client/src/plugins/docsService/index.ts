import { BaseOperation } from "slate";
import docApi from "../../api/doc";
import { NODE_TYPES, NodeType } from "../../stores/stacks/editor/slate/types";
import { DOC_STATUS, RemoteDoc } from "../../types/Doc";
import { generateUUID } from "../../utils/object";
import { applyOperations, normalizeBuffActions } from "./utils";



const library: { [id: string]: RemoteDoc } = {}

export function getDocLib(docId: string): RemoteDoc {
	if (!docId) return null
	return library[docId]
}

export function createDocLib( ): RemoteDoc {
	const remote = {
		doc: {
			id: generateUUID(),
		},
		status: DOC_STATUS.LOCAL,
		buffIn: [],
		buffOut: []
	}
	library[remote.doc.id] = remote
	return remote
}

export function removeDocLib(docId:string): RemoteDoc {
	if ( !docId ) return
	delete library[docId]
}

/** in un DOC inserisco un ACTION nel suo buffer */
export async function addActionDoc(docId: string, action: BaseOperation) {
	if (!docId || !action) return
	let remote: RemoteDoc = getDocLib(docId)
	remote?.buffOut.push(action)
}



/** recupera un Doc (localmente oppure dal BE) */
export async function fetchDoc(docId: string): Promise<RemoteDoc> {
	if (!docId) return null
	let remote: RemoteDoc = getDocLib(docId)
	if (!!remote) return remote
	// se non lo trovo localmente lo cerco nel BE
	const doc = (await docApi.get(docId))?.data
	// oooh non c'e'!!!
	if (!doc) return null
	// c'e' lo memoizzo localmente e lo restituisco
	return library[docId] = remote = { doc, status: DOC_STATUS.SYNC, buffIn: [], buffOut: [] }
}

/** sincronizzo tutte le ACTIONs col BE */
export async function syncRemoteDoc(docId: string) {
	if (!docId) return

	// recupero il REMOTE-DOC
	const remote: RemoteDoc = await fetchDoc(docId)
	if (!remote || !remote.buffOut || remote.buffOut.length == 0) return

	// se si tratta di un DOC nuovo nuovo allora lo creo
	let res: { data: string }
	if (remote.status == DOC_STATUS.LOCAL) {
		remote.doc.children = applyOperations(remote.buffOut, remote.doc.children) as NodeType[]
		res = (await docApi.create(remote.doc))
	} else {
		const actions = normalizeBuffActions(remote.buffOut)
		res = await docApi.update(docId, actions)
		remote.doc.children = applyOperations(remote.buffOut, remote.doc.children) as NodeType[]
	}
	
	if (res.data != "ok") return
	console.log("evviva!")

	remote.status = DOC_STATUS.SYNC
	library[docId].buffOut = []
}
