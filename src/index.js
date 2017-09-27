import './styles/index'

import Header from './scripts/header'

const headerNode = document.querySelector('._header')

if (headerNode) {
  // eslint-disable-next-line no-unused-vars
  const header = new Header({
    el: headerNode
  })
}
