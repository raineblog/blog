# 异或哈希算法

## 思想

我们关注一个区间内出现了什么数字。

因此，我们对每一个数字赋一个随机权值，

然后对这个权值进行一系列操作，例如前缀 $\operatorname{xor}$ 等。

对于两个序列，通过 Hash 的方式判断即可。

同时，也可用于满足某些条件的子序列数量的问题。

我们可以通过 Hash 的方式找到前面满足某些条件的数，来匹配子序列。

## 例题

### 区间判断

#### AtCoder [ABC250E] Prefix Equality

题目描述：

给定序列 $A,B$，询问 $A$ 的前 $x$ 个数和 $B$ 的前 $y$ 个数去重后是否相同。

做法：

我们对每一个数赋一个随机权值，

将序列中第一次出现的这个数赋为权值，后面的都赋为 $0$。

那么我们只需要判断两个前缀异或和是否相同即可。

使用 `mt19937_64` 生成比较强的随机数，冲突概率较小。

??? note "代码"
    ```cpp
    using u64 = uint64_t;

    mt19937_64 rnd_big(114514);

    int n;

    u64 W[N];

    u64 A[N], B[N];

    unordered_set<int> appA, appB;
    unordered_map<int, u64> hashing;

    u64 get_hashing(int x) {
        return hashing.count(x) ? hashing[x] : hashing[x] = rnd_big();
    }

    void Main() {
        cin >> n;
        for (int i = 1; i <= n; ++i) {
            int x;
            cin >> x;
            if (appA.count(x))
                A[i] = A[i - 1];
            else
                A[i] = A[i - 1] ^ get_hashing(x), appA.insert(x);
        }
        for (int i = 1; i <= n; ++i) {
            int x;
            cin >> x;
            if (appB.count(x))
                B[i] = B[i - 1];
            else
                B[i] = B[i - 1] ^ get_hashing(x), appB.insert(x);
        }
        int q;
        cin >> q;
        while (q--) {
            int x, y;
            cin >> x >> y;
            puts(A[x] == B[y] ? "Yes" : "No");
        }
    }
    ```

### 区间计数

## 变种

### 矩阵乘积

来源是 CSP-S 2023 消消乐，用处不大。

但是这引出了类似异或和的一个特有做法。

设有一个群 $(G,\cdot)$，将元素分为入元素和出元素，令入元素和出元素互为逆元。

那么，如果一个区间 $[l,r]$ 的某种运算的前缀和为单位元了，

那么意味着这个区间的元素可以互相抵消，我们可以将前缀和放到 `map` 里面记录，

对于每一个 $S(r)$ 对应的 $S(l)=S(r),l<r$ 就可以统计满足条件的子区间数量。
