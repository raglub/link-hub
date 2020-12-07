<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <table style="back">
      <tr v-for="category in categories" :key="category.name">
        <td>{{ category }}</td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Model } from 'vue-property-decorator'
const { ipcRenderer } = window.require('electron')

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
}
</script>
