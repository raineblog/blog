window.addEventListener('load', function () {
	var p = localStorage.getItem("data-md-color-primary");
	if (p) {
		document.body.setAttribute('data-md-color-primary', p);
	}
	var a = localStorage.getItem('data-md-color-accent');
	if (a) {
		document.body.setAttribute('data-md-color-accent', a);
	}
	var s = localStorage.getItem('data-md-color-scheme');
	if (s) {
		document.body.setAttribute('data-md-color-scheme', s);
	}

}, false);

/*
window.addEventListener('load', function () {
  var p = localStorage.getItem("data-md-color-primary");
  if (p) {
	document.body.setAttribute('data-md-color-primary', p);
  }
  var a = localStorage.getItem('data-md-color-accent');
  if (a) {
	document.body.setAttribute('data-md-color-accent', a);
  }
}, false);
*/

function foo(response) {
	var data = response.data;
	var num = response.data.length;
	if (data && data[0]) {
		var t = new Date(data[0].commit.author.date);
		var ti = t.toLocaleDateString('zh-CN', { timeZone: "Asia/Shanghai", hour12: false }) + " " + t.toLocaleTimeString('zh-CN', { timeZone: "Asia/Shanghai", hour12: false });

		var author_list = document.getElementsByClassName('page_contributors')[0].innerHTML.split(', ');
		author_list = author_list.filter((e) => { return e != 'AFOI-wiki' })
		for (var i = 0; i < num; ++i) {
			author_list.push(data[i].author.login);
		}

		var cnts = author_list.reduce(function (obj, val) {
			obj[val] = (obj[val] || 0) + 1;
			return obj;
		}, {});
		//Use the keys of the object to get all the values of the array
		//and sort those keys by their counts
		var sorted = Object.keys(cnts).sort(function (a, b) {
			return cnts[b] - cnts[a];
		});
		var index = sorted.indexOf('24OI-bot');
		if (index > -1) {
			sorted.splice(index, 1);
		}
		sorted = sorted.map(function (x) {
			return `<a href=https://github.com/${x}>${x}</a>`
		})
		document.getElementsByClassName('facts_modified')[0].innerHTML = (ti);
		document.getElementsByClassName('page_contributors')[0].innerHTML = (sorted.join(', '));
	} else if (!url.endsWith('index')) {
		console.log("ERROR");
		/*url += '/index';
		var script = document.createElement('script');
		document.getElementsByClassName('edit_history')[0].setAttribute('href', `https://github.com/RainPPR/blog/commits/main/docs/${url}`);
		script.src = `https://api.github.com/repos/RainPPR/blog/commits?path=docs/${url}&callback=foo`;
		document.getElementsByTagName('head')[0].appendChild(script);*/
	} else {
		console.log("ERROR ???");
	}
}




