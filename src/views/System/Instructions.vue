<template>
	<div>
		<iframe :src="src" id='iframebox' ref='pdfiframe' frameborder="0" scrolling="yes"></iframe>
	</div>
</template>

<script>
	export default {
		data(){
			return{
				src:'',
			}
		},
		mounted () {
			this.getPdfInfo()
			this.changeIframeBox()
		},
		methods: {
			changeIframeBox () {
				const iframebox = document.getElementById('iframebox')
				const deviceWidth = document.documentElement.clientWidth
				const deviceHeight = document.documentElement.clientHeight
				iframebox.style.width = '100%'
				iframebox.style.height = (Number(deviceHeight)/1.13) + 'px'
			},
			getPdfInfo () {
				// let name = this.pdf
				let src = '../../../static/Instructions.pdf'
				this.src = src
			}
		}
	}
</script>

<style>

</style>
