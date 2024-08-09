# 带权并查集

## 概念

**带权并查集**，也称为**边带权并查集**。

我们在并查集的边上定义某种权值，从而解决更多的问题。

而因为路径压缩的存在，我们一般要定义这种权值在路径压缩时产生的运算。

## 例题

### P2024 [NOI2001] 食物链

你说得对，这道题也可以用带权并查集来做。

在边权上维护模 3 意义下的加法群，从根开始计算两个点的深度差

$$
d=d(x)-d(y)
$$

+ $d\equiv0\pmod3$，则 $x,y$ 属于同类；
+ $d\equiv1\pmod3$，则 $x$ 吃 $y$，$x$ 是 $y$ 的天敌；
+ $d\equiv0\pmod3$，则 $y$ 吃 $x$，$y$ 是 $x$ 的天敌；

当我们在路径压缩的时候，注意我们记录的 $d(x)$ 表示的是 $x$ 到其父节点的距离，

+ 那么，我们已经跑完了一个节点的祖先，其父节点一定是直接接在根上面的。
+ 于是，我们另一个节点的新的距离直接为其父节点到祖先（父节点的父节点）的距离加上其到其父节点的距离即可。

```cpp
int getfa(int x) {
    if (x == fa[x]) return x;
    int t = getfa(fa[x]);
    d[x] = d[x] + d[fa[x]];
    return fa[x] = t;
}
```

合并的时候，默认把 $x$ 分支接在 $y$ 的祖先上，分类讨论即可，

+ 因为已经路径压缩了，因此 $x,y$ 的父节点一定就是根节点。
+ 若 $x,y$ 是同类，则合并其父节点时要保证其深度相同，于是取 $d(y)-d(x)$；
+ 若 $x$ 吃 $y$，那么要使 $x$ 比 $y$ 高一级，取 $d(y)-d(x)+1$。

这两个数的本质就是，我们再向上合并的时候要加上 $d(x)$，则可以抵消。

<details>
<summary>点击查看代码</summary>

```cpp
#include <bits/stdc++.h>

using namespace std;

#define endl "\n"

struct dsu {
    vector<int> fa, d;
    dsu() = default;
    dsu(int siz): fa(siz), d(siz) { iota(fa.begin(), fa.end(), 0); }
    int getfa(int x) {
        if (x == fa[x]) return x;
        int t = getfa(fa[x]);
        d[x] = d[x] + d[fa[x]];
        return fa[x] = t;
    }
};

int n, k;

dsu a;

signed main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr), cout.tie(nullptr);
    cin >> n >> k;
    a = dsu(n + 1);
    auto uni = [] (int x, int y) -> bool {
        int px = a.getfa(x);
        int py = a.getfa(y);
        if (px != py) {
            a.fa[px] = py;
            a.d[px] = a.d[y] - a.d[x];
            return true;
        }
        return ((a.d[x] - a.d[y]) % 3 + 3) % 3 == 0;
    };
    auto eat = [] (int x, int y) -> bool {
        int px = a.getfa(x);
        int py = a.getfa(y);
        if (px != py) {
            a.fa[px] = py;
            a.d[px] = a.d[y] - a.d[x] + 1;
            return true;
        }
        return ((a.d[x] - a.d[y]) % 3 + 3) % 3 == 1;
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

### P1196 [NOI2002] 银河英雄传说

同时维护边权和集合大小。

注意到如果把一个队列 $A$ 接到 $B$，相当于 $A$ 加上边权为集合 $B$ 的大小，直接接到 $B$ 的根上。

我们根据这个，直接维护即可。

<details>
<summary>点击查看代码</summary>

```cpp
#include <bits/stdc++.h>

using namespace std;

struct dsu {
    vector<int> fa, siz, d;
    dsu() = default;
    dsu(int n): fa(n), siz(n, 1), d(n) { iota(fa.begin(), fa.end(), 0); }
    int getfa(int x) {
        if (x == fa[x]) return x;
        int t = getfa(fa[x]);
        d[x] = d[x] + d[fa[x]];
        return fa[x] = t;
    }
    // merge x to y
    void unite(int x, int y) {
        x = getfa(x), y = getfa(y);
        fa[x] = y, d[x] = siz[y];
        siz[y] += siz[x];
    }
};

dsu a(30005);

signed main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr), cout.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        char op[3];
        int x, y;
        cin >> op >> x >> y;
        if (op[0] == 'M') a.unite(x, y);
        else {
            if (a.getfa(x) != a.getfa(y)) cout << "-1" << endl;
            else cout << abs(a.d[x] - a.d[y]) - 1 << endl;
        }
    }
    return 0;
}
```
</details>

