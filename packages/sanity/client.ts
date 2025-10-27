import { SANITY_CONFIG } from "@local/config";
import { createClient } from "@sanity/client";

const sanityClient = createClient({
	...SANITY_CONFIG,
	perspective: "published",
	useCdn: false,
	apiVersion: "2025-01-11",
	stega: {
		enabled: false, // only in preview
		studioUrl: "https://kirschberg.sanity.studio",
	},
	token: process.env.SANITY_TOKEN,
});

export default sanityClient;
