import { resolve } from 'path'
import { promises as fs } from 'fs'
import { describe, expect, it } from 'vitest'
import { transform } from '../src/transform'

describe('should', async () => {
  const id = resolve(__dirname, './fixtures/index.ts')
  const code = await fs.readFile(id, 'utf8')
  it('exported', async () => {
    expect(code).toMatchInlineSnapshot(`
      "export interface ModuleType {
        name: string
      }

      export const list1 = import.meta.globNext<ModuleType>('./modules/*.ts')

      export const list2 = import.meta.globNext<ModuleType>([
        './modules/*.ts',
        '!**/index.ts',
      ])
      "
    `)
    expect((await transform(code, id))?.code)
      .toMatchInlineSnapshot(`
        "export interface ModuleType {
          name: string
        }

        export const list1 = {'./modules/a.ts': () => import('./modules/a.ts'), './modules/b.ts': () => import('./modules/b.ts'), './modules/index.ts': () => import('./modules/index.ts')}

        export const list2 = {'./modules/a.ts': () => import('./modules/a.ts'), './modules/b.ts': () => import('./modules/b.ts')}
        "
      `)
  })
})
