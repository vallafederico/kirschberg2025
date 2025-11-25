import Hls from "hls.js";
import { createEffect, onCleanup } from "solid-js";

interface MuxVideoProps {
	src: {
		asset: {
			playbackId: string;
		};
	};
	loop?: boolean;
	autoplay?: boolean;
	class: string;
}

export default function MuxVideo({
	src,
	autoplay = true,
	loop = true,
	class: className = "",
}: MuxVideoProps) {
	let el!: HTMLVideoElement; // ensure el is assigned before usage
	let hlsRef: Hls;

	const playbackId = src.asset?.playbackId;
	const url = `https://stream.mux.com/${playbackId}.m3u8`;
	const posterUrl = `https://image.mux.com/${playbackId}/thumbnail.webp`;

	createEffect(() => {
		if (!el || !playbackId || !Hls.isSupported()) return;

		if (playbackId && Hls.isSupported()) {
			const hls = new Hls();
			hls.loadSource(url);
			hls.attachMedia(el);
			hlsRef = hls;
		}
	});

	onCleanup(() => {
		if (hlsRef) {
			hlsRef.destroy();
		}
	});

	return (
		<video
			ref={el}
			controls={false}
			autoplay={autoplay}
			muted
			poster={posterUrl}
			class={className}
			playsinline
			loop={loop}
		/>
	);
}
