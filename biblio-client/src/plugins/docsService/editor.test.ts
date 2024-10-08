import { describe, expect, it } from 'vitest';
import { BaseOperation, createEditor, withoutNormalizing } from 'slate';
import { applyOperations, normalizeBuffActions } from './utils';




describe('normalizeBuffActions', () => {

	it('insert_text: accorpare', () => {
		const actions: BaseOperation[] = [
			{
				type: "set_selection",
				properties: null,
				newProperties: { anchor: { path: [0, 0], offset: 2 }, focus: { path: [0, 0], offset: 2 } }
			},
			{
				type: "insert_text",
				path: [0, 0],
				offset: 2,
				text: "x"
			},
			{
				type: "insert_text",
				path: [0, 0],
				offset: 3,
				text: "y"
			},
			{
				type: "insert_text",
				path: [0, 0],
				offset: 4,
				text: "z"
			}
		]

		const children = applyOperations(actions, [
			{ children: [{ text: "prima riga molto lunga e appetitosa" }], },
			{ children: [{ text: "secondariga" }], },
			{ children: [{ text: "terza riga" }], },
		])
		const norm = normalizeBuffActions(actions)
		const childrenNorm = applyOperations(norm, [
			{ children: [{ text: "prima riga molto lunga e appetitosa" }], },
			{ children: [{ text: "secondariga" }], },
			{ children: [{ text: "terza riga" }], },
		])

		expect(children).toEqual(childrenNorm)
	})

	it('set_selection: solo ultima selezione', () => {
		const actions: BaseOperation[] = [
			{
				type: "set_selection",
				properties: null,
				newProperties: { anchor: { path: [0, 0], offset: 2 }, focus: { path: [0, 0], offset: 2 } }
			},
			{
				type: "set_selection",
				properties: { anchor: { path: [0, 0], offset: 2 }, focus: { path: [0, 0], offset: 2 } },
				newProperties: { anchor: { path: [0, 0], offset: 3 }, focus: { path: [0, 0], offset: 3 } }
			},
			{
				type: "insert_text",
				path: [0, 0],
				offset: 2,
				text: "x"
			},
			{
				type: "set_selection",
				properties: { anchor: { path: [0, 0], offset: 2 }, focus: { path: [0, 0], offset: 2 } },
				newProperties: { anchor: { path: [0, 0], offset: 3 }, focus: { path: [0, 0], offset: 3 } }
			},
			{
				type: "insert_text",
				path: [0, 0],
				offset: 3,
				text: "y"
			}
		]
		const norm = normalizeBuffActions(actions)

		expect(norm).toMatchObject([{ type: "insert_text" }, { type: "set_selection" }, { type: "insert_text" }])
	})

	it('remove_text: semplificare in back', () => {
		const actions: BaseOperation[] = [
			{
				type: "remove_text",
				path: [0, 0],
				offset: 4,
				text: "a"
			},
			{
				type: "remove_text",
				path: [0, 0],
				offset: 3,
				text: "m"
			},
			{
				type: "remove_text",
				path: [0, 0],
				offset: 2,
				text: "i"
			},
			{
				type: "remove_text",
				path: [0, 0],
				offset: 1,
				text: "r"
			}
		]

		const children = applyOperations(actions, [
			{ children: [{ text: "prima riga molto lunga e appetitosa" }], },
			{ children: [{ text: "secondariga" }], },
			{ children: [{ text: "terza riga" }], },
		])
		const norm = normalizeBuffActions(actions)
		const childrenNorm = applyOperations(norm, [
			{ children: [{ text: "prima riga molto lunga e appetitosa" }], },
			{ children: [{ text: "secondariga" }], },
			{ children: [{ text: "terza riga" }], },
		])

		expect(norm).toHaveLength(1)
		expect(children).toEqual(childrenNorm)
	})

	it('remove_text: semplificare in foward', () => {
		const actions: BaseOperation[] = [
			{
				type: "remove_text",
				path: [0, 0],
				offset: 1,
				text: "r"
			},
			{
				type: "remove_text",
				path: [0, 0],
				offset: 1,
				text: "i"
			},
			{
				type: "remove_text",
				path: [0, 0],
				offset: 1,
				text: "m"
			},
			{
				type: "remove_text",
				path: [0, 0],
				offset: 1,
				text: "a"
			}
		]

		const children = applyOperations(actions, [
			{ children: [{ text: "prima riga molto lunga e appetitosa" }], },
			{ children: [{ text: "secondariga" }], },
			{ children: [{ text: "terza riga" }], },
		])
		const norm = normalizeBuffActions(actions)
		const childrenNorm = applyOperations(norm, [
			{ children: [{ text: "prima riga molto lunga e appetitosa" }], },
			{ children: [{ text: "secondariga" }], },
			{ children: [{ text: "terza riga" }], },
		])


		expect(norm).toHaveLength(1)
		expect(children).toEqual(childrenNorm)
	})

	it('remove_text: semplificare in back and foward', () => {
		const actions: BaseOperation[] = [
			{
				type: "remove_text",
				path: [0, 0],
				offset: 4,
				text: "a"
			},
			{
				type: "remove_text",
				path: [0, 0],
				offset: 3,
				text: "m"
			},
			{
				type: "remove_text",
				path: [0, 0],
				offset: 2,
				text: "i"
			},
			{
				type: "remove_text",
				path: [0, 0],
				offset: 2,
				text: " "
			}
		]

		const children = applyOperations(actions, [
			{ children: [{ text: "prima riga molto lunga e appetitosa" }], },
			{ children: [{ text: "secondariga" }], },
			{ children: [{ text: "terza riga" }], },
		])
		const norm = normalizeBuffActions(actions)
		const childrenNorm = applyOperations(norm, [
			{ children: [{ text: "prima riga molto lunga e appetitosa" }], },
			{ children: [{ text: "secondariga" }], },
			{ children: [{ text: "terza riga" }], },
		])

		expect(norm).toHaveLength(1)
		expect(children).toEqual(childrenNorm)
	})

	it('split_node: verify', () => {
		const actions: BaseOperation[] = [
			{
				"type": "split_node",
				"path": [0, 0],
				"position": 5,
				"properties": {}
			},
			{
				"type": "split_node",
				"path": [0],
				"position": 1,
				"properties": {
					"type": "text"
				}
			}
		]

		const original = [{ children: [{ text: "pippo inzaghi" }] }]
		const expected = [
			{ children: [{ text: "pippo" }] },
			{ type: "text", children: [{ text: " inzaghi" }] },
		]

		const result = applyOperations(actions, original)

		expect(result).toEqual(expected)
	})

})

