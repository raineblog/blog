# 猫树

## 使用情景

没有修改，只有区间查询；且维护的信息可以快速合并且满足结合律。

我们直接抛出猫树的复杂度：预处理 $\mathcal O(n\log n)$，查询 $\mathcal O(1)$

+ 如果询问的操作是可重复贡献问题（RMQ），那么她和 ST 表是理论复杂度相同的。

+ 如果询问的操作满足可减性（SUM），那么直接前缀和处理是更优的。

+ 如果查询次数 $m$ 远小于元素个数 $n$，那么线段树是更优的。

+ 否则，那么猫树是优于线段树等的。

## 预处理

下面直接记 $m=\dfrac{l+r}2$，表示区间中点。

1. 我们将区间 $[l,r]$ 分为两部分 $[l,m],[m+1,r]$。

2. 从 $m,m+1$ 分别出发，向左、右遍历到 $l,r$，同步维护要处理的信息。

3. 递归左右区间。

复杂度分析：

+ 最多迭代 $\mathcal O(\log n)$ 层；

+ 每一层的每一个元素会且仅会被访问一次，

+ 故，预处理总时间复杂度为 $\mathcal O(n\log n)$。

## 查询

对于询问区间 $[p,q]$，我们需要找到一个合适的线段树节点 $[l,r]$，

满足 $l\le p\le q\le r$，那么我们就可以在这个节点上面直接合并前缀和后缀即可。

首先，我们显然可以从上到下把询问区间推到合适的层上，是 $\mathcal O(\log n)$ 的。

然后我们发现可以从下往上找 LCA，树剖 $\mathcal O(\log \log n)$ 的，ST 表 $\mathcal O(1)$ 的。

但是这太复杂了，我们考虑堆式建树，此时，

+ 设根节点编号为 $1$，子节点满足堆式，

+ 注意到一个节点编号的二进制表示，后 $k$ 位就表示了向上 $k$ 层的信息。

+ 因此，LCA 节点编号就是区间 $[l,r]$ 对应节点编号二进制表示的 LCP（最长公共前缀）。

+ 用公式表达就是 `x >> __lg(x ^ y)`。

因此，我们就可以简单的在 $\mathcal O(1)$ 查询了。

## 实现

题目：[SP1043 GSS1 静态区间最大子段和](https://www.luogu.com.cn/problem/SP1043)。

```cpp
#define fill_over(x) ((1 << (__lg(x) + 1)) - 1)

constexpr int N = 1 << 16;

int n, m, a[N];

int pos[N], ans[20][N << 2], sum[20][N << 2];

void build(int k, int l, int r, int dep) {
    if (l == r) return void(pos[l] = k);
    int mid = (l + r) >> 1;
    // LEFT: [l, mid]
    sum[dep][mid] = a[mid];
    for (int i = mid - 1; i >= l; --i) sum[dep][i] = sum[dep][i + 1] + a[i];
    for (int i = mid - 1; i >= l; --i) sum[dep][i] = max(sum[dep][i], sum[dep][i + 1]);
    ans[dep][mid] = a[mid];
    for (int i = mid - 1; i >= l; --i) ans[dep][i] = max(ans[dep][i + 1], 0) + a[i];
    for (int i = mid - 1; i >= l; --i) ans[dep][i] = max(ans[dep][i], ans[dep][i + 1]);
    // RIGHT: [mid + 1, r]
    sum[dep][mid + 1] = a[mid + 1];
    for (int i = mid + 2; i <= r; ++i) sum[dep][i] = sum[dep][i - 1] + a[i];
    for (int i = mid + 2; i <= r; ++i) sum[dep][i] = max(sum[dep][i], sum[dep][i - 1]);
    ans[dep][mid + 1] = a[mid + 1];
    for (int i = mid + 2; i <= r; ++i) ans[dep][i] = max(ans[dep][i - 1], 0) + a[i];
    for (int i = mid + 2; i <= r; ++i) ans[dep][i] = max(ans[dep][i], ans[dep][i - 1]);
    // DOWN
    build(k << 1, l, mid, dep + 1);
    build(k << 1 | 1, mid + 1, r, dep + 1);
}

int query(int l, int r) {
    if (l == r) return a[l];
    int dep = __lg(pos[l]) - __lg(pos[l] ^ pos[r]);
    return max({ans[dep][l], ans[dep][r], sum[dep][l] + sum[dep][r]});
}

void init() {
    cin >> n;
    for (int i = 1; i <= n; ++i) cin >> a[i];
    m = fill_over(n) + 1, build(1, 1, m, 1);
}
```