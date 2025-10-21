import { SANITY_CONFIG } from "@local/config";
import { createClient } from "@sanity/client";

const sanityClient = createClient({
	...SANITY_CONFIG,
	perspective: "drafts",
	useCdn: false,
	apiVersion: "2025-01-11",
	stega: {
		enabled: true, // only in preview
		studioUrl: "https://kirschberg.sanity.studio",
	},
	token:
		"skqo9rdCnlnN8OOGbaqg5S4pREgQUwJ56tZMuFAvi17vrd7AbBWDwoYgO5vvnUGsW1CGQN0PwEzXtMKogQl2ksLgU1xnZVi4dzfrzYNRZrdLoxpR2ibiiQhizHTZYBy70q27gPgGgtzHL1yC3Yh1DRnAndDfxzS4Mfct4iQlLuLMyfUG4GOv",
});

export default sanityClient;
