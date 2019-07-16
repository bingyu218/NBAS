<template lang="jade">
div.layout-content-main
	div.form
		Row(:gutter="20")
			Col(span="12")
				Card.ss
					Form(ref='form',:model="query",label-position="left")
						Row(:gutter="5")
							Col(span="20")
								Form-item(:label="$t('title')+'：'")|{{list.title}}
							Col(span="10")
								Form-item(:label="$t('sender')+'：admin'")
							Col(span="12")
								Form-item(:label="$t('create time')+'：'")|{{$format(list.createTime, 'YYYY-MM-DD HH:mm:ss')}}
							Col(span="24")
								Form-item(:label="$t('content')+'：'")
									Input(v-model="list.content" type="textarea",readonly=true,:rows="5",:placeholder="$t('no content')")
							Col(span="10")|&nbsp;
							Col(span="10")
								Button(type="" @click="$router.back(-1)" )|{{$t('cancel')}}
</template>

<script>
export default{	
	data(){
		return{
			list: [],
			options: {
				name:'',
				type: 1,
				page: 1,
				num: 10,
				total: 0
			}
		
		}
	},
	created(){
		this.getList()
		this.read()
	},
	methods:{
		async read(){
			let res = await this.$api.readmessage({id:this.$route.params.id})
		},
		async getList(){
			let res = await this.$api.message({num:10,page:1,id:this.$route.params.id})
			if (res.data.code == 0){
				this.list=res.data.data.list[0]
			}
		},
		reply(){
			this.$router.push({
				name: 'userManage',
				params:{
					title: this.list.title,
					username: this.list.username
				}
			})
		},
		deleteinform(){
		}
	}
}
	
</script>

<style lang="scss" scoped>
	.ss{
		position: relative;
		left:30%
	}
	
</style>