import { HashRouter, Routes, Route, useParams } from 'react-router-dom';
import Collatz from './Collatz';
import Info from './Info';
import './App.css';

function CollatzWrapper() {
	const { num } = useParams();
	return <Collatz input={num} />;
}

function App() {
	return (
		<HashRouter>
			<Routes>
				<Route path="/" element={<Collatz />} />
        <Route path="/:num" element={<CollatzWrapper />} />
        <Route path="/info" element={<Info />} />
			</Routes>
		</HashRouter>
	);
}

export default App;
