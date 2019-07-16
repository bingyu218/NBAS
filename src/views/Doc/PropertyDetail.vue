<template lang="jade">
div.layout-content-main
	Form(ref="form",:model="form",:rules="rules",:label-width="120")
		Row(:gutter="18")
			Col(span="10",offset="2")
				Form-item(label="单位名称",prop="name")
					Input(v-model="form.name",placeholder="请输入物业单位名称")
				Form-item(label="所在区域",prop="location",data-toggle="distpicker")
					Row(:gutter="18")
						Col(span="6" style="padding-right:5px")
							Select(placeholder="请选择",v-model="form.province")
								Option(v-for="item in region",:key="item.province",:value="item.value")|{{item.value}}
						Col(span="6" style="padding-right:5px")
							Select(placeholder="请选择",v-model="form.city")
								Option(v-for="item in cityList",:key="item.city",:value="item.value")|{{item.value}}
						Col(span="6" style="padding-right:5px")
								Select(placeholder="请选择",v-model="form.district")
									Option(v-for="item in districtList",:key="item.name2",:value="item.value")|{{item.value}}
				Form-item(label="单位负责人",prop="contactor")
					Input(v-model="form.contactor",placeholder="请输入单位负责人")
				Form-item(label="负责人电话",prop="mobile")
					Input(v-model="form.mobile",placeholder="请输入负责人电话",:maxlength="11")
				Form-item(label="单位位置",prop="address")
					Input(v-model="form.address",type="textarea",:rows="5",placeholder="请填写单位位置")
		Row.mb-20
			Col(span="14",offset="2")
				Form-item.tc
					Button.mr-10(icon="close",@click="reset('form')")|取消
					Button(type="success",icon="plus",@click="create('form')",:loading="loading")|提交
</template>

<script>
import region from '@/views/region.json'
export default {
	data() {
		return {
			region: region,
			cityList: [],
			districtList: [],
			loading:false,
			form: {
				name:'',
				type: 2,
				province: '',
				city: '',
				district: '',
				address:'',
				contactor:'',
				mobile:'',
			},
			rules: {
				name: [{
				required: true,
				type: 'string',
				message: '请填写物业单位名称',
				trigger: 'blur'
				}],
				contactor: [{
					required: false,
					type: 'string',
					message: '请填写单位负责人',
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
					message: '请填写单位位置',
					trigger: 'blur'
				}],
			},
		}
	},
	created(){
		if(this.$route.params.id){
			this.getData()
		}
	},
	watch: {
		'form.province': function(val){
			let index = this.region.findIndex(item=>item.value==val)
			if(index > -1){
				this.cityList = this.region[index].children
				this.form.city = this.list.city
				this.form.district = this.list.district
			}
		},
		'form.city': function(val){
			let index = this.cityList.findIndex(item=>item.value==val)
			if(index > -1){
				this.districtList = this.cityList[index].children
				this.form.district = this.list.district
			}
		},
	},
	methods: {
		async getData(){
			let res = await this.$api.company({ id: this.$route.params.id})
			this.form = res.data.data.list[0]
		},
		create(name) {
			this.loading = true
			this.$refs[name].validate(async (valid) => {
				if (valid) {
					let res = null
					if(this.$route.params.id){
						res = await this.$api.updateCompany(this.form)
					}else {
						res = await this.$api.addCompany(this.form)
					}
					// this.$store.dispatch('newKitchen', this.form).then(res => {
					this.loading = false
					if (res.data.code == 0) {
						this.$refs[name].resetFields();
						this.$Notice.success({
							title: '成功',
							desc: '成功添加物业单位！',
							onClose: () => {
								this.$router.back()
							}
						})
					}else{
						this.loading = false
						this.$Notice.error({
							title: '错误',
							desc: '添加物业单位失败！'
						})
					}
					// })
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
