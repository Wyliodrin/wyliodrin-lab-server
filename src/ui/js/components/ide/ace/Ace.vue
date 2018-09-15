<template>
	<div>
		<editor v-model="source" @init="initEditor"></editor>
	</div>
</template>

<script>
var editor = require ('vue2-ace-editor');
module.exports = {
	name: 'Ace',
	data () {
		return {
			source: ''
		};
	},
	components: {
		editor
	},
	methods: {
		initEditor (editor)
		{
			editor;
			require('brace/ext/language_tools'); //language extension prerequsite...
			require('brace/mode/html');                
			require('brace/mode/python');    //language
			require('brace/mode/less');
			require('brace/theme/chrome');
			require('brace/snippets/python'); //snippet
		}
	}
};
</script>
