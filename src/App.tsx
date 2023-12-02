import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import Home from './pages/home/Home';
import Header from './components/layout/header/Header';

function App() {
	const frontBaseUrl = 'http://localhost:5173';
	const backBaseUrl = 'http://localhost:3000';

	const [TMDBBaseUrl, setTMDBBaseUrl] = useState<string>('');

	async function getTMDBBaseUrl() {
		try {
			const response = await axios.get(
				`${backBaseUrl}/api/TMDB/settings/baseUrl`,
				{
					withCredentials: true,
				}
			);
			setTMDBBaseUrl(response.data.baseUrl);
		} catch (err) {
			console.error(err);
		}
	}

	useEffect(() => {
		getTMDBBaseUrl();
	}, []);

	return (
		<Router>
			<Header frontBaseUrl={frontBaseUrl} />
			<Routes>
				<Route path='/signin' element={<SignIn />} />
				<Route path='/signup' element={<SignUp />} />
				<Route
					path='/'
					element={<Home backBaseUrl={backBaseUrl} TMDBBaseUrl={TMDBBaseUrl} />}
				/>
			</Routes>
		</Router>
	);
}

export default App;
