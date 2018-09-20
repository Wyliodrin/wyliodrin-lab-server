var Vue = require ('vue');
var setup = require ('../../setup.js');
var _ = require ('lodash');

module.exports ={
	namespaced: true,
	state: {
		projects: null,
		project: null,
		languages: [],
		projectFolder: []
	},
	getters: {
		projects (state)
		{
			return state.projects;
		},
		project (state)
		{
			return state.project;
		},
		languages (state)
		{
			return state.languages;
		},
		projectFolder (state)
		{
			return state.projectFolder;
		}
	},
	actions: {
		async list (store)
		{
			try
			{
				store.commit ('projects', null);
				let response = await Vue.http.get (setup.API+'/projects/list');
				if (response.data.err === 0)
				{
					if (_.isArray (response.data.projects))
					{
						store.commit ('projects', response.data.projects);
					}
					else
					{
						Vue.toast.warning({title:'Warning!', message:'Couldn\'t list the projects.<br>Server error: ' + response.data.err});
					}
				}
				else
				{
					Vue.toast.warning({title:'Warning!', message:'Couldn\'t list the projects.<br>Server error: ' + response.data.err});
				}
			}
			catch (e)
			{
				if (e.status === 0)
					Vue.toast.connectionError();
				else if (e.status >= 500)
					Vue.toast.warning({title:'Warning!', message:'Couldn\'t list the projects.<br>Server error: ' + e.body.err});
				return false;
			}
		},
		async languages (store)
		{
			try
			{
				let response = await Vue.http.get (setup.API+'/projects/languages/');
				if (response.data.err === 0)
				{
					if (_.isArray (response.data.languages))
					{
						store.commit ('languages', response.data.languages);
					}
					else
					{
						Vue.toast.warning({title:'Warning!', message:'Couldn\'t list the languages.<br>Server error: ' + response.data.err});
					}
				}
				else
				{
					Vue.toast.warning({title:'Warning!', message:'Couldn\'t list the languages.<br>Server error: ' + response.data.err});
				}
			}
			catch (e)
			{
				if (e.status === 0)
					Vue.toast.connectionError();
				else if (e.status >= 500)
					Vue.toast.warning({title:'Warning!', message:'Couldn\'t list the languages.<br>Server error: ' + e.body.err});
				return false;
			}
		},
		async project (store, projectId)
		{
			try
			{
				console.log (projectId);
				// store.commit ('project', null);
				let response = await Vue.http.get (setup.API+'/projects/'+projectId);
				console.log (response);
				if (response.data.err === 0)
				{
					if (_.isObject (response.data.project))
					{
						store.commit ('project', response.data.project);
					}
					else
					{
						Vue.toast.warning({title:'Warning!', message:'Couldn\'t get the projects.<br>Server error: ' + response.data.err});
					}
				}
				else
				{
					Vue.toast.warning({title:'Warning!', message:'Couldn\'t get the projects.<br>Server error: ' + response.data.err});
				}
			}
			catch (e)
			{
				if (e.status === 0)
					Vue.toast.connectionError();
				else if (e.status >= 500)
					Vue.toast.warning({title:'Warning!', message:'Couldn\'t get the projects.<br>Server error: ' + e.body.err});
				return false;
			}
		},
		async add (store, project)
		{
			try
			{
				let response = await Vue.http.post (setup.API+'/projects/add', project);
				if (response.data.err === 0) 
				{
					store.dispatch ('list').then ();
					return true;
				}
				else {
					Vue.toast.warning({title:'Warning!', message:'Couldn\'t add the project.<br>Server error: ' + response.data.err});
					return false;
				}
			}
			catch (e)
			{
				if (e.status === 0)
					Vue.toast.connectionError();
				else if (e.status >= 500)
					Vue.toast.warning({title:'Warning!', message:'Couldn\'t add the project.<br>Server error: ' + e.body.err});
				return false;
			}
		},
		async del (store, projectId)
		{
			try
			{
				let response = await Vue.http.get (setup.API+'/project/delete/'+projectId);
				if (response.data.err === 0) 
				{
					store.dispatch ('list').then ();
					return true;
				}
				else {
					Vue.toast.warning({title:'Warning!', message:'Couldn\'t delete the project ' + projectId + '.<br>Server error: ' + response.data.err});
					return false;
				}
			}
			catch (e)
			{
				if (e.status === 0)
					Vue.toast.connectionError();
				else if (e.status >= 500)
					Vue.toast.warning({title:'Warning!', message:'Couldn\'t delete the project ' + projectId + '.<br>Server error: ' + e.body.err});
				return false;
			}
		},
		async save (store, project)
		{
			try
			{
				let response = await Vue.http.post (setup.API+'/project/edit/'+project.projectId, project);
				if (response.data.err === 0) 
				{
					store.dispatch ('project', project.projectId);
					store.dispatch ('list');
					return true;
				}
				else
				{
					Vue.toast.warning({title:'Warning!', message:'Couldn\'t save the project.<br>Server error: ' + response.data.err});
					return false;
				}
			}
			catch (e)
			{
				if (e.status === 0)
					Vue.toast.connectionError();
				else if (e.status >= 500)
					Vue.toast.warning({title:'Warning!', message:'Couldn\'t edit the project ' + project + '.<br>Server error: ' + e.body.err});
				return false;
			}
		},
		async listProjectFolder (store, project)
		{
			try
			{
				let response = await Vue.http.post (setup.API+'/projects/list/', {
					project
				});
				if (response.data.err === 0) 
				{
					store.commit ('projectFolder', response.data.project);
					return true;
				}
				else
				{
					Vue.toast.warning({title:'Warning!', message:'Couldn\'t load the project folder.<br>Server error: ' + response.data.err});
					return false;
				}
			}
			catch (e)
			{
				if (e.status === 0)
					Vue.toast.connectionError();
				else if (e.status >= 500)
					Vue.toast.warning({title:'Warning!', message:'Couldn\'t load the project folder ' + project + '.<br>Server error: ' + e.body.err});
				return false;
			}
		},
		async newFolder (store, data)
		{
			try
			{
				let response = await Vue.http.post (setup.API+'/projects/folders/add', {
					project: data.project,
					folder: data.folder
				});
				if (response.data.err === 0) 
				{
					store.dispatch ('listProjectFolder');
					return true;
				}
				else
				{
					Vue.toast.warning({title:'Warning!', message:'Couldn\'t add the folder.<br>Server error: ' + response.data.err});
					return false;
				}
			}
			catch (e)
			{
				if (e.status === 0)
					Vue.toast.connectionError();
				else if (e.status >= 500)
					Vue.toast.warning({title:'Warning!', message:'Couldn\'t add the folder to ' + data.project + '.<br>Server error: ' + e.body.err});
				return false;
			}
		},
		async delFileOrFolder (store, data)
		{
			try
			{
				let response = await Vue.http.post (setup.API+'/projects/folders/del', {
					project: data.project,
					fileOrFolder: data.folder
				});
				if (response.data.err === 0) 
				{
					store.dispatch ('listProjectFolder');
					return true;
				}
				else
				{
					Vue.toast.warning({title:'Warning!', message:'Couldn\'t delete '+data.fileOrFolder+'.<br>Server error: ' + response.data.err});
					return false;
				}
			}
			catch (e)
			{
				if (e.status === 0)
					Vue.toast.connectionError();
				else if (e.status >= 500)
					Vue.toast.warning({title:'Warning!', message:'Couldn\'t delete file or folder from ' + data.project + '.<br>Server error: ' + e.body.err});
				return false;
			}
		},
		async getFile (store, data)
		{
			try
			{
				let response = await Vue.http.post (setup.API+'/projects/files/load', {
					project: data.project,
					file: data.file
				});
				if (response.data.err === 0) 
				{
					return response.data.data;
				}
				else
				{
					Vue.toast.warning({title:'Warning!', message:'Couldn\'t load '+data.file+'+.<br>Server error: ' + response.data.err});
					return false;
				}
			}
			catch (e)
			{
				if (e.status === 0)
					Vue.toast.connectionError();
				else if (e.status >= 500)
					Vue.toast.warning({title:'Warning!', message:'Couldn\'t load ' + data.file + '.<br>Server error: ' + e.body.err});
				return false;
			}
		},
		async setFile (store, data)
		{
			try
			{
				let response = await Vue.http.post (setup.API+'/projects/files/save', {
					project: data.project,
					file: data.file,
					data: data.data
				});
				if (response.data.err === 0) 
				{
					return true;
				}
				else
				{
					Vue.toast.warning({title:'Warning!', message:'Couldn\'t save '+data.file+'+.<br>Server error: ' + response.data.err});
					return false;
				}
			}
			catch (e)
			{
				if (e.status === 0)
					Vue.toast.connectionError();
				else if (e.status >= 500)
					Vue.toast.warning({title:'Warning!', message:'Couldn\'t save ' + data.file + '.<br>Server error: ' + e.body.err});
				return false;
			}
		}
	},
	mutations: 
	{
		projects (state, value)
		{
			state.projects = value;
		},
		project (state, value)
		{
			state.project = value;
		},
		languages (state, value)
		{
			state.languages = value;
		},
		projectFolder (state, value)
		{
			let addEmpty = function (value)
			{
				console.log ('addEmpty');
				console.log (value);
				if (value.files)
				{
					for (let file of value.files)
					{
						addEmpty (file);
					}
					if (value.files.length === 0) value.files.push ({name: '(empty)', type: 'empty'});
				}
				return value;
			};
			// console.log (addEmpty({
			// 	name: 'Project',
			// 	type:'dir',
			// 	files: value
			// }));
			state.projectFolder = [addEmpty (
				{
					state: {
						expanded: true,
					},
					name: 'Project',
					type:'dir',
					files: value
				}
			)
			];
		}
	}
};