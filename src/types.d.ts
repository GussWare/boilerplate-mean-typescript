import { ObjectId, Document, Model } from 'mongoose';
import {Request, Response} from "express"

declare namespace NodeJS {
	interface Global {
		polyglot: any;
	}
}

export interface IPaginationResponse {
	results: any[],
	page: number,
	limit: number,
	totalPages: number,
	totalResults: number
}

export interface IPaginationOptions {
	sortBy?: string;
	limit: number;
	page: number;
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

export interface IUser {
	id?: string;
	name?: string;
	surname?: string;
	username?: string;
	picture?: Img;
	email?: string;
	password?: string;
	role?: string;
	isEmailVerified?: boolean;
	enabled?: boolean;
}

export interface IUserDocument extends Document {
	name: string;
	surname?: string;
	username: string;
	picture?: Img;
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

export interface IToken {
	token: any;
	user: any;
	type: string;
	expires: any;
	blacklisted: boolean;
}

export interface ITokenDocument extends Document {
	token: string | undefined;
	user: string;
	type: string;
	expires: any;
	blacklisted: boolean;
}

export interface ITokenFilter {
	token?: string;
	user?: ObjectId;
	type?: string,
	blacklisted?: boolean
}

export interface ITokenExpiresToken {
	token: string;
	expires: Date;
}

export interface IAccessToken {
	access: ITokenExpiresToken;
	refresh: ITokenExpiresToken;
}

export interface IModule {
	id?:string;
	name?: string;
	slug?: string;
	guard?: string;
	description?: string;
	actions?: IAction[];
}

export interface IModuleFilter {
	name?: string;
	slug?: string;
	guard?: string;
	description?: string;
}

export interface IModuleModel extends Model<IModule> {
	static isNameTaken(name: string): Promise<boolean>;
	static isSlugTaken(slug: string): Promise<boolean>;
}

export interface IAction {
	id?:srting;
	name?: string;
	slug?: string;
	guard?: string;
	description?: string;
	module?: string;
}

export interface IActionFilter {
	name?: string;
	slug?: string;
	guard?: string;
	module: string;
	enabled?: boolean;
}

export interface IActionDocument extends Document {
	name?: string;
	slug?: string;
	guard?: string;
	description?: string;
	module?: string;
}

export interface IActionModel extends Model<IAction> {
	static isSlugTaken(slug: string): Promise<boolean>;
}

export interface IRole {
	name: string;
	slug: string;
	guard: string;
	description: string;
}

export interface IRoleFilter {
	name: string;
	slug: string;
	guard: string;
}

export interface IBitacora {
	user: ObjectId;
	module: string;
	action: string;
	description: string;
	date: Date;
}

export interface IBitacoraFilter {
	user: ObjectId;
	module: string;
	action: string;
	startDate: Date;
	endDate: Date;
}

export interface IController {
	findPaginate?(req: Request, res: Response): Promise<void>;
	findAll?(req: Request, res: Response): Promise<void>;
	findById?(req: Request, res: Response): Promise<void>;
	create?(req: Request, res: Response): Promise<void>;
	update?(req: Request, res: Response): Promise<void>;
	enabled?(req: Request, res: Response): Promise<void>;
	disabled?(req: Request, res: Response): Promise<void>;
	bulk?(req: Request, res: Response): Promise<void>;
}

export interface ICrudService {
	findPaginate?(filter: T, options: IPaginationOptions): Promise<IPaginationResponse>;
	findAll?(): Promise<T[]>;
	findById?(id: string): Promise<T | null>;
	create?(data: T): Promise<T>;
	update?(id: string, data: T): Promise<T | null>;
	enabled?(id: string): Promise<boolean>;
	disabled?(id: string): Promise<boolean>;
	bulk?(data: T[]): Promise<boolean>;
}

export interface ITokenPayload {
	sub: string;
	iat: number;
	exp: number;
	type: string;
}

export interface IAuthLogin {
	email:string;
	password:string;
}

export interface IAuthRefreshToken {
	refreshToken:string;
}

export interface IAuthToken {
	token: string;
	expires: string;
}

export interface IResponseTokenAuth {
	access: IAuthToken;
	refresh: IAuthToken;
}

export interface IFaker {
	make(): Promise<void>;
}

export interface ILanguage {
	name?:string;
	slug?:string;
	description?:string;
	default?:string;
	enabled?:string	
}

export interface ILanguageFilter {
	name?:string;
	slug?:string;
	default?:string;
	enabled?:string	
}

