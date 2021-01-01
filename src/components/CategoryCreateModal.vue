<template>
    <b-modal
      id="modal-prevent-closing"
      ref="modal"
      title="Create category"
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
      </form>
    </b-modal>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import LinkCreateRequest from '@/models/link-create-request'
import LinkCreateResponse from '@/models/link-create-response'
import Link from '@/models/link'
import ModalBase from '@/models/modal-base'
import CategoryCreate from '@/models/category-create'

@Component
export default class CategoryCreateModal extends Vue {
    @Prop()
    private payload!: ModalBase

    nameState = null
    name = ''

    checkFormValidity () {
      // const valid = this.$refs.form.checkValidity()
      // this.nameState = valid
      return true
    }

    resetModal () {
      this.name = ''
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
      const categoryCreate = new CategoryCreate()
      categoryCreate.name = this.name
      this.$emit('clickSubmit', categoryCreate)
      this.payload.isVisible = false
    }
}
</script>
