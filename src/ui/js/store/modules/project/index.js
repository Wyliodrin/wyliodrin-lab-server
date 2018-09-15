var Vue = require ('vue');
var setup = require ('../../setup.js');
var _ = require ('lodash');

module.exports ={
	namespaced: true,
	state: {
		projects: null,
		project: null,
		languages: [],
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
						Vue.toast.warning({title:'Warning!', message:'Couldn\'t list the products.<br>Server error: ' + response.data.err});
					}
				}
				else
				{
					Vue.toast.warning({title:'Warning!', message:'Couldn\'t list the products.<br>Server error: ' + response.data.err});
				}
			}
			catch (e)
			{
				if (e.status === 0)
					Vue.toast.connectionError();
				else if (e.status >= 500)
					Vue.toast.warning({title:'Warning!', message:'Couldn\'t list the products.<br>Server error: ' + e.status});
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
					Vue.toast.warning({title:'Warning!', message:'Couldn\'t list the languages.<br>Server error: ' + e.status});
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
						Vue.toast.warning({title:'Warning!', message:'Couldn\'t get the products.<br>Server error: ' + response.data.err});
					}
				}
				else
				{
					Vue.toast.warning({title:'Warning!', message:'Couldn\'t get the products.<br>Server error: ' + response.data.err});
				}
			}
			catch (e)
			{
				if (e.status === 0)
					Vue.toast.connectionError();
				else if (e.status >= 500)
					Vue.toast.warning({title:'Warning!', message:'Couldn\'t get the products.<br>Server error: ' + e.status});
				return false;
			}
		},
		async resetWorkspace (store, projectId)
		{
			try
			{
				let response = await Vue.http.get (setup.API+'/project/resetWorkspace/'+projectId);
				if (response.data.err === 0) 
				{
					return true;
				}
				else {
					Vue.toast.warning({title:'Warning!', message:'Couldn\'t reset the workspace.<br>Server error: ' + response.data.err});
					return false;
				}
			}
			catch (e)
			{
				if (e.status === 0)
					Vue.toast.connectionError();
				else if (e.status >= 500)
					Vue.toast.warning({title:'Warning!', message:'Couldn\'t reset the workspace.<br>Server error: ' + e.status});
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
					Vue.toast.warning({title:'Warning!', message:'Couldn\'t add the project.<br>Server error: ' + e.status});
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
					Vue.toast.warning({title:'Warning!', message:'Couldn\'t delete the project ' + projectId + '.<br>Server error: ' + e.status});
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
					Vue.toast.warning({title:'Warning!', message:'Couldn\'t edit the project ' + project.projectId + '.<br>Server error: ' + e.status});
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
		}
	}
};