import type { APIEvent } from "@solidjs/start/server";

const routeResolver = {
	home: "/",
	"case-study": "/case/:slug",
};

export async function POST({ request }: APIEvent) {
	// --- 1. Verify Authorization Header ---
	const authHeader = request.headers.get("authorization") ?? "";
	const token = authHeader.replace("Bearer ", "").trim();

	console.log("token", token);
	console.log(
		"process.env.SANITY_REVALIDATE_TOKEN",
		process.env.SANITY_REVALIDATE_TOKEN,
	);

	if (token !== process.env.SANITY_REVALIDATE_TOKEN) {
		return new Response(JSON.stringify({ ok: false, error: "unauthorized" }), {
			status: 401,
			headers: { "Content-Type": "application/json" },
		});
	}

	// --- 2. Parse Incoming Webhook Body ---
	let body: { _id?: string; _type?: string; slug?: string } = {};
	try {
		body = await request.json();
	} catch {
		return new Response(JSON.stringify({ ok: false, error: "invalid json" }), {
			status: 400,
			headers: { "Content-Type": "application/json" },
		});
	}

	console.log("body", body);
	console.log("request.url", request.url);

	if (!body.slug || !body._type) {
		return new Response(
			JSON.stringify({ ok: false, error: "missing slug or type" }),
			{
				status: 400,
				headers: { "Content-Type": "application/json" },
			},
		);
	}

	// --- 3. Determine Which Routes To Invalidate ---
	const paths = [
		"/",
		`/case-study/${body?.slug?.current}`, // Example: /blog/my-post
	];

	// --- 4. Invalidate Cached Pages (If On Vercel) ---
	try {
		// On Vercel, Nitro handles ISR invalidation automatically when using routeRules.isr
		// So we simply trigger the internal revalidation via fetch if desired
		for (const path of paths) {
			// You could call the live path to trigger rebuild if you want:
			await fetch(new URL(path, request.url).toString(), {
				method: "HEAD",
			}).catch(() => {});
		}
	} catch (err) {
		console.error("[ISR] Error revalidating:", err);
	}

	// --- 5. Log For Debug ---
	console.log(`[ISR] Sanity webhook revalidated: ${paths.join(", ")}`);

	// --- 6. Respond Cleanly ---
	return new Response(
		JSON.stringify({
			ok: true,
			message: `Revalidated ${paths.length} routes`,
			paths,
		}),
		{
			status: 200,
			headers: { "Content-Type": "application/json" },
		},
	);
}
