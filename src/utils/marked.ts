import { marked } from 'marked'

const render = new marked.Renderer()
render.link = function(href, title, text){
  // ? incase link redirect in app
  return `<a>${text}</a>`
}

export const markedPreview = (text: string) => {
  return marked(text, {renderer: render})
}
