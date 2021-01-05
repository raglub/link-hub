<template>
  <div class="text-left">
      <h1>About</h1>
      <p>
        <strong>Version: </strong>{{ package.version }}
      </p>
      <p>
        <strong>Commit hash: </strong>{{ package.commitHash }}
      </p>
      <p>
        <strong>Author: </strong>{{ package.author }}
      </p>
      <p>Copyright (c) 2020-2021 Michał Szyma</p>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Model } from 'vue-property-decorator'
import { IpcChannel } from '@/utils/ipc-channel'
import typedIpcRenderer from '@/utils/typed-ipc-renderer'
import PackageExctract from '@/models/package-exctract'

@Component({
})
export default class Home extends Vue {
  private package = new PackageExctract()

  async mounted () {
    this.package = await typedIpcRenderer.invoke(IpcChannel.fetchPackage)
  }
}
</script>
