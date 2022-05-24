import './style.css'
import { list } from '../../test/fixtures'

const app = document.querySelector<HTMLDivElement>('#app')!

/* app.innerHTML = `
  <h1>Hello Vite!</h1>
  <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
` */

/* interface ModuleType {
  name: string
}

const list = import.meta.globNext<ModuleType>('./fixtures/*.ts') */

console.log(list)

Promise.all(Object.values(list).map(i => i()))
  .then((modules) => {
    app.textContent = JSON.stringify(modules)
  })
