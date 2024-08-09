# 普通并查集

## 并查集

并查集是一种用于管理元素所属集合的数据结构，实现为一个森林。

并查集中，每棵树表示一个集合，树中的节点表示对应集合中的元素。

其思想是，把集合属性绑定到根节点上，避免多余的处理，因此一般难以分离。

## 实现

并查集支持两种操作：

+ 合并（Union）：合并两个元素所属集合（合并对应的树）；
+ 查询（Find）：查询某个元素所属集合（查询对应的树的根节点）。

### 朴素

```cpp
class union_find {
	private:
		vector<int> fa;
	public:
		union_find() = delete;
		union_find(const size_t N): fa(N) { iota(fa.begin(), fa.end(), 0); }
		int find(int x) { return x == fa[x] ? x : find(fa[x]); }
		bool connected(int u, int v) { return find(u) == find(v); }
		void unite(int u, int v) { fa[find(u)] = find(v); }
};
```

### 路径压缩

一个不通用的优化，我们把任意一个非根节点直接合并到它的根上。

```cpp
class union_find {
	private:
		vector<int> fa;
	public:
		union_find() = delete;
		union_find(const size_t N): fa(N) { iota(fa.begin(), fa.end(), 0); }
		int find(int x) { return x == fa[x] ? x : fa[x] = find(fa[x]); }
		bool connected(int u, int v) { return find(u) == find(v); }
		void unite(int u, int v) { fa[find(u)] = find(v); }
};
```

非常好写，但是对于可撤销等就无法压缩了。

### 启发式合并和按秩合并

合并时，选择哪棵树的根节点作为新树的根节点会很大程度上影响复杂度。

一般来说，我们可以将节点较少或深度较小的树连到另一棵，以免发生退化。

+ 其中，按照节点个数合并，称为启发式合并（维护树的大小）。
+ 而按照深度（称为秩）合并的，称为按秩合并（维护树的高度）。

一定程度上，启发式合并会被卡，但是按秩合并会比较难写。

```cpp
class union_find {
	private:
		vector<int> fa, siz;
	public:
		union_find() = delete;
		union_find(int N): fa(N), siz(N, 1) { iota(fa.begin(), fa.end(), 0); }
		int find(int x) { return x == fa[x] ? x : fa[x] = find(fa[x]); }
		bool connected(int u, int v) { return find(u) == find(v); }
		void unite(int u, int v) {
			u = find(u), v = find(v);
			if (u == v) return;
			if (siz[u] > siz[v]) swap(u, v);
			fa[u] = v, siz[v] += siz[u];
		}
};
```

按秩合并，

```cpp
class union_find {
	private:
		vector<int> fa, dep;
	public:
		union_find() = delete;
		union_find(int N): fa(N), dep(N, 1) { iota(fa.begin(), fa.end(), 0); }
		int find(int x) { return x == fa[x] ? x : fa[x] = find(fa[x]); }
		bool connected(int u, int v) { return find(u) == find(v); }
		void unite(int u, int v) {
			u = find(u), v = find(v);
			if (u == v) return;
			if (dep[u] > dep[v]) swap(u, v);
			fa[u] = v;
			if (dep[u] == dep[v]) ++dep[v];
		}
};
```

注：因为路径压缩的存在，按秩合并没有太大优势，但是在无法路径压缩的时候，按秩合并似乎也优势不大。

附：不那么准的评测记录，

| | 无 | 启发式合并  | 按秩合并 |
| - | - | - | - |
| 无 | [TLE 5000ms](https://judge.yosupo.jp/submission/223215) | [AC 32ms](https://judge.yosupo.jp/submission/223217) | [AC 32ms](https://judge.yosupo.jp/submission/223219) |
| 路径压缩 | [AC 31ms](https://judge.yosupo.jp/submission/223216) | [AC 32ms](https://judge.yosupo.jp/submission/223218) | [AC 31ms](https://judge.yosupo.jp/submission/223220) |

### 时间复杂度

如果只使用路径压缩或启发式合并，时间复杂度是单次 $\mathcal O(\log n)$ 的。

如果同时使用，时间复杂度是单次 $\mathcal O(\alpha(n))$ 的，可以近似看成单次 $\mathcal O(1)$。

## 例题

### AT_abc238_e [ABC238E] Range Sums

题目描述：有一个长为 $N$ 的序列，判断根据 $Q$ 个区间 $[l_i,r_i]$ 的和，是否能确定整个序列的元素和。

我们注意到，当确定了 $[l,r]$ 的和，我们其实已经确定了 $S_r-S_{l-1}$ 的值。

那么，我们经过若干次传递，如果能从 $S_N$ 转移到 $S_0$，那么就是可行的。

这就是一个并查集板子了，代码略。

### P1955 [NOI2015] 程序自动分析

有若干组条件，可能为 $a_i=a_j$ 或 $a_i\neq a_j$，请判断是否合法。

注意到我们先把等于的 unite 起来，然后再检查不等于的是否合法即可。

离散化可以使用 umap 复杂度低（如果是 CF 建议使用 map）（。

### P1455 搭配购买

维护集合 $c,w$ 的和，进行 01 背包。

过于板子，解析略。

<details>
<summary>点击查看代码</summary>

```cpp
#include <bits/stdc++.h>

using namespace std;

struct pack01 {
    int n, v;
    vector<int> c, w;
    pack01() = delete;
    pack01(int v, vector<int> c, vector<int> w): n(c.size()), v(v), c(c), w(w), dp(v + 1) {}
    vector<int> dp;
    int calc() {
        for (int i = 0; i < n; ++i)
            for (int j = v; j >= c[i]; --j)
                dp[j] = max(dp[j], dp[j - c[i]] + w[i]);
        return dp[v];
    }
};

signed main() {
    int n, m, v;
    cin >> n >> m >> v;
    vector<int> c(n + 1), w(n + 1), fa(n + 1);
    for (int i = 1; i <= n; ++i) cin >> c[i] >> w[i], fa[i] = i;
    // dsu
    function<int(int)> getfa = [&] (int x) {
        if (x == fa[x]) return x;
        return fa[x] = getfa(fa[x]);
    };
    auto unite = [&] (int x, int y) {
        x = getfa(x), y = getfa(y);
        if (x == y) return;
        fa[x] = y, c[y] += c[x], w[y] += w[x];
    };
    while (m--) {
        int x, y;
        cin >> x >> y;
        unite(x, y);
    }
    vector<int> ct, wt;
    for (int i = 1; i <= n; ++i) {
        if (i != fa[i]) continue;
        ct.push_back(c[i]), wt.push_back(w[i]);
    }
    pack01 solev(v, ct, wt);
    cout << solev.calc() << endl;
    return 0;
}

```
</details>

### P1197 [JSOI2008] 星球大战

每次打掉图中的几个点，询问连通块数量。

注意到并查集可以快速查询连通块数量，但是很难支持删除操作。

但是并查集可以很快的完成加入，因此我们正难则反。

1. 先把被打掉的点一口气打掉，处理连通块；
2. 从后往前加入被打掉的点，记录连通块数量。

注意一些细节，实现是很简单的。

<details>
<summary>点击查看代码</summary>

```cpp
#include <bits/stdc++.h>

using namespace std;

#define endl "\n"

constexpr int N = 4e5 + 10;

int n, m;

int hack[N];
bool hacked[N];

vector<int> g[N];

int fa[N], tot;

int getfa(int x) {
    if (x == fa[x]) return x;
    return fa[x] = getfa(fa[x]);
}

void unite(int x, int y) {
    x = getfa(x), y = getfa(y);
    if (x != y) fa[x] = y, --tot;
}

signed main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr), cout.tie(nullptr);
    cin >> n >> m;
    tot = n;
    for (int i = 1; i <= n; ++i)
        fa[i] = i;
    for (int i = 0; i < m; ++i) {
        int u, v;
        cin >> u >> v;
        ++u, ++v;
        g[u].push_back(v);
        g[v].push_back(u);
    }
    int k;
    cin >> k;
    for (int i = 0; i < k; ++i) {
        cin >> hack[i];
        hacked[++hack[i]] = true;
    }
    for (int i = 1; i <= n; ++i) {
        if (hacked[i]) continue;
        if (!g[i].empty())
        for (int j : g[i]) {
            if (hacked[j]) continue;
            unite(i, j);
        }
    }
    vector<int> ans(k + 1);
    ans[k] = tot - k;
    for (int i = k - 1; ~i; --i) {
        int x = hack[i];
        hacked[x] = 0;
        if (!g[x].empty())
        for (int y : g[x]) {
            if (hacked[y]) continue;
            unite(x, y);
        }
        ans[i] = tot - i;
    }
    for (int i : ans)
        cout << i << endl;
    return 0;
}
```
</details>
