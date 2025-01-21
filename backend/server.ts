import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { swaggerUI } from '@hono/swagger-ui'
import { OpenAPIHono, createRoute } from '@hono/zod-openapi'

// Types
type Page = {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

type PageVersion = {
  id: string
  pageId: string
  content: string
  createdAt: string
}

// In-memory storage (replace with a proper database in production)
const pages = new Map<string, Page>()
const pageVersions = new Map<string, PageVersion[]>()

const app = new OpenAPIHono()

// CORS middleware
app.use('/*', cors())

// Swagger UI
app.get('/swagger', swaggerUI({ url: '/doc' }))

// Schemas
const PageSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

const CreatePageSchema = z.object({
  title: z.string(),
  content: z.string(),
})

// Routes
app.openapi(
  createRoute({
    method: 'get',
    path: '/pages',
    responses: {
      200: {
        content: {
          'application/json': {
            schema: z.array(PageSchema),
          },
        },
      },
    },
  }),
  (c) => {
    return c.json(Array.from(pages.values()))
  }
)

app.openapi(
  createRoute({
    method: 'post',
    path: '/pages',
    request: {
      body: {
        content: {
          'application/json': {
            schema: CreatePageSchema,
          },
        },
      },
    },
    responses: {
      201: {
        content: {
          'application/json': {
            schema: PageSchema,
          },
        },
      },
    },
  }),
  async (c) => {
    const body = await c.req.json()
    const id = crypto.randomUUID()
    const now = new Date().toISOString()
    
    const page: Page = {
      id,
      title: body.title,
      content: body.content,
      createdAt: now,
      updatedAt: now,
    }
    
    pages.set(id, page)
    pageVersions.set(id, [{
      id: crypto.randomUUID(),
      pageId: id,
      content: body.content,
      createdAt: now,
    }])
    
    return c.json(page, 201)
  }
)

app.openapi(
  createRoute({
    method: 'get',
    path: '/pages/:id',
    responses: {
      200: {
        content: {
          'application/json': {
            schema: PageSchema,
          },
        },
      },
      404: {
        description: 'Page not found',
      },
    },
  }),
  (c) => {
    const id = c.req.param('id')
    const page = pages.get(id)
    
    if (!page) {
      return c.json({ message: 'Page not found' }, 404)
    }
    
    return c.json(page)
  }
)

app.openapi(
  createRoute({
    method: 'put',
    path: '/pages/:id',
    request: {
      body: {
        content: {
          'application/json': {
            schema: CreatePageSchema,
          },
        },
      },
    },
    responses: {
      200: {
        content: {
          'application/json': {
            schema: PageSchema,
          },
        },
      },
      404: {
        description: 'Page not found',
      },
    },
  }),
  async (c) => {
    const id = c.req.param('id')
    const body = await c.req.json()
    const page = pages.get(id)
    
    if (!page) {
      return c.json({ message: 'Page not found' }, 404)
    }
    
    const now = new Date().toISOString()
    const updatedPage: Page = {
      ...page,
      title: body.title,
      content: body.content,
      updatedAt: now,
    }
    
    pages.set(id, updatedPage)
    
    const versions = pageVersions.get(id) || []
    versions.push({
      id: crypto.randomUUID(),
      pageId: id,
      content: body.content,
      createdAt: now,
    })
    pageVersions.set(id, versions)
    
    return c.json(updatedPage)
  }
)

app.openapi(
  createRoute({
    method: 'get',
    path: '/pages/:id/versions',
    responses: {
      200: {
        content: {
          'application/json': {
            schema: z.array(z.object({
              id: z.string(),
              pageId: z.string(),
              content: z.string(),
              createdAt: z.string(),
            })),
          },
        },
      },
      404: {
        description: 'Page not found',
      },
    },
  }),
  (c) => {
    const id = c.req.param('id')
    const versions = pageVersions.get(id)
    
    if (!versions) {
      return c.json({ message: 'Page not found' }, 404)
    }
    
    return c.json(versions)
  }
)

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})