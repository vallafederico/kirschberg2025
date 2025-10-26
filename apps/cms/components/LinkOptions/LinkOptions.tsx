import { Box, Button, Flex, Select, Stack, Tab, TabList } from "@sanity/ui";
import { useCallback, useEffect, useState } from "react";
import { CgExternal } from "react-icons/cg";
import { MdEmail, MdLink, MdPhone } from "react-icons/md";
import { MemberField, set } from "sanity";
import styles from "./link-options.module.css";

export default function LinkOptions(props) {
	const [tabOptions, setTabOptions] = useState([]);
	const {
		elementProps: { id, onBlur, onFocus, placeholder, readOnly, ref, value },
		onChange,
		schemaType,
		validation,
		renderField,
		renderInput,
		members,
		renderItem,
		renderPreview,
		// value = '',
	} = props;

	// const hasLabel = !schemaType?.options?.noLabel

	const handleTypeSelect = useCallback(
		async (linkType: string) => {
			onChange(set({ ...props.value, linkType }));
			// await getReferencedPageData()
		},
		[onChange],
	);

	const options = [
		{ name: "Page", value: "internal", icon: MdLink },
		{ name: "URL", value: "external", icon: CgExternal },
	];

	const val = props?.value?.linkType?.toLowerCase?.() || "internal";

	const internalMembers = members.filter(
		(member: any) => member.name === "page",
	);
	const externalMembers = members.filter(
		(member: any) => member.name === "url" || member.name === "noFollow",
	);

	return (
		<Stack className={styles} space={3}>
			<TabList space={2}>
				{options.map((option, index) => (
					<Tab
						defaultChecked={props?.value?.linkType === option.value}
						// tone={props?.value?.linkType === option.value ? 'primary' : 'default'}
						selected={props?.value?.linkType === option.value}
						onClick={() => handleTypeSelect(option.value)}
						label={option.name}
						icon={option.icon}
						key={option.name}
						value={option.value}
					/>
				))}
			</TabList>
			<Flex direction="column" gap={4}>
				{val === "internal" &&
					internalMembers.map((member: any) => (
						<MemberField
							renderInput={renderInput}
							renderField={renderField}
							renderItem={renderItem}
							renderPreview={renderPreview}
							key={member.name}
							member={member}
						/>
					))}
				{val === "external" &&
					externalMembers.map((member: any) => (
						<MemberField
							renderInput={renderInput}
							renderField={renderField}
							renderItem={renderItem}
							renderPreview={renderPreview}
							key={member.name}
							member={member}
						/>
					))}
			</Flex>
		</Stack>
	);
}
