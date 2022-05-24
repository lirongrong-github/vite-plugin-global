import './style.css'
import { list1, list2 } from '../../test/fixtures'

const app = document.querySelector<HTMLDivElement>('#app')!

/* app.innerHTML = `
  <h1>Hello Vite!</h1>
  <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
` */

/* interface ModuleType {
  name: string
}

const list = import.meta.globNext<ModuleType>('./fixtures/*.ts') */

/* console.log(list1) */

Promise.all(Object.values(list1).map(i => i()))
  .then((modules) => {
    app.textContent += JSON.stringify(modules)
  })

Promise.all(Object.values(list2).map(i => i()))
  .then((modules) => {
    app.textContent += JSON.stringify(modules)
  })
