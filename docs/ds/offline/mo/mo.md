# 普通莫队

## 形式

有序列 $[1,n]$ 上的问题 $[l,r]$ 共 $m$ 个。

我们将询问离线，考虑从一个区间转移到另一个区间，即，

$$
[l,r]\to[l-1,r]/[l+1,r]/[l,r-1]/[l,r+1]
$$

若这个操作可以在 $\mathcal O(1)$ 的做完，那么总时间复杂度为，

$$
\mathcal O(n\sqrt n)
$$

假设 $n,m$ 同阶。

## 做法

### 离线

我们考虑从一个询问，将区间移动到下一个。

```cpp
int l = 1, r = 0;
for (int i = 1; i <= m; ++i) {
	int x = q[i].l, y = q[i].r;
	if (x == y) {
		// 经常会在这里有特判1
		continue;
	}
	while (x < l) add(--l);
	while (y > r) add(++r);
	while (x > l) del(l++);
	while (y < r) del(r--);
	ans[q[i].id] = get_ans(l, r);
}
```

注意只有先拓展左右端点，再收缩才是正确的。

### 排序

但是，只这么做显然可以卡掉。

我们考虑对询问进行排序，使其复杂度正确。

```cpp
struct query {
	int id, l, r;
	friend bool operator <(const query &a, const query &b) {
		if (belong[a.l] != belong[b.l]) return a.l < b.l;
		return belong[a.l] & 1 ? a.r < b.r : a.r > b.r;
	}
} q[N];

int n, m, c[N];
int siz, belong[N];

cin >> n >> m, siz = sqrt(n);
for (int i = 1; i <= n; ++i) belong[i] = (i - 1) / siz + 1;

for (int i = 1; i <= m; ++i) q[i].id = i, cin >> q[i].l >> q[i].r;
sort(q + 1, q + m + 1);
```

以第一关键字 $l$，第二关键字 $r$ 排序。

注意到这个 $[l,r]$ 的询问可以看成二维平面上的点。

理论上，复杂度最优的情况是，二维中的曼哈顿距离最小生成树。

我们不这么复杂，直接分块，同时应用奇偶化排序。

### 复杂度和块长

设块长为 $B$，那么有 $n/B$ 个块，

+ 左端点是有序的，每次询问最多移动 $\mathcal O(B)$ 次，

+ 在一个块内，右端点最坏移动 $\mathcal O(n)$ 次（全走一遍）。

因此，理论移动次数为，

$$
\mathcal O\left(mB+{n^2\over B}\right)
$$

根据不等式，

$$
mB+{n^2\over B}\ge2\sqrt{mn^2}=\mathcal O(n\sqrt m)
$$

当且仅当，

$$
mB={n^2\over B}
$$

也就是，

$$
B={n\over\sqrt{m}}
$$

当默认 $n,m$ 同阶时，取 $B=\sqrt n$ 即可。

听说 lxl 曾经说，块长最好为，

$$
B={n\over\sqrt{2m/3}}
$$

没有测试过。

为避免 $m\gg n$ 导致 $B=0$，可以写，

$$
\texttt{B = max(1, int(n / sqrt(m * 2 / 3.0)))}
$$

UPD：不确定上面这个正确。

### 根号平衡

普通分块的移动和查询操作是不平衡的，

根据上面的证明，有结论，

+ 移动总共有 $\mathcal O(n\sqrt m)$ 次；

+ 查询总共有 $\mathcal O(m)$ 次。

例如，如果可以 $\mathcal O(1)$ 移动，$\mathcal O(\sqrt n)$ 查询（或更优），

那么就可以在 $\mathcal O(n\sqrt m+m\sqrt n)$ 完成询问。

假设 $n,m$ 同阶，就是 $\mathcal O(n\sqrt n)$ 的。

## 例题

### 例题一：P3901 数列找不同

询问区间 $[l,r]$ 是否互不相同。

记录变量 $\text{cnt}$ 表示当前有多少个数字出现两次及以上。

拓展的时候用桶处理一下即可。

??? note "点击查看代码"
    ```cpp
    #include <bits/stdc++.h>

    using namespace std;

    #define endl "\n"

    constexpr int N = 1e6 + 10;

    int n, t, a[N];

    int siz, belong[N];

    struct query {
        int l, r, id;
        friend bool operator <(const query &a, const query &b) {
            if (belong[a.l] != belong[b.l]) return a.l < b.l;
            return belong[a.l] & 1 ? a.r < b.r : a.r > b.r;
        }
    } q[N];

    int bucket[N], cnt;

    void add(int x) {
        x = a[x];
        if (bucket[x]++ == 1) ++cnt;
    }

    void del(int x) {
        x = a[x];
        if (--bucket[x] == 1) --cnt;
    }

    bool get_ans() {
        return cnt == 0;
    }

    bool ans[N];

    signed main() {
        ios::sync_with_stdio(false);
        cin.tie(nullptr), cout.tie(nullptr);
        cin >> n >> t, siz = sqrt(n);
        for (int i = 1; i <= n; ++i) cin >> a[i], belong[i] = (i - 1) / siz + 1;
        for (int i = 1; i <= t; ++i) q[i].id = i, cin >> q[i].l >> q[i].r;
        sort(q + 1, q + t + 1);
        int l = 1, r = 0;
        for (int i = 1; i <= t; ++i) {
            int x = q[i].l, y = q[i].r;
            if (x == y) {
                ans[q[i].id] = true;
                continue;
            }
            while (l > x) add(--l);
            while (r < y) add(++r);
            while (l < x) del(l++);
            while (r > y) del(r--);
            ans[q[i].id] = get_ans();
        }
        for (int i = 1; i <= t; ++i)
            cout << (ans[i] ? "Yes" : "No") << endl;
        return 0;
    }
    ```

### 例题二：P2709 小B的询问

求区间每个数出现次数的平方和。

直接维护即可，有一个小技巧，

每次先把原贡献删去，更改后直接加入现贡献即可。

??? note "点击查看代码"
    ```cpp
    #include <bits/stdc++.h>

    using namespace std;

    #define endl "\n"

    constexpr int N = 5e4 + 10;

    int n, m, k;

    int a[N], siz, belong[N];

    struct query {
        int id, l, r;
        friend bool operator <(const query &a, const query &b) {
            if (belong[a.l] != belong[b.l]) return a.l < b.l;
            return belong[a.l] & 1 ? a.r < b.r : a.r > b.r;
        }
    } q[N];

    int bucket[N], ans[N];

    int res = 0;

    void add(int x) {
        x = a[x];
        res -= bucket[x] * bucket[x];
        ++bucket[x];
        res += bucket[x] * bucket[x];
    }

    void del(int x) {
        x = a[x];
        res -= bucket[x] * bucket[x];
        --bucket[x];
        res += bucket[x] * bucket[x];
    }

    int get_ans() {
        return res;
    }

    signed main() {
        ios::sync_with_stdio(false);
        cin.tie(nullptr), cout.tie(nullptr);
        cin >> n >> m >> k, siz = sqrt(n);
        for (int i = 1; i <= n; ++i) cin >> a[i], belong[i] = (i - 1) / siz + 1;
        for (int i = 1; i <= m; ++i) q[i].id = i, cin >> q[i].l >> q[i].r;
        sort(q + 1, q + m + 1);
        int l = 1, r = 0;
        for (int i = 1; i <= m; ++i) {
            int x = q[i].l, y = q[i].r;
            if (x == y) {
                ans[q[i].id] = 1;
                continue;
            }
            while (x < l) add(--l);
            while (y > r) add(++r);
            while (x > l) del(l++);
            while (y < r) del(r--);
            ans[q[i].id] = get_ans();
        }
        copy_n(ans + 1, m, ostream_iterator<int>(cout, "\n"));
        return 0;
    }
    ```

### 例题三：P1494 小 Z 的袜子

最经典的莫队板子题。

和上一题一样。

用 C++ 自带的 `__gcd` 就可以，不会被卡常（O2）。

??? note "点击查看代码"
    ```cpp
    #include <bits/stdc++.h>

    using namespace std;

    #define endl "\n"
    #define gcd(x, y) __gcd(x, y)

    using ll = long long;

    constexpr int N = 5e4 + 10;

    int n, m, c[N];

    int siz, belong[N];

    struct query {
        int id, l, r;
        friend bool operator <(const query &a, const query &b) {
            if (belong[a.l] != belong[b.l]) return a.l < b.l;
            return belong[a.l] & 1 ? a.r < b.r : a.r > b.r;
        }
    } q[N];

    pair<ll, ll> ans[N];

    int bucket[N];

    ll res;

    void add(int x) {
        x = c[x];
        res -= bucket[x] * (bucket[x] - 1);
        ++bucket[x];
        res += bucket[x] * (bucket[x] - 1);
    }

    void del(int x) {
        x = c[x];
        res -= bucket[x] * (bucket[x] - 1);
        --bucket[x];
        res += bucket[x] * (bucket[x] - 1);
    }

    pair<ll, ll> get_ans(int l, int r) {
        ll a = res;
        ll b = 1ll * (r - l + 1) * (r - l);
        auto g = gcd(a, b);
        return make_pair(a / g, b / g);
    }

    signed main() {
        ios::sync_with_stdio(false);
        cin.tie(nullptr), cout.tie(nullptr);
        cin >> n >> m, siz = sqrt(n);
        for (int i = 1; i <= n; ++i) cin >> c[i], belong[i] = (i - 1) / siz + 1;
        for (int i = 1; i <= m; ++i) q[i].id = i, cin >> q[i].l >> q[i].r;
        sort(q + 1, q + m + 1);
        int l = 1, r = 0;
        for (int i = 1; i <= m; ++i) {
            int x = q[i].l, y = q[i].r;
            if (x == y) {
                ans[q[i].id] = make_pair(0ll, 1ll);
                continue;
            }
            while (x < l) add(--l);
            while (y > r) add(++r);
            while (x > l) del(l++);
            while (y < r) del(r--);
            ans[q[i].id] = get_ans(l, r);
        }
        for (int i = 1; i <= m; ++i)
            cout << ans[i].first << "/" << ans[i].second << endl;
        return 0;
    }
    ```

### 例题四：CF375D Tree and Queries

注意到子树查询可以直接 DFS 序区间查询。

维护出现次数 $\ge k$ 的次数的方法：

+ 用 $\text{bucket}(x)$ 表示一个数 $(x)$ 的出现次数；

+ 用 $\text{count}(c)$ 表示出现次数为 $(c)$ 的数的个数。

注意到 $\ge k$ 就是后缀求和。

我们首先可以树状数组 / 线段树，但是考虑根号平衡。

我们最优是以 $\mathcal O(1)$ 插入，$\mathcal O(\sqrt n)$ 查询。

数列分块即可，同时应用同样上面的技巧。

??? note "点击查看代码"
    ```cpp
    #include <bits/stdc++.h>

    using namespace std;

    #define endl "\n"

    constexpr int N = 1e5 + 10;

    int n, m, belong[N];

    int _col[N], col[N];

    vector<int> g[N];

    int siz[N], dfn[N], tot;

    void dfs(int u, int fa) {
        dfn[u] = ++tot;
        col[tot] = _col[u];
        siz[u] = 1;
        for (int v : g[u]) {
            if (v == fa) continue;
            dfs(v, u);
            siz[u] += siz[v];
        }
    }

    struct query {
        int id, l, r, k;
        friend bool operator <(const query &a, const query &b) {
            if (belong[a.l] != belong[b.l]) return a.l < b.l;
            return belong[a.l] & 1 ? a.r < b.r : a.r > b.r;
        }
    } q[N];

    int ans[N];

    int bucket[N];

    int arr[N], sz, cnt;
    int L[N], R[N];
    int sum[N];

    void modify(int x, int v) {
        arr[x] += v;
        sum[belong[x]] += v;
    }

    void add(int x) {
        x = col[x];
        modify(bucket[x], -1);
        ++bucket[x];
        modify(bucket[x], 1);
    }

    void del(int x) {
        x = col[x];
        modify(bucket[x], -1);
        --bucket[x];
        modify(bucket[x], 1);
    }

    int get_ans(int k) {
        int p = belong[k];
        int res = 0;
        for (int i = k; i <= R[p]; ++i) res += arr[i];
        for (int i = p + 1; i <= cnt; ++i) res += sum[i];
        return res;
    }

    signed main() {
        ios::sync_with_stdio(false);
        cin.tie(nullptr), cout.tie(nullptr);
        cin >> n >> m, sz = sqrt(n);
        cnt = (n - 1) / sz + 1;
        for (int i = 1; i <= n; ++i)
            cin >> _col[i], belong[i] = (i - 1) / sz + 1;
        for (int i = 1; i <= cnt; ++i)
            L[i] = (i - 1) * sz + 1, R[i] = L[i] + sz - 1;
        R[cnt] = n;
        for (int i = 1; i < n; ++i) {
            int u, v;
            cin >> u >> v;
            g[u].push_back(v);
            g[v].push_back(u);
        }
        dfs(1, -1);
        for (int i = 1; i <= m; ++i) {
            int u, k;
            cin >> u >> k;
            q[i].k = k;
            q[i].id = i;
            q[i].l = dfn[u];
            q[i].r = dfn[u] + siz[u] - 1;
        }
        sort(q + 1, q + m + 1);
        int l = 1, r = 0;
        for (int i = 1; i <= m; ++i) {
            int x = q[i].l, y = q[i].r;
            if (q[i].k > n) {
                ans[q[i].id] = 0;
                continue;
            }
            while (x < l) add(--l);
            while (y > r) add(++r);
            while (x > l) del(l++);
            while (y < r) del(r--);
            ans[q[i].id] = get_ans(q[i].k);
        }
        copy_n(ans + 1, m, ostream_iterator<int>(cout, "\n"));
        return 0;
    }
    ```
