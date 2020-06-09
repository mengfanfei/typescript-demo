import { Request, Response } from 'express'
import 'reflect-metadata'
import { controller, get, post } from '../decorator/index'
import { getResponseData } from '../utils/util'

interface BodyRequest extends Request {
  body: {
    [key: string]: string | undefined
  }
}


@controller('/')
export class LoginController {

  static isLogin(req: BodyRequest): boolean {
    return !!(req.session ? req.session.login : false)
  }

  @get('/api/isLogin')
  isLogin(req: BodyRequest, res: Response): void {
    const isLogin = LoginController.isLogin(req)
    res.json(getResponseData<responseResult.isLogin>(isLogin))
  }

  @post('/login')
  login(req: BodyRequest, res: Response): void {
    const { password } = req.body
    const isLogin = LoginController.isLogin(req)
    if (isLogin) {
      res.json(getResponseData<responseResult.login>(true, '已经登录过了'))
    } else {
      if(password === '123' && req.session) {
        req.session.login = true
        res.json(getResponseData<responseResult.login>(true, '登陆成功'))
      } else {
        res.json(getResponseData<responseResult.login>(false, '登陆失败'))
      }
    }
  }

  @get('/loginout')
  loginout(req: BodyRequest, res: Response): void {
    if (req.session) {
      req.session.login = undefined
    }
    res.json(getResponseData<responseResult.loginout>(true))
  }

  // @get('/')
  // home(req: BodyRequest, res: Response): void {
  //   const isLogin = LoginController.isLogin(req)
  //   if (isLogin) {
  //     res.send(`
  //       <html>
  //         <body>
  //           <a href='/getData'>获取内容</a>
  //           <a href='/showData'>展示内容</a>
  //           <a href='/loginout'>退出</a>
  //         </body>
  //       </html>
  //     `)
  //   } else {
  //     res.send(`
  //       <html>
  //         <body>
  //           <form method="post" action="/login">
  //             <input type="password" name="password" />
  //             <button>提交</button>
  //           </form>
  //         </body>
  //       </html>
  //     `)
  //   }
  // }
}