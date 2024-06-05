/* eslint-disable no-mixed-spaces-and-tabs */
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faPen, faCheck } from '@fortawesome/free-solid-svg-icons';
import axios, { AxiosError } from 'axios';

import loader from '../../assets/images/loader.svg';

import {
	UserList,
	MyList,
	MovieInfoInList,
	TVShowInfoInList,
	EpisodeInfoInList,
	SeasonInfoInList,
	MyListFilters,
} from '../../utils/interface';
import Loader from '../../components/loader/Loader';
import Element from '../../components/element/Element';
import CreateList from '../../components/create-list/CreateList';
import Filter from '../../components/my-list-filter/Filter';
import Pagination from '../../components/pagination/Pagination';

interface Props {
	backBaseUrl: string;
	TMDBBaseUrl: string;
	xsrfToken: string;
	userId: string;
}

interface CreateListResponse {
	response: UserList;
	success: boolean;
}

function Lists({ backBaseUrl, TMDBBaseUrl, xsrfToken, userId }: Props) {
	const [page, setPage] = useState<number>(1);
	const [lastPage, setLastPage] = useState<number>(500);
	const [userLists, setUserLists] = useState<UserList[]>([]);
	const [activeMyList, setActiveMyList] = useState<MyList>();
	const [activeList, setActiveList] = useState<UserList>();
	const [errorCreatingList, setErrorCreatingList] = useState<string>('');
	const [listReady, setListReady] = useState<boolean>(true);
	const [creatingList, setCreatingList] = useState<boolean>(false);
	const [filters, setFilters] = useState<MyListFilters>({
		media: [
			{ devString: 'movie', clientString: 'Movie' },
			{ devString: 'tv', clientString: 'TV Show' },
			{ devString: 'season', clientString: 'Season' },
		],
	});
	const [showFilters, setShowFilters] = useState<boolean>(false);
	const [userListEdit, setUserListEdit] = useState<UserList>();
	const [inputNewNameList, setInputNewNameList] = useState<string>('');

	const enumDefaultListsName = ['Like', 'Watchlist', 'Seen', 'TheaterSeen'];

	async function createList(listName: string) {
		try {
			const response = await axios.post(
				`${backBaseUrl}/api/lists/add`,
				{
					name: listName,
					userId: userId,
				},
				{
					headers: {
						'x-xsrf-token': xsrfToken,
					},
					withCredentials: true,
				}
			);
			return { response: response.data.list, success: true };
		} catch (err) {
			if (err instanceof AxiosError) {
				if (err.response && err.response.status === 404) {
					setErrorCreatingList(err.response.data);
				}
			}
			return { response: err, success: false };
		}
	}

	async function updateList(userList: UserList, newName: string) {
		try {
			await axios.put(
				`${backBaseUrl}/api/lists/${userList._id}/update/name/${newName}`,
				{},
				{
					headers: {
						'x-xsrf-token': xsrfToken,
					},
					withCredentials: true,
				}
			);
			await generateListsNav(userId, false);

			const activeListTitle = document.querySelector('.active-list-title');

			if (userList === activeList && activeListTitle) {
				activeListTitle.textContent = newName;
			}
		} catch (err) {
			console.error(err);
		}
	}

	async function deleteList(userList: UserList) {
		try {
			if (!enumDefaultListsName.includes(userList.name) && listReady) {
				const response = await axios.delete(
					`${backBaseUrl}/api/lists/${userList._id}`,
					{
						headers: {
							'x-xsrf-token': xsrfToken,
						},
						withCredentials: true,
					}
				);

				console.log(response);
				generateListsNav(userId, true);
			}
		} catch (err) {
			console.error(err);
		}
	}

	async function getUserLists(userId: string) {
		try {
			const response = await axios.get(
				`${backBaseUrl}/api/lists/userId/${userId}`,
				{
					headers: {
						'x-xsrf-token': xsrfToken,
					},
					withCredentials: true,
				}
			);
			return response.data;
		} catch (err) {
			console.error(err);
		}
	}

	// async function getElementsInfoList(
	// 	userList: UserList
	// ): Promise<number | MyList> {
	// 	try {
	// 		const response = await axios.get(
	// 			`${backBaseUrl}/api/lists/${userList._id}/elements/info`,
	// 			{
	// 				headers: {
	// 					'x-xsrf-token': xsrfToken,
	// 				},
	// 				withCredentials: true,
	// 			}
	// 		);

	// 		const newList: MyList = {
	// 			userList: userList,
	// 			elements: response.data,
	// 		};
	// 		return newList;
	// 	} catch (err) {
	// 		console.error(err);
	// 		return 0;
	// 	}
	// }

	async function getElementsInfoListPerPageFilters(
		userList: UserList,
		page: number,
		filters: MyListFilters
	): Promise<number | MyList> {
		try {
			console.log('Page: ', page);
			const response = await axios.post(
				`${backBaseUrl}/api/lists/${userList._id}/page/${page}`,
				{ filters: filters },
				{
					headers: {
						'x-xsrf-token': xsrfToken,
					},
					withCredentials: true,
				}
			);

			setLastPage(response.data.totalPages);
			const newList: MyList = {
				userList: userList,
				elements: response.data.elements,
			};
			console.log(response);
			return newList;
		} catch (err) {
			console.error(err);
			return 0;
		}
	}

	async function handleFormCreateList(listName: string) {
		const list: CreateListResponse = await createList(listName);

		if (list.success) {
			await generateListsNav(userId, false);
			setCreatingList(false);
			handleChangeActiveList(list.response);
		}
	}

	async function handleChangeActiveList(list: UserList) {
		if (listReady) {
			const updatedFilters = {
				...filters,
				media: [
					{ devString: 'movie', clientString: 'Movie' },
					{ devString: 'tv', clientString: 'TV Show' },
					{ devString: 'season', clientString: 'Season' },
				],
			};
			setPage(1);
			setFilters(updatedFilters);
			setListReady(false);
			setActiveList(list);
			await getList(list, 1, updatedFilters);
			setListReady(true);
		}
	}

	async function generateListsNav(
		userId: string,
		isNeedToSetActiveList: boolean
	) {
		const userLists: UserList[] = await getUserLists(userId);
		setUserLists(userLists);
		isNeedToSetActiveList && setActiveList(userLists[0]);
	}

	async function getList(
		userList: UserList,
		page: number,
		filters: MyListFilters
	) {
		// const newList: MyList | number = await getElementsInfoList(userList);
		// typeof newList !== 'number' && setActiveMyList(newList);
		const newList: MyList | number = await getElementsInfoListPerPageFilters(
			userList,
			page,
			filters
		);
		typeof newList !== 'number' && setActiveMyList(newList);
	}
	async function handleChangePageAndFilters(filters: MyListFilters) {
		if (activeList) {
			setListReady(false);
			await getList(activeList, page, filters);
			setListReady(true);
		}
	}

	// function getMediaInMyList(myList: MyList) {
	// 	const mediaInMyList: string[] = [];
	// 	for (const element of myList.elements) {
	// 		if (mediaInMyList.includes(element.media)) continue;
	// 		else mediaInMyList.push(element.media);
	// 	}
	// 	return mediaInMyList;
	// }

	// function changeFiltersMedia() {
	// 	if (activeMyList) {
	// 		const updatedFiltersMedia: MyListFilters = { ...filters };
	// 		updatedFiltersMedia.media = [];
	// 		const mediaInMyList = getMediaInMyList(activeMyList);

	// 		for (const media of mediaInMyList) {
	// 			if (media === 'movie')
	// 				updatedFiltersMedia.media.push({
	// 					devString: 'movie',
	// 					clientString: 'Movie',
	// 				});
	// 			else if (media === 'tv')
	// 				updatedFiltersMedia.media.push({
	// 					devString: 'tv',
	// 					clientString: 'TV Show',
	// 				});
	// 			else if (media === 'season')
	// 				updatedFiltersMedia.media.push({
	// 					devString: 'season',
	// 					clientString: 'Season',
	// 				});
	// 			else if (media === 'episode' && mediaInMyList.length === 1)
	// 				updatedFiltersMedia.media.push({
	// 					devString: 'episode',
	// 					clientString: 'Episode',
	// 				});
	// 		}

	// 		setFilters(updatedFiltersMedia);
	// 	}
	// }

	useEffect(() => {
		if (userId !== '') {
			generateListsNav(userId, true);
		}
	}, [userId]);

	useEffect(() => {
		if (activeList) handleChangeActiveList(activeList);
	}, [activeList]);

	useEffect(() => {
		handleChangePageAndFilters(filters);
	}, [page]);

	// useEffect(() => {
	// 	changeFiltersMedia();
	// }, [activeMyList]);

	return userLists && activeList ? (
		<div
			className='wrapper lists-wrapper'
			style={
				creatingList || showFilters
					? { overflow: 'hidden', height: '100vh' }
					: { overflow: 'visible', height: 'fit-content' }
			}
		>
			{creatingList && (
				<CreateList
					setCreatingList={setCreatingList}
					handleFormCreateList={handleFormCreateList}
					setErrorCreatingList={setErrorCreatingList}
					error={errorCreatingList}
				/>
			)}
			{showFilters && (
				<Filter
					filters={filters}
					setFilters={setFilters}
					setShowFilters={setShowFilters}
					listReady={listReady}
					handleChangePageAndFilters={handleChangePageAndFilters}
				/>
			)}
			<div className='left-side-menu'>
				<h1>My lists</h1>
				<div className='lists-menu'>
					{userLists.map((userList) =>
						userList != userListEdit ? (
							<div
								key={userList._id}
								className={activeList._id === userList._id ? 'active' : ''}
								onClick={() => {
									handleChangeActiveList(userList);
								}}
							>
								<div>{userList.name}</div>
								{!enumDefaultListsName.includes(userList.name) && (
									<div className='action-on-user-list'>
										<div className='pen'>
											<FontAwesomeIcon
												icon={faPen}
												className='clickable'
												onClick={(event) => {
													event.stopPropagation();
													setInputNewNameList(userList.name);
													setUserListEdit(userList);
												}}
											/>
										</div>
										<div className='xmark'>
											<FontAwesomeIcon
												icon={faXmark}
												className='clickable'
												onClick={(event) => {
													event.stopPropagation();
													deleteList(userList);
												}}
											/>
										</div>
									</div>
								)}
							</div>
						) : (
							<div className='user-list-editing' key={userList._id}>
								<input
									type='text'
									value={inputNewNameList}
									onChange={(event) => setInputNewNameList(event.target.value)}
								/>
								<FontAwesomeIcon
									icon={faCheck}
									className='clickable'
									onClick={(event) => {
										event.stopPropagation();
										updateList(userList, inputNewNameList);
										setUserListEdit({ _id: '', userId: '', name: '' });
									}}
								/>
							</div>
						)
					)}
				</div>

				<div className='button-wrapper'>
					<button onClick={() => setCreatingList(true)}>
						<span>+</span> Create list
					</button>
				</div>
			</div>
			<div className='main'>
				<button
					className='filter-button'
					style={
						activeMyList && listReady
							? { opacity: 1, cursor: 'pointer' }
							: { opacity: 0, cursor: 'default' }
					}
					onClick={() => setShowFilters(true)}
				>
					Filter
				</button>

				<h1 className='active-list-title'>{activeList.name}</h1>

				<div className='lists'>
					{activeMyList && listReady ? (
						JSON.stringify(activeList) ===
							JSON.stringify(activeMyList.userList) && (
							<>
								{activeMyList.elements.map((element) => (
									<Element
										key={element.TMDBId}
										elementId={element.TMDBId}
										elementName={
											element.media === 'movie'
												? (element as MovieInfoInList).title
												: (element as TVShowInfoInList).name
										}
										elementAdditionalInformation={element.media}
										elementNavigation={
											element.media === 'episode'
												? `/tv/${
														(element as EpisodeInfoInList).TMDBTvId
												  }/seasons/${
														(element as EpisodeInfoInList).nbSeason
												  }/episodes/${
														(element as EpisodeInfoInList).episodeNumber
												  }`
												: element.media === 'season'
												? `/tv/${
														(element as SeasonInfoInList).TMDBTvId
												  }/seasons/${
														(element as SeasonInfoInList).seasonNumber
												  }`
												: element.media === 'movie'
												? `/movies/${element.TMDBId}`
												: `/${element.media}/${element.TMDBId}`
										}
										elementPoster={`${TMDBBaseUrl}original${element.posterPath}`}
										posterHeight={
											window.innerWidth > 1020
												? element.media === 'episode'
													? 216
													: 450
												: element.media === 'episode'
												? 108
												: 225
										}
										posterWidth={
											window.innerWidth > 1020
												? element.media === 'episode'
													? 384
													: 300
												: element.media === 'episode'
												? 192
												: 150
										}
										scrollPosition={null}
									/>
								))}

								{lastPage > 1 && (
									<Pagination
										page={page}
										setPage={setPage}
										lastPage={lastPage}
									/>
								)}
							</>
						)
					) : (
						<img src={loader} alt='loader' className='loader' />
					)}
				</div>
			</div>
		</div>
	) : (
		<Loader />
	);
}

export default Lists;
