import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { createContext, useEffect, useState } from 'react';
import axios from 'axios';

import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import Home from './pages/home/Home';
import Header from './components/layout/header/Header';
import Movie from './pages/movie/Movie';
import TV from './pages/tv/TV';
import Season from './pages/season/Season';

function App() {
	const frontBaseUrl = 'http://localhost:5173';
	const backBaseUrl = 'http://localhost:3000';

	const [TMDBBaseUrl, setTMDBBaseUrl] = useState<string>('');
	const [elementsId, setElementsId] = useState<number[]>([]);

	const elementsContext = createContext<number[]>([]);

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
			<elementsContext.Provider value={elementsId}>
				<Routes>
					<Route path='/signin' element={<SignIn />} />
					<Route path='/signup' element={<SignUp />} />
					<Route
						path='/'
						element={
							<Home backBaseUrl={backBaseUrl} TMDBBaseUrl={TMDBBaseUrl} />
						}
					/>
					<Route
						path='/movies/:id'
						element={
							<Movie
								backBaseUrl={backBaseUrl}
								TMDBBaseUrl={TMDBBaseUrl}
								elementsId={elementsId}
								setElementsId={setElementsId}
							/>
						}
					/>
					<Route
						path='/tv/:id'
						element={
							<TV
								backBaseUrl={backBaseUrl}
								TMDBBaseUrl={TMDBBaseUrl}
								elementsId={elementsId}
								setElementsId={setElementsId}
							/>
						}
					/>
					<Route
						path='/tv/:id/seasons/:nbSeason'
						element={
							<Season
								backBaseUrl={backBaseUrl}
								TMDBBaseUrl={TMDBBaseUrl}
								elementsId={elementsId}
								setElementsId={setElementsId}
							/>
						}
					/>
				</Routes>
			</elementsContext.Provider>
		</Router>
	);
}

export default App;
