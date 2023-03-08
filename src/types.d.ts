import { Document, Model } from 'mongoose';

export interface IPaginationResponse {
	results: any[],
	page: string | number,
	limit: string | number,
	totalPages: string | number,
	totalResults: string | number
}

export interface IPaginationOptions {
	sortBy?: string;
	limit?: number;
	page?: number;
	populate?: string;
	search?: string;
}

export interface IColumnSearch {
	[key: string]: {
		$regex: string;
		$options: string;
	};
}

export interface Img {
	name: string;
	imgUrl: string;
	thumbnailUrl?: string;
}

export interface IUser extends Document {
	name: string;
	surname?: string;
	username: string;
	picture: Img;
	email: string;
	password: string;
	role: string;
	isEmailVerified: boolean;
	enabled: boolean;
}

// Definición de la interfaz para el modelo de usuario
export interface IUserModel extends Model<IUser> {
	static isEmailTaken(email: string): Promise<boolean>;
	static isUsernameTaken(username: string): Promise<boolean>;
  }

export interface IUserFilter {
	name?: string;
	surname?: string;
	username?: string;
	email?: string;
	role?: string;
	isEmailVerified?: boolean;
	enabled?: boolean;
}

export interface IPayloadJWT {
	sub?: any;
	type?: any;
}