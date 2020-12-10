import Link from './link'

export default class Category {
  public name = 'LinkHub'

  public links: Link[] = []

  constructor (name = '') {
    this.name = name
  }
}
