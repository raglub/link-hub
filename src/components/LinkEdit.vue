<template>
    <b-modal
      id="modal-prevent-closing"
      ref="modal"
      title="Edit link"
      v-model="payload.isVisible"
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
    >
      <form ref="form" @submit.stop.prevent="onSubmit">
        <b-form-group
          :state="nameState"
          label="Name"
          label-for="name-input"
          invalid-feedback="Name is required"
        >
          <b-form-input
            id="name-input"
            v-model="payload.name"
            :state="nameState"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group
          :state="nameState"
          label="url"
          label-for="url-input"
          invalid-feedback="Url is required"
        >
          <b-form-input
            id="url-input"
            v-model="payload.url"
            :state="urlState"
            required
          ></b-form-input>
        </b-form-group>
      </form>
    </b-modal>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import LinkEditRequest from '@/models/link-edit-request'
import LinkEditResponse from '@/models/link-edit-response'
import Link from '@/models/link'

@Component
export default class CreateLink extends Vue {
    @Prop()
    private payload!: LinkEditRequest

    nameState = null
    urlState = null
    submittedNames: string[] = []

    checkFormValidity () {
      // const valid = this.$refs.form.checkValidity()
      // this.nameState = valid
      return true
    }

    resetModal () {
      this.nameState = null
    }

    handleOk (bvModalEvt: any) {
      // Prevent modal from closing
      bvModalEvt.preventDefault()
      // Trigger submit handler
      this.onSubmit()
    }

    onSubmit () {
      if (!this.checkFormValidity()) {
        return
      }
      const response = new LinkEditResponse()
      response.name = this.payload.name
      response.url = this.payload.url
      response.id = this.payload.id
      this.$emit('clickSubmit', response)
      this.payload.isVisible = false
    }
}
</script>
