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
            v-model="name"
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
            v-model="url"
            :state="urlState"
            required
          ></b-form-input>
        </b-form-group>
      </form>
    </b-modal>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import LinkCreateRequest from '@/models/link-create-request'
import LinkCreateResponse from '@/models/link-create-response'
import Link from '@/models/link'

@Component
export default class CreateLink extends Vue {
    @Prop()
    private payload!: LinkCreateRequest

    name = ''
    url = ''
    nameState = null
    urlState = null
    submittedNames: string[] = []

    checkFormValidity () {
      // const valid = this.$refs.form.checkValidity()
      // this.nameState = valid
      return true
    }

    resetModal () {
      this.name = ''
      this.url = ''
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
      const response = new LinkCreateResponse()
      response.name = this.name
      response.url = this.url
      response.category = this.payload.category
      this.$emit('clickSubmit', response)
      this.payload.isVisible = false
    }
}
</script>
