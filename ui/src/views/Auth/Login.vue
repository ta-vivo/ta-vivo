<template>
  <h1>{{$t('common.login')}}</h1>
  <el-form ref="form" :model="form" label-width="120px">
    <el-form-item label="Username">
      <el-input v-model="form.name"></el-input>
    </el-form-item>
    <el-form-item label="Password">
      <el-input type="password" v-model="form.name"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">Login</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { defineComponent } from 'vue'
import {ElForm, ElButton, ElInput, ElFormItem} from 'element-plus'

export default defineComponent({
  components: {
    ElForm,
    ElButton,
    ElInput,
    ElFormItem
  },
  data() {
    return {
      form: {
        name: ''
      }
    }
  },
  methods: {
    onSubmit() {
    }
  },
})
</script>
