<template lang="jade">
div.account
	div.text(align="center")
	Row(:gutter= 50 style="padding-bottom:15%")
		Col(span=8)|&nbsp;
		Col(span=15 style="font-size: 30px; margin-top: 30px")|{{username}}
		Col(span=3)|&nbsp;
		Col(span=12 style="padding-top:5%")
			Form.account-form(ref='form',:model="form",:rules="rules",:label-width="80")
				Form-item(prop="oldPassword")
					Input(type="password",v-model="form.oldPassword",:placeholder="$t('Please enter the original password')")
						Icon(type="ios-locked-outline",size="18",slot="prepend")
				Form-item(prop="password")
					Input(type="password",v-model="form.password",:placeholder="$t('Please enter the new password')")
						Icon(type="ios-locked-outline",size="18",slot="prepend")
				Form-item(prop="confirm")
					Input(type="password",v-model="query.confirm",:placeholder="$t('Please confirm the new password')")
						Icon(type="ios-locked-outline",size="18",slot="prepend")
				Form-item
					Col(span=4)|&nbsp;
					Col(span=10)
						Button.ss(type="" ,:style="{width: '125px'}" @click="$router.back(-1)")|{{$t('cancel')}}
					Col(span=10)
						Button(type="primary",style="width: 125px" @click="create('form')",:loading="loading")|{{$t('change password')}}
</template>				

<script>
import {
	api,
	ladderApi,
	formatDate
} from '@/utils'
import router from '../../router/index'
export default {
	data() {
		const validateOldPassCheck = (rule, value, callback) => {
			if(this.query.confirm == '') {
				callback(new Error('请再次输入密码'));
			} else if(this.query.confirm !== this.form.password) {
				callback(new Error('两次输入密码不一致!'));
			} else {
				callback();
			}
		};
		return {
			count: 0,
			time: '',
			ladderApi: ladderApi,
			loading: false,
			username:window.localStorage.getItem('username'),
			form: {
				password: '',
				oldPassword: '',
			},
			query:{
				confirm:'',
			},
			rules: {
				username: [{
					required: true,
					message: '请填写',
					trigger: 'blur'
				},
				{
					type: 'string',
					min: 6,
					message: '用户名长度不能小于6位',
					trigger: 'blur'
				}],
				mobile: [{
					required: true,
					message: '请填写手机号码',
					trigger: 'blur'
				},{
					message: '请填写正确的手机号',
					pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
					trigger: 'blur'
				},
				],
				verifyCode: [{
					required: true,
					message: '请填写验证码',
					trigger: 'blur'
				},
				{
					type: 'string',
					min: 4,
					message: '验证码至少是4位',
					trigger: 'blur'
				}],
				password: [{
					required: true,
					message: '请填写密码',
					trigger: 'blur'
				},
				{
					type: 'string',
					min: 6,
					message: '密码长度不能小于6位',
					trigger: 'blur'
				}],
				oldPassword: [{
					required: true,
					message: '请填写密码',
					trigger: 'blur'
				},
				{
					type: 'string',
					min: 6,
					message: '密码长度不能小于6位',
					trigger: 'blur'
				}],
				confirm: [{
					validator: validateOldPassCheck,
					required: true,
					trigger: 'blur'
				}],
			},
		}
	},
	created(){
		// window.localStorage.setItem('munite',0)
	},
	methods: {
		create(name) {
			this.loading = true
			this.$refs[name].validate(async(valid) => {
				if(valid) {
					let res = null
					if(!this.$route.params.id) {
						res = await this.$api.password(this.form)
					}
					this.loading = false
					if(res.data.code == 0){
						this.$refs[name].resetFields();
						this.$router.back();
						this.$Notice.success({
							title: '成功',
							desc: '已经更改密码！',
							onClose: () => {
							}
						})
					}else {
						this.loading = false
						this.$Notice.error({
							title: '错误',
							desc: '更改失败，请检查信息'
						})
					}
				}else{
					this.loading = false
					this.$Notice.error({
						title: '错误',
						desc: '请检查表单是否完整！'
					})
				}
			})
		},
	}
}
</script>

<style lang="scss" scoped>
</style>

