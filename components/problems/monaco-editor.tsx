'use client'
import dynamic from "next/dynamic"

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false })

interface EditorProps {
	onEditorChange: () => void;
	onEditorMount: () => void;
	theme: 'vs-light' | 'vs-dark';
	code: string;
	selectedLanguage: string;
}

export default function Editor({
	selectedLanguage,
	code,
	theme,
	onEditorChange,
	onEditorMount
}: EditorProps) {
	return (
		<MonacoEditor
			height="100%"
			language={selectedLanguage}
			value={code}
			onChange={onEditorChange}
			onMount={onEditorMount}
			theme={theme}
			options={{
				minimap: { enabled: false },
				fontSize: 14,
				lineNumbers: "on",
				roundedSelection: false,
				scrollBeyondLastLine: false,
				automaticLayout: true,
				tabSize: 2,
				wordWrap: "on",
			}}
		/>
	)
}