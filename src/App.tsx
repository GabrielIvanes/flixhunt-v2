import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { createContext, useEffect, useState } from 'react';
import axios from 'axios';

import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import Home from './pages/home/Home';
import Header from './components/layout/header/Header';
import Movie from './pages/movie/Movie';
import TV from './pages/tv/TV';
import Season from './pages/season/Season';
import Episode from './pages/episode/Episode';
import TopRatedMovies from './pages/top-rated-movies/TopRated';
import TopRatedTv from './pages/top-rated-tv/TopRated';
import Person from './pages/person/Person';
import Search from './pages/search/Search';
import Lists from './pages/lists/Lists';
import Footer from './components/layout/footer/Footer';

function App() {
	const frontBaseUrl = 'http://localhost:5173';
	const backBaseUrl = 'http://localhost:3000';

	const [TMDBBaseUrl, setTMDBBaseUrl] = useState<string>('');
	const [elementsId, setElementsId] = useState<number[]>([]);
	const [userId, setUserId] = useState<string>('');
	const [xsrfToken, setXsrfToken] = useState<string>('');

	const navigate = useNavigate();
	const location = useLocation();

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

	async function getUserId() {
		try {
			const response = await axios.get(`${backBaseUrl}/api/user/getId`, {
				withCredentials: true,
			});
			setUserId(response.data.id);
			if (location.pathname === '/signin') navigate('/');
			else navigate(location.pathname);

			const storedXsrfToken = window.localStorage.getItem('xsrfToken');
			if (storedXsrfToken) {
				setXsrfToken(JSON.parse(storedXsrfToken));
			}
		} catch (err) {
			console.log(location.pathname);
			navigate('/signin');
			console.error(err);
		}
	}

	useEffect(() => {
		getUserId();
		getTMDBBaseUrl();
	}, []);

	return (
		<>
			<Header
				frontBaseUrl={frontBaseUrl}
				backBaseUrl={backBaseUrl}
				userId={userId}
				xsrfToken={xsrfToken}
			/>
			<elementsContext.Provider value={elementsId}>
				<Routes>
					<Route
						path='/signin'
						element={
							<SignIn
								backBaseUrl={backBaseUrl}
								setUserId={setUserId}
								setXsrfToken={setXsrfToken}
							/>
						}
					/>
					<Route
						path='/signup'
						element={<SignUp backBaseUrl={backBaseUrl} />}
					/>
					<Route
						path='/'
						element={
							<Home
								backBaseUrl={backBaseUrl}
								TMDBBaseUrl={TMDBBaseUrl}
								xsrfToken={xsrfToken}
							/>
						}
					/>
					<Route
						path='/movies/:id'
						element={
							<Movie
								backBaseUrl={backBaseUrl}
								TMDBBaseUrl={TMDBBaseUrl}
								userId={userId}
								elementsId={elementsId}
								setElementsId={setElementsId}
								xsrfToken={xsrfToken}
							/>
						}
					/>
					<Route
						path='/tv/:id'
						element={
							<TV
								backBaseUrl={backBaseUrl}
								TMDBBaseUrl={TMDBBaseUrl}
								userId={userId}
								elementsId={elementsId}
								setElementsId={setElementsId}
								xsrfToken={xsrfToken}
							/>
						}
					/>
					<Route
						path='/tv/:id/seasons/:nbSeason'
						element={
							<Season
								backBaseUrl={backBaseUrl}
								TMDBBaseUrl={TMDBBaseUrl}
								userId={userId}
								elementsId={elementsId}
								setElementsId={setElementsId}
								xsrfToken={xsrfToken}
							/>
						}
					/>
					<Route
						path='/tv/:id/seasons/:nbSeason/episodes/:nbEpisode'
						element={
							<Episode
								backBaseUrl={backBaseUrl}
								TMDBBaseUrl={TMDBBaseUrl}
								userId={userId}
								elementsId={elementsId}
								setElementsId={setElementsId}
								xsrfToken={xsrfToken}
							/>
						}
					/>
					<Route
						path='/movies'
						element={
							<TopRatedMovies
								backBaseUrl={backBaseUrl}
								TMDBBaseUrl={TMDBBaseUrl}
								xsrfToken={xsrfToken}
							/>
						}
					/>
					<Route
						path='/tv'
						element={
							<TopRatedTv
								backBaseUrl={backBaseUrl}
								TMDBBaseUrl={TMDBBaseUrl}
								xsrfToken={xsrfToken}
							/>
						}
					/>
					<Route
						path='/persons/:id'
						element={
							<Person
								backBaseUrl={backBaseUrl}
								TMDBBaseUrl={TMDBBaseUrl}
								xsrfToken={xsrfToken}
							/>
						}
					/>
					<Route
						path='/search'
						element={
							<Search
								backBaseUrl={backBaseUrl}
								TMDBBaseUrl={TMDBBaseUrl}
								xsrfToken={xsrfToken}
							/>
						}
					/>
					<Route
						path='/my-lists'
						element={
							<Lists
								backBaseUrl={backBaseUrl}
								TMDBBaseUrl={TMDBBaseUrl}
								xsrfToken={xsrfToken}
								userId={userId}
							/>
						}
					/>
					<Route
						path='/*'
						element={
							<Home
								backBaseUrl={backBaseUrl}
								TMDBBaseUrl={TMDBBaseUrl}
								xsrfToken={xsrfToken}
							/>
						}
					/>
				</Routes>
			</elementsContext.Provider>
			<Footer />
		</>
	);
}

export default App;
