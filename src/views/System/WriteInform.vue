<template lang="jade">
div.layout-content-main
	div.form
		Row(:gutter="20")
			Col(span="6")|&nbsp;
			Col(span="12")
				card
					Form(ref='form',:model="query",label-position="left")
						Row(:gutter="5")
							Col(span="23")
								Form-item(label="收件人：")|{{$route.params.username}}
							Col(span="23")
								Form-item(label="标题：")
									Input(v-model="options.title" style="width:100%")
							Col(span="23")
								Form-item(label="内容：")
									textarea(v-model="options.content",:rows="5",placeholder="没有内容" style="width:100%")
							Col(span="23")
								Col(span='9')|&nbsp;
								Col(span='4')
									Button(type='success' @click="sent()" v-if="btn")|发送
									Button(type='success' @click="sent()" disabled= 'false' v-if="! btn")|发送中
								Col(span='10')
									Button(style="margin-left：10px" @click="$router.back(-1)")|取消
</template>

<script>
export default{	
	data(){
		return{
			btn:true,
			list: [],
			options: {
				toId:'',
				fromId:window.localStorage.getItem('id'),
				title:'',
				content:'',
				info:'',
				type:0,
				// createTime:'123',
				isSettled:false,
				
			}
		}
	},
	created(){
		if (this.$route.params.id != ''){this.options.toId=this.$route.params.id}
	},
	methods:{
		async sent(){
			this.btn = false 
			let res= await this.$api.sentmessage(this.options)
			this.btn= true
			if (res.data.code == 0){
				this.$Notice.success({
					title: '成功',
					desc: '已发送消息'
				});
				this.$router.back(-1)
			}
			else{
				this.$Notice.error({
					title: '错误',
					desc: '发送失败'
				});
			}
		}
	}
}
	
</script>

<style lang="scss" scoped>
	.ss{
		position: relative;
		left:40%
	}
	
</style>