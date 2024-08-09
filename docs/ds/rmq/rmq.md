# RMQ 问题

## 问题描述

对于序列 $A[1\dots n]$，有 $m$ 组询问 $\langle l,r\rangle$，求 $\max_{i=l}^rA_i$。

我们使用 $\mathcal O(A)\sim\mathcal O(B)$ 表示预处理 $\mathcal O(A)$，单次询问 $\mathcal O(B)$ 的时间复杂度。

首先，我们有一个比较优秀的线段树做法：

时间复杂度：$\mathcal O(n)\sim\mathcal O(\log n)$。

空间复杂度：$\mathcal O(n)$。

```cpp
#include <bits/stdc++.h>

using namespace std;

constexpr int N = 2e5 + 10;

int n, a[N];

#define ls(x) ((x) << 1)
#define rs(x) ((x) << 1 | 1)

int seg[N << 2];

void push_up(int k) {
    seg[k] = max(seg[ls(k)], seg[rs(k)]);
}

void build(int k = 1, int l = 1, int r = n) {
    if (l == r) return void(seg[k] = a[l]);
    int mid = l + r >> 1;
    build(ls(k), l, mid);
    build(rs(k), mid + 1, r);
    push_up(k);
}

int query(int p, int q, int k = 1, int l = 1, int r = n) {
    if (l >= p && r <= q) return seg[k];
    int mid = l + r >> 1;
    if (p > mid) return query(p, q, rs(k), mid + 1, r);
    if (q < mid + 1) return query(p, q, ls(k), l, mid);
    else return max(query(p, q, ls(k), l, mid), query(p, q, rs(k), mid + 1, r));
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

但是，我们想要一些更好的 RMQ 做法。

如果不带修的话，就可以用一些经典的 RMQ 算法了。
