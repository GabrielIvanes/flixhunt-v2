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
