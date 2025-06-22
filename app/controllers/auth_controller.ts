import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import { loginValidator, registerValidator } from '#validators/auth'

export default class AuthController {
  async showLogin({ view }: HttpContext) {
    return view.render('auth/login')
  }

  async login({ request, response, session, auth }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.findBy('email', email)
    if (!user || !(await hash.verify(user.password, password))) {
      session.flash('error', 'Email atau password salah')
      return response.redirect().back()
    }

    await auth.use('web').login(user)
    return response.redirect('/dashboard')
  }

  async showRegister({ view }: HttpContext) {
    return view.render('auth/register')
  }

  async register({ request, response, auth }: HttpContext) {
    const { email, password } = await request.validateUsing(registerValidator)
    const user = await User.create({ email, password })

    await auth.use('web').login(user)
    return response.redirect('/dashboard')
  }

  async logout({ response, auth }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect('/')
  }
}
