<template>
  <div class="home">
    <b-button variant="primary" class="mb-2" @click="showCategoryCreate()"><b-icon icon="plus-circle"></b-icon> Add Category</b-button>
    <b-card-group class="text-left" deck>
      <b-card v-for="category in categories" :key="category.name" header-tag="header">
        <template #header>
          <h6 class="mt-2 float-left">{{ category.name }}</h6>
          <div class="float-right">
            <b-dropdown size="sm" right variant="link" toggle-class="text-decoration-none" no-caret>
              <template #button-content>
                <b-icon icon="three-dots-vertical"></b-icon>
              </template>
              <b-dropdown-item @click="showCategoryEdit(category)"><b-icon icon="pencil"></b-icon> Edit</b-dropdown-item>
              <b-dropdown-item @click="showLinkCreate(category)"><b-icon icon="plus-circle"></b-icon> Add link</b-dropdown-item>
            </b-dropdown>
          </div>
        </template>
        <b-card-text>
          <div v-for="(link, index) in category.links" :key="index" class="d-flex bd-highlight">
            <div class="flex-grow-1 bd-highlight">
              <b-icon icon="link" class="float-left mr-2"></b-icon>
              <a class="float-leftt" style="cursor: pointer;" @click="openLink(link.url)" target="_blank">{{ link.name }}</a>
            </div>
            <div class="bd-highlight">
              <b-dropdown size="sm" right variant="link" toggle-class="text-decoration-none" no-caret>
                <template #button-content>
                  <b-icon icon="three-dots-vertical" class="m-0 p-0"></b-icon>
                </template>
                <b-dropdown-item @click="showLinkEdit(link)"><b-icon icon="pencil"></b-icon> Edit link</b-dropdown-item>
              </b-dropdown>
            </div>
          </div>
        </b-card-text>
      </b-card>
    </b-card-group>
    <category-create-modal :payload="categoryCreate" @clickSubmit="createCategory"></category-create-modal>
    <category-edit-modal :payload="categoryEdit" @clickSubmit="editCategory"></category-edit-modal>
    <link-create :payload="linkCreateRequest" @clickSubmit="createLink"></link-create>
    <link-edit-modal :payload="linkEdit" @clickSubmit="editLink"></link-edit-modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Model } from 'vue-property-decorator'
import Category from '@/models/category'
import LinkCreate from '@/components/LinkCreate.vue'
import LinkEditModal from '@/components/LinkEditModal.vue'
import CategoryCreateModal from '@/components/CategoryCreateModal.vue'
import CategoryEditModal from '@/components/CategoryEditModal.vue'
import Link from '@/models/link'
import LinkCreateRequest from '@/models/link-create-request'
import LinkEdit from '@/models/link-edit'
import LinkCreateResponse from '@/models/link-create-response'
import ModalBase from '@/models/modal-base'
import CategoryCreate from '@/models/category-create'
import CategoryEdit from '@/models/category-edit'
import { IpcChannel } from '@/utils/ipc-channel'

const { ipcRenderer, shell } = window.require('electron')

@Component({
  components: {
    LinkCreate,
    LinkEditModal,
    CategoryCreateModal,
    CategoryEditModal
  }
})
export default class Home extends Vue {
  private categories: Category[] = [];
  private linkCreateRequest = new LinkCreateRequest()
  private linkEdit: LinkEdit & ModalBase = {
    name: '',
    id: '',
    url: '',
    isVisible: false
  }

  private categoryEdit: CategoryEdit & ModalBase = {
    name: '',
    id: '',
    isVisible: false
  }

  private categoryCreate: ModalBase = {
    isVisible: false
  }

  async mounted () {
    await this.loadData()
  }

  private async loadData () {
    const data = await ipcRenderer.invoke(IpcChannel.getData)
    this.categories.length = 0
    this.categories.push(...data.categories)
  }

  openLink (url: string) {
    shell.openExternal(url)
  }

  showLinkCreate (category: Category) {
    this.linkCreateRequest.isVisible = true
    this.linkCreateRequest.category = category
  }

  showCategoryCreate () {
    this.categoryCreate.isVisible = true
  }

  showCategoryEdit (category: Category) {
    this.categoryEdit.isVisible = true
    this.categoryEdit.name = category.name
    this.categoryEdit.id = category.id
  }

  showLinkEdit (link: Link) {
    this.linkEdit.isVisible = true
    this.linkEdit.url = link.url
    this.linkEdit.name = link.name
    this.linkEdit.id = link.id
  }

  async createLink (response: LinkCreateResponse) {
    const link = new Link()
    link.name = response.name
    link.url = response.url
    const data = await ipcRenderer.invoke(IpcChannel.createLink, response.category.name, link)
    await this.loadData()
  }

  async createCategory (response: CategoryCreate) {
    const data = await ipcRenderer.invoke('create-category', response)
    await this.loadData()
  }

  async editCategory (response: CategoryEdit) {
    const data = await ipcRenderer.invoke('edit-category', response)
    await this.loadData()
  }

  async editLink (response: LinkEdit) {
    await ipcRenderer.invoke('edit-link', response)
    await this.loadData()
  }
}
</script>
