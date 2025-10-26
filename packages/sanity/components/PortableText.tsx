import {
	PortableText as PortableTextComponent,
	type PortableTextProps,
} from "@portabletext/solid";
import { clientOnly } from "@solidjs/start";

export default function PortableText(props: PortableTextProps) {
	// Portable text cant render on the server, need to use client only
	return clientOnly(() => {
		return Promise.resolve({
			default: PortableTextComponent,
		});
	})(props);

	// return <PortableTextComponent {...props} />;
}
