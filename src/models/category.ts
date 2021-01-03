import Link from './link'

export default class Category {
  public name = 'LinkHub'
  public id = ''

  public links: Link[] = []

  constructor (name = '') {
    this.name = name
  }
}
