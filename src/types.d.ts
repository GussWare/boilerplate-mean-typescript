export interface IOptions {
  sortBy?: string;
  limit?: number;
  page?: number;
  populate?: string | object;
  search?: string;
}

export interface Img {
	name: string;
	imgUrl: string;
	thumbnailUrl?: string;
}

export interface IPaginationOptions {
	sortBy?: string;
	limit?: number;
	page?: number;
	populate?: string;
	search?: string;
}

export interface IUser {
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


export interface IColumnSearch {
  [key: string]: {
    $regex: string;
    $options: string;
  };
}