<template lang="jade">
div.layout-content-main
	Tabs()
		TabPane(label="基本信息",name="baseInfo")
	div.form
		Row(:gutter="30")
			Col(span="16" style="padding-bottom:20px")
				Card()
					Row(:gutter="30")
						Col(span="12")
							p()|编号:8452369721
						Col(span="12")
							p()|检验单位:北京市特种设备检测中心
					Row(:gutter="30" style="padding-top:20px")
						Col(span="12")
							p()|梯种:控制柜
					Row(:gutter="30" style="padding-top:20px")
						Col(span="12")
							p()|时间:2018-10-29 15:31:26
						Col(span="12")
							p()|地址:北京北京朝阳区双井街道176号
			Col(span="7" )
				Card()
					img(src="../../assets/ladder.jpg" width="100%")
			Col(span="16" class="h1" )				
				Card()
					p(slot="title")|保养记录
					Row(:gutter="30")
							Col(span="12")
								p()|机房环境:清洁，室温符合要求，照明正常
							Col(span="12")
								p()|油箱:油量、油温正常，无杂质、无漏油现象
						Row(:gutter="30" style="padding-top:20px")
							Col(span="12")
								p()|电动机:运行时无异常振动和异常声
							Col(span="12")
								p()|编码器: 清洁，安装牢固
						Row(:gutter="30" style="padding-top:20px")
							Col(span="12")
								p()|轿顶:清洁，防护拦安全可靠
							Col(span="12")
								p()|井道照明:齐全，正常



</template>

<script>
export default {
	data() {
		return {		
		}
	},
	methods: {

	}
}
</script>

<style lang="css">
	.h1{
		position: absolute;
		padding-top: 13%;
	}
	.h2{
		position: absolute;
		padding-top: 27%;
	}
</style>
