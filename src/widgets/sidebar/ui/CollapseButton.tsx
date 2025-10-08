import { cn } from '@shared/lib';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ICollapseButton {
	isCollapsed: boolean;
	setIsCollapsed: (value: React.SetStateAction<boolean>) => void;
}

export function CollapseButton({ isCollapsed, setIsCollapsed }: ICollapseButton) {
	return (
		<button
			onClick={() => setIsCollapsed(!isCollapsed)}
			className={cn(
				'absolute left-0 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-r-lg p-2 shadow-lg hover:bg-gray-50 transition-colors z-10',
				isCollapsed ? 'left-0' : 'left-[320px]'
			)}
			aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
		>
			{isCollapsed ? (
				<ChevronRight className='w-5 h-5 text-gray-600' />
			) : (
				<ChevronLeft className='w-5 h-5 text-gray-600' />
			)}
		</button>
	);
}
