# 全源最短路

All Pairs Shortest Path Problem (APSP)。

## Floyd-Warshall

一个很实用的全源最短路解法，特点是好写，容易拓展。

### 思想

我们设 $f(k,i,j)$ 表示考虑前 $k$ 个点，$i\to j$ 的最短路。

首先考虑 $k=0$ 的初始状态，容易知道，

+ 有 $f(0,x,x)=0$ 表示相同的点；

+ 若 $u\to v$，则 $f(0,u,v)=w$ 表示有连边。

考虑加入点 $k$ 的贡献，我们知道 $k$ 可能会更新一些点的距离，

$$
f(k,i,j)=\min\{f(k-1,i,j),f(k-1,i,k)+f(k-1,j,k)\}
$$

直接转移即可。

我们可以滚动数组优化，注意要先枚举 $k$！

### 朴素实现

使用邻接矩阵存图，

??? note "点击查看代码"
	```cpp
	for (int k = 1; k <= n; ++k)
		for (int i = 1; i <= n; ++i)
			for (int j = 1; j <= n; ++j)
				dis[i][j] = min(dis[i][j], dis[i][k] + dis[k][j]);
	```

### 针对稀疏图的常数优化

注意到如果 `dis[i][k] == INF` 那么没必要转移。

??? note "点击查看代码"
	```cpp
	for (int k = 1; k <= n; ++k)
		for (int i = 1; i <= n; ++i) {
			int r = dis[i][k];
			if (r == 0x3f3f3f3f)
				continue;
			for (int j = 1; j <= n; ++j) {
				if (i == j || k == j)
					continue;
				if (dis[k][j] == 0x3f3f3f3f)
					continue;
				dis[i][j] = min(dis[i][j], r + dis[k][j]);
			}
		}
	```

这个优化在稠密图中效果不大。

### IJK / IKJ Algorithm

我们知道 Floyd-Warshall 算法需要 $k$ 先遍历，

但是，如果我们交换顺序，有性质：

+ 遍历顺序 IJK，跑三次即可得到正确答案。

+ 遍历顺序 IKJ，跑两次即可得到正确答案。

证明不会，详见：<https://arxiv.org/abs/1904.01210>。

## Johnson

### 引入

我们发现，如果跑 $n$ 次 Dijkstra 算法，复杂度是 $\mathcal O(n^2\log n+nm\log n)$。

容易发现这个复杂度在稀疏图上面优于 Floyd-Warshall 算法。

用 Fibonacci 堆实现，复杂度为 $\mathcal O(n^2\log n+nm)$，即使在稠密图上也比较好。

但是，问题是 Dijkstra 不支持负权边，如果跑 $n$ 次 Bellman-Ford 反而复杂度更不好了。

于是，我们考虑改造图，将负权消除的同时，求出正确的最短路。

### 过程

#### 势能函数

建超级源点 $0$，与所有点连边权为 $0$ 的边。

我们构造势能函数 $h(x)$ 表示，从 $0$ 号点到点 $x$ 的最短路。

容易发现求势能函数的过程不是复杂度瓶颈，因此使用 SPFA 即可。

#### 改造边权

我们先设记号，

+ 设 $w(u,v)$ 表示原图中，$u,v$ 两点间的边权 $w$；

+ 设 $w'(u,v)$ 为构造的图中，$u,v$ 两点间的边权 $w$；

+ 设 $d(s,t)$ 表示原图中，$s\to t$ 的最短路径长度，是我们要求的；

+ 设 $d'(s,t)$ 为构造的图中，$s\to t$ 的最短路径长度。

我们令，

$$
w'(u,v)=w(u,v)+h(u)-h(v)
$$

有性质：新图中的边权一定非负。

!!! note "边权非负的证明"
	根据松弛的原理，一定有，

	$$
	h(v)\le h(u)+w(u,v)
	$$

	得证。

#### 答案统计

有性质，

$$
d'(s,t)=d(s,t)+h(s)-h(t)
$$

!!! note "正确性的证明"
	不考虑最短的要求，我们假设存在路径 $s\to t$，路径形如，

	$$
	s\to p_1\to p_2\dots\to p_k\to t
	$$

	那么，这条路径的长度表示为，

	$$
	w'(s,p_1)+w'(p_1,p_2)+\dots+w'(p_k,t)
	$$

	直接展开，

	$$
	[w(s,p_1)+h(s)-h(p_1)]+[w(p_1,p_2)+h(p_1)-h(p_2)]+\dots+[w(p_k,t)+h(p_k)-h(t)]
	$$

	化简即，

	$$
	w(s,p_1)+w(p_1,p_2)+\dots+w(p_k,t)+h(s)-h(t)
	$$

	我们发现路径附加值 $h(s)-h(t)$ 只与起点和终点有关，与路径无关。

	因此，我们直接找到 $s\to t$ 的最短路径，再消除掉附加值，一定是正确的。

### 实现

使用魔法平板电视。

??? note "点击查看代码"
	```cpp
	int h[N];

	int dis[N][N];

	int st[N], vis[N];
	int cnt[N];

	bool SPFA(int s, int *d) {
		memset(cnt, 0, sizeof(int) * (n + 1));
		memset(st, 0, sizeof(int) * (n + 1));
		memset(d, 0x3f, sizeof(int) * (n + 1));
		d[s] = 0;
		st[s] = 1;
		queue<int> q;
		q.push(s);
		while (!q.empty()) {
			int u = q.front();
			q.pop();
			st[u] = 0;
			for (auto t : g[u]) {
				int v = t.v, w = t.w;
				if (d[v] > d[u] + w) {
					d[v] = d[u] + w;
					cnt[v] = cnt[u] + 1;
					if (cnt[v] > n)
						return true;
					if (!st[v]) {
						q.push(v);
						st[v] = 1;
					}
				}
			}
		}
		return false;
	}

	void Dijkstra(int s, int *d) {
		memset(vis, 0, sizeof(int) * (n + 1));
		memset(d, 0x3f, sizeof(int) * (n + 1));
		pqueue<pair<int, int>, greater<pair<int, int>>> heap;
		heap.push({0, s});
		d[s] = 0;
		while (!heap.empty()) {
			int u = heap.top().second;
			heap.pop();
			if (vis[u])
				continue;
			vis[u] = 1;
			for (auto t : g[u]) {
				int v = t.v, w = t.w;
				if (d[v] > d[u] + w) {
					d[v] = d[u] + w;
					heap.push({d[v], v});
				}
			}
		}
	}

	bool Johnson() {
		for (int i = 1; i <= n; ++i)
			g[0].emplace_back(i, 0);
		if (SPFA(0, h))
			return true;
		for (int i = 1; i <= n; ++i)
			for (auto &t : g[i])
				t.w += h[i] - h[t.v];
		for (int i = 1; i <= n; ++i) {
			Dijkstra(i, dis[i]);
			for (int j = 1; j <= n; ++j)
				dis[i][j] += h[j] - h[i];
		}
		return false;
	}
	```

## 传递闭包

### 问题描述

给定无权图 $G$ 及若干条边，判断任意两点是否联通。

可以按照 Floyd 的思路，换为 0/1 边权、先 bitand 再 bitor 运算即可。

使用 `bitset` 优化可以轻松做到 $\mathcal O(n^3/\omega)$。

### 实现

```cpp
void Main() {
	n = read<int>();
	for (int i = 1; i <= n; ++i)
		for (int j = 1; j <= n; ++j)
			a[i][j] = read<bool>();
	for (int k = 1; k <= n; ++k)
		for (int i = 1; i <= n; ++i)
			if (a[i][k])
				a[i] |= a[k];
	for (int i = 1; i <= n; ++i)
		for (int j = 1; j <= n; ++j)
			cout << a[i][j] << " \n"[j == n];
}
```