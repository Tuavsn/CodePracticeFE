'use client'
import dynamic from "next/dynamic"

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false })

interface EditorProps {
	onEditorChange: (code: string | undefined) => void;
	onEditorMount: (editor: any) => void;
	theme: 'vs-light' | 'vs-dark';
	code: string | undefined;
	language: string;
}

export default function Editor({
	language,
	code,
	theme,
	onEditorChange,
	onEditorMount
}: EditorProps) {
	return (
		<MonacoEditor
			height="100%"
			language={language}
			value={code}
			onChange={onEditorChange}
			onMount={onEditorMount}
			theme={theme}
			options={{
				minimap: { enabled: true },
				fontSize: 14,
				lineNumbers: "on",
				roundedSelection: false,
				scrollBeyondLastLine: false,
				automaticLayout: true,
				tabSize: 2,
				wordWrap: "on",
				padding: {
					top: 12,
					bottom: 12,
				},
			}}
		/>
	)
}