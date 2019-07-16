<template lang="jade">
div.account
	div.text(align="center")
	Row(:gutter= 50 style="padding-bottom:15%")
		Col(span=12)
			img.img1(src="../assets/logo-menu.png" align="center")
			h3.account-title|宁波申菱 管理系统
		Col(span=12 style="padding-top:5%")
			Form.account-form(ref='form',:model="form",:rules="rules",:label-width="80")
				Form-item(prop="mobile")
					Input(type="text",v-model="form.mobile",placeholder="您注册用的手机")
						icon(name="ios-call-outline",width="14",height="14",slot="prepend")
				Form-item(prop="verifyCode")
					Row(:gutter=30)
						Col(span=12)
							Input(type="text",v-model="form.verifyCode",placeholder="验证码")
								Icon(type="ios-unlocked-outline",size="20",slot="prepend")
						Col(span=12)
							div()
								Button(@click="sentMessage",v-if="count<=0",style="width: 100%")|获取验证码
								Button(@click="sentMessage",v-if="count>0",style="width: 100%" disabled)|获取验证码({{count}})
				Form-item(prop="password")
					Input(type="password",v-model="form.newpassword",placeholder="请输入新密码")
						Icon(type="ios-locked-outline",size="18",slot="prepend")
				Form-item(prop="confirm")
					Input(type="password",v-model="query.confirm",placeholder="请重复新密码")
						Icon(type="ios-locked-outline",size="18",slot="prepend")
				Form-item
					Button(type="primary",style="width: 125px" @click="create('form')",:loading="loading")|重置密码
					Button.ss(type="primary" ,:style="{width: '125px'}" @click="$router.back(-1)")|返回
</template>

<script>
import {
	api,
	ladderApi,
	formatDate
} from '@/utils'
import router from '../router/index'
export default {
	data() {
		const validateOldPassCheck = (rule, value, callback) => {
			if(this.query.confirm == '') {
				callback(new Error('请再次输入密码'));
			} else if(this.query.confirm !== this.form.newpassword) {
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
			form: {
				mobile: '',
				newpassword: '',
				verifyCode:'',
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
				newpassword: [{
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
		this.munite()
		// window.localStorage.setItem('munite',0)
	},
	methods: {
		async sentMessage(){
			this.time=Number(Date.parse(new Date()))
			window.localStorage.setItem('munite',this.time)
			this.munite()
			let res = await this.$api.sentMessage(this.form.mobile)
		},
		munite(){
			if (!(/^\d+$/.test(window.localStorage.getItem('munite')))) window.localStorage.setItem('munite',0)
			this.time=Number(Date.parse(new Date()))
			this.count=(Number(window.localStorage.getItem('munite'))+60000-this.time)/1000
			if (this.count>0){		
				setTimeout(()=>{
					this.munite()
				}, 1000)
			}
			else{window.localStorage.setItem('munite',0)}
		},
		create(name) {
			this.loading = true
			this.$refs[name].validate(async(valid) => {
				if(valid) {
					let res = null
					if(!this.$route.params.id) {
						res = await this.$api.retrieve(this.form)
					}
					this.loading = false
					if(res.data.code == 0){
						this.$refs[name].resetFields();
						window.localStorage.setItem('munite',0);
						this.$router.back();
						this.$Notice.success({
							title: '成功',
							desc: '已经重置密码！',
							onClose: () => {
							}
						})
					}else {
						this.loading = false
						this.$Notice.error({
							title: '错误',
							desc: '重置失败，请检查信息'
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
	.bg{
		position: absolute;
    width: 100%;
    height: 100%;
    background: url('../assets/page.jpg') center center no-repeat;
    background-size: 100% auto;
		filter: blur(5px);
  }
	.text{
		width: 100%;
		height: 100%;
		padding-bottom: 10%;
		position:relative;
	}
	.img1{
		padding-left: 20%;
	}
	.account {
    position: absolute;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: url('../assets/page.jpg') center center no-repeat;
    background-size: 100% auto;
	.account-title {
		color: #606266;
		font-size: 30px;
		line-height: 100px;
		height: 100px;
	}
	.account-form {
		display: block;
		width: 350px;
		margin-left: -80px;
	}
	.register-form {
		width: 270px;
		display: block;
	}
	.ss{
		margin-left: 20px;
	}
}
</style>
