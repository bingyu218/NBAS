<template lang="jade">
div.layout-content-main
	div.form
		Row(:gutter="20")
			Col(span="15")
				card.ss
					Form(ref='form',:model="query",label-position="left")
						Row(:gutter="5")
							Col(span="20")
								Form-item(label="标题：关于群组人员的事")
							Col(span="6")
								Form-item(label="发件人：王云辉")
							Col(span="6")
								Form-item(label="时间：2018-11-07 09:44")
							Col(span="20")
								Form-item(label="内容：")
									Input(type="textarea",:rows="5",placeholder="没有内容")
									
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
				num: 3,
				total: 0
			}
			
		}
	},
	methods:{
		
	}
}
	
</script>

<style lang="scss" scoped>
	.ss{
		position: relative;
		left:30%
	}
	
</style>