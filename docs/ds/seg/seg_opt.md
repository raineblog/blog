# 线段树优化

比较基础，因此讲的很快。

我们主要关注单点修改、区间查询的线段树，这是应用最广泛的。

## 线段树问题

我们以 LOJ 的这道题为例，

例题：[LOJ #130. 树状数组 1 ：单点修改，区间查询](https://loj.ac/p/130)。

洛谷上面也有类似的题：[P3374 【模板】树状数组 1](https://www.luogu.com.cn/problem/P3374)。

因为洛谷的题的数据范围较小，我们使用更强的 LOJ 的题。

## 普通线段树

线段树首先可以分为，

+ 指针式线段树，就是使用指针「动态开点」进行操作。

+ 数组式线段树，就是使用多个数组记录信息。

+ 结构体式线段树，就是使用一个结构体来记录多个信息。

一般来说速度依次递增，我们此处考虑这种线段树怎么优化。

### Version #1：朴素版

我们不考虑指针式线段树，先看一个普通的数组式线段树的代码：

??? note "点击查看代码"
    ```cpp
    ll sum[N << 2];

    void push_up(int k) {
        sum[k] = sum[k << 1] + sum[k << 1 | 1];
    }

    void build(int k, int l, int r) {
        sum[k] = 0;
        if (l == r) {
            sum[k] = a[l];
            return;
        }
        int mid = (l + r) >> 1;
        build(k << 1, l, mid);
        build(k << 1 | 1, mid + 1, r);
        push_up(k);
    }

    void modify(int k, int l, int r, int x, int v) {
        if (l == r) {
            sum[k] += v;
            return;
        }
        int mid = (l + r) >> 1;
        if (x <= mid) modify(k << 1, l, mid, x, v);
        else modify(k << 1 | 1, mid + 1, r, x, v);
        push_up(k);
    }

    ll query(int k, int l, int r, int p, int q) {
        if (l >= p && r <= q) return sum[k];
        int mid = (l + r) >> 1;
        ll res = 0;
        if (p <= mid) res += query(k << 1, l, mid, p, q);
        if (q >= mid + 1) res += query(k << 1 | 1, mid + 1, r, p, q);
        return res;
    }
    ```

它在 LOJ 上面跑了 571 ms（<https://loj.ac/s/2128355>）。

### Version #2：非递归化

注意到单点修改只是在树上走出了一条从上到下的路径，因此可以非递归处理：

??? note "点击查看代码"
    ```cpp
    void modify(int x, int v) {
        int k = 1;
        int l = 1, r = n;
        while (l < r) {
            sum[k] += v;
            int mid = (l + r) >> 1;
            if (x <= mid) r = mid, k = k << 1;
            else l = mid + 1, k = k << 1 | 1;
        }
        sum[k] += v;
    }
    ```

这样就优化到了 493 ms（<https://loj.ac/s/2128360>）。

## zkw 线段树

更详细的见我另一个博客。

我们堆式建树，并钦定值域为 $[0,K]$，其中 $K$ 为 $>N$ 的最小的 $2$ 的整数次幂。

### Version #3：自底向上

根据二进制 + 线段树的结构性质，我们可以写出代码：

??? note "点击查看代码"
    ```cpp
    int m;

    void build() {
        m = 1 << (__lg(n) + 1);
        for (int i = 1; i <= n; ++i) sum[m + i] = a[i];
        for (int i = m - 1; i; --i) push_up(i);
    }

    void modify(int x, int v) {
        x += m;
        while (x) {
            sum[x] += v;
            x >>= 1;
        }
    }

    ll query(int p, int q) {
        p += m - 1, q += m + 1;
        ll s = 0;
        while (p ^ q ^ 1) {
            if (p % 2 == 0) s += sum[p ^ 1];
            if (q % 2 == 1) s += sum[q ^ 1];
            p >>= 1, q >>= 1;
        }
        return s;
    }
    ```

跑到了 328 ms（<https://loj.ac/s/2128362>）。

### Version #4：分支消除

我们知道在 C++ 中，对于分支的优化是较小的。

因此，我们使用三元运算符或者乘法来替代 `if` 的分支。

??? note "点击查看代码"
    ```cpp
    ll query(int p, int q) {
        p += m - 1, q += m + 1;
        ll s = 0;
        while (p ^ q ^ 1) {
            s += (p % 2 == 0) * sum[p ^ 1];
            s += (q % 2 == 1) * sum[q ^ 1];
            p >>= 1, q >>= 1;
        }
        return s;
    }
    ```

这样就是 286 ms（<https://loj.ac/s/2128365>）。

## 树状数组

树状数组可以理解为去掉柚子厨的 zkw 线段树。

这个操作可以使其空间减半，同时带上 $1/2$ 的巨小常数。

### Version #5：位运算优化

注意到减去 $\operatorname{lowbit}$ 的过程，等价于位与本身减一。

??? note "点击查看代码"
    ```cpp
    void modify(int x, int v) {
        for (; x <= n; x += x & -x)
            sum[x] += v;
    }

    ll query(int x) {
        ll r = 0;
        for (; x; x &= x - 1)
            r += sum[x];
        return r;
    }

    ll query(int p, int q) {
        return query(q) - query(p - 1);
    }
    ```

跑了 258 ms（<https://loj.ac/s/2128367>）。

### Version #6：线性建树

=== "方法一"
    尝试倒过来，把叶子结点的值直接传给父亲。

    ??? note "点击查看代码"
        ```cpp
        void build() {
            for (int i = 1; i <= n; ++i) {
                sum[i] += a[i];
                int j = i + (i & -i);
                if (j <= n)
                    sum[j] += sum[i];
            }
        }
        ```

    这样是 241 ms（<https://loj.ac/s/2128373>），很快的。

=== "方法二"
    根据树状数组每个节点记录的区间，前缀和处理。

    ??? note "点击查看代码"
        ```cpp
        ll pre[N], sum[N];

        void build() {
            for (int i = 1; i <= n; ++i) pre[i] = pre[i - 1] + a[i];
            for (int i = 1; i <= n; ++i) sum[i] = pre[i] - pre[i - (i & -i)];
        }
        ```

    跑了 245 ms（<https://loj.ac/s/2128375>）。

### Version #7：缓存优化

理论见 [HPC Fenwick Trees](https://en.algorithmica.org/hpc/data-structures/segment-trees/#fenwick-trees)，因为我自己没研究懂。

在所有关于 `sum` 的操作上都加上 `hole(x)`：

??? note "点击查看代码"
    ```cpp
    inline constexpr int hole(int k) {
        return k + (k >> 10);
    }

    void build() {
        for (int i = 1; i <= n; ++i) pre[i] = pre[i - 1] + a[i];
        for (int i = 1; i <= n; ++i) sum[hole(i)] = pre[i] - pre[i - (i & -i)];
    }

    void modify(int x, int v) {
        for (; x <= n; x += x & -x)
            sum[hole(x)] += v;
    }

    ll query(int x) {
        ll r = 0;
        for (; x; x &= x - 1)
            r += sum[hole(x)];
        return r;
    }
    ```

这样能快不少，234 ms（<https://loj.ac/s/2128379>）。

WTree 不会。

## Reference

<https://en.algorithmica.org/hpc/data-structures/segment-trees/>