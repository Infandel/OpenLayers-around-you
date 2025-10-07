import { useState, type MouseEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MapPin, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { markersActions } from '@entities/marker';
import { RootState } from '@app/store';

export function Sidebar() {
	const [isCollapsed, setIsCollapsed] = useState(false);
	const markers = useSelector((state: RootState) => state.markers.markers);
	const selectedMarkerId = useSelector((state: RootState) => state.markers.selectedMarkerId);
	const dispatch = useDispatch();

	const handleMarkerClick = (markerId: string) => {
		dispatch(markersActions.setSelectedMarker(markerId));
	};

	const handleRemoveMarker = (e: MouseEvent, markerId: string) => {
		e.stopPropagation();
		dispatch(markersActions.removeMarker(markerId));
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
										<div className='flex-1 min-w-0'>
											<div className='flex items-center gap-2 mb-1'>
												<MapPin className='w-4 h-4 text-primary flex-shrink-0' />
												<h3 className='font-semibold text-gray-900 truncate'>{marker.name}</h3>
											</div>
											<p className='text-sm text-gray-600 line-clamp-2'>{marker.description}</p>
											<p className='text-xs text-gray-400 mt-2'>
												{marker.coordinates[1].toFixed(4)}, {marker.coordinates[0].toFixed(4)}
											</p>
										</div>
										<button
											onClick={(e) => handleRemoveMarker(e, marker.id)}
											className='p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0'
											aria-label='Remove marker'
										>
											<Trash2 className='w-4 h-4' />
										</button>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>

			<button
				onClick={() => setIsCollapsed(!isCollapsed)}
				className='absolute left-0 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-r-lg p-2 shadow-lg hover:bg-gray-50 transition-colors z-10'
				style={{ left: isCollapsed ? '0' : '320px' }}
				aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
			>
				{isCollapsed ? (
					<ChevronRight className='w-5 h-5 text-gray-600' />
				) : (
					<ChevronLeft className='w-5 h-5 text-gray-600' />
				)}
			</button>
		</>
	);
}
