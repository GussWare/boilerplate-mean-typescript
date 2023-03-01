import { Request, Response } from 'express'
import HttpStatus from 'http-status'

class UserController {
  async findPaginate (): Promise<boolean> {
    return true
  }

  async findAll (_req: Request, res: Response): Promise<void> {
    res.status(HttpStatus.OK).json({
      message: 'Todos los datos enviados'
    })
  }

  async findById (): Promise<boolean> {
    return true
  }

  async create (): Promise<boolean> {
    return true
  }

  async update (): Promise<boolean> {
    return true
  }

  async remove (): Promise<boolean> {
    return true
  }
}

export default new UserController()
