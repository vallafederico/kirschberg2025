import { toPlainText } from "./string";

export const createPreview = (
	titleFieldName: string,
	subtitleFieldName?: string | null,
	mediaFieldName?: string | (() => unknown),
) => {
	// These can be undefined so this is fine
	const selectors: Record<string, string> = {};

	const extras: Record<string, unknown> = {};

	if (titleFieldName) {
		selectors.title = titleFieldName.toString();
	}

	if (titleFieldName.startsWith("{") && titleFieldName.endsWith("}")) {
		extras.title = titleFieldName.slice(1, -1);
		delete selectors.title;
	}

	if (subtitleFieldName) {
		selectors.subtitle = subtitleFieldName.toString();
	}

	if (subtitleFieldName?.startsWith("{") && subtitleFieldName.endsWith("}")) {
		extras.subtitle = subtitleFieldName.slice(1, -1);
		delete selectors.subtitle;
	}

	// Media cant be undefined, so only add it to object if its defined
	if (mediaFieldName) {
		if (typeof mediaFieldName === "string") {
			selectors.media = mediaFieldName;
		} else if (mediaFieldName instanceof Function) {
			extras.icon = mediaFieldName;
			// selectors.media = mediaFieldName()
		}
	}

	const createPrepare = (
		previewParts: Record<string, unknown>,
		extras: Record<string, unknown>,
	) => {
		const result: Record<string, unknown> = {};

		// Process all selectors first
		for (const [key] of Object.entries(selectors)) {
			// Handle extras (like static titles in curly braces)
			if (extras[key]) {
				result[key] = extras[key];
				continue;
			}

			// Get the raw value from previewParts - Sanity has already processed the selector
			const processedValue = previewParts[key];

			// Check if this is portable text (array of blocks with children)
			const isPortableText =
				Array.isArray(processedValue) &&
				processedValue.length > 0 &&
				processedValue.some((item: unknown) => {
					if (typeof item !== "object" || item === null) return false;
					const obj = item as Record<string, unknown>;
					return obj._type === "block" && Array.isArray(obj.children);
				});

			if (isPortableText) {
				result[key] = toPlainText(processedValue as any);
				continue;
			}

			const isArrayOfSomethingElse = Array.isArray(processedValue);

			if (isArrayOfSomethingElse) {
				result[key] = processedValue?.[0] || undefined;
				continue;
			}

			result[key] = processedValue;
		}

		// Add any extras that weren't processed as selectors
		for (const [key, value] of Object.entries(extras)) {
			if (!(key in result)) {
				result[key] = value;
			}
		}

		return result;
	};

	const cleanedSelectors = Object.fromEntries(
		Object.entries(selectors).map(([key, value]) => {
			// Transform our syntax to Sanity's GROQ syntax
			let groqSelector = value;

			// Handle array indexing: images[0] -> images[0...1][0]
			// GROQ uses slice syntax, so we need to get a slice first
			const arrayIndexMatch = value.match(/^(.+)\[(\d+)\]$/);
			if (arrayIndexMatch) {
				const [, fieldName, indexStr] = arrayIndexMatch;
				const index = parseInt(indexStr, 10);
				// Use GROQ array slicing: fieldName[index...index+1]
				groqSelector = `${fieldName}[${index}...${index + 1}][0]`;
			}

			// Handle count: count(items) -> coalesce(length(items), 0)
			if (value.startsWith("count(")) {
				const match = value.match(/^count\((.+)\)$/);
				if (match) {
					const [, fieldName] = match;
					groqSelector = `coalesce(length(${fieldName}), 0)`;
				}
			}

			// Object property (metadata.title) is valid GROQ syntax

			return [key, groqSelector];
		}),
	);

	const preview = {
		select: cleanedSelectors,
		prepare(previewParts: Record<string, unknown>) {
			return createPrepare(previewParts, extras);
		},
	};
	return preview;
};
