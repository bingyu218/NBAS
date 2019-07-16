<template lang="jade">
div.layout-content-main
		Row(:gutter=30)
			Col(span=16)
				Card
					Row
						Col(span=20)
							Form(ref="form",:model="form",:rules="rules",:label-width="100")
								Row(:gutter="5")
									Col(span="20",offset="2")
										Form-item(label="电梯组名:")
											Input(v-model="form.name")
										Form-item(label="创建人:")
											Input(v-model="form.leader" disabled)
										Form-item(label="所在区域",prop="location",data-toggle="distpicker")
											Cascader(:data="region" v-model="value2")
										Form-item(label="电话:")
											Input(v-model="form.mobile")
										Col(span="16")
											Button.mr-10(type="success",icon="plus",@click="newGroup()" ,:loading="loading")|提交
										Col(span="8")
											Button(icon="close",@click="$router.back(-1)")|取消
</template>

<script>
	import region from '@/views/region.json'
	export default{
		data(){
			return{
				region: region,
				cityList: [],
				districtList: [],
				value2:'',
				loading:false,
				form:{
					name:'',
					leader:window.localStorage.getItem("username"),
					region:'',
					mobile:'',
				},
				rules: {
					name: [{
						required: true,
							type: 'string',
							message: '请填写电梯组名称',
							trigger: 'blur'
					}],
					leader: [{
						required: false,
						type: 'string',
						message: '请填写电梯组负责人',
						trigger: 'blur'
					}],
					mobile: [{
						required: false,
						type: 'string',
						pattern:/^1(3|4|5|7|8)\d{9}$/,
						message: '请填写正确的号码',
						trigger: 'blur'
					}],
				},
			}
		},
		methods:{
			async newGroup() {
				this.loading = true
				this.form.region = this.value2[0]+','+this.value2[1]+','+this.value2[2]
				console.log(this.form.region)
				const res= await this.$api.newGroup(this.form)
				if(res.data.data.code==0){
					this.loading = false
					this.$Notice.success({
						title: '成功',
						desc: '添加成功！'
					});
					this.$router.back(-1)
				}else{
					this.$Notice.error({
						title: '失败',
						desc: '添加失败'
					});
				}
			},
		}
	}	
</script>

<style lang="scss" scoped>
	.inline{
		display: inline-block;
	}
	.username{
		font-size: 30px;
		color: #222;
		display: inline-block;
	}
	.role{
		font-size: 14px;
		color: #999;
		display: inline-block;
	}
	.mr-10{
		margin-left: 100px;
	}
</style>
