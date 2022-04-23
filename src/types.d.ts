export interface IMongooseConfigOptions {
  useCreateIndex: boolean
  useNewUrlParser: boolean
  useUnifiedTopology: boolean
}

export interface IConfigMongoose {
  uri: string
  options: IMongooseConfigOptions
}

export interface IConfiguration {
  env: string
  port: number
  logs: string
  url: object
  mongose: IConfigMongoose
}

export interface IUser {
  id: string
  name: string
  surname: string
  username: string
  picture: string
  email: string
  password: string
  role: string
  isEmailVerified: boolean
  enabled: boolean
}

export interface IModule {
  id: string
  name: string
  slug: string
  description: string
}

export interface IAction {
  id: string
  name: string
  slug: string
  description: string
  module: string
}

export interface IBitacora {
  id: string
  usuario: string
  modulo: string
  accion: string
  description: string
  dateBitacora: string
}
