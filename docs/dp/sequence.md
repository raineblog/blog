# 线性 DP

## 概念

序列 DP 可以说时最常见的 DP 模型。

可以将在序列上 DP 的，都称为序列 DP，例如线性 DP 和区间 DP。

线性 DP 有很多维度，大部分都是一维的。

即用 $f(i,\dots)$ 表示考虑序列的 $i$ 个元素，满足 $\dots$ 限制的答案。

也有二维的，用 $f(i,j,\dots)$ 表示两个序列前 $i,j$ 个元素的答案。

## 序列模型

### 经典例题

#### [B3637 最长上升子序列](https://www.luogu.com.cn/problem/B3637)

设 $f(i)$ 表示以 $A(i)$ 结尾的最长上升子序列 LIS 长度，考虑转移。

$$
f(i)=\max_{j<i}\{[f(j)+1][A_j<A_i]\}
$$

即找到上一个元素，接在这个以后的最大的长度。

直接转移，时间复杂度是 $\mathcal O(N^2)$ 的，

??? note "点击查看代码"
    ```cpp
    int Ans = 0;
    for (int i = 1; i <= n; ++i) {
        F[i] = 1;
        for (int j = 1; j < i; ++j)
            if (A[j] < A[i])
                F[i] = max(F[i], F[j] + 1);
        Ans = max(Ans, F[i]);
    }
    ```

考虑优化。

显然我们可以对值域建立数据结构，但是这样很复杂。

注意到一个数字会导致答案增加，一定是它大于了前面的某一个数。

否则，那么这个数的贡献就是对于后面比它大的数可以加上这一个。

因此，我们考虑维护，

+ 如果这个数大于前面所有的，那么加入数列末尾。

+ 否则用这个数替换大于等于它的第一个，表示后面可以用。

??? note "点击查看代码"
    ```cpp
    memset(F, 0x3f, sizeof F);
    for (int i = 1; i <= n; ++i)
        *lower_bound(F + 1, F + n + 1, A[i]) = A[i];
    int Ans = 0;
    while (F[Ans + 1] != 0x3f3f3f3f)
        ++Ans;
    ```

使用二分查找，时间复杂度是 $\mathcal O(N\log N)$ 的。

#### [P1439 最长公共子序列](https://www.luogu.com.cn/problem/P1439)

设 $f(i,j)$ 表示 $A[1,i]$ 和 $B[1,j]$ 的 LCS。

有，

$$
f(i,j)=\begin{cases}
f(i-1,j-1)+1&A_i=B_j\\
\max\{f(i,j-1),f(i-1,j)\}&A_i\neq B_j
\end{cases}
$$

时间复杂度为 $\mathcal O(N^2)$ 的，可以优化到 $1/\omega$ 但是不存在更优。

??? note "点击查看代码"
    ```cpp
    for (int i = 1; i <= n; ++i)
        for (int j = 1; j <= m; ++j)
            if (a[i] == b[j])
                f[i][j] = f[i - 1][j - 1] + 1;
            else
                f[i][j] = max(f[i - 1][j], f[i][j - 1]);
    ```

三串 LCS：设 $F(i,j,k)$ 表示 $A[1,i],B[1,j],C[1,k]$ 的 LCS，转移分讨即可。

??? note "点击查看代码"
    ```cpp
    int F[N][N][N];

    int Main(string A, string B, string C) {
        for (int i = 1; i <= A.size(); ++i) {
            char a = A[i - 1];
            for (int j = 1; j <= B.size(); ++j) {
                int b = B[j - 1];
                for (int k = 1; k <= C.size(); ++k) {
                    char c = C[k - 1];
                    F[i][j][k] = max({F[i][j][k - 1], F[i][j - 1][k], F[i - 1][j][k]});
                    if (a == b && b == c)
                        F[i][j][k] = max(F[i][j][k], F[i - 1][j - 1][k - 1] + 1);
                }
            }
        }
        return F[A.size()][B.size()][C.size()];
    }
    ```

如果 $A,B$ 是排列，那么存在更优的做法。

我们令 $C$ 为 $A_i$ 在 $B$ 中的出现位置，那么 LCS 一定是 $C$ 的 LIS。

那么就可以 $\mathcal O(N\log N)$ 做了。

??? note "点击查看代码"
    ```cpp
    for (int i = 1; i <= n; ++i)
        P[B[i]] = i;
    memset(F, 0x3f, sizeof F);
    for (int i = 1; i <= n; ++i)
        *upper_bound(F + 1, F + n + 1, P[A[i]][i]) = P[A[i]][i];
    int Ans = 0;
    while (F[Ans + 1] != 0x3f3f3f3f)
        ++Ans;
    ```

#### [P2758 编辑距离](https://www.luogu.com.cn/problem/P2758)

每次操作可以删除、插入、修改一个字符，

定义字符串 $A,B$ 的编辑距离为最少的操作次数，使 $A$ 变成 $B$ 字符串。

设 $f(i,j)$ 表示 $A[1,i]$ 和 $B[1,j]$ 的编辑距离，那么有转移方程，

$$
f(i,j)=\min\{f(i-1,j)+1,f(i,j-1)+1,f(i-1,j-1)+[A_i\neq B_j]\}
$$

直接转移就是 $\mathcal O(N^3)$ 的。

#### [P1115 最大子段和](https://www.luogu.com.cn/problem/P1115)

设 $F(x)$ 表示以 $x$ 结尾的最大字段和，设 $S(x)$ 表示原数组的前缀和。

思路一：

$$
F(x)=\max_{y<x}\{S(x)-S(y)\}=S(x)-\min_{y<x}S(y)
$$

注意到维护前缀最小值即可。

思路二：

$$
F(x)=\max\{A(x),F(x)-1+A(x)\}=A(x)+\max\{F(x-1),0\}
$$

一个元素只可能加入前面的或者自己单独。

??? note "点击查看代码"
    ```cpp
    int F[N];

    int MSS(int *A, int n, function<int(int, int)> cmp) {
        for (int i = 1; i <= n; ++i)
            F[i] = cmp(F[i - 1], 0ll) + A[i];
        int Ans = F[1];
        for (int i = 2; i <= n; ++i)
            Ans = cmp(Ans, F[i]);
        return Ans;
    }
    ```

### 其他例题

#### [51Nod-1050 环状最大子段和](https://vjudge.net/problem/51Nod-1050)

容易发现，环形只是在序列的基础上加了一种情况：跨过某个端点到了另一边。

因此，我们将最大字段和转化为，序列的总和减去一个最小字段和（作为不选的一段）。

注意到这样有可能将整个序列删去，因此只需要用 $[1,n),(1,n]$ 的最小值即可。

??? note "点击查看代码"
    ```cpp
    // 上文的 MSS 函数

    int n, Sum, A[N];

    void Main() {
        cin >> n, Sum = 0;
        if (n == 1) {
            int x;
            cin >> x;
            cout << x << endl;
            return;
        }
        for (int i = 1; i <= n; ++i)
            cin >> A[i], Sum += A[i];
        auto Max = [] (int a, int b) {
            return max(a, b);
        };
        auto Min = [] (int a, int b) {
            return min(a, b);
        };
        int Ans = MSS(A, n, Max);
        Ans = max(Ans, Sum - MSS(A, n - 1, Min));
        Ans = max(Ans, Sum - MSS(A + 1, n - 1, Min));
        cout << Ans << endl;
    }
    ```

同时也可以断环成链，转化为长度限制的最大字段和问题。

#### [P2642 最大双子段和](https://www.luogu.com.cn/problem/P2642)

注意到一定存在一个分割点，将两个段分开，因此考虑枚举这个位置。

我们预处理出来，一个位置之前、之后分别的最大字段和，加起来即可。

??? note "点击查看代码"
    ```cpp
    int n, A[N];

    void init_MSS(int *F) {
        F[0] = -1e9;
        for (int i = 1; i <= n; ++i)
            F[i] = max(F[i - 1], 0ll) + A[i];
        for (int i = 1; i <= n; ++i)
            F[i] = max(F[i - 1], F[i]);
    }

    void init_rMSS(int *F) {
        F[n + 1] = -1e9;
        for (int i = n; i >= 1; --i)
            F[i] = max(F[i + 1], 0ll) + A[i];
        for (int i = n; i >= 1; --i)
            F[i] = max(F[i + 1], F[i]);
    }

    int F[N], G[N];

    void Main() {
        cin >> n;
        copy_n(istream_iterator<int>(cin), n, A + 1);
        init_MSS(F), init_rMSS(G);
        int Ans = -1e9;
        for (int i = 2; i < n; ++i)
            Ans = max(Ans, F[i - 1] + G[i + 1]);
        cout << Ans << endl;
    }
    ```

注意此时这道题要求序列两边非空。

#### [P1121 环状最大双子段和](https://www.luogu.com.cn/problem/P1121)

容易推广，我们跑一次最大双字段和，两次最小双字段和即可。

??? note "点击查看代码"
    ```cpp
    template<int emp>
    int calc(int n, int *A, function<int(int, int)> cmp) {
        static int F[N], G[N];
        F[0] = G[n + 1] = emp;
        int Ans = emp;
        for (int i = 1; i <= n; ++i)
            F[i] = cmp(F[i - 1], 0) + A[i];
        for (int i = 1; i <= n; ++i)
            F[i] = cmp(F[i], F[i - 1]);
        for (int i = n; i >= 1; --i)
            G[i] = cmp(G[i + 1], 0) + A[i];
        for (int i = n; i >= 1; --i)
            G[i] = cmp(G[i], G[i + 1]);
        for (int i = 2; i < n; ++i)
            Ans = cmp(Ans, F[i - 1] + G[i + 1]);
        return Ans;
    }

    int n, Sum, A[N];

    void Main() {
        cin >> n, Sum = 0;
        for (int i = 1; i <= n; ++i)
            cin >> A[i], Sum += A[i];
        auto Max = [] (int a, int b) {
            return max(a, b);
        };
        auto Min = [] (int a, int b) {
            return min(a, b);
        };
        int Ans = calc < (int) -1e9 > (n, A, Max);
        Ans = max(Ans, Sum - calc < 0 > (n - 1, A, Min));
        Ans = max(Ans, Sum - calc < 0 > (n - 1, A + 1, Min));
        cout << Ans << endl;
    }
    ```

需要注意每个题可能会是否可以相邻、是否可以为空做出要求，不过很好改。

#### [CSES-1644 有长度限制](https://vjudge.net/problem/CSES-1644)

我们要求长度在区间 $[L,R]$ 内的最大字段和。

具体内容见单调队列优化 DP 文章。

#### [P1020 [NOIP1999 提高组] 导弹拦截](https://www.luogu.com.cn/problem/P1020)

第一个显然就是最长不上升子序列，令 $x\gets-x$ 跑 LIS 即可。

第二个也是经典东西：狄尔沃斯（Dilworth）定理，其指出：

有限偏序集合中，包含元素最多反链的元素数等于包含链数最少的链分解的链数。

这个量被定义为该偏序集的宽度；而在此题中：

将一个序列剖成若干个单调不升子序列的最小个数等于该序列最长上升子序列的长度。

跑两次 LIS 解决即可。

#### [P1091 [NOIP2004 提高组] 合唱队形](https://www.luogu.com.cn/problem/P1091)

我们发现就是正反两次 LIS 即可。

但是这道题要记录以 $i$ 结尾的 LIS，也直接记录即可。

??? note "点击查看代码"
    ```cpp
    void Main() {
        cin >> n;
        for (int i = 1; i <= n; ++i)
            cin >> A[i];
        memset(F, 0x3f, sizeof F);
        memset(G, 0x3f, sizeof G);
        for (int i = 1; i <= n; ++i) {
            int j = lower_bound(F + 1, F + n + 1, A[i]) - F;
            P[i] = j, F[j] = A[i];
        }
        for (int i = n; i >= 1; --i) {
            int j = lower_bound(G + 1, G + n + 1, A[i]) - G;
            Q[i] = j, G[j] = A[i];
        }
        int ans = 0;
        for (int i = 1; i <= n; ++i)
            ans = max(ans, P[i] + Q[i] - 1);
        cout << n - ans << endl;
    }
    ```

#### [P8020 [ONTAK2015] Badania naukowe](https://www.luogu.com.cn/problem/P8020)

有意思的题，完整版看我题解：<https://www.luogu.com.cn/article/6n2rn1mf>。

我们使用 $P(i)$ 表示从 $A_i$ 开始匹配 $C$，到最后一个字符的下标 $j$。

同理，使用 $Q(i)$ 表示从 $B_i$ 开始匹配 $C$，最后一个字符的下标 $j$。

设 $F(i,j)$ 表示 $A[1,i]$ 和 $B[1,j]$ 的 LCS（最长公共子序列）。

设 $G(i,j)$ 表示 $A[i,n]$ 和 $B[j,m]$ 的 LCS（最长公共子序列）。

那么，答案可以表示为，

$$
\max_{i,j}\{
F(i-1,j-1)+G(P(i)+1,Q(j)+1)+\lvert C\rvert,
\text{if $\langle i,j\rangle$ is valid.}
\}
$$

也就是前面的和后面的 LCS 可以直接计入答案，再加上子串 $C$ 的长度。

??? note "点击查看代码"
    ```cpp
    constexpr int N = 3e3 + 10;

    void init_matching(int n, int *A, int k, int *C, int *P) {
        for (int i = 1; i + k - 1 <= n; ++i) {
            int p = i, q = 1;
            while (p <= n && q <= k) {
                q += (A[p] == C[q]);
                ++p;
            }
            P[i] = (q > k) ? p - 1 : 0;
        }
    }

    int n, A[N], P[N];
    int m, B[N], Q[N];
    int k, C[N];
    int F[N][N], G[N][N];

    void init_LCS() {
        for (int i = 1; i <= n; ++i)
            for (int j = 1; j <= m; ++j)
                if (A[i] == B[j])
                    F[i][j] = F[i - 1][j - 1] + 1;
                else
                    F[i][j] = max(F[i][j - 1], F[i - 1][j]);
    }

    void init_rLCS() {
        for (int i = n; i >= 1; --i)
            for (int j = m; j >= 1; --j)
                if (A[i] == B[j])
                    G[i][j] = G[i + 1][j + 1] + 1;
                else
                    G[i][j] = max(G[i][j + 1], G[i + 1][j]);
    }

    int get_ans() {
        int Ans = -1;
        for (int i = 1; i + k - 1 <= n; ++i)
            for (int j = 1; j + k - 1 <= m; ++j)
                if (P[i] && Q[j])
                    Ans = max(Ans, F[i - 1][j - 1] + G[P[i] + 1][Q[j] + 1] + k);
        return Ans;
    }

    void Main() {
        cin >> n;
        copy_n(istream_iterator<int>(cin), n, A + 1);
        cin >> m;
        copy_n(istream_iterator<int>(cin), m, B + 1);
        cin >> k;
        copy_n(istream_iterator<int>(cin), k, C + 1);
        init_matching(n, A, k, C, P);
        init_matching(m, B, k, C, Q);
        init_LCS(), init_rLCS();
        cout << get_ans() << endl;
    }
    ```

## 路径模型

### 一维模型

#### [P1541 [NOIP2010 提高组] 乌龟棋](https://www.luogu.com.cn/problem/P1541)

看题解区第一篇的思路，是很简单的，但是我们使用记忆化搜索可以更简单的做。

设，

$$
F(x,a_1,a_2,a_3,a_4)
$$

表示走到 $x$ 位置，剩余 $a_k$ 张走 $k$ 的卡片（$1\le k\le4$）的最大得分。

首先这么做空间都不够，但是我们是记忆化搜索！

我们知道一个确定的状态 $(a_1,a_2,a_3,a_4)$ 一定对应着一个唯一的 $x$。

也就是说第一维度其实在 $k^4$ 的空间中只有一个是有效的，我们直接令数组表示这个即可。

??? note "点击查看代码"
    ```cpp
    int n, m;

    int A[400], mem[40][40][40][40];

    int dfs(int x, int a, int b, int c, int d) {
        if (a < 0 || b < 0 || c < 0 || d < 0)
            return -1e9;
        if (x > n)
            return -1e9;
        if (x == n)
            return A[n];
        if (mem[a][b][c][d] != -1)
            return mem[a][b][c][d];
        return mem[a][b][c][d] = max({
            mem[a][b][c][d],
            dfs(x + 1, a - 1, b, c, d),
            dfs(x + 2, a, b - 1, c, d),
            dfs(x + 3, a, b, c - 1, d),
            dfs(x + 4, a, b, c, d - 1)
        }) + A[x];
    }

    void Main() {
        cin >> n >> m;
        for (int i = 1; i <= n; ++i)
            cin >> A[i];
        int C[5] = {0};
        for (int i = 1; i <= m; ++i) {
            int x;
            cin >> x;
            ++C[x];
        }
        memset(mem, -1, sizeof mem);
        cout << dfs(1, C[1], C[2], C[3], C[4]) << endl;
    }
    ```

#### [P2285 [HNOI2004] 打鼹鼠](https://www.luogu.com.cn/problem/P2285)

简单题，设 $F(i)$ 表示达到第 $i$ 个，钦定 $i$ 必须打的最大个数。

注意到我们一定是从一个移到另一个，打完再继续移动，因此这么设计是正确的。

考虑转移，

$$
F(i)=\max\{F(j)+1,\operatorname{if}j\to i\text{ is valid.}\}
$$

直接做是 $\mathcal O(N^2)$ 的，但是似乎可以过。

??? note "点击查看代码"
    ```cpp
    int n, m;

    struct node {
        int t, x, y;
    } a[N];

    int F[N];

    int dis(int i, int j) {
        return abs(a[i].x - a[j].x) + abs(a[i].y - a[j].y);
    }

    bool check(int j, int i) {
        return dis(i, j) <= abs(a[i].t - a[j].t);
    }

    void Main() {
        cin >> n >> m;
        for (int i = 1; i <= m; ++i)
            cin >> a[i].t >> a[i].x >> a[i].y;
        for (int i = 1; i <= m; ++i) {
            F[i] = 1;
            for (int j = 1; j < i; ++j)
                if (check(j, i))
                    F[i] = max(F[i], F[j] + 1);
        }
        int ans = F[1];
        for (int i = 2; i <= m; ++i)
            ans = max(ans, F[i]);
        cout << ans << endl;
    }
    ```

#### [P4933 大师](https://www.luogu.com.cn/problem/P4933)

好题。

设 $F(i,v)$ 表示以 $i$ 结尾长度至少为 $2$ 的公差为 $v$ 的等差数列个数。

那么，虽然 $v$ 最大可能是 $2\times10^4$ 级别的，但是最多只有 $\mathcal O(N)$ 个是有效的。

因此，我们对于每个 $i$ 枚举前一个 $j$，进行转移：

$$
F(i,v)=\sum_{j<i}(F(j,v)+1),\text{if $A_i-A_j=v$}.
$$

那么，答案就是，

$$
\text{Ans}=n+\sum_{i=1}^n\sum_vF(i,v)
$$

这么做时间复杂度是 $\mathcal O(n^2)$ 的，可以使用 `std::unordered_map` 达到这个复杂度。

??? note "点击查看代码"
    ```cpp
    int n, A[N];

    ll S[N];

    unordered_map<int, ll> F[N];

    void Main() {
        cin >> n;
        copy_n(istream_iterator<int>(cin), n, A + 1);
        for (int i = 1; i <= n; ++i)
            for (int j = 1; j < i; ++j)
                F[i][A[i] - A[j]] = (F[i][A[i] - A[j]] + F[j][A[i] - A[j]] + 1) % MOD;
        ll ans = n;
        for (int i = 1; i <= n; ++i)
            for (auto t : F[i])
                ans = (ans + t.second) % MOD;
        cout << ans << endl;
    }
    ```

#### [P2340 [USACO03FALL] Cow Exhibition G](https://www.luogu.com.cn/problem/P2340)

考虑经典状态设计，设 $F(i,x)$ 表示前 $i$ 头牛，智商为 $x$ 时的最大情商。

转移直接转移即可，可以使用 `unordered_map` 更方便的实现，那么就是，

设 $F(i)$ 表示前 $i$ 头牛的决策集合，一个二元组第一维为智商，第二维为对于的最大情商。

??? note "点击查看代码"
    ```cpp
    int n, A[N], B[N];
    unordered_map<int, int> F[N];

    void update(int i, int x, int y) {
        if (F[i].count(x))
            F[i][x] = max(F[i][x], y);
        else
            F[i][x] = y;
    }

    void Main() {
        cin >> n;
        for (int i = 1; i <= n; ++i)
            cin >> A[i] >> B[i];
        update(1, 0, 0);
        for (int i = 1; i <= n; ++i) {
            for (auto t : F[i]) {
                update(i + 1, t.first + A[i], t.second + B[i]);
                update(i + 1, t.first, t.second);
            }
        }
        int Ans = -1e9;
        for (auto t : F[n + 1])
            if (t.first >= 0 && t.second >= 0)
                Ans = max(Ans, t.first + t.second);
        cout << Ans << endl;
    }
    ```

#### [P4310 绝世好题](https://www.luogu.com.cn/problem/P4310)

注意到只需要相邻与不为零，那么容易想到，

设 $F(i)$ 表示以 $i$ 结尾的最大长度，转移，

$$
F(i)=\max\{F(j)+1,\text{if $(A_i$ bitand $B_j)\neq0$}\}
$$

超时了，我们考虑拆位，注意到一个数会联通所有其中 $1$ 的位。

那么我们只需要把这个数的所有位统一考虑即可，即用这个数更新所有的联通的位的答案。

??? note "点击查看代码"
    ```cpp
    int n, A[N], F[40];

    void Main() {
        int n;
        cin >> n;
        int ans = 1;
        for (int i = 1; i <= n; ++i) {
            int x;
            cin >> x;
            for (int k = 0; k < 40; ++k)
                if ((x >> k) & 1)
                    ans = max(ans, ++F[k]);
            for (int k = 0; k < 40; ++k)
                if ((x >> k) & 1)
                    F[k] = max(F[k], ans);
        }
        cout << ans << endl;
    }
    ```

#### [P1854 花店橱窗布置](https://www.luogu.com.cn/problem/P1854)

题面复杂实际简单。

设 $F(i,j)$ 表示前 $i$ 支花插在前 $j$ 个花瓶中，其中钦定第 $i$ 支花放在 $j$ 花瓶中的最大得分。

考虑转移，枚举第 $i-1$ 支花插在哪里即可，

$$
F(i,j)=A(i,j)+\max_{k<j}\{F(i-1,k\}
$$

复杂度是 $\mathcal O(N^3)$ 的，可以接受。

注意到要记录方案，那么设 $G(i,j)$ 表示 $F(i,j)$ 是从哪个 $k$ 转移来的，直接倒序记录即可。

??? note "点击查看代码"
    ```cpp
    int n, m;

    int A[N][N];
    int F[N][N], G[N][N];

    void Main() {
        cin >> n >> m;
        for (int i = 1; i <= n; ++i)
            for (int j = 1; j <= m; ++j)
                cin >> A[i][j];
        memset(F, -0x3f, sizeof F);
        F[0][0] = 0;
        for (int i = 1; i <= n; ++i)
            for (int j = 1; j <= m; ++j)
                for (int k = 0; k < j; ++k)
                    if (F[i - 1][k] + A[i][j] > F[i][j])
                        F[i][j] = F[i - 1][k] + A[i][j], G[i][j] = k;
        int Ans = -1e9, Pos = 0;
        for (int i = 1; i <= m; ++i)
            if (F[n][i] > Ans)
                Ans = F[n][i], Pos = i;
        cout << Ans << endl;
        vector<int> Res;
        for (int i = n; i >= 1; --i) {
            Res.push_back(Pos);
            Pos = G[i][Pos];
        }
        for (auto it = Res.rbegin(); it != Res.rend(); ++it)
            cout << *it << " ";
        cout << endl;
    }
    ```

### 二维模型

#### [P1216 [IOI1994] 数字三角形](https://www.luogu.com.cn/problem/P1216)

设 $F(i,j)$ 表示走到第 $i$ 行第 $j$ 列的最大价值。

$$
F(i,j)=A(i,j)+\max\{F(i-1,j),F(i-1,j-1)\}
$$

表示从上一行的这一个、上一个转移。

??? note "点击查看代码"
    ```cpp
    dp[0][0] = 0;
    for (int i = 1; i <= n; ++i)
        for (int j = 1; j <= i; ++j)
            dp[i][j] = a[i][j] + max(dp[i - 1][j], dp[i - 1][j - 1]);
    int ans = -1;
    for (int i = 1; i <= n; ++i)
        ans = max(ans, dp[n][i]);
    ```

#### [P1002 [NOIP2002 普及组] 过河卒](https://www.luogu.com.cn/problem/P1002)

经典的地图上 DP 的问题。

设 $F(x,y)$ 表示到 $(x,y)$ 的方案数，那么显然，

$$
F(x,y)=\begin{cases}
0&\text{if $x,y$ is not valid}\\
1&\text{if $x=1$ or $y=1$}\\
F(x-1,y)+F(x,y-1)&\text{otherwise.}
\end{cases}
$$

时间复杂度是 $\mathcal O(N^2)$ 的，注意开 `long long`。

#### [P1004 [NOIP2000 提高组] 方格取数](https://www.luogu.com.cn/problem/P1004)

经典双进程 DP 思路，首先容易想到四方 DP 的思路。

设 $F(x_1,y_1,x_2,y_2)$ 表示第一、二个进程分别走到的位置，最大得分。

每次转移一起走一个即可。

??? note "点击查看代码"
    ```cpp

    int n;

    int A[11][11];
    int F[11][11][11][11];

    int w(int x1, int y1, int x2, int y2) {
        if (x1 == x2 and y1 == y2)
            return A[x1][y1];
        return A[x1][y1] + A[x2][y2];
    }

    void Main() {
        cin >> n;
        int x, y, t;
        while (cin >> x >> y >> t)
            A[x][y] = t;
        for (int x1 = 1; x1 <= n; ++x1)
            for (int y1 = 1; y1 <= n; ++y1)
                for (int x2 = 1; x2 <= n; ++x2)
                    for (int y2 = 1; y2 <= n; ++y2)
                        F[x1][y1][x2][y2] = max({
                        F[x1 - 1][y1][x2][y2 - 1],
                        F[x1 - 1][y1][x2 - 1][y2],
                        F[x1][y1 - 1][x2][y2 - 1],
                        F[x1][y1 - 1][x2 - 1][y2]
                    }) + w(x1, y1, x2, y2);
        cout << F[n][n][n][n] << endl;
    }
    ```

还可以优化到三方。

设 $F(k,x_1,x_2)$ 表示各自走了 $k$ 步，分别到了两个行数的最大得分。

转移也是直接一起走一步即可，代码略。

#### [P1006 [NOIP2008 提高组] 传纸条](https://www.luogu.com.cn/problem/P1006)

和上一题类似，但是要求路径不交。

我们令 $F(i,j,k,l)$ 表示两个人的位置，并钦定 $(i,j)$ 靠左下、$(k,l)$ 靠右上。

那么路径不交的充要条件就是始终 $l>j$，这是显然的。

那么直接转移即可。

??? note "点击查看代码"
    ```cpp
    int n, m;
    int A[N][N];
    int F[N][N][N][N];

    void Main() {
        cin >> n >> m;
        for (int i = 1; i <= n; ++i)
            for (int j = 1; j <= m; ++j)
                cin >> A[i][j];
        for (int i = 1; i <= n; ++i)
            for (int j = 1; j <= m; ++j)
                for (int k = 1; k <= n; ++k)
                    for (int l = j + 1; l <= m; ++l)
                        F[i][j][k][l] = max({
                        F[i - 1][j][k][l - 1],
                        F[i - 1][j][k - 1][l],
                        F[i][j - 1][k][l - 1],
                        F[i][j - 1][k - 1][l]
                    }) + A[i][j] + A[k][l];
        cout << F[n][m - 1][n - 1][m] << endl;
    }
    ```

## 分组模型

### 合并模型

#### [P3147 [USACO16OPEN] 262144 P](https://www.luogu.com.cn/problem/P3147)

设 $F(i,x)$ 表示左端点为 $x$，最近可能在哪里合并出来 $i$。

转移显然，

$$
F(i,x)=F(i-1,F(i-1,x)+1)
$$

考虑初始状态，

$$
F(A_i,i)=i
$$

注意到合并出来的数字一定是递增的，那么直接转移即可。

??? note "点击查看代码"
    ```cpp
    void Main() {
        cin >> n;
        for (int i = 1; i <= n; ++i) {
            int x;
            cin >> x;
            F[x][i] = i;
        }
        int ans = 0;
        for (int i = 2; i < 60; ++i)
            for (int x = 1; x <= n; ++x) {
                if (!F[i][x] && F[i - 1][x])
                    F[i][x] = F[i - 1][F[i - 1][x] + 1];
                if (F[i][x])
                    ans = i;
            }
        cout << ans << endl;
    }
    ```

### 分割模型

#### [P1868 饥饿的奶牛](https://www.luogu.com.cn/problem/P1868)

这个也是经典转移思想的应用：

每次只考虑最后一次选的（类似 P9871 [NOIP2023] 天天爱打卡的方法）！

设 $F(x)$ 表示 $[1,x]$ 的答案，如何转移？

我们钦定选择区间 $[L,R]$ 其中 $R=x$，那么，

$$
F(x)=F(L-1)+(R-L+1)
$$

但是这样会从转移的间隙中漏掉答案，怎么办？

考虑每一时刻对 $F(x)$ 做前缀最大值，即把前面的答案加到这上面即可。

即，

$$
F(x)=\max_{j<L}F(j)+(R-L+1)
$$

暴力转移的复杂度是 $\mathcal O(N+V)$ 的，其中 $V=\max R$。

??? note "点击查看代码"
    ```cpp
    int n;

    vector<int> g[N];

    int F[N];

    void Main() {
        cin >> n;
        int mx = 0;
        for (int i = 1; i <= n; ++i) {
            int x, y;
            cin >> x >> y;
            ++x, ++y;
            g[y].push_back(x);
            mx = max(mx, y);
        }
        int Ans = 0;
        for (int i = 1; i <= mx; ++i) {
            F[i] = F[i - 1];
            for (int j : g[i])
                F[i] = max(F[i], F[j - 1] + i - j + 1);
            Ans = max(Ans, F[i]);
        }
        cout << Ans << endl;
    }
    ```

考虑如果我们把 $R_i$ 放大到 $10^9$ 或者更大怎么做？

还是类似，天天爱打卡卡，不过是简化版。

注意到真正有用的状态只有 $F(L_i-1),F(R_i)$ 这大约 $2N$ 个。

那么我们类似离散化的，将所有的的这些有用的值处理，其他的直接复制前面的即可。

??? note "点击查看代码"
    ```cpp
    int n;

    int L[N], R[N];

    vector<int> g[2 * N];

    int F[2 * N];

    void Main() {
        cin >> n;
        int mx = 0;
        vector<int> S{-1};
        for (int i = 1; i <= n; ++i) {
            cin >> L[i] >> R[i];
            ++L[i], ++R[i];
            S.push_back(L[i] - 1);
            S.push_back(R[i]);
        }
        sort(S.begin(), S.end());
        S.erase(unique(S.begin(), S.end()), S.end());
    #define get_id(x) (lower_bound(S.begin(), S.end(), x) - S.begin())
        for (int i = 1; i <= n; ++i)
            g[get_id(R[i])].push_back(get_id(L[i] - 1));
        int Ans = 0;
        for (int i = 1; i < S.size(); ++i) {
            F[i] = F[i - 1];
            for (int j : g[i])
                F[i] = max(F[i], F[j] + S[i] - S[j]);
            Ans = max(Ans, F[i]);
        }
        cout << Ans << endl;
    }
    ```

#### [P1874 快速求和](https://www.luogu.com.cn/problem/P1874)

有一些有意思的技巧。

首先我们设 $S(i,j)$ 表示 $[i,j]$ 的数位组成的数字。

考虑这个东西如何计算，首先注意到我们要组成的数最大是 $10^5$，那么超过的都没意义。

因此，我们考虑取模（？）。

具体的，我们令 $S(i,j)$ 表示 $[i,j]$ 的数字模一个大数 $P$（比 $10^5$ 大即可）。

那么，我们只需要类似字符串哈希的，求出 $S(i)$ 表示前 $i$ 个数码的数字，然后，

$$
S(i,j)=S(j)-S(i-1)\times P^{j-i+1}
$$

即可，这是很有意思的。

然后考虑求解答案，设 $F(i,j)$ 表示考虑前 $i$ 个数位，组成 $j$ 的最小花费。

那么转移只需要枚举这个加号的位置即可，

$$
F(i,j)=\min_{k<i}\{F(k,j-S(k+1,i))+1\}
$$

直接转移即可，注意到还是 $S(k+1,i)>j$ 之后就没意义了。

因此反着枚举超过就 `break` 即可。

??? note "点击查看代码"
    ```cpp
    constexpr int MOD = 1e9 + 7;

    int n, tar;

    string str;

    int R[50], S[50];

    void init() {
        R[0] = 1, S[0] = 0;
        for (int i = 1; i <= n; ++i) {
            R[i] = R[i - 1] * 10ll % MOD;
            S[i] = (S[i - 1] * 10ll % MOD + str[i - 1] - '0') % MOD;
        }
    }

    int get(int l, int r) {
        return (S[r] - 1ll * S[l - 1] * R[r - l + 1] % MOD + MOD) % MOD;
    }

    int F[50][(int)1e5 + 10];

    void Main() {
        cin >> str >> tar;
        n = str.size(), init();
        memset(F, 0x3f, sizeof F);
        F[0][0] = -1;
        for (int i = 1; i <= n; ++i)
            for (int j = 1; j <= tar; ++j) {
                for (int k = i - 1; k >= 0; --k) {
                    int t = get(k + 1, i);
                    if (t > j)
                        break;
                    F[i][j] = min(F[i][j], F[k][j - t] + 1);
                }
            }
        int Ans = F[n][tar];
        if (Ans + 1 >= 0x3f3f3f3f)
            Ans = -1;
        cout << Ans << endl;
    }
    ```

## 其他例题

### 简单题

#### [P1095 [NOIP2007 普及组] 守望者的逃离](https://www.luogu.com.cn/problem/P1095)

注意到，如果我们一直使用魔法、等着恢复的话，平均的每秒移动是不优于直接走的。

因此，答案一定可以表示为，花光魔法，然后等一定时间后一直走到终点的路径。

??? note "点击查看代码"
    ```cpp
    void Main() {
        cin >> M >> S >> T;
        for (int i = 1; i <= T; ++i) {
            if (M >= 10)
                F[i] = F[i - 1] + 60, M -= 10;
            else
                F[i] = F[i - 1], M += 4;
        }
        for (int i = 1; i <= T; ++i) {
            if (F[i] < F[i - 1] + 17)
                F[i] = F[i - 1] + 17;
            if (F[i] >= S) {
                cout << "Yes" << endl;
                cout << i << endl;
                return;
            }
        }
        cout << "No" << endl;
        cout << F[T] << endl;
    }
    ```

下面的 `F[i] < F[i - 1] + 17` 一定会从某一个点开始一直执行，因此正确性是显然的。

#### [P1650 田忌赛马](https://www.luogu.com.cn/problem/P1650)

注意到田忌出马，一定是最强的几个加上最弱的几个。

其中强的用于获胜得分，弱的用于摸鱼混轮数让强的得分。

因此，我们考虑 DP，令 $F(i,j)$ 表示：

进行了 $i$ 轮，田忌从强的出了 $j$ 个的最大分数。

考虑第 $i$ 个田忌出什么，讨论即可，转移：

$$
F(i,j)=\max\{F(i-1,j)+w(i,n-(i-j)+1),F(i-1,j-1)+w(i,j)\}
$$

其中 $w(i,j)$ 表示齐王的第 $i$ 匹马对田忌的第 $j$ 匹马的得分。

直接转移即可，时间复杂度 $\mathcal O(N^2)$。

??? note "点击查看代码"
    ```cpp
    void Main() {
        cin >> n;
        for (int i = 1; i <= n; ++i)
            cin >> A[i];
        for (int i = 1; i <= n; ++i)
            cin >> B[i];
        sort(A + 1, A + n + 1);
        sort(B + 1, B + n + 1);
        for (int i = 1; i <= n; ++i) {
            F[i][0] = F[i - 1][0] + G(i, n - i + 1);
            F[i][i] = F[i - 1][i - 1] + G(i, i);
            for (int j = 1; j < i; ++j)
                F[i][j] = max(F[i - 1][j] + G(i, n - (i - j) + 1), F[i - 1][j - 1] + G(i, j));
        }
        int Ans = -1e9;
        for (int i = 0; i <= n; ++i)
            Ans = max(Ans, F[n][i]);
        cout << Ans << endl;
    }
    ```

#### [P1435 [IOI2000] 回文字串](https://www.luogu.com.cn/problem/P1435)

这题也有区间 DP 做法。

注意到答案一定是字符串长度减去最长回文子串。

考虑如何求最长回文子串，容易想到是将字符串逆序后求 LCS 即可。

??? note "点击查看代码"
    ```cpp
    int F[1010][1010];

    // LCS: a.size() == b.size()
    int Main(string a, string b) {
        int n = a.size();
        memset(F, 0, sizeof F);
        for (int i = 1; i <= n; ++i)
            for (int j = 1; j <= n; ++j)
                if (a[i - 1] == b[j - 1])
                    F[i][j] = F[i - 1][j - 1] + 1;
                else
                    F[i][j] = max(F[i][j - 1], F[i - 1][j]);
        return F[n][n];
    }

    int Main(string a) {
        string b(a);
        reverse(begin(b), end(b));
        return a.size() - Main(a, b);
    }

    void Main() {
        string str;
        cin >> str;
        cout << Main(str) << endl;
    }
    ```

### 中档题

#### [P3558 [POI2013] BAJ-Bytecomputer](https://www.luogu.com.cn/problem/P3558)

首先注意到只需要单调不降，因此让序列出现 $-2,2$ 等一定不优。

因此考虑设 $F(i,-1/0/1)$ 表示考虑前 $i$ 个字符，

让第 $i$ 个变为 $-1/0/1$ 且前面单调不降的最小次数。

转移，若 $A_i=-1$，

$$
\begin{aligned}
F(i,-1)&=F(i-1,-1)\\
F(i,0)&=\inf\\
F(i,1)&=F(i-1,1)+2
\end{aligned}
$$

若 $A_i=0$，

$$
\begin{aligned}
F(i,-1)&=F(i-1,-1)+1\\
F(i,0)&=\min\{F(i-1,0),F(i-1,-1)\}\\
F(i,1)&=F(i-1,1)+1
\end{aligned}
$$

若 $A_i=1$，

$$
\begin{aligned}
F(i,-1)&=F(i-1,-1)+2\\
F(i,0)&=F(i-1,-1)+1\\
F(i,1)&=\min\{F(i-1,-1),F(i-1,0),F(i-1,1)\}
\end{aligned}
$$

这比较好理解，注意特判 $i=1$ 即可。

??? note "点击查看代码"
    ```cpp
    int n;

    struct node {
        int a[3];
        int &operator [](int x) {
            return a[x + 1];
        }
    } F[N];

    void Main() {
        cin >> n;
        F[1][-1] = 1e9;
        F[1][0] = 1e9;
        F[1][1] = 1e9;
        int x;
        cin >> x;
        F[1][x] = 0;
        for (int i = 2; i <= n; ++i) {
            cin >> x;
            if (x == -1) {
                F[i][-1] = F[i - 1][-1];
                F[i][0] = 1e9;
                F[i][1] = F[i - 1][1] + 2;
            }
            if (x == 0) {
                F[i][-1] = F[i - 1][-1] + 1;
                F[i][0] = min(F[i - 1][0], F[i - 1][-1]);
                F[i][1] = F[i - 1][1] + 1;
            }
            if (x == 1) {
                F[i][-1] = F[i - 1][-1] + 2;
                F[i][0] = F[i - 1][-1] + 1;
                F[i][1] = min({F[i - 1][-1], F[i - 1][0], F[i - 1][1]});
            }
        }
        int ans = min({F[n][-1], F[n][0], F[n][1]});
        if (ans >= 1e9) {
            puts("BRAK");
            return;
        }
        cout << ans << endl;
    }
    ```


