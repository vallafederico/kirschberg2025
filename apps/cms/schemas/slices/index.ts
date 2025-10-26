import header from "./header";
import richText from "./richText";
import caseSlices from './case'

import { createSliceSet } from "../../utils/create";


const globalPageSlices = [header, richText, ...caseSlices] as any[] 

const slices = createSliceSet({
	name: "pageSlices",
	title: "Page Slices",
	slices: globalPageSlices,
});

const caseStudySlices = createSliceSet({
	name: "caseStudySlices",
	title: "Case Study Slices",
	slices: caseSlices,
})

export default [slices, caseStudySlices, ...globalPageSlices];
