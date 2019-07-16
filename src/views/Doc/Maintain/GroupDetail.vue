<template lang="jade">
div.layout-content-main
	Form(ref="form",:model="form",:rules="rules",:label-width="120")
		Row(:gutter="18")
			Col(span="10",offset="2")
				Form-item(label="班组名称:",prop="name")
					Input(v-model="form.name",placeholder="请输入班组名称")
				//Form-item(label="维保站点:",prop="id")
					Row(:gutter="10")
						Col(span="24")
							Select(placeholder="请选择",v-model="form.siteId" )
								Option(v-for="item in siteList",:key="item.id",:value="item.id" v-text="item.name")|{{item.value}}
				Form-item(label="班组负责人:",prop="contactor")
					Input(v-model="form.contactor",placeholder="请输入班组负责人")
				Form-item(label="负责人电话:",prop="mobile")
					Input(v-model="form.mobile",placeholder="请输入负责人电话",:maxlength="11")
				Form-item(label="维保单位:",prop="maintenanceCompanyName")
					Input(v-model="form.maintenanceCompanyName",placeholder="请输入维保单位名称")

		Row.mb-20
			Col(span="14",offset="2")
				Form-item.tc
					Button.mr-10(icon="close",@click="$router.back(-1)")|取消
					Button(type="success",icon="plus",@click="submit('form')")|提交
</template>

<script>
export default {
	data() {
		return {
			loading:false,
			siteList:[],
			form: {
				name: '',
				contactor:'',
				mobile: '',
				address:'',
				maintenanceCompanyName:''
			},
			rules: {
				name: [{
					required: true,
					type: 'string',
					message: '请填写班组名称',
					trigger: 'blur'
				}],
				contactor: [{
				required: false,
				type: 'string',
				message: '请填写班组负责人',
				trigger: 'blur'
				}],
				mobile: [{
					required: false,
					type: 'string',
					pattern:/^1(3|4|5|7|8)\d{9}$/,
					message: '请填写正确的号码',
					trigger: 'blur'
				}],
// 				siteId: [{
// 					required: true,
// 					type: 'string',
// 					message: '请填写维保站点',
// 					trigger: 'blur'
// 				}],
			},
		}
	},
	created(){
		if(this.$route.params.id){
			this.getData()
		}
		this.getOption()
	},
	methods: {
		async getData() {
			let res = await this.$api.team({
				id: this.$route.params.id
			})
			this.form = res.data.data.list[0]
		},
		getOption() {
			this.$api.site({page: 1,num: 100}).then(res => {
					this.siteList = res.data.data.list
			})
		},
		submit(name) {
			this.loading = true
			this.$refs[name].validate(async(valid) => {
				if (valid) {
					let res = null
					if(this.$route.params.id) {
						res = await this.$api.updateTeam(this.form)
					} else {
						// res = await this.$api.addTeam(this.form)
					}	
					this.loading = false
// 					if (res.data.code == 0) {
// 					  this.$refs[name].resetFields();
// 						this.$router.back();
// 					  this.$Notice.success({
// 							title: '成功',
// 							desc: '成功添加群组！',
// 							onClose: () => {
// 								this.$router.back()
// 							}
// 					  },)
// 					}else{
						this.loading = false
						this.$Notice.error({
							title: '错误',
							desc: '添加群组失败！'
						})
					// }
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
		},		
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
