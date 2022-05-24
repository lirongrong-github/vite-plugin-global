import { resolve } from 'path'
/* import { promises as fs } from 'fs' */
import { describe, expect, it } from 'vitest'
import { transform } from '../src/transform'
import code from './fixtures/index.ts?raw'

describe('should', async () => {
  const id = resolve(__dirname, './fixtures/index.ts')
  /* const code = await fs.readFile(id, 'utf8') */
  it('exported', async () => {
    expect(code).toMatchInlineSnapshot(`
      "export interface ModuleType {
        name: string
      }

      export const list1 = import.meta.myGlob<ModuleType>('./modules/*.ts')

      export const list2 = import.meta.myGlob<ModuleType>([
        './modules/*.ts',
        '!**/index.ts',
      ])

      export const list3 = import.meta.myGlob<ModuleType>([
        './modules/*.ts',
        '!**/index.ts',
      ], { eager: true, as: 'raw' })

      export const list4 = import.meta.myGlob<ModuleType>([
        './modules/*.ts',
        '!**/index.ts',
      ], { eager: true })
      "
    `)
    expect((await transform(code, id))?.code)
      .toMatchInlineSnapshot(`
        "import * as __vite_global__3_0 from './modules/a.ts'
        import * as __vite_global__3_1 from './modules/b.ts'
        import * as __vite_global__2_0 from './modules/a.ts?raw'
        import * as __vite_global__2_1 from './modules/b.ts?raw'
        export interface ModuleType {
          name: string
        }

        export const list1 = {
        './modules/a.ts': () => import('./modules/a.ts'),
        './modules/b.ts': () => import('./modules/b.ts'),
        './modules/index.ts': () => import('./modules/index.ts')
        }

        export const list2 = {
        './modules/a.ts': () => import('./modules/a.ts'),
        './modules/b.ts': () => import('./modules/b.ts')
        }

        export const list3 = {
        './modules/a.ts': __vite_global__2_0,
        './modules/b.ts': __vite_global__2_1
        }

        export const list4 = {
        './modules/a.ts': __vite_global__3_0,
        './modules/b.ts': __vite_global__3_1
        }
        "
      `)
  })
})
