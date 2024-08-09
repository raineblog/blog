# ST 表

## 概念

ST 表可以做到 $\mathcal O(n\log n)$ 预处理，$\mathcal O(1)$ 求出序列区间最大值。

按照最基础的思想，设 $f(i,j)$ 表示区间 $[i,j]$ 的最大值，考虑上述倍增思想。

### 预处理

重新设计状态，

用 $f(i,j)$ 表示区间 $[i,i+2^j-1]$ 的最大值，也就是从 $i$ 开始的 $2^j$ 个数。

考虑这样子递推的边界，

+ 显然 $f(i,0)=a_i$。
+ 显然 $f(i,j)=\max\{f(i,j-1),f(i+2^{j-1},j-1)\}$。

这么折半的预处理，可以做到 $\mathcal O(n\log n)$ 的复杂度。

### 查询

考虑查询，如果我们按照朴素的思想去处理的话，也是 $\mathcal O(n\log n)$ 的，但是

有一个很简单的性质，$\max\{x,x\}=x$，这意味着我们可以重复计算一个区间的最大值。

于是，我们可以把区间中一部分重复的区间跳过，直接去计算：

能覆盖整个区间的两个左右端点上的整个区间，就可以做到 $\mathcal O(1)$。

### 代码

不支持修改（复杂度很差）。

```cpp
#include <bits/stdc++.h>

using namespace std;

constexpr int N = 2e5 + 10;
constexpr int K = 20;

int n, a[N];

int st[N][K];

#define pow2(x) (1 << (x))

void build() {
    for (int i = 1; i <= n; ++i) st[i][0] = a[i];
    for (int k = 1; k < K; ++k)
        for (int i = 1; i + pow2(k) - 1 <= n; ++i)
            st[i][k] = max(st[i][k - 1], st[i + pow2(k - 1)][k - 1]);
}

int query(int p, int q) {
    int k = log2(q - p + 1);
    return max(st[p][k], st[q - pow2(k) + 1][k]);
}

signed main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr), cout.tie(nullptr);
    cin >> n;
    copy_n(istream_iterator<int>(cin), n, a + 1);
    build();
    int q, l, r; cin >> q;
    while (q--) cin >> l >> r, cout << query(l, r) << endl;
    return 0;
}
```

### 优化

为了空间局部性，我们把 ST 表第二维放到前面，如下，

```cpp
int st[K][N];

#define pow2(x) (1 << (x))

void build() {
    for (int i = 1; i <= n; ++i) st[0][i] = a[i];
    for (int k = 1; k < K; ++k)
        for (int i = 1; i + pow2(k) - 1 <= n; ++i)
            st[k][i] = min(st[k - 1][i], st[k - 1][i + pow2(k - 1)]);
}

int query(int p, int q) {
    int k = __lg(q - p + 1);
    return min(st[k][p], st[k][q - pow2(k) + 1]);
}
```

同时使用 `__lg` 计算 $\log_2$，这样可以获得更快的运行速度。

评测记录：

+ $f(i,k)$：AC 659 ms <https://judge.yosupo.jp/submission/223238>.

+ $f(k,i)$：AC 624 ms <https://judge.yosupo.jp/submission/223236>.

## 扩展

### 可重复贡献问题

除 RMQ 以外，还有其它的「可重复贡献问题」。例如「区间按位与」、「区间按位或」等。

ST 表能较好的维护「可重复贡献」的区间信息（同时也应满足结合律），时间复杂度较低。

**可重复贡献问题**是指满足 $x\operatorname{opt} x=x$ 的运算对应的区间询问。

例如，$\max(x,x)=x$，$\operatorname{gcd}(x,x)=x$，等等。

所以 RMQ 和区间 GCD 就是一个可重复贡献问题，像区间和就不具有这个性质。

如果预处理区间重叠了，则会导致重叠部分被计算两次，这是我们所不愿意看到的。

### 闲话

注意到猫树的复杂度和 ST 表相同，且支持维护非可重复性问题。

但是猫树较 ST 表更难实现，所以很少用。