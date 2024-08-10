# 最小生成树

本文仅对于无向连通图。

生成树，Spanning Tree（ST），在一个 $n$ 个点的图中选取 $n-1$ 条边，构成一棵树。

最小生成树，Minimum Spanning Tree（MST），通常是边权和最小的生成树。

算法分类：

| 算法 | Prim | Prim 堆优化 | Kruskal |
| - | - | - | - |
| 思想 | 加点 | 加点 | 加边 |
| 时间复杂度 | $\mathcal O(n^2+m)$ | $\mathcal O(m \log n)$ | $\mathcal O(m\log m)$ |

实际应用中，Kruskal 往往更好些、且更快。即使是对于稠密图，Prim 的理论复杂度更优，Kruskal 也不一定跑的慢。

如果不是明显卡一个算法的，可以 Kruskal 解决。

## Kruskal

思想：加边，贪心选择。

思路为，将所有边 $(u,v,w)$ 按权值 $w$ 排序，从小到大依次遍历，如果两侧不属于一个连通块，那么就将这条边加入生成树中。最终一定会选出 $n-1$ 条边，且是一个最小生成树。

证明：略，见 [OI-Wiki](https://oi-wiki.org/graph/mst/#%E8%AF%81%E6%98%8E)。

## Prim

思想：加点，贪心选择。

思路为，每次选择距离最小的一个结点，并用新的边更新其他结点的距离。

和 Dijkstra 算法类似，因此可以堆优化。

时间复杂度：$\mathcal O(n^2+m)$，堆优化 $\mathcal O((n+m) \log n)$。

## 代码

```cpp
struct edge { int u, v, w; };
bool operator <(const edge &a, const edge &b) { return a.w < b.w; }

struct graph_vector {
    vector<edge> e;
    graph_vector() { e.clear(); }
    graph_vector(int m) { e.resize(m); }
};

struct graph_array {
    vector<vector<int>> e;
    graph_array() { e.clear(); }
    graph_array(int n) { e.resize(n + 1, vector<int>(n + 1, INF)); }
};

struct graph_list {
    vector<int> h, e, w, ne; int idx;
    graph_list() { idx = 0; }
    graph_list(int n, int m) {
        h.resize(n + 1); idx = 0;
        e.resize(m + 1), ne.resize(m + 1), w.resize(m + 1);
    } void add(int u, int v, int s) {
        ++idx; e[idx] = v; w[idx] = s; ne[idx] = h[u];
        h[u] = idx;
    } void Add(int u, int v, int w) { add(u, v, w); add(v, u, w); }
};

struct dsu {
    vector<int> f;
    dsu(int n) { f.resize(n + 1); iota(f.begin(), f.end(), 0); }
    int find(int x) { return x == f[x] ? x : f[x] = find(f[x]); }
    bool merge(int a, int b) {
        a = find(a), b = find(b);
        return a == b ? 0 : (f[find(a)] = f[find(b)], 1);
    }
};

struct {
    int mst(int n, graph_vector &g) {
        sort(g.e.begin(), g.e.end());
        int res = 0, cnt = 0;
        dsu d(n); for (auto &i: g.e) {
            int u = i.u, v = i.v;
            if (!d.merge(u, v)) continue;
            res += i.w, ++cnt;
            if (cnt == n - 1) return res;
        } return -1;
    } int mst(int n, graph_array &g) {
        vector<int> dis(n + 1), vis(n + 1);
        fill(dis.begin(), dis.end(), INF);
        int res = 0; rep(i, n) {
            int t = -1; gor(j, 1, n + 1)
            if (!vis[j] && (t == -1 || dis[j] < dis[t])) t = j;
            if (i && dis[t] == INF) return -1;
            if (i) res += dis[t];
            gor(j, 1, n + 1) dis[j] = min(dis[j], g.e[t][j]);
            vis[t] = 1;
        } return res;
    } int mst(int n, graph_list &g) {
        vector<int> dis(n + 1), vis(n + 1);
        fill(dis.begin(), dis.end(), INF);
        priority_queue<pii, vector<pii>, greater<pii>> heap;
        heap.push({0, 1}); dis[1] = 0;
        int res = 0, cnt = 0; while (heap.size()) {
            int u = heap.top().second, d = heap.top().first;
            heap.pop(); if (vis[u]) continue;
            res += d; vis[u] = 1, ++cnt;
            for (int i = g.h[u]; i; i = g.ne[i]) {
                int v = g.e[i], w = g.w[i];
                if (w < dis[v]) dis[v] = w, heap.push({w, v});
            }
        } return cnt == n ? res : -1;
    }
} mst;
```
