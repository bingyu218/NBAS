<template lang="jade">
div.layout-content-main
	Form(ref="form",:model="form",:rules="rules",:label-width="120")
		Row(:gutter="16")
			Col(span="10",offset="2")
				Form-item(label="维保站点名称",prop="name")
					Input(v-model="form.name",placeholder="请输入维保站点名称")
				Form-item(label="维保单位",prop="id",data-toggle="distpicker")
					Row(:gutter="18")
						Col(span="6" style="padding-right:5px")
							Select(placeholder="请选择",v-model="form.maintenanceCompanyId" )
								Option(v-for="item in maintenanceList",:key="item.id",:value="item.id" v-text="item.name")|{{item.value}}
				Form-item(label="负责人",prop="contactor")
					Input(v-model="form.contactor",placeholder="请输入班组负责人")
				Form-item(label="负责人电话",prop="mobile")
					Input(v-model="form.mobile",placeholder="请输入负责人电话",:maxlength="11")
				
				Form-item(label="详细地址",prop="address")
					Input(v-model="form.address",type="textarea",:rows="5",placeholder="请填写详细地址")
		Row.mb-20
			Col(span="14",offset="2")
				Form-item.tc
					Button.mr-10(icon="close",@click="reset('form')")|取消
					Button(type="success",icon="plus",@click="create('form')",:loading="loading")|提交
</template>

<script>
export default {
	data() {
		return {
			loading:false,
			maintenanceList:[],
			form: {
				name: '',
				contactor:'',
				mobile: '',
				address:'',
				maintenanceCompanyId:''
			},			
			rules: {
				name: [{
					required: true,
					type: 'string',
					message: '请填写维保站点名称',
					trigger: 'blur'
				}],
				contactor: [{
				required: false,
				type: 'string',
				message: '请填写负责人',
				trigger: 'blur'
				}],
				mobile: [{
					required: false,
					type: 'string',
					pattern:/^1(3|4|5|7|8)\d{9}$/,
					message: '请填写正确的号码',
					trigger: 'blur'
				}],
				address: [{
					required: false,
					type: 'string',
					message: '请填写详细地址',
					trigger: 'blur'
				}],
				maintenanceCompanyId: [{
					required: false,
					type: 'string',
					message: '请选择维保单位',
					trigger: 'blur'
				}],
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
			let res = await this.$api.site({
				id: this.$route.params.id
			})
			this.form = res.data.data.list[0]
		},
		getOption() {
			this.$api.company({
				type: 1,
				page: 1,
				num: 100
			}).then(res => {
				this.maintenanceList = res.data.data.list
			})
		},
		create(name) {
			this.loading = true
			this.$refs[name].validate(async(valid) => {
				if (valid) {
					let res = null
					if(this.$route.params.id) {
						res = await this.$api.updateSite(this.form)
					} else {
						res = await this.$api.addSite(this.form)
					}	
					this.loading = false
					if (res.data.code == 0) {
					  this.$refs[name].resetFields();
						this.$router.back()
					  this.$Notice.success({
						title: '成功',
						desc: '成功添加站点！',
						onClose: () => {							
						}
					  })
					}else{
						this.loading = false
						this.$Notice.error({
							title: '错误',
							desc: '添加站点失败！'
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
