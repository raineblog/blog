# 线段树提高

一些比较系统的东西，会单独放文章，这里只写一些理论的。

## 线段树维护矩阵

例题：[P7453 [THUSCH2017] 大魔法师](https://www.luogu.com.cn/problem/P7453)。

当区间信息比较复杂，但是满足结合律的时候，可以使用矩阵维护。

线段树每个节点维护一个矩阵，合并区间时使用矩阵乘法转移。

但是，矩阵乘法的复杂度较差（自身带 $\mathcal O(k^3)$ 的），可能会被卡。

## 堆式建树

我们称，若节点 $x$ 的左右儿子分别编号 $2x,2x+1$，则是堆式的。

堆式建树后，往往钦定线段树值域为 $[1,2^k]$，不够的补余位即可。

这种存储方式在猫树和 zkw 线段树都有很好的应用。

此处提供一个比较好玩的自动补齐到 $2^k$ 的方法：

```cpp
#define awa(x) ({ \
    auto t = x; \
    __builtin_popcount(t) == 1 ? t : (1 << (__lg(t) + 1)); \
})
```

这样 $n$ 就变成了 $\ge n$ 的最小的 $2$ 的非负整数次幂。

如果是大于就只取后面半边即可。

## 动态开点线段树

记录一棵树的 `root` 和 `tot`。

+ 不要 `build`。

+ 在 `modify` 的时候如果当前节点为空则 `++tot` 设置编号。

+ 在 `query` 的时候如果节点为空则返回一个合适的值。

实现方法很多，我倾向于函数第一个参数传 `&k` 引用，

+ 调用的时候传 `k -> a[k].lss/rss`；

+ 如果 `k == 0` 则 `k = ++tot` 可以在前面自动修改了。

+ 下放标记时如果没有孩子，就直接创建一个，或者标记永久化。

另外，我们通过动态开点可以实现一个线段树森林，进而实现主席树、线段树合并等。

## 权值线段树

线段树的每个节点表示权值而不是数组下标，类似桶的线段树维护。

通常权值线段树只会进行单点修改区间查询，以及二分（见下面）操作。

这些都是很简单的，我会单独放一个博客记录可持久化权值线段树（主席树）。

## 线段树合并

线段树合并一般只用于权值线段树，下文再说为什么。

### 原地合并

思想很简单，代码很简单。

我们合并两个叶子结点，并依次上传。

```cpp
int merge(int x, int y, int l, int r) {
    if (!x || !y) return x + y;
    if (l == r) {
        // do someting ...
        return x;
    }
    int mid = (l + r) >> 1;
    a[x].lss = merge(a[x].lss, a[y].lss, l, mid);
    a[x].rss = merge(a[x].rss, a[y].rss, mid + 1, r);
    return push_up(x), x;
}
```

如果比较容易合并任意大小的两个区间，也可以用下面的简单做法。

```cpp
int merge(int x, int y) {
    if (!x || !y) return x | y;
    // do someting ...
    a[x].lss = merge(a[x].lss, a[y].lss);
    a[x].rss = merge(a[x].rss, a[y].rss);
    return x;
}
```

复杂度很抽象。

一般来说比较玄学，因为这个复杂度是 $\mathcal O(有多少个节点需要合并)$ 的。

对于满的线段树，那么合并复杂度就是重构的复杂度，很抽象。

所以一般只合并稀疏的，比如权值线段树。

空间开多大？不知道。也是玄学，能开大就大点把。

### 可持久化线段树合并

我们上一个写法，我们直接把结果放在了 $x$ 树上面，替换了原来的结构。

但是，有的时候我们依然需要 $x$ 树的信息，就需要拷贝（类似可持久化的新开点）。

但是拷贝的问题是，空间很大，一般不常用。

### 线段树合并维护树上操作

类似启发式合并。

例题：[CF600E Lomsat gelral](https://www.luogu.com.cn/problem/CF600E)。

核心思想是，自底向上或自顶向下的，DFS 整棵树，把节点信息合并到下一个节点上。

核心代码：

```cpp
int n;

vector<int> g[N];

int root[N], tot;

struct node {
    int lss, rss;
    struct vt {
        int cnt, ans;
        friend vt operator +(const vt &a, const vt &b) {
            if (a.cnt > b.cnt) return a;
            if (b.cnt > a.cnt) return b;
            return vt{a.cnt, a.ans + b.ans};
        }
    } v;
} a[int(1e7)];

void push_up(int k) {
    a[k].v = a[a[k].lss].v + a[a[k].rss].v;
}

void modify(int &k, int l, int r, int x, int v) {
    if (!k) k = ++tot;
    if (l == r) {
        a[k].v.ans = x;
        a[k].v.cnt += v;
        return;
    }
    int mid = (l + r) >> 1;
    if (x <= mid)
        modify(a[k].lss, l, mid, x, v);
    else
        modify(a[k].rss, mid + 1, r, x, v);
    push_up(k);
}

int merge(int x, int y, int l, int r) {
    if (!x || !y) return x | y;
    if (l == r) {
        a[x].v.cnt += a[y].v.cnt;
        return x;
    }
    int mid = (l + r) >> 1;
    a[x].lss = merge(a[x].lss, a[y].lss, l, mid);
    a[x].rss = merge(a[x].rss, a[y].rss, mid + 1, r);
    push_up(x);
    return x;
}

int ans[N];

int get_ans(int root) {
    return a[root].v.ans;
}

void dfs(int u, int fa) {
    for (int v : g[u]) if (v != fa) {
        dfs(v, u);
        root[u] = merge(root[u], root[v], 1, MAXN);
    }
    ans[u] = get_ans(root[u]);
}
```

## 线段树二分

通常是在值域线段树上面。

例题：<https://hydro.ac/d/RainPPR/p/P1001>。

### 朴素双 $\log$ 做法

我们先二分答案，然后再在线段树查询这个区间的答案。

那么，时间复杂度自然就是 $\mathcal O(\log^2 n)$ 的，其中 $n$ 是值域。

特点是好写，可能会被卡，也可能不会。

UPD：大部分时候只有单调修改区间查询，因此用树状数组可以快得多。

### 单 $\log$ 全局二分

所谓全局，就是要查询的区间已经在线段树上一个完整节点内了。

此时非常容易理解且好写，

+ 记 `root` 为当前要二分节点；

+ 判断左子树 `lson[root]` 是否满足；

+ 判断柚子厨 `rson[root]` 是否满足；

+ 选择合适的一边转移。

最经典的例子就是单点修改全局第 $k$ 小。

### 单 $\log$ 局部二分

所谓局部，就是指一个值域区间内，跨越了多个线段树上节点的。

我们需要先从线段树跑到区间对应的每一个节点上，如果在这个节点上就进去。

复杂度：线段树上区间被表示成 $\mathcal O(\log n)$ 个块，且深度最大为 $\mathcal O(\log n)$。

代码：

```cpp
namespace ds {
    constexpr int N = 5e5 + 10;

    struct node {
        int l, r, v;
    } a[N << 2];

    void build(int k, int l, int r) {
        a[k] = {l, r, 0};
        if (l == r) return;
        int mid = (l + r) >> 1;
        build(k << 1, l, mid);
        build(k << 1 | 1, mid + 1, r);
    }

    void modify(int x, int v) {
        int root = 1;
        while (true) {
            a[root].v += v;
            int l = a[root].l, r = a[root].r;
            if (l == r) break;
            int mid = (l + r) >> 1;
            if (x <= mid) root = root << 1;
            else root = root << 1 | 1;
        }
    }

    vector<int> pos;

    int query(int k, int p, int &x) {
        int l = a[k].l, r = a[k].r;
        if (l >= p) {
            if (a[k].v < x) {
                x -= a[k].v;
                return -1;
            }
            while (a[k].l != a[k].r) {
                if (a[k << 1].v < x)
                    x -= a[k << 1].v, k = k << 1 | 1;
                else
                    k = k << 1;
            }
            return a[k].l;
        }
        if (l == r) return -1;
        int mid = (l + r) >> 1;
        if (p <= mid) {
            int t = query(k << 1, p, x);
            if (t != -1) return t;
        }
        return query(k << 1 | 1, p, x);
    }

    void init(int n) {
        build(1, 1, n);
    }

    void add(int x) {
        modify(x, 1);
    }

    void del(int x) {
        modify(x, -1);
    }

    int rnk(int l, int k) {
        return query(1, l, k);
    }
}
```