<template>
  <div class="home">
    <b-card-group class="text-left" deck>
      <b-card v-for="category in categories" :key="category.name" header-tag="header">
        <template #header>
          <h6 class="mb-0 float-left">{{ category.name }}</h6>
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
          <div v-for="(link, index) in category.links" :key="index">
            <b-icon icon="link" class="mr-2"></b-icon>
            <a style="cursor: pointer;" @click="openLink(link.url)" target="_blank">{{ link.name }}</a>
          </div>
        </b-card-text>
      </b-card>
    </b-card-group>
    <link-create :payload="linkCreateRequest" @clickSubmit="createLink"></link-create>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Model } from 'vue-property-decorator'
import Category from '@/models/category'
import LinkCreate from '@/components/LinkCreate.vue'
import Link from '@/models/link'
import LinkCreateRequest from '@/models/link-create-request'
import LinkCreateResponse from '@/models/link-create-response'

const { ipcRenderer, shell } = window.require('electron')

@Component({
  components: {
    LinkCreate
  }
})
export default class Home extends Vue {
  private categories: Category[] = [];
  private linkCreateRequest = new LinkCreateRequest()

  async mounted () {
    const data = await ipcRenderer.invoke('get-data')
    this.$data.categories = data.categories
  }

  openLink (url: string) {
    shell.openExternal(url)
  }

  showLinkCreate (category: Category) {
    this.linkCreateRequest.isVisible = true
    this.linkCreateRequest.category = category
  }

  createLink (response: LinkCreateResponse) {
    const link = new Link()
    link.name = response.name
    link.url = response.url
    response.category.links.push(link)
  }
}
</script>
