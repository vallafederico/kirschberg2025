import { createEffect, onCleanup } from "solid-js";
import { isServer } from "solid-js/web";

/**
 * @param key - KeyboardEvent.key to listen for (e.g. "Escape", "Enter")
 * @param callback - Function to run when key is pressed
 * @param opts - {
 *   target?: EventTarget,
 *   eventType?: "keydown" | "keyup",
 *   modifiers?: {
 *     ctrlKey?: boolean,
 *     shiftKey?: boolean,
 *     altKey?: boolean,
 *     metaKey?: boolean
 *   }
 * }
 */
export function useKeypress(
	key: string,
	callback: (e: KeyboardEvent) => void,
	opts?: {
		target?: EventTarget;
		eventType?: "keydown" | "keyup";
		modifiers?: {
			ctrlKey?: boolean;
			shiftKey?: boolean;
			altKey?: boolean;
			metaKey?: boolean;
		};
	},
) {
	if (isServer) return;
	const target = opts?.target || window;

	if (!target) return;
	const eventType = opts?.eventType || "keydown";
	const modifiers = opts?.modifiers || {};

	const handler = (e: KeyboardEvent) => {
		let keyMatch = e.key === key;
		let modifiersMatch = true;

		// Check if all specified modifiers match the event's state
		if (modifiers) {
			if (modifiers.ctrlKey !== undefined && e.ctrlKey !== modifiers.ctrlKey)
				modifiersMatch = false;
			if (modifiers.shiftKey !== undefined && e.shiftKey !== modifiers.shiftKey)
				modifiersMatch = false;
			if (modifiers.altKey !== undefined && e.altKey !== modifiers.altKey)
				modifiersMatch = false;
			if (modifiers.metaKey !== undefined && e.metaKey !== modifiers.metaKey)
				modifiersMatch = false;
		}

		if (keyMatch && modifiersMatch) {
			callback(e);
		}
	};

	createEffect(() => {
		target.addEventListener(
			eventType,
			handler as EventListenerOrEventListenerObject,
		);
	});

	onCleanup(() => {
		target.removeEventListener(
			eventType,
			handler as EventListenerOrEventListenerObject,
		);
	});

	target.addEventListener(
		eventType,
		handler as EventListenerOrEventListenerObject,
	);

	onCleanup(() => {
		target.removeEventListener(
			eventType,
			handler as EventListenerOrEventListenerObject,
		);
	});
}
