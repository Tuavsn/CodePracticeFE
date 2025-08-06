import DOMPurify from 'isomorphic-dompurify';

interface ContentDisplayProps {
	content: string
	className?: string
}

export default function ContentDisplay({ content, className }: ContentDisplayProps) {
	const cleanHTML = DOMPurify.sanitize(content);

	return (
		<div
			className={`${className} prose max-w-none prose-p:break-words prose-headings:break-words prose-a:break-all overflow-hidden`}
			dangerouslySetInnerHTML={{ __html: cleanHTML }}
		/>
	);
}