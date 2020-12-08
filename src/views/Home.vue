<template>
  <div class="home">
    <b-card-group class="text-left" deck>
      <b-card v-for="category in categories" :key="category.name"
        :header="category.name">
        <b-card-text>
          <div v-for="(link, index) in category.links" :key="index">
            <b-icon icon="link" class="mr-2"></b-icon>
            <a style="cursor: pointer;" @click="openLink(link.url)" target="_blank">{{ link.name }}</a>
          </div>
        </b-card-text>
      </b-card>
    </b-card-group>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Model } from 'vue-property-decorator'
const { ipcRenderer, shell } = window.require('electron')

@Component({
  components: {
  }
})
export default class Home extends Vue {
  private categories = [];

  async mounted () {
    const data = await ipcRenderer.invoke('get-data')
    this.$data.categories = data.categories
  }

  openLink (url: string) {
    shell.openExternal(url)
  }
}
</script>
