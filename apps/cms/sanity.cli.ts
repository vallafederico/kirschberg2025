import { defineCliConfig } from "sanity/cli";
import { SANITY_CONFIG } from "@local/config";

export default defineCliConfig({
	api: {
		...SANITY_CONFIG,
	},
	studioHost: "kirschberg",
	/**
	 * Enable auto-updates for studios.
	 * Learn more at https://www.sanity.io/docs/cli#auto-updates
	 */
	deployment: {
		autoUpdates: false,
	},
});
