import { indentWithTab } from "@codemirror/commands"
import { StreamLanguage } from "@codemirror/language"
import { shell } from "@codemirror/legacy-modes/mode/shell"
import { Compartment, EditorSelection } from "@codemirror/state"
import { oneDark } from '@codemirror/theme-one-dark'
import { KeyBinding, keymap } from "@codemirror/view"
import { vim } from "@replit/codemirror-vim"
import { EditorView, basicSetup } from "codemirror"
import { autocompletion, completeFromList, CompletionContext, CompletionResult, completeAnyWord } from "@codemirror/autocomplete"

// invoke ajax by fetch api. path /admin/shell, return stirng lines

function ajaxShell(path: string, cmd: string, extras: { [key: string]: any }, cb: (lines: string[]) => void) {
	// add query parameter cmd to path, use GET method
	const url = new URL(path, window.location.origin);
	// Add the cmd parameter
	url.searchParams.append('cmd', cmd);
	// add all extras to url
	for (const [key, value] of Object.entries(extras)) {
		url.searchParams.append(key, value);
	}

	fetch(url.toString())
		.then((response) => {
			return response.text();
		})
		.then((text) => {
			const lines = text.split('\n');
			cb(lines);
		})
		.catch((err) => {
			console.log(err);
		});
}


function cm6(wrap: HTMLElement, doc: string | null, extras: { [key: string]: any }, cb: ((currentContent: string) => void) | null) {
	const tm = oneDark;
	const languageConf = new Compartment
	const themeConf = new Compartment
	const mykb: KeyBinding = {
		key: 'Ctrl-Enter', run: (ev) => {
			const ms = ev.state.selection.main

			// ev.state.doc.lineAt
			// how to get the content current line
			console.log(ms)
			const line = ev.state.doc.lineAt(ms.from)
			console.log("line: ", line)
			console.log("line text: ", line.text)

			if (line.text.trim() === 'clear') {
				const transaction = ev.state.update({
					changes: {
						from: 0, to: ev.state.doc.length, insert: ''
					},
					selection: EditorSelection.cursor(0)
				})
				ev.dispatch(transaction)
			} else {
				ajaxShell('/execute', line.text, extras, (lines) => {
					const insertText = `\n${lines.join('\n')}`
					const transaction = ev.state.update({
						changes: {
							from: ms.from, to: ms.to, insert: insertText
						},
						selection: EditorSelection.cursor(ms.from + insertText.length)
					})
					ev.dispatch(transaction)
				})
			}
			// move the cursor to the end of the document
			// const transaction = ev.state.update({ changes: { from: ms.from, to: ms.to, insert: `\neditor` } })
			// const transaction = ev.state.update({ changes: ChangeSet.empty(0) })
			// ev.dispatch(transaction)
			return true;
		}
	}

	const shellCompletionCache: { [key: string]: any } = {};

	const myCompletionSource = [completeAnyWord,
		(ctx: CompletionContext): CompletionResult => {
			const token = ctx.state.wordAt(ctx.pos);
			return {
				from: token?.from || ctx.pos,
				to: ctx.pos,
				options: [],
			};
		},
		async (ctx: CompletionContext): Promise<CompletionResult> => {
			const token = ctx.state.wordAt(ctx.pos)
			const line = ctx.state.doc.lineAt(ctx.pos)
			// get the word value
			const from = token?.from || ctx.pos;
			const to = ctx.pos;
			const partWord = ctx.state.sliceDoc(from, to)
			// Make the AJAX request
			const url = new URL("/completion", window.location.origin);
			// const url = new URL("/rest-get/", "http://localhost:4002");
			// Add the cmd parameter
			url.searchParams.append('line', line.text);
			url.searchParams.append('word', partWord);

			if (shellCompletionCache["g"]) {
				return { from, to, options: shellCompletionCache["g"] }
			}
			// add all extras to url
			const response = await fetch(url, {
				method: 'GET',
				// headers: {
				// 	'Content-Type': 'application/json',
				// },
				// body: JSON.stringify({
				// 	text: ctx.state.sliceDoc(from, to), // The partially typed word
				// }),
			})
			const data = await response.json()
			console.log(data)
			// Process the response to create the completion options
			const options = data.data.map((item: string) => ({ label: item }))
			shellCompletionCache["g"] = options
			return { from, to, options }
		}
	];

	const extensions = [
		keymap.of([mykb]),
		autocompletion({
			override: myCompletionSource
		}),
		vim(),
		basicSetup,
		themeConf.of(tm),
		keymap.of([mykb, indentWithTab]),
		languageConf.of(StreamLanguage.define(shell)),
		EditorView.updateListener.of(function (e) {
			// console.log(e.state)
			if (cb)
				cb(e.state.doc.toString());
			localStorage.setItem('docContent', e.state.doc.toString());
		}),
		EditorView.domEventHandlers({
			blur: () => {
				console.log('blur')
			}
		})
	]

	const view = new EditorView({
		doc: doc || localStorage.getItem('docContent') || '',
		extensions
	})

	return { view }

}

export default cm6