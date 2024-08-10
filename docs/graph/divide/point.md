# 点分治

点分治适合处理大规模的树上路径信息问题。

## 流程

我们将一棵有根树上的路径分为两种：

1. 经过根节点的路径（以根节点作为 LCA 的）；

2. 不经过根节点的（完全在子树内的）。

我们根据这两个，对树进行分治：

1. 统计经过根的路径的答案；

2. 删去根节点，分治子树。

考虑复杂度，显然是能被链卡死的，我们希望每次划分的子树尽可能平衡，

1. 于是，我们可以递归一个树，钦定这个子树的重心为根；

2. 假设我们处理经过根的答案存在 $\mathcal O(T(n))$ 的做法。

3. 重心可以把树分为两个不超过一半的子树，复杂度为 $\mathcal O(T(n)\log n)$。

问题转化为：如何处理经过根的路径？这是点分治的核心，一般也是最难的点。

## 实现

1. 找出树的中心做根 `getroot();`

2. 对当前树统计答案 `calc();`

3. 分治各个子树递归 `divide();`

细节：

+ 我们用 `vis` 表示一个点是否被删掉（标记根的删除）；

+ 通常将问题离线下来统一计算。

### 树的重心

有性质：

+ 重心的所有子树大小不超过整棵树的一半；

+ 重心的最大子树最小。

根据上面任意一个都可以 $\mathcal O(n)$ 的找重心。

我一般用第二个：

```cpp
int tot, siz[N];

int root, max_son[N];

void dfs(int u, int fa) {
    siz[u] = 1;
    max_son[u] = -1;
    for (auto t : g[u]) {
        int v = t.v;
        if (v == fa)
            continue;
        if (vis[v])
            continue;
        dfs(v, u);
        max_son[u] = max(max_son[u], siz[v]);
        siz[u] += siz[v];
    }
    max_son[u] = max(max_son[u], tot - siz[u]);
    if (root == -1 || max_son[u] < max_son[root])
        root = u;
}

int get_root(int u) {
    tot = u == 1 ? n : siz[u];
    root = -1;
    dfs(u, -1);
    return root;
}
```

### 点分治

很简单。

```cpp
void divide(int u) {
    vis[u] = true;
    calc(u);
    for (auto t : g[u]) {
        int v = t.v;
        if (vis[v])
            continue;
        divide(get_root(v));
    }
}
```

### 计算答案

最难的部分。

具体问题具体分析。

下面我们给几道例题。

## 例题

### P3806 【模板】点分治 1

推荐使用 QOJ 的题目：[QOJ #329. 点分治](https://qoj.ac/problem/329)。

其中 `calc` 函数如下：

??? note "点击查看代码"
    ```cpp
    bool ans[N];

    int dis[N], cnt;

    void get_dis(int u, int fa, int val) {
        if (val > (int)1e7) // 超过了最大长度，无意义
            return;
        dis[++cnt] = val; // 将长度记录下来
        for (auto t : g[u]) {
            int v = t.v;
            if (v == fa)
                continue;
            if (vis[v])
                continue;
            get_dis(v, u, val + t.w);
        }
    }

    int mp[M];

    void calc(int u) {
        mp[0] = 1;
        int mx = 0;
        for (auto t : g[u]) {
            int v = t.v;
            if (vis[v])
                continue;
            cnt = 0;
            get_dis(v, u, t.w); // 遍历子树，统计长度
            for (int i = 1; i <= cnt; ++i)
                for (int j = 0; j < m; ++j)
                    if (q[j] >= dis[i])
                        ans[j] |= mp[q[j] - dis[i]]; // 更新答案
            for (int i = 1; i <= cnt; ++i)
                mp[dis[i]] = true, mx = max(mx, dis[i]); // 加入子树的贡献
        }
        memset(mp, 0, sizeof(int) * (mx + 1)); // 清除操作，注意最大是值域
    }
    ```

我们用 $\text{map}$ 表示在一棵树的前面的子树中出现的路径长度。

每次加入一个子树，先更新答案，再加入这个子树的贡献。

这样做可以避免出现同一颗子树用同一颗子树的信息的情况。

时间复杂度为 $\mathcal O(nm\log n)$。

### CF161D Distance in Tree

和上面一样，只是计数。

这道题数据范围小，所以朴素树上 DP 似乎也可以解决。

??? note "点击查看代码"
    ```cpp
    ll ans;

    int dis[N], cnt;

    void get_dis(int u, int fa, int dep) {
        if (dep > 500)
            return;
        dis[++cnt] = dep;
        for (int v : g[u]) {
            if (v == fa)
                continue;
            if (vis[v])
                continue;
            get_dis(v, u, dep + 1);
        }
    }

    int mp[1010];

    void calc(int u) {
        mp[0] = 1;
        cnt = 0;
        for (int v : g[u]) {
            if (vis[v])
                continue;
            int st = cnt + 1;
            get_dis(v, u, 1);
            for (int i = st; i <= cnt; ++i)
                if (k >= dis[i])
                    ans += mp[k - dis[i]]; // 这里计数
            for (int i = st; i <= cnt; ++i)
                ++mp[dis[i]];
        }
        for (int i = 1; i <= cnt; ++i)
            --mp[dis[i]];
    }
    ```

### P4178 Tree

注意到要求 $\le K$ 而不是 $=K$，观察点分树板子题，

我们发现 `mp` 数组的前缀和就是 $\le K$ 的答案，因此树状数组维护。

因为只需要维护单点修改前缀查询，所以树状数组很快。

??? note "点击查看代码"
    ```cpp
    namespace ds {
        inline constexpr int hole(int k) {
            return k + (k >> 10);
        }

        ll s[hole(V)];
        uint64_t Tag, tag[hole(V)];

        void modify(int x, int v) {
            for (++x; x < V; x += x & -x) {
                if (tag[hole(x)] != Tag)
                    s[hole(x)] = 0;
                s[hole(x)] += v;
                tag[hole(x)] = Tag;
            }
        }

        ll sum(int x) {
            ll r = 0;
            for (++x; x; x &= x - 1)
                if (tag[hole(x)] == Tag)
                    r += s[hole(x)];
            return r;
        }

        void clear() {
            ++Tag;
        }
    }

    ll ans;

    int dis[N], cnt;

    void get_dis(int u, int fa, int val) {
        if (val > k)
            return;
        dis[++cnt] = val;
        for (auto t : g[u]) {
            int v = t.v;
            if (v == fa)
                continue;
            if (vis[v])
                continue;
            get_dis(v, u, val + t.w);
        }
    }

    void calc(int u) {
        ds::modify(0, 1);
        cnt = 0;
        for (auto t : g[u]) {
            int v = t.v;
            if (vis[v])
                continue;
            int st = cnt + 1;
            get_dis(v, u, t.w);
            for (int i = st; i <= cnt; ++i)
                if (k >= dis[i])
                    ans += ds::sum(k - dis[i]);
            for (int i = st; i <= cnt; ++i)
                ds::modify(dis[i], 1);
        }
        ds::clear();
    }
    ```

### P4149	[IOI2011] Race

维护 $\operatorname{dis}u+\operatorname{dis}v=k$ 中，$\operatorname{dep}u+\operatorname{dep}v$ 最小值。

维护一个 $\text{map}$，记录映射，

$$
\text{map}:\operatorname{dis}u\to\operatorname{dep}v
$$

每次加入，

$$
\def\dis{\operatorname{dis}}
\def\dep{\operatorname{dep}}
\begin{aligned}
\text{map}(\dis v)&\overset{\min}{\longleftarrow}\dep v\\
ans&\longleftarrow\dep v+\text{map}(k-\dis v)
\end{aligned}
$$

代码：

??? note "点击查看代码"
    ```cpp
    #include <bits/stdc++.h>

    using namespace std;

    #define endl "\n"

    constexpr int N = 2e5 + 10;
    constexpr int M = 1e6 + 10;

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

    int get_root(int);

    // -----------------------------------------------------------------------------

    int mp[M];

    int vis[N], dis[N], dep[N];

    int cnt, ans = INF;

    void init(int u, int fa, int is, int ep) {
        if (is > k) return;
        ++cnt;
        dis[cnt] = is, dep[cnt] = ep;
        for (auto t : g[u]) {
            if (t.v == fa || vis[t.v]) continue;
            init(t.v, u, is + t.w, ep + 1);
        }
    }

    void calc(int u) {
        mp[0] = cnt = 0;
        for (auto t : g[u]) {
            int v = t.v, w = t.w;
            if (vis[v]) continue;
            int st = cnt + 1;
            init(v, u, w, 1);
            for (int i = st; i <= cnt; ++i)
                ans = min(ans, mp[k - dis[i]] + dep[i]);
            for (int i = st; i <= cnt; ++i)
                mp[dis[i]] = min(mp[dis[i]], dep[i]);
        }
        for (int i = 1; i <= cnt; ++i) mp[dis[i]] = INF;
    }

    void solve(int u) {
        vis[u] = 1, calc(u);
        for (auto t : g[u]) {
            if (vis[t.v]) continue;
            solve(get_root(t.v));
        }
    }

    // -----------------------------------------------------------------------------

    int siz[N], max_son[N];
    int tot, root;

    void dfs(int u, int fa) {
        siz[u] = 1, max_son[u] = 0;
        for (auto t : g[u]) {
            int v = t.v;
            if (v == fa || vis[v]) continue;
            dfs(v, u);
            siz[u] += siz[v];
            max_son[u] = max(max_son[u], siz[v]);
        }
        max_son[u] = max(max_son[u], tot - siz[u]);
        if (max_son[u] < max_son[root]) root = u;
    }

    int get_root(int u) {
        tot = siz[u], root = 0;
        return dfs(u, -1), root;
    }

    // -----------------------------------------------------------------------------

    signed main() {
        ios::sync_with_stdio(false);
        cin.tie(nullptr), cout.tie(nullptr);
        cin >> n >> k;
        memset(mp, 0x3f, sizeof mp);
        for (int i = 1; i < n; ++i) {
            int u, v, w;
            cin >> u >> v >> w;
            Add(u + 1, v + 1, w);
        }
        max_son[0] = n + 1;
        siz[1] = n;
        solve(get_root(1));
        cout << (ans >= n ? -1 : ans) << endl;
        return 0;
    }
    ```

当然这道题还可以启发时合并来做。