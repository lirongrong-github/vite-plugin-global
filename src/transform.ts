import { dirname } from 'path'
import fg from 'fast-glob'
import MagicString from 'magic-string'
// import { parse } from 'acorn'
import type { ArrayExpression, Literal, ObjectExpression } from 'estree'

const importGlobRE = /\bimport\.meta\.myGlob(?:<\w+>)?\(([\s\S]*?)\)/g
const importPrefix = '__vite_global__'

export interface AcornNode {
  end: number
  start: number
  type: string
}

export type Parse = (input: string, options?: any) => AcornNode

export async function transform(code: string, id: string, parse: Parse) {
  /* TODO: runtime warning */
  const matchs = Array.from(code.matchAll(importGlobRE))
  if (!matchs.length)
    return { code }
  const s = new MagicString(code)
  let num = 0
  for (const match of matchs) {
    /* const glob = match[1].slice(1, -1) */
    const argumentString = `[${match[1]}]`
    /* @ts-expect-error let me do it */
    const ast = parse(argumentString, { ecmaVersion: 'latest' }).body[0].expression as ArrayExpression
    /* arg1 */
    const arg1 = ast.elements[0] as Literal | ArrayExpression
    const globs: string[] = []
    if (arg1.type === 'ArrayExpression') {
      for (const element of arg1.elements) {
        /* @ts-expect-error let me do it */
        if (element.type === 'Literal')
        /* @ts-expect-error let me do it */
          globs.push(element.value as string)
      }
    }
    else {
      globs.push(arg1.value as string)
    }
    /* arg2 */
    const options: myGlobOptions<boolean> = {}
    const arg2 = ast.elements[1] as ObjectExpression | undefined
    if (arg2) {
      for (const property of arg2.properties) {
        /* @ts-expect-error let me do it */
        options[property.key.name] = property.value.value
      }
    }
    const files = await fg(globs, { dot: true, cwd: dirname(id) })
    const start = match.index!
    const end = start + match[0].length
    const query = options.as ? `?${options.as}` : ''
    if (options.eager) {
      const inports = files.map((file, idx) => `import * as ${importPrefix}${num}_${idx} from '${file}${query}'`).join('\n')
      s.prepend(`${inports}\n`)
      const replacement = `{\n${files.map((file, idx) => `'${file}': ${importPrefix}${num}_${idx}`).join(',\n')}\n}`
      s.overwrite(start, end, replacement)
    }
    else {
      const replacement = `{\n${files.map(i => `'${i}': () => import('${i}${query}')`).join(',\n')}\n}`
      s.overwrite(start, end, replacement)
    }
    num += 1
  }
  return {
    code: s.toString(),
    map: s.generateMap(),
  }
}
