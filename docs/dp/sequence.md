# 序列 DP

序列 DP 可以说时最常见的 DP 模型。

可以将在序列上 DP 的，都称为序列 DP，例如线性 DP 和区间 DP。

## 线性 DP

### 概念

线性 DP 有很多维度，大部分都是一维的。

即用 $f(i,\dots)$ 表示考虑序列的 $i$ 个元素，满足 $\dots$ 限制的答案。

也有二维的，用 $f(i,j,\dots)$ 表示两个序列前 $i,j$ 个元素的答案。

### 经典模型

#### 最长上升子序列

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

#### 最长公共子序列

设 $f(i,j)$ 表示 $A[1,i]$ 和 $B[1,j]$ 的 LCS。

有，

$$
f(i,j)=\begin{cases}
f(i-1,j-1)&A_i=B_j\\
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

#### 编辑距离

每次操作可以删除、插入、修改一个字符，

定义字符串 $A,B$ 的编辑距离为最少的操作次数，使 $A$ 变成 $B$ 字符串。

设 $f(i,j)$ 表示 $A[1,i]$ 和 $B[1,j]$ 的编辑距离，那么有转移方程，

$$
f(i,j)=\min\{f(i-1,j)+1,f(i,j-1)+1,f(i-1,j-1)+[A_i\neq B_j]\}
$$

直接转移就是 $\mathcal O(N^3)$ 的。

### 例题

#### P1002 [NOIP2002 普及组] 过河卒

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

#### P1216 [IOI1994] 数字三角形

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

#### P1020 [NOIP1999 提高组] 导弹拦截

第一个显然就是最长不上升子序列，令 $x\gets-x$ 跑 LIS 即可。

第二个也是经典东西：狄尔沃斯（Dilworth）定理，其指出：

有限偏序集合中，包含元素最多反链的元素数等于包含链数最少的链分解的链数。

这个量被定义为该偏序集的宽度；而在此题中：

将一个序列剖成若干个单调不升子序列的最小个数等于该序列最长上升子序列的长度。

跑两次 LIS 解决即可。

#### P1091 [NOIP2004 提高组] 合唱队形

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

#### P1095 [NOIP2007 普及组] 守望者的逃离

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

#### P1650 田忌赛马

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

#### P1541 [NOIP2010 提高组] 乌龟棋

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

#### P1868 饥饿的奶牛

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

#### P2285 [HNOI2004] 打鼹鼠

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

#### P4933 大师

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

## 区间 DP