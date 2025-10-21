import { setupPages } from "../utils/structure-utils";
import type {
	StructureBuilder,
	StructureResolver,
	StructureResolverContext,
} from "sanity/structure";
import {
	MdArchive,
	MdArticle,
	MdBusiness,
	MdHome,
	MdPerson,
	MdPerson2,
	MdSchema,
	MdSearch,
	MdSettings,
	MdSettingsSuggest,
} from "react-icons/md";
import {
	RiLayoutTop2Line,
	RiLayoutBottom2Line,
	RiLayoutMasonryFill,
} from "react-icons/ri";
import { IoShareSocial } from "react-icons/io5";
import { TbSettingsSearch } from "react-icons/tb";

export const structure: StructureResolver = (
	S: StructureBuilder,
	context: StructureResolverContext,
) => {
	const { singlePage, pageList, folder, div } = setupPages(S);

	return S.list()
		.title("Studio")
		.items([
			singlePage("Home", "home", MdHome),
			div(),
			singlePage("About", "about", MdPerson2),
			singlePage("Archive", "archive", MdArchive),
			div(),
			pageList("Case Studies", "case-study", MdArticle),
			pageList("Clients", "client", MdBusiness),
			pageList("Collaborators", "collaborator", MdPerson),
			div(),
			folder("Settings", MdSettings, [
				singlePage("Header", "settings.header", RiLayoutTop2Line),
				singlePage("Footer", "settings.footer", RiLayoutBottom2Line),
				div(),
				singlePage("Global SEO", "seoDefaults", MdSearch),
				div(),
				pageList("Social Networks", "socialNetworks", IoShareSocial),
				folder("Schema Markup", MdSchema, [
					singlePage(
						"Schema Markup Defaults",
						"schemaMarkupDefaults",
						MdSettingsSuggest,
					),
					div(),
					pageList("People", "schemaMarkupPerson", MdPerson),
					pageList("Organizations", "schemaMarkupOrganization", MdBusiness),
				]),
			]),
		]);
};
