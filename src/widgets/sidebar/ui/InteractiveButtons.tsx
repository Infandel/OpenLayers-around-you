import { type Marker, markersActions } from '@entities/marker';
import { Check, Edit3, Trash2, X } from 'lucide-react';
import { EditingMarkerState } from '../config/types';
import { Dispatch, SetStateAction, MouseEvent as ReactMouseEvent } from 'react';
import { useDispatch } from 'react-redux';
import { EDITING_MARKER_INITIAL_STATE } from '../config/constants';

interface IInteractiveButtons {
	editingMarker: EditingMarkerState;
	setEditingMarker: Dispatch<SetStateAction<EditingMarkerState>>;
	marker: Marker;
}

export function InteractiveButtons({ editingMarker, setEditingMarker, marker }: IInteractiveButtons) {
	const dispatch = useDispatch();

	const handleSaveClick = (e: ReactMouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		if (editingMarker.id) {
			dispatch(
				markersActions.updateMarker({
					id: editingMarker.id,
					name: editingMarker.name,
					description: editingMarker.description,
				})
			);
			setEditingMarker(EDITING_MARKER_INITIAL_STATE);
		}
	};

	const handleCancelClick = (e: ReactMouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		setEditingMarker(EDITING_MARKER_INITIAL_STATE);
	};

	const handleEditClick = (e: ReactMouseEvent<HTMLButtonElement>, { id, name, description }: Marker) => {
		e.stopPropagation();
		setEditingMarker({ id, name, description });
	};

	const handleRemoveMarker = (e: ReactMouseEvent<HTMLButtonElement>, markerId: string) => {
		e.stopPropagation();
		dispatch(markersActions.removeMarker(markerId));

		// Exit edit mode if deleting the edited marker
		if (editingMarker.id === markerId) {
			setEditingMarker(EDITING_MARKER_INITIAL_STATE);
		}
	};

	return (
		<div className='flex gap-1 flex-shrink-0'>
			{editingMarker.id === marker.id ? (
				<>
					<button
						onClick={handleSaveClick}
						className='p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors flex-shrink-0'
						aria-label='Save marker edits'
					>
						<Check className='w-4 h-4' />
					</button>
					<button
						onClick={handleCancelClick}
						className='p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0'
						aria-label='Cancel marker edits'
					>
						<X className='w-4 h-4' />
					</button>
				</>
			) : (
				<>
					<button
						onClick={(e) => handleEditClick(e, marker)}
						className='p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex-shrink-0'
						aria-label='Edit marker'
					>
						<Edit3 className='w-4 h-4' />
					</button>
					<button
						onClick={(e) => handleRemoveMarker(e, marker.id)}
						className='p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0'
						aria-label='Remove marker'
					>
						<Trash2 className='w-4 h-4' />
					</button>
				</>
			)}
		</div>
	);
}
