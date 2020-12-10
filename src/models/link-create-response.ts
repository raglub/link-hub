import Category from './category'

export default class LinkCreateResponse {
    name = ''
    url = ''
    category: Category = new Category()
}
