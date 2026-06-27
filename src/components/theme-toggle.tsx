import { MoonIcon, SunIcon } from '@radix-ui/react-icons';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { applyTheme } from '@/utils/theme';

export function ThemeToggle() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					size="theme-toggle"
					className="relative bg-card-ghost rounded-full border-border shrink-0 [transition:background_400ms_ease,rotate_150ms_ease] hover:rotate-[18deg] data-[state=open]:rotate-0 focus-visible:ring-offset-0"
					aria-label="Toggle theme"
				>
					<SunIcon className="h-[14px] w-[14px] rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
					<MoonIcon className="absolute h-[14px] w-[14px] rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
					<span className="sr-only">Toggle theme</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={() => applyTheme('light')}>Light</DropdownMenuItem>
				<DropdownMenuItem onClick={() => applyTheme('dark')}>Dark</DropdownMenuItem>
				<DropdownMenuItem onClick={() => applyTheme('system')}>System</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
