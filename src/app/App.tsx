import { Routes, Route } from 'react-router-dom';
import { MapPage } from '@pages/map';

function App() {
	return (
		<div className='h-screen w-screen overflow-hidden'>
			<Routes>
				<Route path='/' element={<MapPage />} />
			</Routes>
		</div>
	);
}

export default App;
