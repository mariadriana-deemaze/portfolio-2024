
import { useCallback, useEffect, useState } from 'react';
import { cn } from '@/utils/utils';

export const AnimatedMottos = ({ data, className }: { data: string[]; className?: string }) => {
	const [roleIndex, setRoleIndex] = useState(0);

	const splitWords = () => {
		const words = document.querySelectorAll('.role-slide');

		words.forEach((word) => {
			const letters = word.textContent?.split('');
			word.textContent = '';
			letters.forEach((letter) => {
				const span = document.createElement('span');
				span.textContent = letter;
				span.className = 'letter';
				word.append(span);
			});
		});
	};

	const animateText = useCallback(() => {
		const words = document.querySelectorAll('.role-slide');

		let lastWordIndex = 0;

		if (roleIndex === 0) {
			lastWordIndex = data.length - 1;
		} else {
			lastWordIndex = roleIndex - 1;
		}

		const currentWord = words[roleIndex];
		const previousWord = words[lastWordIndex];

		Array.from(previousWord.children).forEach((letter, i) => {
			setTimeout(() => {
				letter.className = 'letter out';
			}, i * 80);
		});

		Array.from(currentWord.children).forEach((letter, i) => {
			letter.className = 'letter behind';
			setTimeout(
				() => {
					letter.className = 'letter in';
				},
				340 + i * 80
			);
		});
	}, [roleIndex, data.length]);

	const switchRole = () => {
		if (roleIndex === data.length - 1) {
			setRoleIndex(0);
		} else {
			setRoleIndex(roleIndex + 1);
		}
	};

	useEffect(() => {
		splitWords();
	}, []);

	useEffect(() => {
		animateText();
	}, [animateText, roleIndex]);

	useEffect(() => {
		const interval = setInterval(switchRole, 5000);
		return () => clearInterval(interval);
	});

	return (
		<h6
			className="h-5 w-full relative roles-slider font-clash text-lg font-normal"
		>
			{data.map((item, index) => (
				<span className={cn('role-slide', className)} key={`motto_item_${index}`}>
					{item}
				</span>
			))}
		</h6>
	);
};

