<template>
	<div class="main">
		<el-header class="dashboard-header">
		  <router-link to="/watch/map" tag="h2" class="pointer">
		    <Icon style="color: white;" type="md-desktop" />
		    <span style="font-size: 20px;">宁波申凌电梯公司</span>
		  </router-link>
		  <div class="dashboard-header-pic">
		    <img style="margin-right: -12px;" src="../assets/images/dashboard-top-l.jpg" alt="logo-l">
		    <span class="center">
		      <img src="../assets/images/logo.png" alt="logo">
		    </span>
		    <img style="margin-left: -12px;" src="../assets/images/dashboard-top-r.jpg" alt="logo-r">
		  </div>
		  <p class="dashboard-header-clock"><img src="../assets/images/time.png" style="height: 20px;width: 20px;" alt=""> <b v-text="clock"></b></p>
		</el-header>
		
		<div class="mycontent" >
			<Row :gutter="16">
				<Col  span="6">
					<div class="mycard">
						<div class="card_title">
							<img style="height: 15px;width: 20px;float: left;margin-top: 3px;" src="../assets/images/device.png" alt="">
							<p style="font-size:15px;color: #c2dbef;float: left;font-weight: 600; margin-left: 10px;">设备运行状况</p>
						</div>
						<div class="card_content">
							<div><p></p> <p></p></div>
							<div><p></p> <p></p></div>
							<div><p></p> <p></p></div>
							<div><p></p> <p></p></div>
						</div>
					</div>
					<div class="mycard" >
						<div class="card_title">
							<img style="height: 20px;width: 20px;float: left;" src="../assets/images/warning.png" alt="">
							<p style="font-size:15px;color: #c2dbef;float: left;font-weight: 600; margin-left: 10px;">设备故障排行</p>
						</div>
						<div class="card_content">
							<PieChart></PieChart>
						</div>
					</div>
				</Col>
				<Col span="12">
					<div class="mycard" style="height: 400px;">
						<div class="card_title">
							<img style="height: 24px;width: 24px;float: left;" src="../assets/images/i.jpg" alt="">
							<p style="font-size:15px;color: #c2dbef;float: left;font-weight: 600; margin-left: 10px;">设备定位</p>
						</div>
						<div class="card_content">
							<Map ></Map>
						</div>
					</div>
					
				</Col>
				<Col span="6">
					<div class="mycard">
						
					</div>
					<div class="mycard">
						
					</div>
				</Col>
			</Row>
		
		</div>
		<div class="footer">
			
		</div>
	</div>
</template>

<script>
	import Map from '@/views/Dashboard/Map'
	import PieChart from '@/YDemo/PieChart.vue'
	export default{
		created() {
			
		},
		components: {
			
			'Map': Map,
			'PieChart':PieChart,
		},
		data(){
			return{
				clock: new Date().toLocaleString(),
			}
		},
		 created() {
		  setInterval(()=> {
		    this.clock = new Date().toLocaleString()
		  }, 1000)
		},
	}
</script>

<style lang="scss" scope>
	.main{
		// overflow: scroll;
		// min-height: 600px;
		width: 100%;
		background: #16223a;
		overflow: scroll;
		height: 100%;
		// overflow-x: flex;
	}
	.dashboard-header {
	  display: flex;
	  flex-flow: row nowrap;
	  align-items: center;
	  justify-content: space-between;
	  font-size: 12px;
	  background-color: #1d2c47;
	  & > * {
	    width: 300px;
	  }
	  .dashboard-header-pic {
	    padding-top: 8px;
	    width: 600px;
	    text-align: center;
	    img {
	      width: auto;
	      height: 40px;
	      z-index: 1;
	    }
	    .center {
	      position: relative;
	      display: inline-block;
	      border-radius: 50%;
	      top: 6px;
	      border: 1px solid #1d2c47;
	      height: 70px;
	      width: 70px;
	      text-align: center;
	      padding-top: 12px; 
	      background: #1d2c47;
	      box-shadow: 0 1px 0 rgba(29, 44, 71, .7), 0 2px 6px rgba(0, 0, 0, .3);
	    }
	  }
	  h2 {
	    color: #b3c7d3;
	    letter-spacing: 2px;
	  }
	  
	  p.dashboard-header-clock {
	    text-align: right;
	    color: #a6c2d2;
	    font-size: 16px;
	    i {
	      vertical-align: middle;
	      font-size: 18px;
	      margin-right: 12px;
	    }
	    b {
	      vertical-align: middle;
	      display: inline-block;
	      width: 204px;
	      letter-spacing: 1px;
	      text-align: left;
	    }
	  }
	}
	.dashboard-header-time {
	  text-align: right;
	}
	.mycontent{
		// overflow-y: auto;
		padding: 30px 15px 10px 15px;
		width: 100%;
		min-height: 600px;
	}
	.mycard{
	  min-height: 200px;
	  border-radius: 2px;
	  background: #1d2d47;
	  padding: 10px;
	  margin-bottom: 12px;
	}
	.card_title{
		width: 100%;
		height: 31px;
	}
	.card_content{
		width: 100%;
		min-height: 200px
	}
	.footer{
		width: 100%;
		height: 100px;
	}
</style>
