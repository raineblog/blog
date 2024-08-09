# 扩展域并查集

## 概念

**扩展域并查集**用于维护两类及以上集合的连通性。

具体的，我们一般开多倍空间，用 $x,x+n,\dots$ 表示同一个物体的不同属性。

这种用多个域表示同一元素不同属性的，也称为**种类并查集**。

## 例题

### P1892 [BOI2003] 团伙

经典例题：[P1892 [BOI2003] 团伙](https://www.luogu.com.cn/problem/P1892)。

我们用 $F[1,N]$ 表示朋友域，用 $F[N+1,2N]$ 表示敌人域。

+ 若 $x,y$ 是朋友，那么直接连接 $\langle x,y\rangle$，表示他俩是朋友；
+ 若 $x,y$ 是敌人，那么连接 $\langle x,y+N\rangle,\langle x+N,y\rangle$，表示敌人的敌人是朋友。

例如 $A\to B\to C$，其中只有 $B$ 是敌人域的，那么 $A$ 敌人 $B$ 的敌人 $C$ 就是 $A$ 的朋友。

<details>
<summary>点击查看代码</summary>

```cpp
#include <bits/stdc++.h>

using namespace std;

struct dsu {
    vector<int> fa;
    dsu(int siz): fa(siz) { iota(fa.begin(), fa.end(), 0); }
    int getfa(int x) { return x == fa[x] ? x : fa[x] = getfa(fa[x]); }
    void unite(int x, int y) { fa[getfa(x)] = getfa(y); }
};

signed main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr), cout.tie(nullptr);
    int n, m;
    cin >> n >> m;
    dsu a(2 * n + 1);
    while (m--) {
        char op[3];
        int x, y;
        cin >> op >> x >> y;
        if (op[0] == 'F') a.unite(x, y);
        else a.unite(x + n, y), a.unite(y + n, x);
    }
    int res = 0;
    for (int i = 1; i <= n; ++i)
        res += a.fa[i] == i;
    cout << res << endl;
    return 0;
}
```
</details>

### P2024 [NOI2001] 食物链

一个比经典例题还经典的例题：[P2024 [NOI2001] 食物链](https://www.luogu.com.cn/problem/P2024)。

我们另，

+ $x$ 表示本体；
+ $x+n$ 表示 $x$ 的事物集合；
+ $x+2n$ 表示 $x$ 的天敌集合。

<details>
<summary>点击查看代码</summary>

```cpp
#include <bits/stdc++.h>

using namespace std;

#define endl "\n"

struct dsu {
    vector<int> fa;
    dsu() = default;
    dsu(int siz): fa(siz) { iota(fa.begin(), fa.end(), 0); }
    int getfa(int x) { return x == fa[x] ? x : fa[x] = getfa(fa[x]); }
    void unite(int x, int y) { fa[getfa(x)] = getfa(y); }
};

int n, k;

dsu a;

signed main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr), cout.tie(nullptr);
    cin >> n >> k;
    a = dsu(3 * n + 1);
    // x:         >_<
    // x + n:     x's food
    // x + 2 * n: x's enemy
    auto uni = [] (int x, int y) -> bool {
        if (a.getfa(x) == a.getfa(y + n)) return false;
        if (a.getfa(x) == a.getfa(y + 2 * n)) return false;
        a.unite(x, y), a.unite(x + n, y + n), a.unite(x + 2 * n, y + 2 * n);
        return true;
    };
    auto eat = [] (int x, int y) -> bool {
        if (a.getfa(x) == a.getfa(y)) return false;
        if (a.getfa(x) == a.getfa(y + n)) return false;
        a.unite(x + n, y), a.unite(x, y + 2 * n), a.unite(x + 2 * n, y + n);
        return true;
    };
    int ans = 0;
    while (k--) {
        int op, x, y;
        cin >> op >> x >> y;
        if (x > n || y > n) ++ans;
        else if (op == 1) ans += !uni(x, y);
        else if (op == 2) ans += !eat(x, y);
    }
    cout << ans << endl;
    return 0;
}
```
</details>

我们可以总结出来，

+ 扩展域并查集，一定要搞清楚要开几个维度，连边必须讨论清楚，尽量多连；
+ 一般来说，通常有几个维度就至少要连几条边。

### P5937 [CEOI1999] Parity Game

类似的，我们设 $S$ 为二进制序列的前缀和。

那么，我们的 $[l,r]$ 信息，也就是知道了 $S_r-S_{l-1}$ 的奇偶性。

我们用扩展域并查集，

+ 若为偶数，连边 $\langle l,r\rangle,\langle l+n,r+n\rangle$，表示这两个奇偶性相同。
+ 若为奇数，连边 $\langle l+n,r\rangle,\langle l,r+n\rangle$，表示奇偶性不同。

如果连边的时候发现，同一组如果出现了另一组的边，那么失效。

提前离散化一下即可。

<details>
<summary>点击查看代码</summary>

```cpp
#include <bits/stdc++.h>

using namespace std;

#define endl "\n"

struct query_t {
    int l, r;
    bool iseven;
};

struct dsu_t {
    vector<int> fa;
    dsu_t(int n): fa(n) { iota(fa.begin(), fa.end(), 0); }
    int getfa(int x) { return x == fa[x] ? x : fa[x] = getfa(fa[x]); }
    void unite(int l, int r) { fa[getfa(l)] = getfa(r); }
} dsu(1e4 + 10);

signed main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr), cout.tie(nullptr);
    int n, m;
    cin >> n >> m;
    vector<int> s(m * 2);
    vector<query_t> a(m);
    for (int i = 0; i < m; ++i) {
        int l, r; string op;
        cin >> l >> r >> op;
        --l;
        s[i] = l, s[i + m] = r;
        a[i] = (query_t){l, r, op == "even"};
    }
    sort(s.begin(), s.end());
    s.erase(unique(s.begin(), s.end()), s.end());
    n = s.size();
    #define getid(x) (lower_bound(s.begin(), s.end(), x) - s.begin() + 1)
    for (int i = 0; i < m; ++i) {
        int op = a[i].iseven;
        int l = getid(a[i].l), r = getid(a[i].r);
        // cout << "MERGE " << l << " " << r << " " << op << " WA " << n << endl;
        if (op == 1) {
            if (dsu.getfa(l) == dsu.getfa(r + n) || dsu.getfa(l + n) == dsu.getfa(r))
                cout << i << endl, exit(0);
            dsu.unite(l, r), dsu.unite(l + n, r + n);
        } else {
            if (dsu.getfa(l) == dsu.getfa(r) || dsu.getfa(l + n) == dsu.getfa(r + n))
                cout << i << endl, exit(0);
            dsu.unite(l, r + n), dsu.unite(l + n, r);
        }
    }
    cout << m << endl;
    return 0;
}
```
</details>
