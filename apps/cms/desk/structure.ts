import { IoShareSocial } from "react-icons/io5";
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
import { RiLayoutBottom2Line, RiLayoutTop2Line } from "react-icons/ri";
import { TbSettingsSearch } from "react-icons/tb";
import type {
	StructureBuilder,
	StructureResolver,
	StructureResolverContext,
} from "sanity/structure";
import { setupPages } from "../utils/structure-utils";

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
