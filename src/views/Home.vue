<template>
  <div class="home">
    <b-card-group class="text-left" deck>
      <b-card v-for="category in categories" :key="category.name" header-tag="header">
        <template #header>
          <h6 class="mt-2 float-left">{{ category.name }}</h6>
          <div class="float-right">
            <b-dropdown size="sm"  variant="link" toggle-class="text-decoration-none" no-caret>
              <template #button-content>
                <b-icon icon="three-dots-vertical"></b-icon>
              </template>
              <b-dropdown-item href="#"><b-icon icon="pencil"></b-icon> Edit</b-dropdown-item>
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
              <b-dropdown size="sm"  variant="link" toggle-class="text-decoration-none" no-caret>
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
    <link-create :payload="linkCreateRequest" @clickSubmit="createLink"></link-create>
    <link-edit :payload="linkEditRequest" @clickSubmit="editLink"></link-edit>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Model } from 'vue-property-decorator'
import Category from '@/models/category'
import LinkCreate from '@/components/LinkCreate.vue'
import LinkEdit from '@/components/LinkEdit.vue'
import Link from '@/models/link'
import LinkCreateRequest from '@/models/link-create-request'
import LinkEditRequest from '@/models/link-edit-request'
import LinkCreateResponse from '@/models/link-create-response'

const { ipcRenderer, shell } = window.require('electron')

@Component({
  components: {
    LinkCreate,
    LinkEdit
  }
})
export default class Home extends Vue {
  private categories: Category[] = [];
  private linkCreateRequest = new LinkCreateRequest()
  private linkEditRequest = new LinkEditRequest()

  async mounted () {
    await this.loadData()
  }

  private async loadData () {
    const data = await ipcRenderer.invoke('get-data')
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

  showLinkEdit (link: Link) {
    this.linkEditRequest.isVisible = true
    this.linkEditRequest.url = link.url
    this.linkEditRequest.name = link.name
    this.linkEditRequest.id = link.id
  }

  async createLink (response: LinkCreateResponse) {
    const link = new Link()
    link.name = response.name
    link.url = response.url
    const data = await ipcRenderer.invoke('create-link', response.category.name, link)
    await this.loadData()
  }

  async editLink (response: LinkCreateResponse) {
    await ipcRenderer.invoke('edit-link', response)
    await this.loadData()
  }
}
</script>
