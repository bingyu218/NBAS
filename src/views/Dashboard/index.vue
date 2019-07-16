<template>
	<div class="wrapper layout-content-main" style="background:#f5f3f0;padding:0;overflow-y: scroll;" id="lay">
		<Drawer :title="$t('Content Selection')" :closable="false" v-model="value1" width="10">
			<div><Checkbox @on-change='showpanel("map",map)' v-model="map">{{$t("Devices Location")}}</Checkbox></div>
			<div><Checkbox @on-change='showpanel("chat",chat)' v-model="chat">{{$t("Feedback")}}</Checkbox></div>
			<div><Checkbox @on-change='showpanel("progress",progress)' v-model="progress">{{$t("Treating Progress")}}</Checkbox></div>
			<div><Checkbox @on-change='showpanel("chart",chart)' v-model="chart">{{$t("Achievement Chart")}}</Checkbox></div>
			<!-- <div><Checkbox @on-change='showpanel("chart2",chart2)' v-model="chart2">用户组成</Checkbox></div> -->
			<div><Checkbox @on-change='showpanel("chart3",chart3)' v-model="chart3">{{$t("Common Faults")}}</Checkbox></div>
			<div><Checkbox @on-change='showpanel("chart4",chart4)' v-model="chart4">{{$t("Active Devices")}}</Checkbox></div>
			<div><Checkbox @on-change='showpanel("email",email)' v-model="email">{{$t("Notice")}}</Checkbox></div>
		</Drawer>
		<!-- Content Wrapper. Contains page content -->
			<!-- Main content -->
			<section class="content">
				<!-- Small boxes (Stat box) -->
				<div class="row" style="">
					<div class="ivu-col ivu-col-span-6" id='title1' style="padding-left:10px;padding-right:10px">

						<!-- small box -->
						<div class="small-box bg-red">
							<div class="inner" style="text-align:center; padding:4px" >
								<div :style="'font-size:'+setheight[0]/2.3+'px'" style='font-weight: bold;' id="font11">{{allevents}}</div>
								<p :style="'font-size:'+setheight[0]/6.5+'px'" id="font21">{{$t("Fault Devices")}}</p>
							</div>

							<a href="#" class="small-box-footer" @click="$router.push({name:'maintain'})" :style="'font-size:'+setheight[0]/8+'px'">More info <i class="fa fa-arrow-circle-right"></i></a>
						</div>
					</div>
					<!-- ./col -->
					<div class="ivu-col ivu-col-span-6" id='title2' style="padding-left:10px;padding-right:10px">
						<!-- small box -->
						<div class="small-box bg-aqua">
							<div class="inner" style="text-align:center; padding:4px">
								<div :style="'font-size:'+setheight[0]/2.3+'px'" id="font12" style='font-weight: bold;'>{{0}}<sup style="font-size: 20px"></sup></div>
								<p :style="'font-size:'+setheight[0]/6.5+'px'" id="font22">{{$t("Updateable Firmware")}}</p>
							</div>
							<div class="icon">
								<i class="ion ion-stats-bars"></i>
							</div>
							<a href="#" class="small-box-footer" @click="$router.push({name:'evolution'})" :style="'font-size:'+setheight[0]/8+'px'">More info <i class="fa fa-arrow-circle-right"></i></a>
						</div>

					</div>
					<!-- ./col -->
					<div class="ivu-col ivu-col-span-6" id='title3' style="padding-left:10px;padding-right:10px">

						<!-- small box -->
						<div class="small-box bg-yellow">
							<div class="inner" style="text-align:center; padding:4px">
								<div :style="'font-size:'+setheight[0]/2.3+'px'" id="font13" style='font-weight: bold;'>{{today}}</div>
								<p :style="'font-size:'+setheight[0]/6.5+'px'" id="font23">{{$t("Tasks Completed Today")}}</p>
							</div>
							<div class="icon">
								<i class="ion ion-person-add"></i>
							</div>
							<a href="#" class="small-box-footer" @click="$router.push({name:'maintainList'})" :style="'font-size:'+setheight[0]/8+'px'">More info <i class="fa fa-arrow-circle-right"></i></a>
						</div>

					</div>
					<!-- ./col -->
					<div class="ivu-col ivu-col-span-6" id='title4' style="padding-left:10px;padding-right:10px">

						<!-- small box -->
						<div class="small-box bg-green">
							<div class="inner" style="text-align:center; padding:4px">
								<div :style="'font-size:'+setheight[0]/2.3+'px'" id="font14" style='font-weight: bold;' v-if="shine">{{onlinedevice}}/{{alldevice}}</div>
								<p :style="'font-size:'+setheight[0]/6.5+'px'" id="font24">{{$t("Online Devices")}} {{parseInt(100*onlinedevice/alldevice)}}%</p>
							</div>
							<div class="icon">
								<i class="ion ion-pie-graph"></i>
							</div>
							<a href="#" class="small-box-footer" @click="$router.push({name:'map'})" :style="'font-size:'+setheight[0]/8+'px'">More info <i class="fa fa-arrow-circle-right"></i></a>
						</div>

					</div>
					<!-- ./col -->
				</div>
				<!-- /.row -->
				<!-- Main row -->
				<Row :gutter=20>
					<!-- Left col -->
					<!-- <section class="col-lg-5 connectedSortable"> -->
					

					<draggable :options="{animation: 60,group:'panel'}">
						<Col span='12' id="mapwidth">
						<div class="box box-primary" v-if="map">
							<div class="box-header" style="margin:0">
							  <!-- tools box -->
							  <div class="pull-right box-tools">
								  <button type="button" class="btn btn-primary btn-sm pull-right" @click="map=!map;showpanel('map',map)"><i class="fa fa-times"></i>
								  </button>
									<div class="btn-group" style="margin-right: 5px;">
										<button type="button" class="btn btn-primary btn-sm dropdown-toggle" data-toggle="dropdown" @click="widthblock1('mapwidth')">
											<i class="fa fa-bars"></i></button>
										<div class="dropdown-menu pull-right" role="menu">
											<div style="display: inline-block; font-size:smaller;height:20px;margin-left:5px">{{$t('size')}}：</div>
											<Card style="height:20px;width:20px;cursor: pointer;display: inline-block;border-radius:0;" :style="'background:'+size1" @mouseover.native="widthblock2(1)" @mouseout.native="widthblock1('mapwidth')" @click.native="widthblock3('mapwidth',1)"></Card>
											<Card style="height:20px;width:20px;cursor: pointer;display: inline-block;border-radius:0;" :style="'background:'+size2" @mouseover.native="widthblock2(2)" @mouseout.native="widthblock1('mapwidth')" @click.native="widthblock3('mapwidth',2)"></Card>
											<Card style="height:20px;width:20px;cursor: pointer;display: inline-block;border-radius:0;" :style="'background:'+size3" @mouseover.native="widthblock2(3)" @mouseout.native="widthblock1('mapwidth')" @click.native="widthblock3('mapwidth',3)"></Card>
											<Card style="height:20px;width:20px;cursor: pointer;display: inline-block;border-radius:0;" :style="'background:'+size4" @mouseover.native="widthblock2(4)" @mouseout.native="widthblock1('mapwidth')" @click.native="widthblock3('mapwidth',4)"></Card>
										</div>
									</div>

								<button type="button" class="btn btn-primary btn-sm pull-right" title="Collapse" style="margin-right: 5px;" @click="mapbody=!mapbody">
								  <i class="fa fa-minus" v-if="mapbody"></i> <i class="fa fa-plus" v-if="!mapbody"></i>
								</button>
							  </div>
							  <!-- /. tools -->

							  <i class="fa fa-map-marker"></i>
							  <h3 class="box-title" v-if="text0">
								{{$t("Devices Location")}}
							  </h3>
							</div>
							<transition name="bounce">
							<div style="background:#f5f3f0;border: 0;" :style="'height:'+screenheight/2.55+'px'" v-if="mapbody">
								<Map style="margin-top:0px;margin:0"></Map>
							</div>
							</transition>
							<!-- /.box-body-->
						</div>
						</Col>
						<Col span='6' id="chatwidth">
						  <!-- /.box -->
						<!-- Chat box -->
						<div class="box box-primary" v-if="chat" >
							<div class="box-header" style="margin:0">
							  <!-- tools box -->
							  <div class="pull-right box-tools">
								  <button type="button" class="btn btn-primary btn-sm pull-right" @click="chat=!chat;showpanel('chat',chat)"><i class="fa fa-times"></i>
								  </button>
									<div class="btn-group" style="margin-right: 5px;">
										<button type="button" class="btn btn-primary btn-sm dropdown-toggle" data-toggle="dropdown" @click="widthblock1('chatwidth')">
											<i class="fa fa-bars"></i></button>
										<div class="dropdown-menu pull-right" role="menu">
											<div style="display: inline-block; font-size:smaller;height:20px;margin-left:5px">{{$t('size')}}：</div>
											<Card style="height:20px;width:20px;cursor: pointer;display: inline-block;border-radius:0;" :style="'background:'+size1" @mouseover.native="widthblock2(1)" @mouseout.native="widthblock1('chatwidth')" @click.native="widthblock3('chatwidth',1)"></Card>
											<Card style="height:20px;width:20px;cursor: pointer;display: inline-block;border-radius:0;" :style="'background:'+size2" @mouseover.native="widthblock2(2)" @mouseout.native="widthblock1('chatwidth')" @click.native="widthblock3('chatwidth',2)"></Card>
											<Card style="height:20px;width:20px;cursor: pointer;display: inline-block;border-radius:0;" :style="'background:'+size3" @mouseover.native="widthblock2(3)" @mouseout.native="widthblock1('chatwidth')" @click.native="widthblock3('chatwidth',3)"></Card>
											<Card style="height:20px;width:20px;cursor: pointer;display: inline-block;border-radius:0;" :style="'background:'+size4" @mouseover.native="widthblock2(4)" @mouseout.native="widthblock1('chatwidth')" @click.native="widthblock3('chatwidth',4)"></Card>
										</div>
									</div>
							
								<button type="button" class="btn btn-primary btn-sm pull-right" title="Collapse" style="margin-right: 5px;" @click="chatbody=!chatbody">
								  <i class="fa fa-minus" v-if="chatbody"></i> <i class="fa fa-plus" v-if="!chatbody"></i>
								</button>
							  </div>
							  <!-- /. tools -->
							
							  <i class="fa fa-comments-o"></i>
							  <h3 class="box-title" v-if="text1">
								{{$t("Feedback")}}
							  </h3>
							</div>
							<transition name="bounce">
							<div class="box-body chat" id="chat-box" v-if="chatbody" :style="'height:'+screenheight/2.55+'px'">
								<!-- chat item -->
								<Scroll :on-reach-bottom='handleReachBottom' :distance-to-edge="0" style="margin-top: 5px;width:103%;" :height="screenheight/2.55-60">
									<div class="item" v-for="item in chatlist" >
										<img :src="item.portrait" alt="user image" class="online" onerror="src='../../../static/admin.jpg'">
										<p class="message">
											<a href="#" class="name">
												<!-- <small class="text-muted pull-right"><i class="fa fa-clock-o"></i> 2:15 &nbsp;&nbsp;</small> -->
												<div style="font-size: large;" :style="'font-size:'+setheight[0]/6+'px'">{{item.username}}</div>
												<div style="white-space:normal;word-break:break-all;word-wrap:break-word;width:97%;color:#444444;">{{item.content}}</div>
											</a>
											<div style="display: inline-block;width:95%;margin-top:5px">
											<Col span='1'>&nbsp;</Col>
											<Col span='5'><i class="fa fa-clock-o" style='margin-top: 10px;'></i>&nbsp;{{item.create_time}}</Col>
											<Col span='4'><Button type="text" @click="recall(item.id)" v-if="item.from_id">{{$t("withdraw")}}</Button>&nbsp;</Col>
											<Col span='7'>
												<Button type="text" @click="item.showlist=true" v-if="!item.showlist" style="outline: none;">{{item.followlist.length}}{{$t("replies")}}</Button>
												<Button type="text" @click="item.showlist=false" v-if="item.showlist">{{$t("hidden reply")}}</Button>
											</Col>
											<Col span='7'>
												<Button type="text" @click="reply=$t('respond ')+item.username+':';chatoptions.follow=item.id;chatoptions.content=''" v-if="chatoptions.follow!=item.id" style="outline: none;">{{$t("respond here")}}</Button>
												<Button type="text" @click="reply=$t('Please leave your questions and suggestions');chatoptions.follow=-1;chatoptions.content=''" v-if="chatoptions.follow==item.id" style="color:#FF2C00">{{$t("new message")}}</Button>
											</Col>
											</div>
										</p>
										<div class="attachment" v-for="follow in item.followlist" v-if="item.showlist">
											<h4 style="white-space:normal;word-break:break-all;word-wrap:break-word;color:#2d8cf0;display: inline-block;">{{follow.username}}</h4>
											<h4 style="white-space:normal;word-break:break-all;word-wrap:break-word;display: inline-block;">{{follow.content}}</h4>
											<div>
												<Col span='15'>&nbsp;</Col>
												<Col span='4'><Button type="text" @click="recall(follow.id)" v-if="follow.from_id">{{$t("withdraw")}}</Button>&nbsp;</Col>
												<Col span='5'><i class="fa fa-clock-o" style='margin-top: 10px;'></i>&nbsp;{{follow.create_time}}</Col>
											</div>
										</div>
	<!-- 									<div class="attachment" v-if="(!item.showlist)&&(item.followlist.length>0)">
											<h4 style="white-space:normal;word-break:break-all;word-wrap:break-word; ">宋工:建议减小关门低速1、低速2。</h4>
										</div> -->
										<!-- /.attachment -->
									</div>
								</Scroll>
								<!-- /.item -->
<!-- 								<div class="input-group">
									<input class="form-control" placeholder="Type message...">

									<div class="input-group-btn">
										<button type="button" class="btn btn-primary"><i class="fa fa-plus"></i></button>
									</div>
								</div> -->
								<form action="#" method="post" style="margin-top:5px">
									<div class="input-group">
										<Col span='18'><textarea type="text" name="message" style="height:40px" :placeholder="reply" class="form-control" v-model="chatoptions.content" :style="'font-size:'+screenheight/55+'px'"></textarea></Col>
										<Col span='6'>
										<span class="input-group-btn" style="width: 100%">
											<button type="button" class="btn btn-primary btn-flat" @click="sentchat()" v-if="chatoptions.follow!=-1" :disabled="btn2" style="height:40px;width:100%">{{$t("respond")}}</button>
											<button type="button" class="btn btn-primary btn-flat" @click="sentchat()" v-if="chatoptions.follow==-1" :disabled="btn2" style="height:40px;width:100%">{{$t("message")}}</button>
										</span>
										</Col>
									</div>
								</form>
							</div>
							</transition>
						</div>
						</Col>
						<Col span='6' id="progresswidth">
						<!-- /.box (chat box) -->
						<!-- TO DO List -->
						<div class="box box-primary" v-if="progress" >
							<div class="box-header">
								<i class="fa fa-hourglass-2"></i>
								<h3 class="box-title" v-if="text2">{{$t("Treating Progress")}}</h3>
								<div class="pull-right box-tools">
									<div class="btn-group" style="margin-right: 5px;">
										<button type="button" class="btn btn-primary btn-sm dropdown-toggle" data-toggle="dropdown" @click="widthblock1('progresswidth')">
											<i class="fa fa-bars"></i></button>
										<div class="dropdown-menu pull-right" role="menu">
											<div style="display: inline-block; font-size:smaller;height:20px;margin-left:5px">{{$t('size')}}：</div>
											<Card style="height:20px;width:20px;cursor: pointer;display: inline-block;border-radius:0;" :style="'background:'+size1" @mouseover.native="widthblock2(1)" @mouseout.native="widthblock1('progresswidth')" @click.native="widthblock3('progresswidth',1)"></Card>
											<Card style="height:20px;width:20px;cursor: pointer;display: inline-block;border-radius:0;" :style="'background:'+size2" @mouseover.native="widthblock2(2)" @mouseout.native="widthblock1('progresswidth')" @click.native="widthblock3('progresswidth',2)"></Card>
											<Card style="height:20px;width:20px;cursor: pointer;display: inline-block;border-radius:0;" :style="'background:'+size3" @mouseover.native="widthblock2(3)" @mouseout.native="widthblock1('progresswidth')" @click.native="widthblock3('progresswidth',3)"></Card>
											<Card style="height:20px;width:20px;cursor: pointer;display: inline-block;border-radius:0;" :style="'background:'+size4" @mouseover.native="widthblock2(4)" @mouseout.native="widthblock1('progresswidth')" @click.native="widthblock3('progresswidth',4)"></Card>
										</div>
									</div>
									<button type="button" class="btn btn-primary btn-sm pull-right" @click="progress=!progress"><i class="fa fa-times"></i>
									</button>
								<button type="button" class="btn btn-primary btn-sm pull-right" title="Collapse" style="margin-right: 5px;" @click="progressbody=!progressbody">
									<i class="fa fa-minus" v-if="progressbody"></i> <i class="fa fa-plus" v-if="!progressbody"></i>
								</button>
								</div>
							</div>
							<!-- /.box-header -->
							<transition name="bounce">
							<div class="box-body" v-if="progressbody" style="" :style="'height:'+screenheight/2.55+'px'">
								<Select class="smr" v-model="prostate" style="width:100%;" :placeholder="$t('progress')" @on-change="getprogress(1)">
									<Option key="6" :label="$t('all')" value="6"></Option>
									<Option key="1" :label="$t('untreated')" value="1"></Option>
									<Option key="2" :label="$t('examine order')" value="2"></Option>
									<Option key="3" :label="$t('treating')" value="3"></Option>
									<Option key="4" :label="$t('examine finished')" value="4"></Option>
									<Option key="5" :label="$t('stored')" value="5"></Option>
								</Select>
								<Scroll :on-reach-bottom='handleReachBottom2' :distance-to-edge="0" style="margin-top: 5px;width:101%" :height="screenheight/2.55-55">
								<ul class="todo-list" style=" padding:3">
									<div v-for="item in todo" :style="'font-size:'+screenheight/54+'px'" style="">
										<Col span='24'> 
											<span class="text">{{$t('device')}}：{{item.pro}}</span>
											<small class="label label-danger"><i class="fa fa-clock-o"></i> {{item.time}}</small>
										</Col>
										<div>
											<Col span='24' v-if="item.type=='240'">{{$t('fault code')}}：E{{item.description}}{{$t('E'+item.description)}}</Col>
											<Col span='24' v-if="item.type=='15'">{{$t('fault code')}}：E{{item.description}}{{$t('dE'+item.description)}}</Col>
										</div>
										<div>
											<Col span='24'>{{$t('install address')}}：{{item.addr}}</Col> 
										</div>
										<Col span='3' style="margin-bottom: 10px;display: inline-block;" :style="'min-width:'+screenwidth/18+'px;'">{{$t('progress')}}：</Col>
										<Col span='18' style="margin-bottom: 10px;display: inline-block;" :style="">
											<Col span='20' @mouseenter.native="barword=item.num;" @mouseleave.native="barword='';">
												<div class="progress horizontal active" :style="'height:'+screenheight/42+'px'" v-if="item.progress =='100%'" >
													<div :style="'font-size:'+screenheight/54+'px'" v-if="barword==item.num" style="position: absolute;left:45%;color:#ffffff"> {{item.state}} </div>
													<div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" :style="'width:'+item.progress">
													</div>
												</div>
												<div class="progress horizontal active" :style="'height:'+screenheight/42+'px'" v-if="item.progress =='80%'" >
													<div :style="'font-size:'+screenheight/54+'px'" v-if="barword==item.num" style="position: absolute;left:45%;color:#ffffff"> {{item.state}} </div>
													<div class="progress-bar progress-bar-primary progress-bar-striped" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" :style="'width:'+item.progress">
													</div>
												</div>
												<div class="progress horizontal active" :style="'height:'+screenheight/42+'px'" v-if="item.progress =='40%'">
													<div :style="'font-size:'+screenheight/54+'px'" v-if="barword==item.num" style="position: absolute;left:45%"> {{item.state}} </div>
													<div class="progress-bar progress-bar-warning progress-bar-striped" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" :style="'width:'+item.progress">
													</div>
												</div>
												<div class="progress horizontal active" :style="'height:'+screenheight/42+'px'" v-if="(item.progress =='10%')||(item.progress =='0%')">
													<div :style="'font-size:'+screenheight/54+'px'" v-if="barword==item.num" style="position: absolute;left:45%"> {{item.state}} </div>
													<div class="progress-bar progress-bar-danger progress-bar-striped" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" :style="'width:'+item.progress">
													</div>
												</div>
											</Col> 
											<Col span='4' style="text-align:center;color:#878787;">{{item.progress}}</Col>
										</Col>
									</div>
								</ul>
								</Scroll>
							</div>
							</transition>
							<!-- /.box-body -->
						</div>
						<!-- /.box -->
						</Col>
						
						<Col span='12' id="chartwidth">
					<!-- </section> -->
					<!-- /.Left col -->
					<!-- right col (We are only adding the ID to make the widgets sortable)-->
						<!-- solid sales graph -->
						<div class="box box-primary" v-if="chart">
							<div class="box-header">
								<i class="fa fa-th"></i>

								<h3 class="box-title" v-if="text3">{{$t("Achievement Chart")}}</h3>
								
								<div class="box-tools pull-right">
									<div class="btn-group" style="margin-right: 5px;">
										<button type="button" class="btn btn-primary btn-sm dropdown-toggle" data-toggle="dropdown" @click="widthblock1('chartwidth')">
											<i class="fa fa-bars"></i></button>
										<div class="dropdown-menu pull-right" role="menu">
											<div style="display: inline-block; font-size:smaller;height:20px;margin-left:5px">{{$t('size')}}：</div>
											<Card style="height:20px;width:20px;cursor: pointer;display: inline-block;border-radius:0;" :style="'background:'+size1" @mouseover.native="widthblock2(1)" @mouseout.native="widthblock1('chartwidth')" @click.native="widthblock3('chartwidth',1);chartwidth()"></Card>
											<Card style="height:20px;width:20px;cursor: pointer;display: inline-block;border-radius:0;" :style="'background:'+size2" @mouseover.native="widthblock2(2)" @mouseout.native="widthblock1('chartwidth')" @click.native="widthblock3('chartwidth',2);chartwidth()"></Card>
											<Card style="height:20px;width:20px;cursor: pointer;display: inline-block;border-radius:0;" :style="'background:'+size3" @mouseover.native="widthblock2(3)" @mouseout.native="widthblock1('chartwidth')" @click.native="widthblock3('chartwidth',3);chartwidth()"></Card>
											<Card style="height:20px;width:20px;cursor: pointer;display: inline-block;border-radius:0;" :style="'background:'+size4" @mouseover.native="widthblock2(4)" @mouseout.native="widthblock1('chartwidth')" @click.native="widthblock3('chartwidth',4);chartwidth()"></Card>
										</div>
									</div>
									<button type="button" class="btn btn-primary btn-sm" @click="chartbody=!chartbody;areafault();">
										<i class="fa fa-minus" v-if="chartbody"></i>
										<i class="fa fa-plus" v-if="!chartbody"></i>
									</button>
									<button type="button" class="btn btn-primary btn-sm" @click="chart=false"><i class="fa fa-times"></i>
									</button>
								</div>
							</div>
							<transition name="bounce">
							<div class="box-body border-radius-none" v-if="chartbody" :style="'height:'+screenheight/2.55+'px'">
								<swiper id="swiperBox" v-bind:options="swiperOption" ref="mySwiper">
									<swiper-slide>
										<div class='' :style="'height:'+screenheight/2.7+'px'">
										<compare></compare>
										</div>
										<div class="swiper-button-next"></div>
									</swiper-slide>
									<!-- <swiper-slide>
										<div class="swiper-button-prev"></div>
										<div class='' style="height:370px">
											<freq></freq>
										</div>
										<div class="swiper-button-next"></div>
									</swiper-slide> -->
									<swiper-slide>
										<div class="swiper-button-prev"></div>
										<div class='' :style="'height:'+screenheight/2.7+'px'">
											<!-- <div id="test1" style="height:300px;width:100%"> </div> -->
											<test1></test1>
										</div>
									</swiper-slide>
								</swiper>
							</div>
							</transition>
						</div>
						<!-- /.box -->
						</Col>
					
						<Col span='6' id="chartwidth2">
						<!-- </section> -->
						<!-- /.Left col -->
						<!-- right col (We are only adding the ID to make the widgets sortable)-->
							<!-- solid sales graph -->
							<div class="box box-primary" v-if="chart2">
								<div class="box-header">
									<i class="fa fa-th"></i>
									<h3 class="box-title" v-if="text4">用户组成</h3>
									<div class="box-tools pull-right">
										<div class="btn-group" style="margin-right: 5px;">
											<button type="button" class="btn btn-primary btn-sm dropdown-toggle" data-toggle="dropdown" @click="widthblock1('chartwidth2')">
												<i class="fa fa-bars"></i></button>
											<div class="dropdown-menu pull-right" role="menu">
												<div style="display: inline-block; font-size:smaller;height:20px;margin-left:5px">{{$t('size')}}：</div>
												<Card style="height:20px;width:20px;cursor: pointer;display: inline-block;border-radius:0;" :style="'background:'+size1" @mouseover.native="widthblock2(1)" @mouseout.native="widthblock1('chartwidth2')" @click.native="widthblock3('chartwidth2',1);chartwidth()"></Card>
												<Card style="height:20px;width:20px;cursor: pointer;display: inline-block;border-radius:0;" :style="'background:'+size2" @mouseover.native="widthblock2(2)" @mouseout.native="widthblock1('chartwidth2')" @click.native="widthblock3('chartwidth2',2);chartwidth()"></Card>
												<Card style="height:20px;width:20px;cursor: pointer;display: inline-block;border-radius:0;" :style="'background:'+size3" @mouseover.native="widthblock2(3)" @mouseout.native="widthblock1('chartwidth2')" @click.native="widthblock3('chartwidth2',3);chartwidth()"></Card>
												<Card style="height:20px;width:20px;cursor: pointer;display: inline-block;border-radius:0;" :style="'background:'+size4" @mouseover.native="widthblock2(4)" @mouseout.native="widthblock1('chartwidth2')" @click.native="widthblock3('chartwidth2',4);chartwidth()"></Card>
											</div>
										</div>
										<button type="button" class="btn btn-primary btn-sm" @click="chartbody2=!chartbody2;MemberCharts();">
											<i class="fa fa-minus" v-if="chartbody2"></i>
											<i class="fa fa-plus" v-if="!chartbody2"></i>
										</button>
										<button type="button" class="btn btn-primary btn-sm" @click="chart2=false"><i class="fa fa-times"></i>
										</button>
									</div>
								</div>
								<transition name="bounce">
								<div class="box-body border-radius-none" v-if="chartbody2" style="height:380px">

								</div>
								</transition>
							</div>
							</Col>
							
							<Col span='6' id="emailwidth">
							<!-- quick email widget -->
							<div class="box box-primary" v-if="email">
								<div class="box-header">
									<i class="fa fa-envelope"></i>
							
									<h3 class="box-title" v-if="text5">{{$t("Notice")}}</h3>
									<!-- tools box -->
									<div class="pull-right box-tools">
										<div class="btn-group" style="margin-right: 5px;">
											<button type="button" class="btn btn-primary btn-sm dropdown-toggle" data-toggle="dropdown" @click="widthblock1('emailwidth')">
												<i class="fa fa-bars"></i></button>
											<div class="dropdown-menu pull-right" role="menu">
												<div style="display: inline-block; font-size:smaller;height:20px;margin-left:5px">{{$t('size')}}：</div>
												<Card style="height:20px;width:20px;cursor: pointer;display: inline-block;border-radius:0;" :style="'background:'+size1" @mouseover.native="widthblock2(1)" @mouseout.native="widthblock1('emailwidth')" @click.native="widthblock3('emailwidth',1)"></Card>
												<Card style="height:20px;width:20px;cursor: pointer;display: inline-block;border-radius:0;" :style="'background:'+size2" @mouseover.native="widthblock2(2)" @mouseout.native="widthblock1('emailwidth')" @click.native="widthblock3('emailwidth',2)"></Card>
												<Card style="height:20px;width:20px;cursor: pointer;display: inline-block;border-radius:0;" :style="'background:'+size3" @mouseover.native="widthblock2(3)" @mouseout.native="widthblock1('emailwidth')" @click.native="widthblock3('emailwidth',3)"></Card>
												<Card style="height:20px;width:20px;cursor: pointer;display: inline-block;border-radius:0;" :style="'background:'+size4" @mouseover.native="widthblock2(4)" @mouseout.native="widthblock1('emailwidth')" @click.native="widthblock3('emailwidth',4)"></Card>
											</div>
										</div>
										<button type="button" class="btn btn-primary btn-sm" @click="emailbody=!emailbody">
											<i class="fa fa-minus" v-if="emailbody"></i>
											<i class="fa fa-plus" v-if="!emailbody"></i>
										</button>
										<button type="button" class="btn btn-primary btn-sm" @click="email=false"><i class="fa fa-times"></i>
										</button>
									</div>
									<!-- /. tools -->
								</div>
								<transition name="bounce">
								<div class="box-body" v-if="emailbody" :style="'height:'+screenheight/2.55+'px'">
									<form action="#" method="post">
										<div class="form-group">
											<input type="email" class="form-control" name="emailto" :placeholder="$t('Send to:')" v-model="options.toId" :style="'height:'+screenheight/25+'px;font-size:'+screenheight/40+'px'">
										</div>
										<div class="form-group">
											<input type="text" class="form-control" name="subject" :placeholder="$t('title')" v-model="options.title" :style="'height:'+screenheight/25+'px;font-size:'+screenheight/40+'px'">
										</div>
										<div>
											<textarea class="textarea" :placeholder="$t('content')" v-model="options.content" style="width: 100%;line-height: 18px; border: 1px solid #dddddd; padding: 10px;" :style="'height:'+screenheight/6+'px;font-size:'+screenheight/50+'px'"></textarea>
										</div>
										<button type="button" class="pull-right btn btn-default" id="sendEmail" @click="sent()" :disabled="btn">{{$t('send')}}
											<i class="fa fa-arrow-circle-right"></i></button>
									</form>
								</div>
								</transition>
							</div>
							</Col>
							
							<Col span='6' id="chartwidth3">
								<div class="box box-primary" v-if="chart3">
									<div class="box-header">
										<i class="fa fa-th"></i>
										<h3 class="box-title" v-if="text6">{{$t("Common Faults")}}</h3>
										<div class="box-tools pull-right">
											<div class="btn-group" style="margin-right: 5px;">
												<button type="button" class="btn btn-primary btn-sm dropdown-toggle" data-toggle="dropdown" @click="widthblock1('chartwidth3')">
													<i class="fa fa-bars"></i></button>
												<div class="dropdown-menu pull-right" role="menu">
													<div style="display: inline-block; font-size:smaller;height:20px;margin-left:5px">{{$t('size')}}：</div>
													<Card style="height:20px;width:20px;cursor: pointer;display: inline-block;border-radius:0;" :style="'background:'+size1" @mouseover.native="widthblock2(1)" @mouseout.native="widthblock1('chartwidth3')" @click.native="widthblock3('chartwidth3',1);chartwidth()"></Card>
													<Card style="height:20px;width:20px;cursor: pointer;display: inline-block;border-radius:0;" :style="'background:'+size2" @mouseover.native="widthblock2(2)" @mouseout.native="widthblock1('chartwidth3')" @click.native="widthblock3('chartwidth3',2);chartwidth()"></Card>
													<Card style="height:20px;width:20px;cursor: pointer;display: inline-block;border-radius:0;" :style="'background:'+size3" @mouseover.native="widthblock2(3)" @mouseout.native="widthblock1('chartwidth3')" @click.native="widthblock3('chartwidth3',3);chartwidth()"></Card>
													<Card style="height:20px;width:20px;cursor: pointer;display: inline-block;border-radius:0;" :style="'background:'+size4" @mouseover.native="widthblock2(4)" @mouseout.native="widthblock1('chartwidth3')" @click.native="widthblock3('chartwidth3',4);chartwidth()"></Card>
												</div>
											</div>
											<button type="button" class="btn btn-primary btn-sm" @click="chartbody3=!chartbody3;MemberCharts();">
												<i class="fa fa-minus" v-if="chartbody3"></i>
												<i class="fa fa-plus" v-if="!chartbody3"></i>
											</button>
											<button type="button" class="btn btn-primary btn-sm" @click="chart3=false"><i class="fa fa-times"></i>
											</button>
										</div>
									</div>
									<transition name="bounce">
									<div class="box-body border-radius-none" v-if="chartbody3" :style="'height:'+screenheight/2.55+'px'">
										<swiper id="swiperBox2" v-bind:options="swiperOption" ref="mySwiper">
											<swiper-slide>
												<div class='' :style="'height:'+screenheight/2.7+'px'">
												<faultfreq></faultfreq>
												</div>
											</swiper-slide>
										</swiper>
									</div>
									</transition>
								</div>
							</Col>
							<Col span='12' id="chartwidth4">
								<div class="box box-primary" v-if="chart4">
									<div class="box-header">
										<i class="fa fa-th"></i>
										<h3 class="box-title" v-if="text7">{{$t("Active Devices")}}</h3>
										<div class="box-tools pull-right">
											<div class="btn-group" style="margin-right: 5px;">
												<button type="button" class="btn btn-primary btn-sm dropdown-toggle" data-toggle="dropdown" @click="widthblock1('chartwidth4')">
													<i class="fa fa-bars"></i></button>
												<div class="dropdown-menu pull-right" role="menu">
													<div style="display: inline-block; font-size:smaller;height:20px;margin-left:5px">{{$t('size')}}：</div>
													<Card style="height:20px;width:20px;cursor: pointer;display: inline-block;border-radius:0;" :style="'background:'+size1" @mouseover.native="widthblock2(1)" @mouseout.native="widthblock1('chartwidth4')" @click.native="widthblock3('chartwidth4',1);chartwidth()"></Card>
													<Card style="height:20px;width:20px;cursor: pointer;display: inline-block;border-radius:0;" :style="'background:'+size2" @mouseover.native="widthblock2(2)" @mouseout.native="widthblock1('chartwidth4')" @click.native="widthblock3('chartwidth4',2);chartwidth()"></Card>
													<Card style="height:20px;width:20px;cursor: pointer;display: inline-block;border-radius:0;" :style="'background:'+size3" @mouseover.native="widthblock2(3)" @mouseout.native="widthblock1('chartwidth4')" @click.native="widthblock3('chartwidth4',3);chartwidth()"></Card>
													<Card style="height:20px;width:20px;cursor: pointer;display: inline-block;border-radius:0;" :style="'background:'+size4" @mouseover.native="widthblock2(4)" @mouseout.native="widthblock1('chartwidth4')" @click.native="widthblock3('chartwidth4',4);chartwidth()"></Card>
												</div>
											</div>
											<button type="button" class="btn btn-primary btn-sm" @click="chartbody4=!chartbody4;MemberCharts();">
												<i class="fa fa-minus" v-if="chartbody4"></i>
												<i class="fa fa-plus" v-if="!chartbody4"></i>
											</button>
											<button type="button" class="btn btn-primary btn-sm" @click="chart4=false"><i class="fa fa-times"></i>
											</button>
										</div>
									</div>
									<transition name="bounce">
									<div class="box-body border-radius-none" v-if="chartbody4" :style="'height:'+screenheight/2.55+'px'">
										<swiper id="swiperBox2" v-bind:options="swiperOption" ref="mySwiper">
											<swiper-slide>
												<div class='' :style="'height:'+screenheight/2.7+'px'">
												<activedoor></activedoor>
												</div>
											</swiper-slide>
										</swiper>
									</div>
									</transition>
								</div>
							</Col>
						<!-- /.box -->
						
						</draggable>
					<!-- right col -->
				</Row>
				<!-- /.row (main row) -->
			</section>
			<Col span='22'>&nbsp;</Col>
			<Col span='2' style="vertical-align: middle;">
				<div style="cursor: pointer;color:blue;font-size: larger;margin-left: 20px" @click="value1=true">
					<span style="font-size: 16px" class="fa fa-eye fa-2x"></span>
						内容筛选
				</div>
			</Col>
	</div>
</template>
<script>
	import draggable from 'vuedraggable'
	import Map from '@/views/Dashboard/Map'
	import test1 from '@/views/Dashboard/Order'
	import faultfreq from '@/views/Dashboard/faultfreq'
	import activedoor from '@/views/Dashboard/activedoor'
	import compare from '@/views/Dashboard/compare'
	import echarts from 'echarts'
	import {swiper,swiperSlide} from 'vue-awesome-swiper'
	export default {
		name: 'HelloWorld',
		components: {
			draggable,
			'Map': Map,
			'test1':test1,
			'faultfreq':faultfreq,
			'activedoor':activedoor,
			'compare':compare,
			swiper,swiperSlide,
		},
		data() {
			return {
				text0:true,
				text1:true,
				text2:true,
				text3:true,
				text4:true,
				text5:true,
				text6:true,
				text7:true,
				btn:false,
				btn2:false,
				value1:false,
				faultdevice: 0,
				size1: '#ffffff',
				size2: '#ffffff',
				size3: '#ffffff',
				size4: '#ffffff',
				fault:true,
				fix:true,
				map: true,
				chat: true,
				chart: true,
				chart2: false,
				chart3: true,
				chart4: true,
				email: true,
				progress: true,
				mapbody: true,
				chatbody: true,
				chartbody: true,
				chartbody2: true,
				chartbody3: true,
				chartbody4: true,
				emailbody: true,
				progressbody: true,
				shine:true,
				barword:'',
				todo:[],
				chatlist:[],
				swiperOption:{
					autoplay:true,
					delay:20000,
					notNextTick:true,
					direction:'horizontal',
					grabCursor:true,
					setWrapperSize:true,
					autoHerght:true,
					slidesPerView: 1,
					mousewheel:true,
					mousewheelControl:true,
					height:window.innerHeight,
					resistanceRatio:0,
					observeParents:true,
					observer:true,//修改swiper自己或子元素时，自动初始化swiper
					allowTouchMove: false,
					navigation: {
						prevEl: '.swiper-button-prev',
						nextEl: '.swiper-button-next',
					},
				},
				data:[],
				area:[],
				LastWeek:'',
				LastWeekend:'',
				NowWeek:'',
				NowWeekend:'',
				screenwidth:'',
				screenheight:'',
				setheight:['','','',''],
				options: {
					toId:'',
					fromId:window.localStorage.getItem('id'),
					title:'',
					content:'',
					info:'',
					type:0,
					// createTime:'123',
					isSettled:false,
				},
				chatoptions: {
					fromId:window.localStorage.getItem('username'),
					title:'1',
					content:'',
					info:'1',
					type:0,
					follow: -1,
				},
				chartrepair:[],
				chartorder:[],
				usernum: 0,
				emailnum: 0,
				today: 0,
				allevents: 0,
				alldevice: 0,
				onlinedevice:0,
				chatpage:0,
				progresspage:0,
				prostate:'6',
				chatbottom:false,
				reply:'',
// 				codelist:[this.$t('maintain'),'过流','母线过压','母线欠压','输入缺相',
// 						'输出缺相','输出过力矩','编码器故障','模块过热','运行接触器故障',
// 						'抱闸接触器故障','封星继电器故障','抱闸开关故障','运行中安全回路断开','运行中门锁断开',
// 						'门锁短接故障','层站召唤通讯故障','轿厢通讯故障','并联通讯故障','开门故障',
// 						'关门故障','开关门到位故障','平层信号异常','终端减速开关故障','下限位信号异常',
// 						'上限位信号异常','打滑故障','电梯速度异常','电机反转故障','磁极位置学习故障',
// 						'E30','停车速度检测','井道自学习故障','马达过热故障','制动力严重不足',
// 						  '制动力不足警告',],
// 				codelist2:['输入电压过低','输入电压过高','','','开关门受阻','飞车保护','电机过载','输出过流'],
			}
		},
		mounted(){
			// this.shineword();
			if (window.localStorage.getItem('mapwidth') != null) {this.widthblock3('mapwidth',window.localStorage.getItem('mapwidth'))}
			if (window.localStorage.getItem('chatwidth') != null) {this.widthblock3('chatwidth',window.localStorage.getItem('chatwidth'))}
			if (window.localStorage.getItem('chartwidth') != null) {this.widthblock3('chartwidth',window.localStorage.getItem('chartwidth'))}
			if (window.localStorage.getItem('chartwidth2') != null) {this.widthblock3('chartwidth2',window.localStorage.getItem('chartwidth2'))}
			if (window.localStorage.getItem('chartwidth3') != null) {this.widthblock3('chartwidth3',window.localStorage.getItem('chartwidth3'))}
			if (window.localStorage.getItem('progresswidth') != null) {this.widthblock3('progresswidth',window.localStorage.getItem('progresswidth'))}
			if (window.localStorage.getItem('emailwidth') != null) {this.widthblock3('emailwidth',window.localStorage.getItem('emailwidth'))}
			if (window.localStorage.getItem('map') == 1) {this.map=false}
			if (window.localStorage.getItem('chat') == 1) {this.chat=false}
			if (window.localStorage.getItem('chart') == 1) {this.chart=false}
			if (window.localStorage.getItem('chart2') == 1) {this.chart2=false}
			if (window.localStorage.getItem('chart3') == 1) {this.chart3=false}
			if (window.localStorage.getItem('progress') == 1) {this.progress=false}
			if (window.localStorage.getItem('email') == 1) {this.email=false}
			
		},
		created(){
			this.screenwidth = document.documentElement.clientWidth-200;
			this.screenheight = document.documentElement.clientHeight;
			this.setheight[0]=this.screenheight/9.75 -3
			this.setheight[1]=this.setheight[0]/2.4
			this.getchat();
			this.getinfo();
			this.getprogress();
			this.LastWeek = this.getWeek(7)
			this.LastWeekend = this.getWeek(1)
			this.NowWeek = this.getWeek(0)
			this.NowWeekend = this.getWeek(-6)
			var _this=this
			$(document).keydown(function(event){
			　　　　if(event.ctrlKey && event.keyCode === 32){
						_this.value1=true
			　　　　}
			　　});
			$(window).resize(function(){
				_this.selfadaption()
			});
	function disabledMouseWheel() {  
	  if (document.addEventListener) {
		document.addEventListener('DOMMouseScroll', scrollFunc, false);  
	  }//W3C  
	  window.onmousewheel = document.onmousewheel = scrollFunc;//IE/Opera/Chrome  
	}
	function MouseWheel() {  
	  if (document.removeEventListener) {  
		document.removeEventListener('DOMMouseScroll', scrollFunc, false);  
	  }//W3C  
	  window.onmousewheel = document.onmousewheel = null;//IE/Opera/Chrome  
	}  
	function scrollFunc(evt) {  
	  evt = evt || window.event;  
		if(evt.preventDefault) {  
		// Firefox  
		  evt.preventDefault();  
		  evt.stopPropagation();  
		} else {  
		  // IE  
		  evt.cancelBubble=true;  
		  evt.returnValue = false;  
	  }  
	  return false;  
	}
		this.reply=this.$t('Please leave your questions and suggestions')
		},
		methods: {
			selfadaption(){
				var val1=['mapwidth','chatwidth','progresswidth','chartwidth','chartwidth2','emailwidth','chartwidth3','chartwidth4']
				for (var i=0;i<val1.length;i++){
					var val2=window.localStorage.getItem(val1[i])
					var width=document.documentElement.clientWidth
					if (width<1000) {
						val2=val2*2
						if (width<700) {val2=val2*2}
					}
					if (val2>4) {val2=4}
					if (val2*(width-200)<1200) {
						if (i==0) {this.text0=false}
						if (i==1) {this.text1=false}
						if (i==2) {this.text2=false}
						if (i==3) {this.text3=false}
						if (i==4) {this.text4=false}
						if (i==5) {this.text5=false}
						if (i==6) {this.text6=false}
						if (i==7) {this.text7=false}
						}
					else {
						if (i==0) {this.text0=true}
						if (i==1) {this.text1=true}
						if (i==2) {this.text2=true}
						if (i==3) {this.text3=true}
						if (i==4) {this.text4=true}
						if (i==5) {this.text5=true}
						if (i==6) {this.text6=true}
						if (i==7) {this.text7=true}
						}
					if (val2==1) {document.getElementById(val1[i]).className='ivu-col ivu-col-span-6'}
					if (val2==2) {document.getElementById(val1[i]).className='ivu-col ivu-col-span-12'}
					if (val2==3) {document.getElementById(val1[i]).className='ivu-col ivu-col-span-18'}
					if (val2==4) {document.getElementById(val1[i]).className='ivu-col ivu-col-span-24'}
				}
				if (width<700) {
					for (var i=0;i<4;i++){
						document.getElementById('title'+(i+1).toString()).className="ivu-col ivu-col-span-24"
					}
				}   else {
						if (width<1000){
							for (var i=0;i<4;i++){
								document.getElementById('title'+(i+1).toString()).className="ivu-col ivu-col-span-12"
							}
						}
						else {
							for (var i=0;i<4;i++){
								document.getElementById('title'+(i+1).toString()).className="ivu-col ivu-col-span-6"
							}
						}
					}
				if ((this.screenheight < document.documentElement.clientHeight)){
					this.screenheight = document.documentElement.clientHeight;
				}
				document.getElementById('mapsize').style.height = (Number(this.screenheight)/2.55) + 'px'
				document.getElementById('test1').style.height = (Number(this.screenheight)/2.6) + 'px'
				document.getElementById('freq').style.height = (Number(this.screenheight)/2.6-32) + 'px'
				document.getElementById('activedoor').style.height = (Number(this.screenheight)/2.6-32) + 'px'
				document.getElementById('areaChart').style.height = (Number(this.screenheight-200)/2.6) + 'px'
				// document.getElementById('font11').style.font-size = (Number(this.setheight[0])/2.3) + 'px'
				console.log(document.getElementById('font11').style.FontSize)
				this.$router.push(0)	
			},
			handleReachBottom(){
				this.getchat()
			},
			handleReachBottom2(){
				this.getprogress()
			},
			showpanel(val1,val2){
				if (val2) {window.localStorage.setItem(val1,0)}
				else {window.localStorage.setItem(val1,1)}
			},
			async sent(){
				this.btn = true 
				let res= await this.$api.sentmessage(this.options)
				this.btn= false
				if (res.data.code == 0){
					this.$Notice.success({
						title: this.$t('success'),
						desc: this.$t('send notice successfully')
					});
				}
				else{
					this.$Notice.error({
						title: this.$t('error'),
						desc: this.$t('fail to send notice')
					});
				}
			},
			async recall(val){
				let res = await this.$api.delchat({id:val})
				if (res.data.code == 0){
					this.chatpage=0
					this.chatlist=[]
					this.getchat()
					this.$Notice.success({
						title: this.$t('success'),
						desc: this.$t('You has callback the message')
					});
				}
			},
			async sentchat(){
				var res
				if (!/\S/.test(this.chatoptions.content)) {
					this.$Notice.warning({
						title: this.$t('tip'),
						desc: this.$t('the content can not be empty')
					});
				}
				else {
					this.btn2= true
					res= await this.$api.sentchat(this.chatoptions)
					this.btn2= false
				}
				if (res.data.code == 0){
					this.chatpage=0
					this.chatlist=[]
					this.getchat()
					this.$Notice.success({
						title: this.$t('success'),
						desc: this.$t('send message successfully')
					});
					this.chatoptions.content=''
				}
				else{
					this.$Notice.error({
						title: this.$t('error'),
						desc: this.$t('fail to send message')
					});
				}
			},
			async getchat(){
				this.chatpage++
				let cht = await this.$api.chat({num:10,page:this.chatpage,follow:-1})
				if (cht.body.code == 0){
					if (cht.body.list.length == 0) {
						this.chatpage--
						this.$Notice.warning({
							title: this.$t('tip'),
							desc: this.$t('It is the end！'),
						});
					}
					for(var i=0;i<cht.body.list.length;i++){
						var followlist=[]
						let ech = await this.$api.chat({num:100,page:1,follow:cht.body.list[i].id})
						if (ech.body.code == 0){
							followlist=ech.body.list
							for(var j=0;j<followlist.length;j++){
								var t=Date.parse(new Date())-followlist[j].create_time
								if(t<86400000){followlist[j].create_time=this.$format(followlist[j].create_time,'HH:mm')}
								else if(t<31536000000){followlist[j].create_time=this.$format(followlist[j].create_time,'MM-DD')}
								else {followlist[j].create_time=this.$format(followlist[j].create_time,'YYYY-MM-DD')}
								if (followlist[j].nickname != null) {followlist[j].username = followlist[j].nickname}
								if (followlist[j].from_id == window.localStorage.getItem('id')) {followlist[j].from_id=true}
								else {followlist[j].from_id=false}
							}
						}
						if (cht.body.list[i].nickname != null) {
							cht.body.list[i].username = cht.body.list[i].nickname
							}
						var portrait="src='../../../static/admin.jpg'"
						if (cht.body.list[i].portrait != null) {portrait='http://server.asynciot.com/getfile?filePath='+cht.body.list[i].portrait}
						var t=Date.parse(new Date())-cht.body.list[i].create_time
						if(t<86400000){cht.body.list[i].create_time=this.$format(cht.body.list[i].create_time,'HH:mm')}
						else if(t<31536000000){cht.body.list[i].create_time=this.$format(cht.body.list[i].create_time,'MM-DD')}
						else {cht.body.list[i].create_time=this.$format(cht.body.list[i].create_time,'YYYY-MM-DD')}
						if (cht.body.list[i].from_id == window.localStorage.getItem('id')) {cht.body.list[i].from_id=true}
						else {cht.body.list[i].from_id=false}
						this.chatlist.push({id:cht.body.list[i].id,username:cht.body.list[i].username,content:cht.body.list[i].content,create_time:cht.body.list[i].create_time,followlist:followlist,showlist:false,portrait:portrait,from_id:cht.body.list[i].from_id})
					}
				}
				else {
					this.$Notice.error({
						title: this.$t('error'),
						desc: this.$t('fail to get message')
					})
				}
			},
			shineword(){
				setTimeout(()=>{
					this.shine=!this.shine
					this.shineword()
				}, 1000)
			},
			async getprogress(val){
				if (val == 1) {this.todo=[];this.progresspage=0}
				this.progresspage++
				let res = await this.$api.progress({
					page: this.progresspage,
					num: 8,
					state: this.prostate,
					// user_id:window.localStorage.getItem('id')
				})
				
				if (res.data.code === 0) {
					if (res.data.list.length == 0) {
						this.progresspage--
						this.$Notice.warning({
							title: this.$t('tip'),
							desc: this.$t('It is the end！')
						});
					}
					this.data = res.data.list
					for (var i=0;i<res.data.list.length;i++) {
						
						this.getname(i)
					}
				}
				else {
					this.$Notice.error({
						title: this.$t('error'),
						desc: this.$t('fail to get treating progress')
					})
				}
			},
			async getname(val){
				let ech = await this.$api.devices({device_id:this.data[val].device_id,num:10,page:1})
				if (ech.data.data.list.length == 1) {
				if (ech.data.data.list[0].device_name != null){this.data[val].device_name = ech.data.data.list[0].device_name}
				if (ech.data.data.list[0].IMEI != null){this.data[val].IMEI = ech.data.data.list[0].IMEI}
				if (ech.data.data.list[0].install_addr != null){this.data[val].install_addr = ech.data.data.list[0].install_addr}
				if (ech.data.data.list[0].cell_address != null){this.data[val].cell_address = ech.data.data.list[0].cell_address}
				if (ech.data.data.list[0].ip_country != null){this.data[val].ipaddr = ech.data.data.list[0].ip_country+ech.data.data.list[0].ip_region+ech.data.data.list[0].ip_city}
				var t=Date.parse(new Date())-parseInt(this.data[val].create_time)
				var e=''
				if(t>1000){this.data[val].create_time=parseInt(t/1000).toString()+" secs"}
				if(t>60000){this.data[val].create_time=parseInt(t/60000).toString()+" mins"}
				if(t>3600000){this.data[val].create_time=parseInt(t/3600000).toString()+" hours"}
				if(t>86400000){this.data[val].create_time=parseInt(t/86400000).toString()+" days"}
				}
				var pro='0%'
				var code='0'
				var state=this.$t('untreated')
				var e='未填写'
				if (this.data[val].code != null) {
					code=this.data[val].code.toString(16)
					}
				if (this.data[val].state2 == 'examined') {pro='10%';state=this.$t('examine order')}
				if (this.data[val].state2 == 'untreated') {pro='0%';state=this.$t('untreated')}
				if (this.data[val].state == 'examined') {pro='80%';state=this.$t('examine finished')}
				if (this.data[val].state == 'untreated') {pro='40%';state=this.$t('treating')}
				if (this.data[val].state2 == 'treated') {pro='100%';state=this.$t('stored')}
				this.todo.push({pro:this.data[val].device_name,description: code,time:this.data[val].create_time,progress:pro,addr:this.data[val].install_addr,expect:e,type:ech.data.data.list[0].device_type,state:state,num:10*this.progresspage + val})
			},
			async getinfo(){
				var res
				var ech
				this.faultdevice=0
				this.usernum=0
				this.emailnum=0
				res = await this.$api.fault({num:1,page:1,device_type:'',type:'1',state:'untreated',islast:1})
				if (0 === res.data.code) {
					this.faultdevice =this.faultdevice + res.data.data.totalNumber
				}
				res = await this.$api.people({username: '',mobile: '',name:'',id:'',page: 1,num: 10,total: 0})
				if (0 === res.data.code) {
					this.usernum = res.data.data.totalNumber
				}
				res = await this.$api.message({num:10,page:1,done:false})
				if (res.data.code == 0){
				this.emailnum = res.data.data.totalNumber
				}
				res = await this.$api.getRepair({
					search_info: '',page: 1,num: 4,isreg: "True",state:'treated',order_type:'',result:'',device_id:'',
					finish_starttime:Date.parse(this.$format(new Date(), 'YYYY-MM-DD')),
				})
				if (res.data.code == 0){
				this.today = res.data.data.totalNumber
				}
				res = await this.$api.getRepair({
					search_info: '',page: 1,num: 4,isreg: "True",state:'untreated',order_type:'',result:'',device_id:'',
				})
				if (res.data.code == 0){
				this.faultdevice =this.faultdevice + res.data.data.totalNumber
				this.allevents=this.today+this.faultdevice
				}
				res = await this.$api.devices({page: 1,num: 10,isreg: ''})
				if (res.data.code == 0){
				this.alldevice =res.data.data.totalNumber
				}
				res = await this.$api.devices({page: 1,num: 10,isreg: '',state:'online'})
				if (res.data.code == 0){
				this.onlinedevice =res.data.data.totalNumber
				}
			},
			widthblock1(val){
				var width=document.getElementById(val).className
				if (width=='ivu-col ivu-col-span-6') {this.size1='#008b00';this.size2='#ffffff';this.size3='#ffffff';this.size4='#ffffff'}
				if (width=='ivu-col ivu-col-span-12') {this.size1='#008b00';this.size2='#008b00';this.size3='#ffffff';this.size4='#ffffff'}
				if (width=='ivu-col ivu-col-span-18') {this.size1='#008b00';this.size2='#008b00';this.size3='#008b00';this.size4='#ffffff'}
				if (width=='ivu-col ivu-col-span-24') {this.size1='#008b00';this.size2='#008b00';this.size3='#008b00';this.size4='#008b00'}
			},
			widthblock2(val){
				if (val==1) {this.size1='#008b00';this.size2='#ffffff';this.size3='#ffffff';this.size4='#ffffff'}
				if (val==2) {this.size1='#008b00';this.size2='#008b00';this.size3='#ffffff';this.size4='#ffffff'}
				if (val==3) {this.size1='#008b00';this.size2='#008b00';this.size3='#008b00';this.size4='#ffffff'}
				if (val==4) {this.size1='#008b00';this.size2='#008b00';this.size3='#008b00';this.size4='#008b00'}
			},
			widthblock3(val1,val2){
				if (val2==1) {document.getElementById(val1).className='ivu-col ivu-col-span-6'}
				if (val2==2) {document.getElementById(val1).className='ivu-col ivu-col-span-12'}
				if (val2==3) {document.getElementById(val1).className='ivu-col ivu-col-span-18'}
				if (val2==4) {document.getElementById(val1).className='ivu-col ivu-col-span-24'}
				window.localStorage.setItem(val1,val2)
			},
			getWeek(n){
				var now = new Date()
				var year = now.getFullYear()
				var month = now.getMonth()+1
				var date = now.getDate()
				var day = now.getDay()
				if(day !== 0){
					n =n+day-1
				}else{
					n =n+day
				}
				if(day){
					if(month>1){
						month=month
					}else{
						year=year-1
						month=12
					}
				}
				now.setDate(now.getDate()-n);	
				year=now.getFullYear();
				month=now.getMonth()+1;
				date=now.getDate();
				var s=year+"/"+(month<10?('0'+month):month)+"/"+(date<10?('0'+date):date);
				return s
			},

			DeviceCharts() {
				let test1 = this.$echarts.init(document.getElementById('test3'))
				let test2 = this.$echarts.init(document.getElementById('test4'))
				test1.setOption({
					title: {
						text: '新增设备',
						subtext: '数量'
					},
					tooltip: {
						trigger: 'axis'
					},
					legend: {
						data: ['门机', '控制柜']
					},
					xAxis: {
						type: 'category',
						boundaryGap: false,
						data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
					},
					yAxis: {
						type: 'value',
					},
					series: [{
						name: '门机',
						type: 'line',
						data: [6, 8, 11, 4, 3, 5, 1],
						markPoint: {
							data: [
								{type: 'max', name: '最大值'},
								{type: 'min', name: '最小值'}
							]
						},
						itemStyle : {
							normal : {
								color:'#37a2da',
								lineStyle:{
									color:'#37a2da'
								}
							}
						},
					},
					{
						name: '控制柜',
						type: 'line',
						data: [6, 5, 7, 3, 2, 3, 4],
						markPoint: {
							data: [
								{type: 'max', name: '最大值'},
								{type: 'min', name: '最小值'}
							]
						},
						itemStyle : {
							normal : {
								color:'#ffd460',
								lineStyle:{
									color:'#ffd460'
								}
							}
						},
					}]
				})
				test2.setOption({
					title: {
						text: '本周访问量',
						subtext: '人数'
					},
					tooltip: {
						trigger: 'axis'
					},
					legend: {
						data: ['游客', '用户']
					},
					xAxis: {
						type: 'category',
						boundaryGap: false,
						data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
					},
					yAxis: {
						type: 'value',
					},
					series: [{
						name: '游客',
						type: 'line',
						data: [10, 13, 22, 15, 23, 22, 40],
						markPoint: {
							data: [
								{type: 'max', name: '最大值'},
								{type: 'min', name: '最小值'}
							],
							
						},
						itemStyle : {
							normal : {
								color:'#67e0e3',
								lineStyle:{
									color:'#67e0e3'
								}
							}
						},
					},
					{
						name: '用户',
						type: 'line',
						data: [41, 53, 62, 51, 41, 50, 72],
						markPoint: {
							data: [
								{type: 'max', name: '最大值'},
								{type: 'min', name: '最小值'}
							]
						},
						itemStyle : {
							normal : {
								color:'#ff9f7f',
								lineStyle:{
									color:'#ff9f7f'
								}
							}
						},
					}]
				})
			},
		}
	}
	
</script>
<style lang="scss" scoped>
	.wrapper{
		background-color: #5A6268;
	}
	.slide-fade-enter-active {
		transition: all .3s ease;
	}

	/*这里使用了贝塞尔曲线*/
	.slide-fade-leave-active {
		transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
	}

	/*slide-fade-leave-to 用于低于 2.1.8 版本的 Vue*/
	/*translateX 转化为 x 轴的值*/
	.slide-fade-enter, .slide-fade-leave-to {
		transition: translateX(10px);
		opacity: 0;
	}
	.bounce-enter-active {
	  animation: bounce-in .5s;
	}
	.bounce-leave-active {
	  animation: bounce-in .5s reverse;
	}
	@keyframes bounce-in {
	  0% {
		transform: scale(0);
	  }
	  50% {
		transform: scale(1.5);
	  }
	  100% {
		transform: scale(1);
	  }
	}
</style>