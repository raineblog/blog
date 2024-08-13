# 倍增 LCA

## 思想

记 $f(u,k)$ 表示 $u$ 向上 $2^k$ 级父亲，然后就可以 $\mathcal O(n\log n)$ 预处理。

查询的时候，我们从大到小枚举 $k$，

+ 先将深度大的点往上跳，直到深度相等；

+ 将两个点一起往上跳，令两点不汇合，最后在跳一步即可。

!!! note "点击查看代码"
    ```cpp
    int fa[20][N], dep[N];

    void build(int u, int ff) {
        for (int k = 1; k < 20; ++k)
            fa[k][u] = fa[k - 1][fa[k - 1][u]];
        for (int v : g[u]) {
            if (v != ff) {
                fa[0][v] = u;
                dep[v] = dep[u] + 1;
                build(v, u);
            }
        }
    }

    void build(int u) {
        dep[u] = 1;
        build(u, -1);
    }

    int lca(int x, int y) {
        if (dep[x] < dep[y])
            swap(x, y);
        for (int k = 19; k >= 0; --k)
            if (dep[fa[k][x]] >= dep[y])
                x = fa[k][x];
        if (x == y)
            return x;
        for (int k = 19; k >= 0; --k)
            if (fa[k][x] != fa[k][y])
                x = fa[k][x], y = fa[k][y];
        return fa[0][x];
    }
    ```

## 优化

类似 ST 表，我们把第 $2$ 维 $k$ 提前，以减少 cache miss 次数，提高程序效率。

上面代码已经体现了，略。

## 拓展

在 LCA 的同时，还可以同步记录一些其他的东西。

比如下面的代码记录了子树中的最大节点编号，这类算法统称树上倍增。

??? note "P10113 [GESP202312 八级] 大量的工作沟通"
    以前写的代码，不好看。
    
    ```cpp
    int n, f[N];
    int dep[N], mxj[N];
    int lt[N][35];

    void init(int u, int fa) {
        dep[u] = dep[fa] + 1;
        mxj[u] = max(u, mxj[fa]);
        for (int k = 0; k <= 30; ++k)
            lt[u][k + 1] = lt[lt[u][k]][k];
        for (int v : g[u]) if (v != fa)
            lt[v][0] = u, init(v, u);
    }

    int lca(int x, int y) {
        if (dep[x] < dep[y])
            swap(x, y);
        for (int k = 30; ~k; --k)
            if (dep[lt[x][k]] >= dep[y])
                x = lt[x][k];
        if (x == y) return x;
        for (int k = 30; ~k; --k)
            if (lt[x][k] != lt[y][k])
                x = lt[x][k], y = lt[y][k];
        return lt[x][0];
    }
    ```
