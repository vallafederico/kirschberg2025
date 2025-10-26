export default function Quote({
	quote,
	author,
}: {
	quote: string;
	author: string;
}) {
	return (
		<section>
			<blockquote>
				<p>{quote}</p>
			</blockquote>
			<p>{author}</p>
		</section>
	);
}
