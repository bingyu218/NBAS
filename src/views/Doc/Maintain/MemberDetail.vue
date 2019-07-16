<template lang="jade">
div.layout-content-main
	Form(ref="form",:model="form",:rules="rules",:label-width="90")
		Row(:gutter="16")
			Col(span="10",offset="1")
				Form-item(label="联系人",prop="mobile")
					Input(v-model="form.username",placeholder="请输入联系方式",:maxlength="11" ,:disabled="disabled")
				Form-item(label="联系人电话",prop="mobile")
					Input(v-model="form.mobile",placeholder="请输入联系方式",:maxlength="11")
				Form-item(label="维保群组",prop="groupId")
					Select(placeholder="请选择",v-model="form.groupId" )
						Option(v-for="item in groupList",:key="item.id",:value="item.id" v-text="item.name")|{{item.value}}
				Form-item.tc
					Button.mr-10(icon="close",@click="$router.back(-1)")|取消
					Button(type="success",icon="plus",@click="create('form')",:loading="loading")|提交
</template>

<script>
export default {
	data() {
		return {
			loading: false,
			groupList:[],
			form: {
				userId:window.localStorage.getItem("id"),
				name: '',
				mobile: '',
				companyId: -1,
				groupId: '',
			},
			disabled:false,
			rules: {
// 				name: [{
// 					required: true,
// 					type: 'string',
// 					message: '请填写用户姓名',
// 					trigger: 'blur'
// 				}],
				mobile: [{
					required: false,
					type: 'string',
					pattern: /^1(3|4|5|7|8)\d{9}$/,
					message: '请填写正确的手机号码',
					trigger: 'blur'
				}],
// 				groupId: [{
// 					required: true,
// 					type: 'string',
// 					message: '请选择维保群组',
// 					trigger: 'blur'
// 				}],
			},
		}
	},
	created(){
		if(this.$route.params.id){
			this.disabled = true
			this.getData()
		}
		// this.getOption()
	},
	methods: {
		async getData() {
			let res = await this.$api.people({
				id: this.$route.params.id
			})
			this.form = res.data.data.list[0]
		},
// 		getOption() {
// 			this.$api.team({page: 1,num: 100}).then(res => {
// 				this.groupList = res.data.data.list
// 			})
// 		},
		create(name) {
			this.loading = true
			this.$refs[name].validate(async(valid) => {
				if(valid) {
					let res = null
					if(this.$route.params.id) {
						res = await this.$api.updatePeople(this.form)
					}else{
						res = await this.$api.addPeople(this.form)
					}
					this.loading = false
					if(res.data.code == 0) {
						if(res.data.code == 0){
							this.$refs[name].resetFields();
							this.$router.back();
							this.$Notice.success({
								title: '成功',
								desc: '成功添加维保人员！',
								onClose: () => {
								}
							})
						}else {
							this.loading = false
							this.$Notice.error({
								title: '错误',
								desc: '添加维保人员失败！'
							})
						}							
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
		reset(name) {
			this.$refs[name].resetFields();
		}
	}
}
</script>

<style lang="scss" scoped>
.material-combination {
    position: relative;
}
.cover {
    filter: blur(2px);
}
.material-cover {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
</style>
