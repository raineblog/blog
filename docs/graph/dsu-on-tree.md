# 树上启发式合并

树上启发式合并通常可以用自底向上 / 自顶向下的线段树合并完成。

但是相比来说，树上启发式合并会更好实现一点，但缺点是思维更多。

## 启发式合并

启发式算法是基于人类的经验和直观感觉，对算法的优化。

启发式合并最常见的就是并查集的合并。

对于树上问题，我们统称为树上启发式合并。

其中比较特定的一类技巧成为 DSU on Tree。

下文不分辨定义，全都成为（树上）启发式合并。

## 树上启发式合并

树上启发式合并用于离线的求解子树的问题，不带修改。

有些题可以用树上莫队或者树套树一类的实现，但是这个算法一般很优。

其思想大概是，我们无法记录下每个节点的所有信息。

于是我们将最大的子树的信息保留，把其他子树的信息求解完先扔掉在算一遍加进去。

我们遍历每一个子节点，

+ 递归遍历轻儿子，不保留贡献；
+ 递归遍历重儿子，保留贡献；
+ 再遍历轻儿子，单独计入其贡献；
+ 更新该节点的答案；
+ 如果这个节点的答案不保留，那么消除贡献。

其中，第三步可以有多种实现：

+ 可以直接计入贡献的，用类似上面子树遍历的方法处理；
+ 不能直接计入贡献的，单独写一个递归实现。

可以发现我这里提到的两个，其实本质都是第二个，第一个实现简单而已。

总结：

0. 首先进行重链剖分；
1. 处理轻儿子的答案；
2. 清空轻儿子的贡献；
3. 处理重儿子的答案；
4. 加入轻儿子的贡献；
6. 计算该节点的答案。

## 实现

注意到这里不需要链的 DFS 序连续的性质，因此 DFN 的处理可以放在第一个 DFS 中。

第一个 DFS 记录，每个节点的：

父节点（`fa`）、深度（`dep`）、子树大小（`siz`）、重子节点（`son`）。

节点编号 DFN（`dfn`）、DFS 序中的节点编号（`rnk`）。

不是每个信息都必须的，下面是一个示例代码，

```cpp
int dep[N], siz[N], son[N];
int dfn[N], rnk[N], idx;

void dfs1(int u, int ff) {
	int mx = -1; siz[u] = 1, son[u] = -1;
	dfn[u] = ++idx, rnk[idx] = u;
	for (int v : g[u]) if (v != ff) {
		dep[v] = dep[u] + 1;
		dfs1(v, u), siz[u] += siz[v];
		if (siz[v] > mx) mx = siz[v], son[u] = v;
	}
}
```

第二个 DFS，求解答案，代码形如，

```cpp
void dfs2(int u, int ff, int keep) {
	for (int v : g[u]) if (v != ff && v != son[u]) dfs2(v, u, 0);
	if (son[u] != -1) dfs2(son[u], u, 1);
	add(u, ff), ans[u] = getans();
	if (keep == 0) del(u, ff);
}
```

这个东西的复杂度是 $\mathcal O(n\log n)$ 的，证明如下：

每个节点的访问，是由其上面的轻子节点引起的。

而根到节点的轻子节点个数是 $\mathcal O(n\log n)$ 的，因此，算法复杂度为：$\mathcal O(n\log n)$。

## 例题

### CF600E Lomsat gelral

模板题，此题作者写出了两种代码。

#### Solution 1

题解区的常见算法。

考虑上面的经典形式，我们在子树的加入贡献和删除时，暴力枚举这个子树。

注意到往上走的过程中，子树的答案还需要重新计算，

因此我们在处理过程中记录的结果，直接清空即可。

```cpp
#include <bits/stdc++.h>

using namespace std;

constexpr int N = 1e5 + 10;

using ll = long long;

int n, col[N];

vector<int> g[N];

int dep[N], siz[N], son[N];
int dfn[N], rnk[N], idx;

void dfs1(int u, int ff) {
	int mx = -1; siz[u] = 1, son[u] = -1;
	dfn[u] = ++idx, rnk[idx] = u;
	for (int v : g[u]) if (v != ff) {
		dep[v] = dep[u] + 1;
		dfs1(v, u), siz[u] += siz[v];
		if (siz[v] > mx) mx = siz[v], son[u] = v;
	}
}

int cnt[N], mont;

ll ans[N], wgq, res;

void add(int u, int ff, int s, int Son) {
	cnt[col[u]] += s;
	if (cnt[col[u]] > wgq) wgq = cnt[col[u]], res = col[u];
	else if (cnt[col[u]] == wgq) res += col[u];
	for (int v : g[u]) if (v != ff && v != Son) add(v, u, s, Son);
}

auto getans() {
	return res;
}

void dfs2(int u, int ff, int keep) {
	for (int v : g[u]) if (v != ff && v != son[u]) dfs2(v, u, 0);
	if (son[u] != -1) dfs2(son[u], u, 1);
	add(u, ff, 1, son[u]), ans[u] = getans();
	if (keep == 0) add(u, ff, -1, 0), wgq = res = 0;
}

signed main() {
	ios::sync_with_stdio(false);
	cin.tie(nullptr), cout.tie(nullptr);
	cin >> n;
	for (int i = 1; i <= n; ++i) cin >> col[i];
	for (int i = 1; i < n; ++i) {
		int u, v; cin >> u >> v;
		g[u].push_back(v), g[v].push_back(u);
	}
	dfs1(1, -1), dfs2(1, -1, 1);
	for (int i = 1; i <= n; ++i) cout << ans[i] << " ";
	return 0;
}
```

#### Solution 2

栈统计答案。

注意到我们是一个数一个数处理的，因此我们枚举子树区间，

我们每加入区间的一个数，就在栈中压入旧的答案。

注意到加入和删除的操作一定是对称处理的，因此，类似可撤并查集，

删除的时候复原旧的答案、弹栈即可。

```cpp
#include <bits/stdc++.h>

using namespace std;

constexpr int N = 1e5 + 10;

using ll = long long;

int n, col[N];

vector<int> g[N];

int dep[N], siz[N], son[N];
int dfn[N], rnk[N], idx;

void dfs1(int u, int ff) {
	int mx = -1; siz[u] = 1, son[u] = -1;
	dfn[u] = ++idx, rnk[idx] = u;
	for (int v : g[u]) if (v != ff) {
		dep[v] = dep[u] + 1;
		dfs1(v, u), siz[u] += siz[v];
		if (siz[v] > mx) mx = siz[v], son[u] = v;
	}
}

int cnt[N]; ll ans[N];

vector<ll> wgq, res;

void add(int i) {
	++cnt[i];
	if (cnt[i] < wgq.back()) wgq.push_back(wgq.back()), res.push_back(res.back());
	else if (cnt[i] == wgq.back()) wgq.push_back(wgq.back()), res.push_back(res.back() + i);
	else wgq.push_back(cnt[i]), res.push_back(i);
}

void del(int k) {
	wgq.pop_back(), res.pop_back();
	--cnt[k];
}

ll getans() {
	return res.back();
}

void dfs2(int u, int ff, int keep) {
	for (int v : g[u]) if (v != ff && v != son[u]) dfs2(v, u, 0);
	if (son[u] != -1) dfs2(son[u], u, 1);
	for (int v : g[u]) if (v != ff && v != son[u]) for (int i = dfn[v]; i <= dfn[v] + siz[v] - 1; ++i) add(col[rnk[i]]);
	add(col[u]), ans[u] = getans();
	if (keep == 0) for (int i = dfn[u]; i <= dfn[u] + siz[u] - 1; ++i) del(col[rnk[i]]);
}

signed main() {
	ios::sync_with_stdio(false);
	cin.tie(nullptr), cout.tie(nullptr);
	cin >> n;
	for (int i = 1; i <= n; ++i) cin >> col[i];
	for (int i = 1; i < n; ++i) {
		int u, v; cin >> u >> v;
		g[u].push_back(v), g[v].push_back(u);
	}
	wgq.push_back(0), res.push_back(0);
	dfs1(1, -1), dfs2(1, -1, 1);
	for (int i = 1; i <= n; ++i) cout << ans[i] << " ";
	return 0;
}
```

### P4149 [IOI2011] Race

启发式合并思路，

$$
\def\dis#1{\operatorname{dis}(#1)}
\dis{u}+\dis{v}-2\dis{\mathit{LCA}}=k
$$

中，最小的，

$$
\def\dep#1{\operatorname{dep}(#1)}
\dep{u}+\dep{v}-2\dep{\mathit{LCA}}
$$

我们固定 $\mathit{LCA}$（枚举），问题转化为，

$$
\def\dis#1{\operatorname{dis}(#1)}
\dis{u}+\dis{v}=k+2\dis{\mathit{LCA}}
$$

的最小，

$$
\def\dep#1{\operatorname{dep}(#1)}
\dep{u}+\dep{v}
$$

我们遍历小子树的 $\text{map}$，去大子树的 $\text{map}$ 查询；

其次，将小子树的 $\text{map}$ 加入大子树的 $\text{map}$ 即可。

```cpp
#include <bits/stdc++.h>

using namespace std;

#define endl "\n"

constexpr int N = 2e5 + 10;

constexpr int INF = 1e9;

// -----------------------------------------------------------------------------

int n, k;

struct edge {
	int v, w;
	edge() = default;
	edge(int v, int w): v(v), w(w) {}
};

vector<edge> g[N];

void add(int u, int v, int w) {
	g[u].emplace_back(v, w);
}

void Add(int u, int v, int w) {
	add(u, v, w), add(v, u, w);
}

int ans = INF;

map<int, int> mp[N];

#define get_no(x, y) (mp[x].count(y) ? mp[x][y] : INF)
#define get(x, y) (mp[x][y] = get_no(x, y), mp[x][y])

void dfs(int u, int fa, int dis, int dep) {
	get(u, dis) = min(get(u, dis), dep);
	for (auto t : g[u]) {
		int v = t.v, w = t.w;
		if (v == fa) continue;
		dfs(v, u, dis + w, dep + 1);
		if (mp[v].size() > mp[u].size()) swap(mp[u], mp[v]);
		for (auto i : mp[v]) ans = min(ans, get_no(u, k - i.first + 2 * dis) + i.second - 2 * dep);
		for (auto i : mp[v]) get(u, i.first) = min(get(u, i.first), i.second);
	}
}

signed main() {
	ios::sync_with_stdio(false);
	cin.tie(nullptr), cout.tie(nullptr);
	cin >> n >> k;
	for (int i = 1; i < n; ++i) {
		int u, v, w;
		cin >> u >> v >> w;
		Add(u, v, w);
	}
	dfs(0, -1, 0, 0);
	cout << (ans >= n ? -1 : ans) << endl;
	return 0;
}
```