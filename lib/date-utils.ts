export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString("vi-VN", {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}