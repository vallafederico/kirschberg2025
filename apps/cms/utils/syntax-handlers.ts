/**
 * Syntax handler system for parsing field selectors in createPreview
 * This allows for modular extension of selector syntax
 */

/**
 * Syntax handler system for parsing field selectors in createPreview
 * This allows for modular extension of selector syntax
 */

export interface SyntaxHandler {
	/** Pattern to match against the selector string */
	pattern: RegExp;
	/** Function to process the matched selector and return the processed value */
	process: (
		match: RegExpMatchArray,
		previewParts: Record<string, unknown>,
	) => unknown;
	/** Name of the handler for debugging */
	name: string;
}

/**
 * Array indexing handler - handles syntax like images[0], items[1], etc.
 * Returns the element at the specified index from an array field
 */
export const arrayIndexHandler: SyntaxHandler = {
	name: "arrayIndex",
	pattern: /^(.+)\[(\d+)\]$/,
	process: (match, previewParts) => {
		const [, fieldName, indexStr] = match;
		const index = parseInt(indexStr, 10);
		const fieldValue = previewParts[fieldName];

		if (Array.isArray(fieldValue) && fieldValue.length > index) {
			return fieldValue[index];
		}

		return undefined;
	},
};

/**
 * Count function handler - handles syntax like count(items), count(images), etc.
 * Returns the length of an array field
 */
export const countHandler: SyntaxHandler = {
	name: "count",
	pattern: /^count\((.+)\)$/,
	process: (match, previewParts) => {
		const [, fieldName] = match;
		const fieldValue = previewParts[fieldName];

		if (Array.isArray(fieldValue)) {
			return fieldValue.length;
		}

		return 0;
	},
};

/**
 * Object property access handler - handles syntax like user.name, config.title, etc.
 * Returns the nested property from an object field
 */
export const objectPropertyHandler: SyntaxHandler = {
	name: "objectProperty",
	pattern: /^(.+)\.(.+)$/,
	process: (match, previewParts) => {
		const [, objectName, propertyName] = match;
		const objectValue = previewParts[objectName];

		if (
			objectValue &&
			typeof objectValue === "object" &&
			!Array.isArray(objectValue)
		) {
			return (objectValue as Record<string, unknown>)[propertyName];
		}

		return undefined;
	},
};

/**
 * Default handler for simple field names
 * Returns the field value as-is
 */
export const defaultHandler: SyntaxHandler = {
	name: "default",
	pattern: /^.+$/,
	process: (match, previewParts) => {
		const fieldName = match[0];
		return previewParts[fieldName];
	},
};

/**
 * Registry of all available syntax handlers
 * Handlers are processed in order, so more specific patterns should come first
 */
export const syntaxHandlers: SyntaxHandler[] = [
	arrayIndexHandler,
	countHandler,
	objectPropertyHandler,
	defaultHandler,
];

/**
 * Process a field selector using the registered syntax handlers
 * @param selector - The field selector string (e.g., "images[0]", "count(items)", "user.name")
 * @param previewParts - The preview data object containing field values
 * @returns The processed value from the selector
 */
export const processSelector = (
	selector: string,
	previewParts: Record<string, unknown>,
): unknown => {
	for (const handler of syntaxHandlers) {
		const match = selector.match(handler.pattern);
		if (match) {
			return handler.process(match, previewParts);
		}
	}

	// Fallback to default behavior
	return previewParts[selector];
};

/**
 * Add a new syntax handler to the registry
 * @param handler - The syntax handler to add
 * @param position - Optional position to insert at (defaults to beginning for higher priority)
 */
export const addSyntaxHandler = (
	handler: SyntaxHandler,
	position?: number,
): void => {
	if (position !== undefined) {
		syntaxHandlers.splice(position, 0, handler);
	} else {
		syntaxHandlers.unshift(handler);
	}
};

/**
 * Remove a syntax handler from the registry
 * @param handlerName - The name of the handler to remove
 */
export const removeSyntaxHandler = (handlerName: string): void => {
	const index = syntaxHandlers.findIndex(
		(handler) => handler.name === handlerName,
	);
	if (index !== -1) {
		syntaxHandlers.splice(index, 1);
	}
};
