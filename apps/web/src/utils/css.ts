export const setCssVariable = (variable: string, value: string) => {
	if (!document) return;

	document.documentElement.style.setProperty(variable, value);
};

export const getCssVariable = (variable: string) => {
	if (!document) return;

	return document.documentElement.style.getPropertyValue(variable);
};
