<template>
	<div style="height: 100%; width: 100%">
		<div style="height: 100%; width: 100%; float: left;">
			<editor v-model="source" @init="initEditor" lang="python" theme="monokai" :options="editorOptions"></editor>
		</div>
	</div>
</template>

<script>
var editor = require ('vue2-ace-editor');
module.exports = {
	name: 'Ace',
	data () {
		var urlParams = new URLSearchParams(window.location.search);
		console.log (this.$store);
		return {
			treeData0: this.getTreeData0 (),
			projectId: urlParams.get ('projectId'),
			project: new Buffer (urlParams.get ('projectId'), 'base64').toString(),
			source: '',
			editorOptions: {
				fontSize: '14pt',
			}
		};
	},
	components: {
		editor
	},
	created ()
	{
		
	},
	methods: {
		initEditor (editor)
		{
			editor;
			require('brace/ext/language_tools'); //language extension prerequsite...
			// require('brace/mode/html');                
			require('brace/mode/python');    //language
			require('brace/mode/less');
			require('brace/theme/monokai');
			require('brace/snippets/python'); //snippet
		},
		getTreeData0() {
			return [
				{ text: 'Disc C:', state: { expanded: true }, children: [
					{ text: 'PerfLogs' },
					{ text: 'Users', children: [
						{ text: 'User 1' },
						{ text: 'User 2' },
						{ text: 'User 3' }
					]},
					{ text: 'tomcat' },
					{ text: 'sysCache' },
					{ text: 'Program Files', children: [
						{ text: 'Intel' },
						{ text: 'Internet Explorer' },
						{ text: 'Opera' },
						{ text: 'Oracle' }
					]}
				]}
			];
		}
	}
};
</script>
