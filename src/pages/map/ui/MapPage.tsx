import { MapWidget } from '@widgets/map';
import { Sidebar } from '@widgets/sidebar';

export function MapPage() {
	return (
		<div className='flex h-full w-full'>
			<Sidebar />
			<MapWidget />
		</div>
	);
}
