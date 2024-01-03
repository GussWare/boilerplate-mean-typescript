import { ObjectId, Document, Model } from 'mongoose';
import { Request, Response } from "express"

declare namespace NodeJS {
	interface Global {
		polyglot: any;
	}
}

export interface IPaginationResponse {
	results: any[],
	page: number,
	page_size: number,
	num_pages: number,
	count: number
}

export interface IPaginationOptions {
	sort_by?: string;
	page_size: number;
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
	first_name?: string;
	last_name?: string;
	username?: string;
	picture?: Img;
	email?: string;
	password?: string;
	is_email_verified?: boolean;
	is_active?: boolean;
}

export interface IUserDocument extends Document {
	first_name: string;
	last_name?: string;
	username: string;
	picture?: Img;
	email: string;
	password: string;
	is_email_verified: boolean;
	is_active: boolean;
}

// Definition of the interface for the user model
export interface IUserModel extends Model<IUser> {
	static isEmailTaken(email: string): Promise<boolean>;
	static isUsernameTaken(username: string): Promise<boolean>;
}

export interface IUserFilter {
	first_name?: string;
	last_name?: string;
	username?: string;
	email?: string;
	role?: string;
	is_email_verified?: boolean;
	is_active?: boolean;
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

export interface IGroup {
	name: string;
	codename: string;
	description: string;
	permissions?: string[];
}

export interface IGroupDocument extends Document {
	name: string;
	codename: string;
	description: string;
	permissions?: string[];
}

export interface IGroupModel extends Model<IGroup> {
	paginate(filter: IGroupFilter, options: IPaginationOptions): Promise<IPaginationResponse>;
	isNameTaken(name: string): Promise<boolean>;
	isCodeNameTaken(codename: string): Promise<boolean>;
}

export interface IGroupFilter {
	name: string;
	codename: string;
}

export interface IPermission {
	id?: srting;
	name?: string;
	codename?: string;
	description?: string;
}

export interface IPermissionFilter {
	name?: string;
	codename?: string;
}

export interface IPermissionDocument extends Document {
	name?: string;
	codename?: string;
	guard?: string;
	description?: string;
	module?: string;
}

export interface IPermissionModel extends Model<IPermission> {
	static iscodenameTaken(codename: string): Promise<boolean>;
}

export interface ILogSystem {
	user: ObjectId;
	module: string;
	action: string;
	description: string;
	date: Date;
}

export interface ILogSystemFilter {
	user: ObjectId;
	module: string;
	action: string;
	startDate: Date;
	endDate: Date;
}

export interface IController {
	findPagination?(req: Request, res: Response): Promise<void>;
	findAll?(req: Request, res: Response): Promise<void>;
	findById?(req: Request, res: Response): Promise<void>;
	create?(req: Request, res: Response): Promise<void>;
	update?(req: Request, res: Response): Promise<void>;
	enabled?(req: Request, res: Response): Promise<void>;
	disabled?(req: Request, res: Response): Promise<void>;
	delete?(req: Request, res: Response): Promise<void>;
	bulkCreate?(req: Request, res: Response): Promise<void>;
	bulkDelete?(req: Request, res: Response): Promise<void>;
	bulkEnabled?(req: Request, res: Response): Promise<void>;
	bulkDisabled?(req: Request, res: Response): Promise<void>;
}

export interface ICrudService {
	findPaginate?(filter: T, options: IPaginationOptions): Promise<IPaginationResponse>;
	findAll?(): Promise<T[]>;
	findById?(id: string): Promise<T | null>;
	create?(data: T): Promise<T>;
	update?(id: string, data: T): Promise<T | null>;
	enabled?(id: string): Promise<boolean>;
	disabled?(id: string): Promise<boolean>;
	bulkCreate?(data: T[]): Promise<boolean>;
	bulkDelete?(ids: string[]): Promise<boolean>;
	bulkEnabled?(ids: string[]): Promise<boolean>;
	bulkDisabled?(ids: string[]): Promise<boolean>;
	clear?(): Promise<boolean>;
}

export interface ITokenPayload {
	sub: string;
	iat: number;
	exp: number;
	type: string;
}

export interface IAuthLogin {
	email: string;
	password: string;
}

export interface IAuthRefreshToken {
	refreshToken: string;
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
	name?: string;
	codename?: string;
	description?: string;
	default?: string;
	is_active?: string
}

export interface ILanguageFilter {
	name?: string;
	codename?: string;
	default?: string;
	is_active?: string
}

type ValidSchema = {
    params?: Schema;
    query?: Schema;
    body?: Schema;
};

