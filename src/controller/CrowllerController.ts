import fs from 'fs'
import path from 'path'
import { Request, Response, NextFunction } from 'express'
import 'reflect-metadata'
import { controller, use, get } from '../decorator/index'
import { getResponseData } from '../utils/util'
import Crowller from '../utils/crowller'
import Analyzer from '../utils/analyzer'

interface BodyRequest extends Request {
  body: {
    [key: string]: string | undefined
  }
}

const checkLogin = (req: Request, res: Response, next: NextFunction): void => {
  const isLogin = !!(req.session ? req.session.login : false)
  if (isLogin) {
    next()
  } else {
    res.json(getResponseData(null, '请先登录'))
  }
}


@controller('/')
export class CrowllerController {

  @get('/getData')
  @use(checkLogin)
  getData(req: BodyRequest, res: Response):void {
    const secret = 'x3b174jsx'
    const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`
    const analyzer = Analyzer.getInstance()
    new Crowller(url, analyzer)
    res.json(getResponseData<responseResult.getData>(true))
  }

  @get('/showData')
  @use(checkLogin)
  showData(req: BodyRequest, res: Response):void {
    try {
      const position = path.resolve(__dirname, '../../data/course.json')
      const result = fs.readFileSync(position, 'utf8')
      res.json(getResponseData<responseResult.showData>(JSON.parse(result)))
    } catch (error) {
      res.json(getResponseData<responseResult.showData>(false, '数据不存在'))
    }
  }
}