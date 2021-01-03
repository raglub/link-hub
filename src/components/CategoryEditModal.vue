<template>
    <b-modal
      id="modal-prevent-closing"
      ref="modal"
      title="Edit category"
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
      </form>
    </b-modal>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import ModalBase from '@/models/modal-base'
import CategoryEdit from '@/models/category-edit'

@Component
export default class CategoryEditModal extends Vue {
    @Prop()
    private payload!: CategoryEdit & ModalBase

    nameState = null

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
      const categoryEdit = new CategoryEdit()
      categoryEdit.name = this.payload.name
      categoryEdit.id = this.payload.id
      this.$emit('clickSubmit', categoryEdit)
      this.payload.isVisible = false
    }
}
</script>
