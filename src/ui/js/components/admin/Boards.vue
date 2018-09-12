<template>
	<div class="content greybg w-100 d-flex flex-column h-top">
			
		<div class="content w-100 d-flex flex-row proj-bar">
			<div class="content-top w-100 pt-2">
				<div class="content-title float-left">
					<span><img src="img/users.png" class="mr-2">Boards</span>
					<div class="search"><img src="/img/icons/search-icon.png">
						<input type="text" v-model="search" placeholder="Search" class="search-input">
					</div>
				</div>
				<div class="btn-group submenu">
					<button type="button" class="btn btn-secondary dropdown-toggle xs-submenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
						<img src="img/icons/submenu-icon.png">
					</button>
					<!-- <div class="dropdown-menu dropdown-menu-right">
						<button @click="addUser" class="projbar-btn"><img src="img/icons/add-icon-16.png"> New User</button>
					</div> -->
				</div>
			</div>
		</div>
		<div class="content pt-4 pr-4 pl-4 d-flex flex-column w-100 h-100 rel">
			<div class="d-flex h-100 justify-content-center align-items-center" v-if="boards === null">
				<div>
					<half-circle-spinner :animation-duration="1000" :size="120"/>
				</div>
			</div>
			<table v-else class="table table-hover">
				<thead>
					<tr>
						<th scope="col">Board ID
							<a href="#" class="sort-by"></a></th>
						<!-- <th scope="col">User
							<a href="#" class="sort-by"></a></th> -->
						<th scope="col" class="text-center">Username
							<a href="#" class="sort-by"></a></th>
						<th scope="col" class="text-center">Course
							<a href="#" class="sort-by"></a></th>
						<th scope="col" class="text-center">IP
							<a href="#" class="sort-by"></a></th>
						<th scope="col" class="text-center">Status
							<a href="#" class="sort-by"></a></th>
						<th scope="col" class="text-center">Last Seen
							<a href="#" class="sort-by"></a></th>
						<th scope="col" class="text-center">Actions
							<a href="#" class="sort-by"></a></th>
						<!-- <th scope="col" class="text-center">Iterations
							<a href="#" class="sort-by"></a></th> -->
						<!-- <th scope="col" class="text-center" style="width:130px">Actions</th> -->
					</tr>
				</thead>
				<tbody>
					<tr v-for="board in boards" :key="board.boardId">
						<td>{{board.boardId}}</td>
						<td class="text-center">{{board.userId}}</td>
						<td class="text-center">{{board.courseId}}</td>
						<td class="text-center">{{board.status}}</td>
						<td class="text-center">{{board.IP}}</td>
						<!-- <td class="text-center">17</td> -->
						<!-- <td class="text-center" style="width:130px"></td> -->
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script>
module.exports = {
	name: 'Boards'
};
</script>

