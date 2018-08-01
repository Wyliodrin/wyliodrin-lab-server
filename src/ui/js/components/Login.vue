<template>
	<div>
		<div>
			Name: <input v-model="name" type="text">
		</div>
		<div>
			<div class="greeting">Hello {{name}}{{exclamationMarks}}</div>
			<button @click="decrement">-</button>
			<button @click="increment">+</button>
		</div>
	</div>
</template>

<script>

module.exports = {
	name: 'Hello component',
	data() {
		return {
			name: 'World',
			enthusiasm: 5
		};
	},
	methods: {
		increment() { 
			this.enthusiasm++; 
		},
		decrement() {
			if (this.enthusiasm > 1) {
				this.enthusiasm--;
			}
		},
	},
	computed: {
		exclamationMarks() {
			return Array(this.enthusiasm + 1).join('!');
		}
	}
};

</script>