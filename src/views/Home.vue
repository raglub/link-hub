<template>
  <div class="home">
    <table style="back">
      <tr v-for="category in categories" :key="category">
        <td>{{ category }}</td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import HelloWorld from '@/components/HelloWorld.vue' // @ is an alias to /src
const { ipcRenderer } = window.require('electron')

export default defineComponent({
  name: 'Home',
  data: () => {
    return {
      categories: []
    }
  },
  components: {
  },
  async mounted () {
    const data = await ipcRenderer.invoke('get-data')
    this.$data.categories = data.categories
  }
})
</script>

<style scoped lang="scss">

table {
  width: 100%;
}
</style>
