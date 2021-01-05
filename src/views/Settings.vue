<template>
  <div class="text-left">
    <h1>Settings</h1>
    <b-form @submit.stop.prevent="onSubmit">
      <b-form-group
        id="input-group-1"
        label="Data Path:"
        label-for="input-1"
        description="This is location where are stored links."
      >
        <b-form-input
          id="input-1"
          v-model="settings.dataPath"
          placeholder="Enter the data path"
          required
        ></b-form-input>
      </b-form-group>
      <b-button type="submit" class="float-right" variant="primary">Save</b-button>
    </b-form>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Model } from 'vue-property-decorator'
import { IpcChannel } from '@/utils/ipc-channel'
import typedIpcRenderer from '@/utils/typed-ipc-renderer'
import SettingsModel from '@/models/settingsModel'

@Component({
})
export default class Settings extends Vue {
  private settings = new SettingsModel()

  async mounted () {
    this.settings = await typedIpcRenderer.invoke(IpcChannel.fetchSettings)
  }

  async onSubmit () {
    await typedIpcRenderer.invoke(IpcChannel.updateSettings, this.settings)
  }
}
</script>
