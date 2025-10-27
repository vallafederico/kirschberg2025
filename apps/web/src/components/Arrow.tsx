export default function Arrow({ class: className = "" }: { class: string }) {
	return (
		<svg
			class={className}
			width="12"
			height="12"
			viewBox="0 0 12 12"
			aria-hidden="true"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M1.69744 11.1861L0 9.48864L7.16619 2.31534H1.78267L1.79687 0H11.179V9.3892H8.84943L8.86364 4.01278L1.69744 11.1861Z"
				fill="currentColor"
			/>
		</svg>
	);
}
