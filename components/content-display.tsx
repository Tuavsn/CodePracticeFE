import DOMPurify from 'isomorphic-dompurify';

interface ContentDisplayProps {
	content: string
	className?: string
}

export default function ContentDisplay({ content, className }: ContentDisplayProps) {
	const cleanHTML = DOMPurify.sanitize(content);

	return (
		<div
			className={`${className} prose max-w-none`}
			dangerouslySetInnerHTML={{ __html: cleanHTML }}
		/>
	);
}