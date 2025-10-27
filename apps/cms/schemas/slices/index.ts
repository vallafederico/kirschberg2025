import { createSliceSet } from "../../utils/create";
import aboutSlices from "./about";
import caseSlices from "./case";
import header from "./header";
import richText from "./richText";

const globalPageSlices = [
	header,
	richText,
	...caseSlices,
	...aboutSlices,
] as any[];

const slices = createSliceSet({
	name: "pageSlices",
	title: "Page Slices",
	slices: globalPageSlices,
});

const caseStudySlices = createSliceSet({
	name: "caseStudySlices",
	title: "Case Study Slices",
	slices: caseSlices,
});

const aboutSlicesSet = createSliceSet({
	name: "aboutSlices",
	title: "About Slices",
	slices: aboutSlices,
});

export default [slices, caseStudySlices, ...globalPageSlices, aboutSlicesSet];
