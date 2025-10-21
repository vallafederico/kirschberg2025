export default function Media({
	mediaType,
	image,
	video,
}: {
	mediaType: string;
	image: any;
	video: any;
}) {
	return (
		<div>
			<h2>{mediaType}</h2>
			<img src={image.asset.url} alt={image.asset.altText} />
			<video src={video.asset.url} alt={video.asset.altText} />
		</div>
	);
}
