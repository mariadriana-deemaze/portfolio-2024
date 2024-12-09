import { HTMLAttributes } from 'react';
import { InfoCircledIcon } from '@radix-ui/react-icons';

export function MDXNote({ children, ...props }: HTMLAttributes<HTMLElement>) {
	return (
		<aside {...props} className="border border-blue-400">
			<div className="border border-orange-400">
				<InfoCircledIcon />
			</div>
			<div className="border border-green-400">
				<b>Note: </b>
				{children}
			</div>
		</aside>
	);
}
