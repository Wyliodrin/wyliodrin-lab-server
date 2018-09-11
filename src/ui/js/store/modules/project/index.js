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
						console.log ('Products list fail');
						// TODO toast
					}
				}
				else
				{
					console.log ('Products list fail');
					// TODO toast
				}
			}
			catch (e)
			{
				console.log ('Product list fail '+e.message);
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
						console.log ('Languages list fail');
						// TODO toast
					}
				}
				else
				{
					console.log ('Languages list fail');
					// TODO toast
				}
			}
			catch (e)
			{
				console.log ('languages list fail '+e.message);
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
						console.log ('Product get fail');
						// TODO toast
					}
				}
				else
				{
					console.log ('Product get fail');
					// TODO toast
				}
			}
			catch (e)
			{
				console.log ('Product get fail '+e);
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
				else return false;
			}
			catch (e)
			{
				console.log ('Reset workspace fail '+e);
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
				else return false;
			}
			catch (e)
			{
				console.log ('New project fail '+e);
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
				else return false;
			}
			catch (e)
			{
				console.log ('Del '+projectId+' fail '+e);
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
					// TODO toast
					return false;
				}
			}
			catch (e)
			{
				console.log ('Edit project '+project.projectId+' fail '+e);
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