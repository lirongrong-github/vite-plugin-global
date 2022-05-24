import './style.css'
import { list1, list2, list3, list4 } from '../../test/fixtures'

const app = document.querySelector<HTMLDivElement>('#app')!

/* app.innerHTML = `
  <h1>Hello Vite!</h1>
  <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
` */

/* interface ModuleType {
  name: string
}

const list = import.meta.myGlob<ModuleType>('./fixtures/*.ts') */

/* console.log(list1) */

await Promise.all(Object.values(list1).map(i => i()))
  .then((modules) => {
    app.innerHTML += `${JSON.stringify(modules)}<br>`
  })

await Promise.all(Object.values(list2).map(i => i()))
  .then((modules) => {
    app.innerHTML += `${JSON.stringify(modules)}<br>`
  })

app.innerHTML += `${JSON.stringify(list3)}<br>`
app.innerHTML += `${JSON.stringify(list4)}<br>`
