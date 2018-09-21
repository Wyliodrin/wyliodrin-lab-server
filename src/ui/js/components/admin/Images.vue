<template>
	<div class="content w-100 h-100 d-flex flex-column">
			
		<div class="content w-100 d-flex flex-row proj-bar">
			<div class="content-top w-100 pt-2">
				<div class="content-title float-left">
					<span><img src="/img/raspberrypi.png" class="mr-2">Images</span>
				</div>
				<div class="btn-group submenu">
					<button type="button" class="btn btn-secondary dropdown-toggle xs-submenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
						<img src="img/icons/submenu-icon.png">
					</button>
					<div class="dropdown-menu dropdown-menu-right">
						<button @click="addImage" class="projbar-btn"><img src="img/icons/add-icon-16.png"> New Image</button>
					</div>
				</div>
			</div>
		</div>
		<div class="content pt-4 pr-4 pl-4 d-flex flex-column w-100 h-100 rel">
			<div class="d-flex h-100 justify-content-center align-items-center" v-if="images === null">
				<div>
					<half-circle-spinner :animation-duration="1000" :size="120"/>
				</div>
			</div>
			<table v-else class="table table-hover">
				<thead>
					<tr>
						<th scope="col">Filename
							<a href="#" class="sort-by"></a></th>
						<th scope="col" class="text-center">ID
							<a href="#" class="sort-by"></a></th>
						<th scope="col" class="text-center">Status
							<a href="#" class="sort-by"></a></th>
						<!-- <th scope="col" class="text-center">Teachers
							<a href="#" class="sort-by"></a></th> -->
						<!-- <th scope="col" class="text-center">Iterations
							<a href="#" class="sort-by"></a></th> -->
						<th scope="col" class="text-center" style="width:130px">Actions</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="image in images" :key="image.id" @click="properties(image)" class="handpointer">
						<td>{{image.filename}}</td>
						<td class="text-center">{{image.id}}</td>
						<td class="text-center">{{status (image)}}</td>
						<!-- <td class="text-center">{{latestVersion(application)}}</td> -->
						<!-- <td class="text-center">17</td> -->
						<td class="text-center" style="width:130px">
							<a class="iconbtn" v-show="image.status==='ok'" @click="update(image)" v-tooltip data-toggle="tooltip" data-placement="top" title="Update Software"><img src="/img/icons/restart-16.png"></a>
							<a class="iconbtn" v-show="image.status==='downloaded'" @click="setup(image)" v-tooltip data-toggle="tooltip" data-placement="top" title="Setup"><img src="/img/icons/restart-16.png"></a>
							<a class="iconbtn" @click="del(image)" v-tooltip data-toggle="tooltip" data-placement="top" title="Delete"><img src="/img/icons/erase-16.png"></a>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script>

var Vue = require ('vue');
var HalfCircleSpinner = require ('epic-spinners/dist/lib/epic-spinners.min.js').HalfCircleSpinner;

var mapGetters = require('vuex').mapGetters;
var timeout = null;
module.exports = {
	name: 'Images',
	methods: {
		properties ()
		{

		},
		addImage ()
		{
			let that = this;
			Vue.bootbox.prompt ('Download Image URL', function (result)
			{
				if (result)
				{
					that.$store.dispatch ('image/download', result);
				}
			});
		},
		async setup (image)
		{
			await this.$store.dispatch ('image/setup', image.id);
		},
		status (image)
		{
			if (image.status === 'downloading' && image.progress)
			{
				return image.status + ' ('+Math.floor(image.progress.percent*100)+'%)';
			}
			else
			{
				return image.status;
			}
		},
		async updateImages ()
		{
			await this.$store.dispatch ('image/listImages');
			timeout = setTimeout (this.updateImages, 5000);
		},
		update (image)
		{
			var that = this;
			Vue.bootbox.confirm ('Are you sure you want to update the image?', function (result)
			{
				if (result)
				{
					that.$store.dispatch ('image/updateImage', image.id);
				}
			});
		},
		del (image)
		{
			var that = this;
			Vue.bootbox.confirm ('Are you sure you want to delete the image?', function (result)
			{
				if (result)
				{
					that.$store.dispatch ('image/deleteImage', image.id);
				}
			});
		}
	},
	components: {
		HalfCircleSpinner
	},
	created () {
		this.updateImages ();
	},
	destroyed ()
	{
		clearTimeout (timeout);
	},
	computed: {
		...mapGetters ({
			images: 'image/images'
		})
	}
};
</script>
