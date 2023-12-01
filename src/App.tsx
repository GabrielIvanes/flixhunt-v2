import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import Home from './pages/home/Home';
import Header from './components/layout/header/Header';
function App() {
	const frontBaseUrl = 'http://localhost:5173';

	return (
		<Router>
			<Header frontBaseUrl={frontBaseUrl} />
			<Routes>
				<Route path='/signin' element={<SignIn />} />
				<Route path='/signup' element={<SignUp />} />
				<Route path='/' element={<Home />} />
			</Routes>
		</Router>
	);
}

export default App;
