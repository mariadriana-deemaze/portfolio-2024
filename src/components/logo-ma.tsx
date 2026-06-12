import type { SVGProps } from 'react';

import { cn } from '@/utils/utils';

type LogoMAProps = SVGProps<SVGSVGElement>;

export const LogoMark = ({ className, ...props }: LogoMAProps) => (
	<svg
		width="37"
		height="18"
		viewBox="0 3 37 18"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		role="img"
		aria-label="Maria Adriana"
		className={cn('w-auto', className)}
		{...props}
	>
		<path
			d="M8.97021 3.15039H16.8042C17.1323 3.1504 17.4299 3.31123 17.6089 3.5752V3.57617L22.9468 11.5566L22.9478 11.5596C23.1375 11.8333 23.1552 12.197 22.9907 12.5068L20.2017 17.7715H20.2007L20.1997 17.7734C19.8743 18.4153 18.9679 18.4634 18.5649 17.8604L18.564 17.8594L14.6899 12.0859C14.1608 11.2775 12.9514 11.3552 12.521 12.2031L8.44189 20.165C8.27773 20.4741 7.94907 20.6805 7.59326 20.6807H1.10205C0.403208 20.6807 -0.056433 19.9471 0.255371 19.3174L0.254395 19.3164L8.12256 3.67871L8.12549 3.67383C8.27157 3.35727 8.6116 3.15043 8.97021 3.15039Z"
			fill="url(#lm_fill0)"
			fillOpacity="0.22"
			stroke="url(#lm_stroke0)"
			strokeWidth="0.5"
		/>
		<path
			d="M27.2495 4.93567C27.6094 4.25867 28.5934 4.2511 28.9478 4.92102V4.922L36.7476 19.4747C37.0707 20.1011 36.6148 20.8497 35.8804 20.8497H30.0444C29.326 20.8497 28.8718 20.1 29.1948 19.4913L29.1958 19.4894L29.1968 19.4884C29.1971 19.4877 29.1972 19.4866 29.1978 19.4855C29.1992 19.4828 29.2018 19.4791 29.2046 19.4738C29.2101 19.4631 29.2183 19.4466 29.229 19.4259C29.2504 19.3846 29.2819 19.3241 29.3218 19.2472C29.4019 19.0925 29.5163 18.8709 29.6538 18.6056C29.9287 18.075 30.2956 17.3672 30.6636 16.6583C31.0315 15.9495 31.401 15.2399 31.6802 14.7052C31.8197 14.4379 31.9369 14.2143 32.02 14.0568C32.0615 13.9782 32.0937 13.9158 32.1167 13.8732C32.1275 13.8532 32.1352 13.8369 32.1411 13.8263L32.147 13.8214L32.1577 13.7999L32.4995 13.1241L32.5005 13.1251C32.6486 12.8539 32.6268 12.5217 32.4585 12.2726C32.2961 12.0324 32.0279 11.8674 31.7144 11.8673H25.2231C24.5046 11.8673 24.0512 11.1166 24.3745 10.5079L24.3755 10.507L27.2505 4.93665L27.2495 4.93567Z"
			fill="url(#lm_fill1)"
			fillOpacity="0.22"
			stroke="url(#lm_stroke1)"
			strokeWidth="0.5"
		/>
		<defs>
			<linearGradient
				id="lm_fill0"
				x1="11.63"
				y1="3"
				x2="11.63"
				y2="20.83"
				gradientUnits="userSpaceOnUse"
			>
				<stop stopColor="currentColor" />
				<stop offset="1" stopColor="currentColor" stopOpacity="0.4" />
			</linearGradient>
			<linearGradient
				id="lm_stroke0"
				x1="11.63"
				y1="3"
				x2="11.63"
				y2="20.83"
				gradientUnits="userSpaceOnUse"
			>
				<stop stopColor="#F15A24" />
				<stop offset="1" stopColor="currentColor" />
			</linearGradient>
			<linearGradient
				id="lm_fill1"
				x1="30.56"
				y1="4.27"
				x2="30.56"
				y2="21"
				gradientUnits="userSpaceOnUse"
			>
				<stop stopColor="currentColor" />
				<stop offset="1" stopColor="currentColor" stopOpacity="0.4" />
			</linearGradient>
			<linearGradient
				id="lm_stroke1"
				x1="30.56"
				y1="4.27"
				x2="30.56"
				y2="21"
				gradientUnits="userSpaceOnUse"
			>
				<stop stopColor="#F15A24" />
				<stop offset="1" stopColor="currentColor" />
			</linearGradient>
		</defs>
	</svg>
);
