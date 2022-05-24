import type { Plugin } from 'vite'
import { transform } from './transform'
export interface Options {

}

export default function (_options: Options = {}): Plugin {
  return {
    name: 'vite-plugin-global',
    transform(code, id) {
      return transform(code, id)
    },
  }
}