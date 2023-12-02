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
	id: number;
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
	genre_ids: number[];
	id: number;
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
	backdrop_path: string;
	first_air_date: string;
	genre_ids: number[];
	id: number;
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

export type ElementType = Movie | TVShow;

export interface HomeList {
	name: string;
	elements: ElementType[];
}
