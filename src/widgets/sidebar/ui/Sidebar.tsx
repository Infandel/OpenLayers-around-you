import { useState, type ChangeEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MapPin } from 'lucide-react';
import { markersActions } from '@entities/marker';
import { RootState } from '@app/store/store';
import { CollapseButton } from './CollapseButton';
import type { EditingMarkerState } from '../config/types';
import { EDITING_MARKER_INITIAL_STATE } from '../config/constants';
import { InteractiveButtons } from './InteractiveButtons';
import { EditMarker } from './EditMarker';

export function Sidebar() {
	const [isCollapsed, setIsCollapsed] = useState(false);
	const markers = useSelector((state: RootState) => state.markers.markers);
	const selectedMarkerId = useSelector((state: RootState) => state.markers.selectedMarkerId);
	const dispatch = useDispatch();

	const [editingMarker, setEditingMarker] = useState<EditingMarkerState>(EDITING_MARKER_INITIAL_STATE);

	const handleMarkerClick = (markerId: string) => {
		// Prevent selecting marker while editing it
		if (editingMarker.id !== markerId) {
			dispatch(markersActions.setSelectedMarker(markerId));
		}
	};

	return (
		<>
			<div
				className={`bg-white border-r border-gray-200 transition-all duration-300 flex flex-col ${
					isCollapsed ? 'w-0' : 'w-80'
				} overflow-hidden`}
			>
				<div className='p-6 border-b border-gray-200'>
					<h1 className='text-2xl font-bold text-gray-900'>Map Markers</h1>
					<p className='text-sm text-gray-500 mt-1'>
						{markers.length} {markers.length === 1 ? 'marker' : 'markers'}
					</p>
				</div>

				<div className='flex-1 overflow-y-auto p-4'>
					{markers.length === 0 ? (
						<div className='text-center py-12'>
							<MapPin className='w-12 h-12 text-gray-300 mx-auto mb-3' />
							<p className='text-gray-500 text-sm'>No markers yet</p>
							<p className='text-gray-400 text-xs mt-1'>Click the + button to add markers</p>
						</div>
					) : (
						<div className='space-y-2'>
							{markers.map((marker) => (
								<div
									key={marker.id}
									onClick={() => handleMarkerClick(marker.id)}
									className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
										selectedMarkerId === marker.id
											? 'border-primary bg-blue-50'
											: 'border-gray-200 bg-white hover:border-gray-300'
									}`}
								>
									<div className='flex items-start justify-between gap-3'>
										<EditMarker editingMarker={editingMarker} setEditingMarker={setEditingMarker} marker={marker} />

										<InteractiveButtons
											editingMarker={editingMarker}
											setEditingMarker={setEditingMarker}
											marker={marker}
										/>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>

			<CollapseButton isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
		</>
	);
}
