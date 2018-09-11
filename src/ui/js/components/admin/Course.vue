<template>
	<div class="content greybg w-100 d-flex flex-column" v-if="course === null">
		<div class="d-flex h-100 justify-content-center align-items-center">
			<div>
				<half-circle-spinner :animation-duration="1000" :size="120"/>
			</div>
		</div>
	</div>
	<div class="content greybg w-100 d-flex flex-column h-top" v-else>
		<div class="content w-100 d-flex flex-row proj-bar">
			<div class="content-top w-100 pt-2">

				<div class="content-title float-left">
					<span><!--<img src="/img/icons/device-48.png" class="mr-4">-->{{course.name}}</span>
				</div>

				<div class="btn-group submenu">
					<button type="button" class="btn btn-secondary dropdown-toggle xs-submenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
						<img src="img/icons/submenu-icon.png">
					</button>
					<div class="dropdown-menu dropdown-menu-right">
						<button @click="deleteCourse"><img src="/img/icons/erase-16.png"> Delete course</button>
						<!-- <button @click="addProduct"><img src="/img/icons/add-icon-16.png"> Provision Product</button>
						<button @click="settings"><img src="/img/icons/settings-icon-16.png"> Settings</button>
						<button @click="provisioningFile"><img src="/img/icons/settings-icon-16.png"> Provisioning File</button> -->
						<router-link to="/courses"><img src="/img/icons/back-icon-16.png"> Go back</router-link>
					</div>
				</div>

			</div>
		</div>
		<div class="content pt-4 pr-4 pl-4 d-flex flex-column w-100 h-100 rel">
			<!-- <div class="filters w-100">
				<div class="input-group">
					<div class="filter-title">Status:</div>
					<div class="btn-group radio-group" data-toggle="buttons">
						<label class="btn">All
							<input type="radio" value="all" name="all">
						</label>
						<label class="btn not-active">Production
							<input type="radio" value="production" name="production">
						</label>
						<label class="btn not-active">Beta
							<input type="radio" value="beta" name="beta">
						</label>
					</div>
				</div>
				<div class="select-group ml-5">
					<div class="filter-title">Running apps:</div>
					<select id="basic2" class="form-control" multiple>
						<option selected>WaterD 1.7</option>
						<option selected>CofeeD 1.3</option>
					</select>
				</div>
				<div class="select-group ml-5">
					<div class="filter-title">Location:</div>
					<select id="basic2" class="form-control" multiple>
						<option selected>USA</option>
						<option selected>India</option>
					</select>
				</div>
				<div class="search-filters float-right">
					<input type="text" id="search" value="Search">
					<a href="#"><img src="/img/icons/search-16.png"></a>
				</div>
			</div> -->
			<!-- <div class="d-flex h-100 justify-content-center align-items-center" v-if="products === null">
				<div>
					<half-circle-spinner :animation-duration="1000" :size="120"/>
				</div>
			</div> -->

			<div class="course-tab-bg"></div>
			<div class="course-info">
				<ul class="nav nav-tabs navbar-right" id="myTab" role="tablist">
					<li class="nav-item">
						<a class="nav-link active" id="students-tab" data-toggle="tab" href="#students" role="tab" aria-controls="students" aria-selected="true">Students</a>
					</li>
					<li class="nav-item">
						<a class="nav-link" id="teachers-tab" data-toggle="tab" href="#teachers" role="tab" aria-controls="teachers" aria-selected="false">Teachers</a>
					</li>
				</ul>
				<div class="tab-content" id="myTabContent">
					<div class="tab-pane fade show active" id="students" role="tabpanel" aria-labelledby="studets-tab">
						<h4>Students</h4>
						<table class="table users-table table-hover">
							<!--<thead>
								<tr>
									<th scope="col">Name
										<a href="#" class="sort-by"></a></th>
									<th scope="col" class="text-center">Username
										<a href="#" class="sort-by"></a></th>
									<th scope="col" class="text-center">Email
										<a href="#" class="sort-by"></a></th>
									<th scope="col" class="text-center">Platform
										<a href="#" class="sort-by"></a></th>
									<th scope="col" class="text-center xs-hide">Load
										<a href="#" class="sort-by"></a></th>
									<th scope="col" class="text-center xs-hide">Memory Usage
										<a href="#" class="sort-by"></a></th>
									<th scope="col" class="text-center xs-hide">Status
										<a href="#" class="sort-by"></a></th>
									<th scope="col" class="text-center xs-hide">Last status
										<a href="#" class="sort-by"></a></th>
									<th scope="col" class="text-center">Messages
										<a href="#" class="sort-by"></a></th>
									<th scope="col" class="text-center">Deployer
										<a href="#" class="sort-by"></a></th>
									<th scope="col" class="text-center">Starter
										<a href="#" class="sort-by"></a></th>
									<th scope="col" class="text-center" style="width:190px">Actions</th>
								</tr>
							</thead>-->
							<tbody>
								<tr class="add-user handpointer">
									<!-- <td style="width:300px" @click="productSettings(product)" class="handpointer"><img v-if="product.options.restrictAccess" src="/img/icons/locked.png" class="status-icon" v-tooltip data-toggle="tooltip" data-placement="top" title="Restricted Access"><img v-if="product.actions.restart" src="/img/icons/sched-update.png" class="status-icon" v-tooltip data-toggle="tooltip" data-placement="top" title="Restart Scheduled"><img v-if="product.actions.distribute" src="/img/icons/sched-distribute.png" class="status-icon" v-tooltip data-toggle="tooltip" data-placement="top" title="Distribute Scheduled"><img v-if="product.options.restrictUpdate" src="/img/icons/no-update.png" class="status-icon" v-tooltip data-toggle="tooltip" data-placement="top" title="Restricted Update">{{product.name}}</td> -->
									<td class="user-name"><h5>Add new</h5></td>
									<td class="add-pic"><img src="img/icons/white-plus-50.png"></td>
								</tr>
								<tr v-for="student in students" :key="student.userId">
									<!-- <td style="width:300px" @click="productSettings(product)" class="handpointer"><img v-if="product.options.restrictAccess" src="/img/icons/locked.png" class="status-icon" v-tooltip data-toggle="tooltip" data-placement="top" title="Restricted Access"><img v-if="product.actions.restart" src="/img/icons/sched-update.png" class="status-icon" v-tooltip data-toggle="tooltip" data-placement="top" title="Restart Scheduled"><img v-if="product.actions.distribute" src="/img/icons/sched-distribute.png" class="status-icon" v-tooltip data-toggle="tooltip" data-placement="top" title="Distribute Scheduled"><img v-if="product.options.restrictUpdate" src="/img/icons/no-update.png" class="status-icon" v-tooltip data-toggle="tooltip" data-placement="top" title="Restricted Update">{{product.name}}</td> -->
									<td class="user-name"><h5>{{student.firstName+' '+student.lastName}}</h5></td>
									<td class="user-pic"><img :src="gravatar(student)"></td>
									<td class="user-nick"><strong>{{student.username}}</strong></td>
									<td class="user-email">{{student.email}}</td>
									<a class="iconbtn user-del-btn" @click="del(student)" v-tooltip data-toggle="tooltip" data-placement="top" title="Delete"><img src="/img/icons/erase-16.png"></a>
									<!-- <td class="text-center xs-hide">{{value (product.statistics.instant.cpu)}}</td>
									<td class="text-center xs-hide">{{freeMemory (product)}}</td>
									<td class="text-center xs-hide" :class="product.status">{{product.status}}</td>
									<td class="text-center xs-hide">{{latestStatus (product)}}</td>
									<td class="text-center error"><button @click="showErrors (product)"> {{errors(product.log, 'l')}} / <span>{{errors (product.log, 'e')}}</span></button></td> -->
									<!-- <td class="text-center">{{versionDeployer(product)}}</td> -->
									<!-- <td class="text-center">1.5</td> -->
									<!--<td class="text-center" style="width:190px">
										<a class="iconbtn" @click="productSettings (product)" v-tooltip data-toggle="tooltip" data-placement="top" title="View details"><img src="/img/icons/view-16.png"></a> -->
										<!-- <a class="iconbtn" @click="productProvisioningFile (product)" v-tooltip data-toggle="tooltip" data-placement="top" title="Provisioning File"><img src="/img/icons/soft-settings-16.png"></a>
										<a class="iconbtn" v-if="!product.options.restrictAccess" @click="restart(product)" v-tooltip data-toggle="tooltip" data-placement="top" title="Schedule restart"><img src="/img/icons/restart-sched-16.png"></a>
										<a class="iconbtn" v-if="!product.options.restrictAccess" @click="distribute(product)" v-tooltip data-toggle="tooltip" data-placement="top" title="Schedule a distribute"><img src="/img/icons/distribute.png"></a>
										<a class="iconbtn" v-if="product.shell && !product.options.restrictAccess" @click="shell(product)" v-tooltip data-toggle="tooltip" data-placement="top" title="Shell"><img src="/img/icons/terminal.png"></a>
										<a class="iconbtn" @click="del(student)" v-tooltip data-toggle="tooltip" data-placement="top" title="Delete Product"><img src="/img/icons/erase-16.png"></a>
									</td>-->
								</tr>
							</tbody>
						</table>
					</div>
					<div class="tab-pane fade" id="teachers" role="tabpanel" aria-labelledby="teachers-tab">
						<h4>Teachers</h4>
						<table class="table users-table table-hover">
							<!--<thead>
								<tr>
									<th scope="col">Name
										<a href="#" class="sort-by"></a></th>
									<th scope="col" class="text-center">Username
										<a href="#" class="sort-by"></a></th>
									<th scope="col" class="text-center">Email
										<a href="#" class="sort-by"></a></th>
									<th scope="col" class="text-center">Platform
										<a href="#" class="sort-by"></a></th>
									<th scope="col" class="text-center xs-hide">Load
										<a href="#" class="sort-by"></a></th>
									<th scope="col" class="text-center xs-hide">Memory Usage
										<a href="#" class="sort-by"></a></th>
									<th scope="col" class="text-center xs-hide">Status
										<a href="#" class="sort-by"></a></th>
									<th scope="col" class="text-center xs-hide">Last status
										<a href="#" class="sort-by"></a></th>
									<th scope="col" class="text-center">Messages
										<a href="#" class="sort-by"></a></th>
									<th scope="col" class="text-center">Deployer
										<a href="#" class="sort-by"></a></th>
									<th scope="col" class="text-center">Starter
										<a href="#" class="sort-by"></a></th>
									<th scope="col" class="text-center" style="width:190px">Actions</th>
								</tr>
							</thead> -->
							<tbody>
								<tr class="add-user handpointer">
									<!-- <td style="width:300px" @click="productSettings(product)" class="handpointer"><img v-if="product.options.restrictAccess" src="/img/icons/locked.png" class="status-icon" v-tooltip data-toggle="tooltip" data-placement="top" title="Restricted Access"><img v-if="product.actions.restart" src="/img/icons/sched-update.png" class="status-icon" v-tooltip data-toggle="tooltip" data-placement="top" title="Restart Scheduled"><img v-if="product.actions.distribute" src="/img/icons/sched-distribute.png" class="status-icon" v-tooltip data-toggle="tooltip" data-placement="top" title="Distribute Scheduled"><img v-if="product.options.restrictUpdate" src="/img/icons/no-update.png" class="status-icon" v-tooltip data-toggle="tooltip" data-placement="top" title="Restricted Update">{{product.name}}</td> -->
									<td class="user-name"><h5>Add new</h5></td>
									<td class="add-pic"><img src="img/icons/white-plus-50.png"></td>
								</tr>
								<tr v-for="teacher in teachers" :key="teacher.userId">
									<!-- <td style="width:300px" @click="productSettings(product)" class="handpointer"><img v-if="product.options.restrictAccess" src="/img/icons/locked.png" class="status-icon" v-tooltip data-toggle="tooltip" data-placement="top" title="Restricted Access"><img v-if="product.actions.restart" src="/img/icons/sched-update.png" class="status-icon" v-tooltip data-toggle="tooltip" data-placement="top" title="Restart Scheduled"><img v-if="product.actions.distribute" src="/img/icons/sched-distribute.png" class="status-icon" v-tooltip data-toggle="tooltip" data-placement="top" title="Distribute Scheduled"><img v-if="product.options.restrictUpdate" src="/img/icons/no-update.png" class="status-icon" v-tooltip data-toggle="tooltip" data-placement="top" title="Restricted Update">{{product.name}}</td> -->
									<td class="user-name"><h5>{{teacher.firstName+' '+teacher.lastName}}</h5></td>
									<td class="user-pic"><img :src="gravatar(teacher)"></td>
									<td class="user-nick"><strong>{{teacher.username}}</strong></td>
									<td class="user-email">{{teacher.email}}</td>
									<a class="iconbtn user-del-btn" @click="del(teacher)" v-tooltip data-toggle="tooltip" data-placement="top" title="Delete"><img src="/img/icons/erase-16.png"></a>
									<!-- <td class="text-center xs-hide">{{value (product.statistics.instant.cpu)}}</td>
									<td class="text-center xs-hide">{{freeMemory (product)}}</td>
									<td class="text-center xs-hide" :class="product.status">{{product.status}}</td>
									<td class="text-center xs-hide">{{latestStatus (product)}}</td>
									<td class="text-center error"><button @click="showErrors (product)"> {{errors(product.log, 'l')}} / <span>{{errors (product.log, 'e')}}</span></button></td> -->
									<!-- <td class="text-center">{{versionDeployer(product)}}</td> -->
									<!-- <td class="text-center">1.5</td> -->
									<!--<td class="text-center" style="width:190px">
										<a class="iconbtn" @click="productSettings (product)" v-tooltip data-toggle="tooltip" data-placement="top" title="View details"><img src="/img/icons/view-16.png"></a>
										<a class="iconbtn" @click="productProvisioningFile (product)" v-tooltip data-toggle="tooltip" data-placement="top" title="Provisioning File"><img src="/img/icons/soft-settings-16.png"></a>
										<a class="iconbtn" v-if="!product.options.restrictAccess" @click="restart(product)" v-tooltip data-toggle="tooltip" data-placement="top" title="Schedule restart"><img src="/img/icons/restart-sched-16.png"></a>
										<a class="iconbtn" v-if="!product.options.restrictAccess" @click="distribute(product)" v-tooltip data-toggle="tooltip" data-placement="top" title="Schedule a distribute"><img src="/img/icons/distribute.png"></a>
										<a class="iconbtn" v-if="product.shell && !product.options.restrictAccess" @click="shell(product)" v-tooltip data-toggle="tooltip" data-placement="top" title="Shell"><img src="/img/icons/terminal.png"></a>
										<a class="iconbtn" @click="del(teacher)" v-tooltip data-toggle="tooltip" data-placement="top" title="Delete Product"><img src="/img/icons/erase-16.png"></a>
									</td>-->
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>

		</div> 
	</div>
</template>

<script>
var HalfCircleSpinner = require ('epic-spinners/dist/lib/epic-spinners.min.js').HalfCircleSpinner;
var mapGetters = require ('vuex').mapGetters;
var _ = require ('lodash');
var md5 = require ('md5');
module.exports = {
	name: 'Course',
	components: {
		HalfCircleSpinner
	},
	created () {
		this.$store.dispatch ('course/getCourse', this.$route.params.courseId);
		this.$store.dispatch ('user/getAllUsers');
	},
	computed: 
	{
		...mapGetters ({
			course: 'course/course',
			users: 'user/users',
		}),
		students ()
		{
			console.log ('students');
			if (this.users)
			{
				let that = this;
				return _.filter (this.users, function (user)
				{
					return _.indexOf (that.course.students, user.userId)>=0;
				});
			}
			else
			{
				return [];
			}
		},
		teachers ()
		{
			if (this.users)
			{
				let that = this;
				return _.filter (this.users, function (user)
				{
					return _.indexOf (that.course.teachers, user.userId)>=0;
				});
			}
			else
			{
				return [];
			}
		}
	},
	methods: {
		deleteCourse ()
		{

		},
		gravatar (user)
		{
			console.log (user);
			return 'https://www.gravatar.com/avatar/'+md5 (user.email)+'?d=mp';
		}
	}
};
</script>

