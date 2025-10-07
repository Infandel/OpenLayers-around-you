import { Plus, X } from 'lucide-react';

interface IMapControls {
	isAddingMarker: boolean;
	onToggleAddMarker: () => void;
}

export function MapControls({ isAddingMarker, onToggleAddMarker }: IMapControls) {
	return (
		<div className='absolute top-4 right-4 flex flex-col gap-2'>
			<button
				onClick={onToggleAddMarker}
				className={`p-3 rounded-lg shadow-lg transition-all ${
					isAddingMarker ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-white hover:bg-gray-50 text-gray-700'
				}`}
				aria-label={isAddingMarker ? 'Cancel adding marker' : 'Add marker'}
			>
				{isAddingMarker ? <X className='w-6 h-6' /> : <Plus className='w-6 h-6' />}
			</button>

			{isAddingMarker && (
				<div className='bg-white p-3 rounded-lg shadow-lg text-sm text-gray-700 max-w-xs'>
					Click anywhere on the map to add a marker
				</div>
			)}
		</div>
	);
}
