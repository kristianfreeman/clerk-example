import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
import { Hono } from 'hono'

type Bindings = {
  CLERK_API_URL: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('*', clerkMiddleware())
app.get('/', (c) => {
  const auth = getAuth(c)

  if (!auth?.userId) {
    return c.json({
      message: 'You are not logged in.'
    })
  }

  return c.json({
    message: 'You are logged in!',
    userId: auth.userId
  })
})

app.get('/login', async (c) => {
  const signInUrl = new URL(c.env.CLERK_API_URL + `/sign-in`)
  return c.redirect(signInUrl.toString())
})

export default app
