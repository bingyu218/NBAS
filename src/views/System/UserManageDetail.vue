<template lang="jade">
div.layout-content-main
	Form(ref="form",:model="form",:rules="rules",:label-width="120")
		Row(:gutter="18")
			Col(span="10",offset="2")
				Form-item(label="昵称",prop="userName")
					Input(v-model="form.name",placeholder="请输入昵称")
				Form-item(label="性别",prop="sex")<input id="man" type="radio" checked="checked" name="1" v-model="form.sex"/>男<input id="woman" type="radio"  name="1"/>女
				Form-item(label="所在公司",prop="company",data-toggle="distpicker")
					Row(:gutter="18")
						Col(span="18" style="padding-right:5px")
							Select(placeholder="请选择",v-model="form.company")
								Option(v-for="item in region",:key="item.province",:value="item.value")|{{item.value}}	
				Form-item(label="登陆用户名",prop="username")
					Input(v-model="form.username",placeholder="请设置登陆用户名")
				Form-item(label="密码",prop="password")
					Input(v-model="form.password",placeholder="请设置密码")
				Form-item(label="确认密码",prop="confirmpassword")
					Input(v-model="form.confirmpassword",placeholder="请再次输入密码")
				Form-item(label="联系电话",prop="mobile")
					Input(v-model="form.mobile",placeholder="请输入联系电话",:maxlength="11")
				Form-item(label="Email",prop="contactor")
					Input(v-model="form.email",placeholder="请邮箱地址")
				Form-item(label="设置权限",prop="authority")
					Row(:gutter="18")
						Col(span="18" style="padding-right:5px")
							Select(placeholder="请选择",v-model="form.authority")
								Option(v-for="item in region",:key="item.province",:value="item.value")|{{item.value}}		
				Form-item(label="身份证号码",prop="certId")
					Input(v-model="form.certId",placeholder="请输入身份证号码",:maxlength="18")
		Row.mb-20
			Col(span="14",offset="2")
				Form-item.tc
					Button.mr-10(icon="close",@click="$router.back(-1)")|取消
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
			type: 0,
			province: '',
			city: '',
			district: '',
			address:'',
			contactor:'',
			mobile:'',
		},
		rules: {
			username: [{
            required: true,
            message: '请填写昵称',
            trigger: 'blur'
          },
          {
            type: 'string',
            min: 5,
            message: '用户名长度不能小于6位',
            trigger: 'blur'
          }
        ],
        password: [{
            required: true,
            message: '请填写密码',
            trigger: 'blur'
          },
          {
            type: 'string',
            min: 3,
            message: '密码长度不能小于6位',
            trigger: 'blur'
          }
        ],
         confirmpassword: [{
            required: true,
            message: '请确认密码',
            trigger: 'blur'
          },
          {
            type: 'string',
            //equal: password,
            message: '密码长度不能小于6位',
            trigger: 'blur'
          }
        ],
			name: [{
				required: true,
					type: 'string',
					message: '请填写名称',
					trigger: 'blur'
			}],
				mobile: [{
					required: false,
					type: 'string',
					pattern:/^1(3|4|5|7|8)\d{9}$/,
					message: '请填写正确的手机号码',
					trigger: 'blur'
			}],
				certId: [{
					required: true,
					type: 'string',
					pattern:/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
					message: '请填写正确的身份证号码',
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
							res = await this.$api.updatepeople({id:this.form.id,username:this.form.username,
																	birthday:this.form.birthday,email:this.form.email,
																	mobile:this.form.mobile,sex:this.form.sex})
						}else {
							res = await this.$api.addpeople(this.form)
						}
				  // this.$store.dispatch('newKitchen', this.form).then(res => {
						this.loading = false
						if (res.data.code == 0) {
							this.$refs[name].resetFields();
							this.$Notice.success({
								title: '成功',
								desc: '成功添加用户！'
							})
						}else{
							this.loading = false
							this.$Notice.error({
								title: '错误',
								desc: '添加用户失败！'
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
