export interface FormSignUp {
	email: string;
	password: string;
	confirmPassword: string;
	username: string;
}

export interface FormSignIn {
	email: string;
	password: string;
}

export interface User {
	id: string;
	username: string;
	image: string;
}

export interface Genre {
	id: number;
	name: string;
}

export interface Movie {
	adult: boolean;
	backdrop_path: string | null;
	department: string | null; // department of the person in the media
	genre_ids: number[];
	id: number;
	job: string | null; // job of the person in the media
	media_type: string | null;
	original_language: string;
	original_title: string;
	overview: string;
	popularity: number;
	poster_path: string | null;
	release_date: string;
	title: string;
	video: boolean;
	vote_average: number;
	vote_count: number;
}

export interface TVShow {
	adult: boolean | null;
	backdrop_path: string;
	department: string | null; // department of the person in the media
	first_air_date: string;
	genre_ids: number[];
	id: number;
	job: string | null; // job of the person in the media
	media_type: string | null;
	name: string;
	origin_country: string[];
	original_language: string;
	original_name: string;
	overview: string;
	popularity: number;
	poster_path: string;
	vote_average: number;
	vote_count: number;
}

export type ElementType = Movie | TVShow | Person | Season | Episode;

export interface ListType {
	name: string;
	elements: ElementType[] | Image[];
}

interface BelongsToCollection {
	id: number;
	name: string;
	poster_path: string | null;
	backdrop_path: string | null;
}

export interface Cast {
	adult: boolean;
	gender: number;
	id: number;
	known_for_department: string;
	name: string;
	original_name: string;
	popularity: number;
	profile_path: string;
	cast_id: number | null;
	character: string;
	credit_id: string;
	order: number;
}
export interface Crew {
	adult: boolean;
	gender: number;
	id: number;
	known_for_department: string;
	name: string;
	original_name: string;
	popularity: number;
	profile_path: string;
	credit_id: string;
	department: string;
	job: string;
}

export type Person = Cast | Crew;
interface ProductionCompany {
	id: number;
	logo_path: string | null;
	name: string;
	origin_country: string;
}
interface ProductionCountry {
	iso_3166_1: string;
	name: string;
}

export interface Provider {
	logo_path: string;
	provider_id: number;
	provider_name: string;
	display_priority: number;
}

interface SpokenLanguage {
	english_name: string;
	iso_639_1: string;
	name: string;
}
export interface VideoItem {
	iso_639_1: string;
	iso_3166_1: string;
	name: string;
	key: string;
	site: string;
	size: number;
	type: string;
	official: boolean;
	published_at: string;
	id: string;
}

interface WatchProvider {
	link: string;
	buy: Provider[];
	rent: Provider[];
	flatrate: Provider[];
}

interface WatchProviders {
	results: {
		[locale: string]: WatchProvider;
	};
}

export interface MovieDetails {
	adult: boolean;
	backdrop_path: string;
	belongs_to_collection: BelongsToCollection;
	budget: number;
	credits: {
		cast: Cast[];
		crew: Crew[];
	};
	genres: Genre[];
	homepage: string;
	id: number;
	imdb_id: string;
	original_language: string;
	original_title: string;
	overview: string;
	popularity: number;
	poster_path: string;
	production_companies: ProductionCompany[];
	production_countries: ProductionCountry[];
	recommendations: {
		page: number;
		results: Movie[];
		total_pages: number;
		total_results: number;
	};
	release_date: string;
	revenue: number;
	runtime: number;
	spoken_languages: SpokenLanguage[];
	status: string;
	tagline: string;
	title: string;
	video: boolean;
	videos: {
		results: VideoItem[];
	};
	vote_average: number;
	vote_count: number;
	'watch/providers': WatchProviders;
}

export interface ElementAction {
	_id: string;
	name: string;
	value: boolean;
	date: string | null;
}

export interface Comment {
	_id: string;
	userId: string;
	TMDBId: number;
	comment: string;
	date: string;
}

interface AggregateCast {
	adult: boolean;
	gender: number;
	id: number;
	known_for_department: string;
	name: string;
	order: number;
	original_name: string;
	popularity: number;
	profile_path: string;
	roles: { credit_id: number; character: string; episode_count: number }[];
	total_episode_count: number;
}

interface AggregateCrew {
	adult: boolean;
	department: string;
	gender: number;
	id: number;
	jobs: { credit_id: number; job: string; episode_count: number }[];
	known_for_department: string;
	name: string;
	original_name: string;
	popularity: number;
	profile_path: string;
	total_episode_count: number;
}
interface Creator {
	id: number;
	credit_id: string;
	name: string;
	gender: number;
	profile_path: string | null;
}

interface Network {
	id: number;
	logo_path: string | null;
	name: string;
	origin_country: string;
}

export interface Episode {
	air_date: string;
	episode_number: number;
	episode_type: string;
	id: number;
	name: string;
	overview: string;
	production_code: string;
	runtime: number;
	season_number: number;
	show_id: number;
	still_path: string | null;
	vote_average: number;
	vote_count: number;
	crew: Crew[] | null;
	guest_stars: Cast[] | null;
}

interface ProductionCountry {
	iso_3166_1: string;
	name: string;
}

export interface Season {
	air_date: string;
	episode_count: number;
	id: number;
	name: string;
	overview: string;
	poster_path: string | null;
	season_number: number;
	vote_average: number;
}

export interface TVShowDetails {
	adult: boolean;
	aggregate_credits: {
		cast: AggregateCast[];
		crew: AggregateCrew[];
	};
	backdrop_path: string | null;
	created_by: Creator[];
	episode_run_time: number[];
	first_air_date: string;
	genres: Genre[];
	homepage: string;
	id: number;
	in_production: boolean;
	languages: string[];
	last_air_date: string;
	last_episode_to_air: Episode | null;
	name: string;
	next_episode_to_air: Episode | null;
	networks: Network[];
	number_of_episodes: number;
	number_of_seasons: number;
	origin_country: string[];
	original_language: string;
	original_name: string;
	overview: string;
	popularity: number;
	poster_path: string | null;
	production_companies: ProductionCompany[];
	production_countries: ProductionCountry[];
	seasons: Season[];
	spoken_languages: SpokenLanguage[];
	status: string;
	tagline: string;
	type: string;
	vote_average: number;
	vote_count: number;
	recommendations: {
		page: number;
		results: TVShow[];
		total_pages: number;
		total_results: number;
	};
	videos: {
		results: VideoItem[];
	};
	'watch/providers': WatchProviders;
}

export interface SeasonDetails {
	air_date: string;
	credits: {
		cast: Cast[];
		crew: Crew[];
	};
	episodes: Episode[];
	id: number;
	name: string;
	overview: string;
	poster_path: string | null;
	season_number: number;
	videos: {
		results: VideoItem[];
	};
	'watch/providers': WatchProviders;
}

export interface ElementParent {
	number: number;
	name: string;
}

export interface ElementList {
	list: ListType;
	TMDBBaseUrl: string;
	elementWidth: number;
	elementHeight: number;
}

export interface Image {
	aspect_ratio: number;
	height: number;
	iso_639_1: string;
	file_path: string;
	vote_average: number;
	vote_count: number;
	width: number;
}

export interface EpisodeDetails {
	air_date: string;
	crew: Crew[];
	episode_number: number;
	guest_stars: Cast[] | null;
	name: string;
	overview: string;
	id: number;
	production_code: string;
	runtime: number;
	season_number: number;
	still_path: string | null;
	vote_average: number;
	vote_count: number;
	credits: {
		cast: Cast[];
		crew: Crew[];
		guest_stars: Cast[];
	};
	images: {
		stills: Image[];
	};
	videos: {
		results: VideoItem[];
	};
}

export interface MoviesByPage {
	page: number;
	results: Movie[];
	total_pages: number;
	total_results: number;
}

export interface TVShowsByPage {
	page: number;
	results: TVShow[];
	total_pages: number;
	total_results: number;
}

export interface Filters {
	genres: Genre[];
	date: string | null;
	date_gte: string | null;
	date_lte: string | null;
	vote_gte: number;
	vote_lte: number | null;
	rate_gte: number | null;
	rate_lte: number | null;
}

export type Media = Movie | TVShow;

export interface PersonDetails {
	adult: boolean;
	also_known_as: string[];
	biography: string;
	birthday: string;
	combined_credits: {
		cast: Media[];
		crew: Media[];
	};
	deathday: string | null;
	gender: number;
	homepage: string | null;
	id: number;
	imdb_id: string;
	known_for_department: string;
	name: string;
	place_of_birth: string;
	popularity: number;
	profile_path: string | null;
}

interface PersonSearch {
	adult: boolean;
	gender: number;
	id: number;
	known_for_department: string;
	name: string;
	original_name: string;
	popularity: number;
	profile_path: string | null;
	known_for: Media[];
}

export interface SearchType<T> {
	page: number;
	results: T[];
	total_pages: number;
	total_results: number;
}

export interface MultiSearch {
	adult: boolean;
	backdrop_path: string | null;
	id: number;
	title: string;
	name: string;
	original_language: string;
	original_title: string;
	original_name: string;
	overview: string;
	poster_path: string | null;
	media_type: 'movie' | 'person' | 'tv';
	genre_ids: number[];
	popularity: number;
	release_date: string; // Present for 'movie' media_type
	video: boolean; // Present for 'movie' media_type
	vote_average: number;
	vote_count: number;
	gender: number; // Present for 'person' media_type
	known_for_department: string; // Present for 'person' media_type
	profile_path: string | null; // Present for 'person' media_type
	known_for: PersonSearch[]; // Present for 'person' media_type
	origin_country: string[]; // Present for 'person' media_type
}

export interface UserList {
	_id: string;
	userId: string;
	name: string;
}

export interface ElementInList {
	_id: string;
	listId: string;
	elementId: number; // TMDBId
	elementModel: 'movie' | 'tv' | 'season' | 'episode';
}

export interface MyList {
	userList: UserList;
	elements: ElementInfoInList[];
}

export type ElementInfoInList =
	| MovieInfoInList
	| TVShowInfoInList
	| SeasonInfoInList
	| EpisodeInfoInList;

export interface MovieInfoInList {
	backdropPath: string;
	credits: {
		cast: [{ id: number }];
		crew: [{ id: number }];
	};
	genres: [{ id: number }];
	TMDBId: number;
	overview: string;
	posterPath: string;
	recommendations: [{ id: number }];
	date: string;
	runtime: string;
	tagline: string;
	title: string;
	media: string;
	voteAverage: number;
	video: {
		name: string;
		key: string;
		site: string;
		type: string;
		official: boolean;
	};
	providers: [{ id: number }];
	directors: [{ id: number }];
	createdAt: string;
}

export interface TVShowInfoInList {
	backdropPath: string;
	credits: {
		cast: [{ id: number }];
		crew: [{ id: number }];
	};
	genres: [{ id: number }];
	TMDBId: number;
	overview: string;
	posterPath: string;
	recommendations: [{ id: number }];
	firstDate: string;
	lastDate: string;
	tagline: string;
	name: string;
	media: string;
	numberEpisodes: number;
	numberSeasons: number;
	voteAverage: number;
	video: {
		name: string;
		key: string;
		site: string;
		type: string;
		official: boolean;
	};
	providers: [{ id: number }];
	creators: [{ id: number }];
	createdAt: string;
}

export interface SeasonInfoInList {
	credits: {
		cast: [{ id: number }];
		crew: [{ id: number }];
	};
	TMDBId: number;
	TMDBTvId: number;
	overview: string;
	posterPath: string;
	date: string;
	seasonNumber: number;
	name: string;
	media: string;
	voteAverage: number;
	video: {
		name: string;
		key: string;
		site: string;
		type: string;
		official: boolean;
	};
	providers: [{ id: number }];
	createdAt: string;
}

export interface EpisodeInfoInList {
	credits: {
		cast: [{ id: number }];
		crew: [{ id: number }];
	};
	TMDBId: number;
	TMDBTvId: number;
	nbSeason: number;
	overview: string;
	posterPath: string;
	date: string;
	runtime: string;
	episodeNumber: number;
	name: string;
	media: string;
	video: {
		name: string;
		key: string;
		site: string;
		type: string;
		official: boolean;
	};
	images: [{ path: string }];
	createdAt: string;
}

export interface MyListFilters {
	media: { devString: string; clientString: string }[];
}
