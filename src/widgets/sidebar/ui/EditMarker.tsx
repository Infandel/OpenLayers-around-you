import { type Marker } from '@entities/marker';
import { MapPin } from 'lucide-react';
import { type EditingMarkerState } from '../config/types';
import type { Dispatch, SetStateAction, ChangeEvent } from 'react';

interface IEditMarker {
	editingMarker: EditingMarkerState;
	setEditingMarker: Dispatch<SetStateAction<EditingMarkerState>>;
	marker: Marker;
}

export function EditMarker({ editingMarker, setEditingMarker, marker }: IEditMarker) {
	const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
		setEditingMarker((prev) => ({ ...prev, name: e.target.value }));
	};

	const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		setEditingMarker((prev) => ({ ...prev, description: e.target.value }));
	};

	return (
		<div className='flex-1 min-w-0'>
			<div className='flex items-center gap-2 mb-1'>
				<MapPin className='w-4 h-4 text-primary flex-shrink-0' />
				{editingMarker.id === marker.id ? (
					<input
						type='text'
						value={editingMarker.name}
						onClick={(e) => e.stopPropagation()}
						onChange={handleNameChange}
						className='border border-gray-300 rounded p-1 text-gray-900 w-full max-w-xs'
					/>
				) : (
					<h3 className='font-semibold text-gray-900 truncate'>{marker.name}</h3>
				)}
			</div>
			{editingMarker.id === marker.id ? (
				<textarea
					value={editingMarker.description}
					onClick={(e) => e.stopPropagation()}
					onChange={handleDescriptionChange}
					className='border border-gray-300 rounded p-1 text-gray-700 w-full max-w-xs resize-none'
					rows={2}
				/>
			) : (
				<p className='text-sm text-gray-600 line-clamp-2'>{marker.description}</p>
			)}
			<p className='text-xs text-gray-400 mt-2'>
				{marker.coordinates[1].toFixed(4)}, {marker.coordinates[0].toFixed(4)}
			</p>
		</div>
	);
}
