# 单源最短路

Single Source Shortest Path Problem (SSSP)。

## Dijkstra

该算法，Dijkstra（/ˈdikstrɑ/ 或 /ˈdɛikstrɑ/）是一种求解非负权图上单源最短路径的算法。

朴素算法复杂度为 $\mathcal O(n^2)$，堆优化为 $\mathcal O(m\log m)$，使用 Fibonacci 堆（支持 $\mathcal O(1)$ 插入）可以做到 $\mathcal O(n\log n+m)$。

### 朴素算法

设两个集合：「已确定最短路长度的集合 $S$」和「未确定最短路长度的集合 $T$」。

每次从 $T$ 中选取一个最近的，加入集合 $S$ 并松弛，更新其他点的最短路。直到 $T$ 集合为空。

代码：

??? note "点击查看代码"
	```cpp
	int dis[N], vis[N];

	int get_u() {
		int t = -1;
		for (int i = 1; i <= n; ++i) {
			if (vis[i])
				continue;
			if (t == -1 || dis[i] < dis[t])
				t = i;
		}
		return t;
	}

	void dijkstra(int s) {
		memset(dis, 0x3f, sizeof dis);
		dis[s] = 0;
		for (int step = 0; step < n; ++step) {
			int u = get_u();
			vis[u] = true;
			for (auto t : g[u]) {
				int v = t.v, w = t.w;
				dis[v] = min(dis[v], dis[u] + w);
			}
		}
	}
	```

### 堆优化

每成功松弛一条边 $(u,v)$ ，就将 $v$ 插入堆中，

如果 $v$ 已经在堆中，直接修改相应元素的权值即可，每次查找操作直接取堆顶结点即可。

代码：

??? note "点击查看代码"
	```cpp
	int dis[N], vis[N];

	void dijkstra(int s) {
		memset(dis, 0x3f, sizeof(int) * (n + 1));
		pqueue<pair<int, int>, greater<pair<int, int>>> heap;
		dis[s] = 0;
		heap.push({0, s});
		while (!heap.empty()) {
			int u = heap.top().second;
			heap.pop();
			if (vis[u])
				continue;
			vis[u] = 1;
			for (auto t : g[u]) {
				int v = t.v, w = t.w;
				if (dis[v] > dis[u] + w) {
					dis[v] = dis[u] + w;
					heap.push({dis[v], v});
				}
			}
		}
	}
	```

### 复杂度分析

首先，朴素算法显然就是 $\mathcal O(n^2+m)$ 的。

考虑分析堆优化版本的复杂度，有结论：优先队列中存在的元素个数在 $\mathcal O(m)$，单次是单 $\log$ 的，因此总时间复杂度为 $\mathcal O(m\log m)$。

| 实现 | 复杂度 | 适用情景 |
| :-: | :-: | :-: |
| 朴素算法 | $\mathcal O(n^2+m)$ | 数据量小 |
| 优先队列优化 | $\mathcal O(m\log m)$ | 稀疏图，边数为 $\mathcal O(n)$ 等级的 |
| Fibonacci 堆优化 | $\mathcal O(n\log n+m)$ | 稠密图，边数为 $\mathcal O(n^2)$ 等级的 |

一般来说，最后一个严格更优，但是数据量小的时候跑得不一定快。

说句闲话，Dijkstra 也可以魔改后用于负权图，详见 Johnson 算法。

## Bellman–Ford

### 思想

我们称松弛为操作：

$$
\text{dis}(v)=\min\{\text{dis}(v),\text{dis}(u)+w(u,v)\}
$$

我们称对一个图中的所有边（共 $m$ 条）进行一遍松弛，为一轮松弛。

有性质：进行 $n$ 轮松弛以后，一定能找到最短路（如果存在的话）。

证明：一次松弛会使找到的最短路径 $+1$，那么 $n$ 轮就可以找完了。

有常数优化：找不到松弛了，表示一定找完了最短路，那么可以停止。

有性质：若 $n$ 轮之后依然可以松弛，那么**图中 $s$ 所在的连通块**一定存在负环。

可以用来判断负环（建超级源点向所有点连边，边权为 $0$，可以判断全局）。

### 实现

??? note "点击查看代码"
	```cpp
	struct edge {
		int u, v, w;
	};

	vector<edge> g;

	int dis[N];

	bool bf(int s, int k = n) {
		memset(dis, 0x3f, sizeof dis);
		dis[s] = 0;
		for (int step = 1; step <= n; ++step) {
			bool flag = false;
			for (auto t : g) {
				int u = t.u, v = t.v;
				if (dis[u] == 0x3f3f3f3f)
					continue;
				int w = t.w;
				if (dis[v] > dis[u] + w) {
					dis[v] = dis[u] + w;
					flag = true;
				}
			}
			if (!flag)
				return false;
		}
		return true;
	}
	```

通过传入函数的 $k$ 参数，可以实现找长度不超过 $k$ 的最短路。

时间复杂度显然为 $\mathcal O(nm)$。

### 优化

最常见的优化就是 SPFA，即 Bellman-Ford 的队列优化版。

队列优化类似 BFS，那么我们也可以用 DFS 实现，可以用于比较快的判断负环。

但是目前大部分 Bellman-Ford 的优化都可能会被卡，且速度也快不了多少，因此不讲。

???+ "拓展：Bellman-Ford 的其他优化（摘自 OI-Wiki）"
	除了队列优化（SPFA）之外，Bellman–Ford 还有其他形式的优化，这些优化在部分图上效果明显，但在某些特殊图上，最坏复杂度可能达到指数级。

	+ 堆优化：将队列换成堆，与 Dijkstra 的区别是允许一个点多次入队。在有负权边的图可能被卡成指数级复杂度。
	+ 栈优化：将队列换成栈（即将原来的 BFS 过程变成 DFS），在寻找负环时可能具有更高效率，但最坏时间复杂度仍然为指数级。
	+ LLL 优化：将普通队列换成双端队列，每次将入队结点距离和队内距离平均值比较，如果更大则插入至队尾，否则插入队首。
	+ SLF 优化：将普通队列换成双端队列，每次将入队结点距离和队首比较，如果更大则插入至队尾，否则插入队首。
	+ D´Esopo–Pape 算法：将普通队列换成双端队列，如果一个节点之前没有入队，则将其插入队尾，否则插入队首。

	更多优化以及针对这些优化的 Hack 方法，可以看 [fstqwq 在知乎上的回答](https://www.zhihu.com/question/292283275/answer/484871888)。

## SPFA

### 队列优化

即 Shortest Path Faster Algorithm。

原理是，我们不需要每次松弛那么多，只有上一次被松弛的节点所连接的边才能继续松弛。

我们可以用各种方法来维护可能会引起松弛的节点，例如 BFS（队列优化）和 DFS。

代码：

??? note "点击查看代码"
	```cpp
	int dis[N], vis[N];

	void spfa(int s, int k = n) {
		memset(dis, 0x3f, sizeof dis);
		dis[s] = 0;
		vis[s] = 1;
		queue<int> q;
		q.push(s);
		while (!q.empty()) {
			int u = q.front();
			q.pop();
			vis[u] = 0;
			for (auto t : g[u]) {
				int v = t.v, w = t.w;
				if (dis[v] > dis[u] + w)  {
					dis[v] = dis[u] + w;
					if (!vis[v]) {
						q.push(v);
						vis[v] = 1;
					}
				}
			}
		}
	}
	```

虽然在大多数情况下 SPFA 跑得很快，但其最坏情况下的时间复杂度为 $\mathcal O(nm)$ 的。

但是，SPFA 总还是比 Bellman-Ford 快的，因此我们在存在负权边的时候可以考虑 SPFA。

### 判断负环

注意到我们在用队列实现松弛的时候，每条边松弛的次数不能直接知道了。

因此，我们直接去记录最短路的长度，在松弛的时候修改，如果 $\ge n$ 了就存在负环。

??? note "点击查看代码"
	```cpp
	int dis[N], vis[N];
	int len[N];

	bool check(int s) {
		memset(vis, 0, sizeof(int) * (n + 1));
		memset(dis, 0x3f, sizeof(int) * (n + 1));
		dis[s] = 0;
		vis[s] = 1;
		queue<int> q;
		q.push(s);
		len[s] = 0;
		while (!q.empty()) {
			int u = q.front();
			q.pop();
			vis[u] = 0;
			for (auto t : g[u]) {
				int v = t.v, w = t.w;
				if (dis[v] > dis[u] + w) {
					dis[v] = dis[u] + w;
					len[v] = len[u] + 1;
					if (len[v] >= n)
						return true;
					if (!vis[v]) {
						q.push(v);
						vis[v] = 1;
					}
				}
			}
		}
		return false;
	}
	```

### DFS 版 SPFA

通常用于判负环，复杂度依然不对。

此处可以直接判断一个点是否出现在最短路中两次。

因为 DFS 栈中只有祖先，但是 BFS 队列不满足这个性质。

??? note "点击查看代码"
	PS：板子题被卡了。
	
	```cpp
	int dis[N], vis[N];

	bool dfs(int u) {
		if (vis[u])
			return true;
		vis[u] = 1;
		for (auto t : g[u]) {
			int v = t.v, w = t.w;
			if (dis[v] > dis[u] + w) {
				dis[v] = dis[u] + w;
				if (dfs(v))
					return true;
			}
		}
		vis[u] = 0;
		return false;
	}

	bool check(int s) {
		memset(vis, 0, sizeof(int) * (n + 1));
		memset(dis, 0x3f, sizeof(int) * (n + 1));
		dis[s] = 0;
		return dfs(s);
	}
	```
