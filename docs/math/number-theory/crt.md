# 中国剩余定理

## 理论

中国剩余定理（Chinese Remainder Theorem，CRT）

求解如下形式的一元线性同余方程组（其中 $m$ 两两互质）：

<center>$\left\{\begin{matrix}
x \equiv a_1 \pmod {m_1} \\
x \equiv a_2 \pmod {m_2} \\
  \dots \\
x \equiv a_k \pmod {m_k}
\end{matrix}\right.$</center>

### 过程

1.  计算所有模数的积 $M = \prod m_i$；
2.  对于第 $i$ 个方程：
    1.  计算：$M_i = \dfrac{M}{m_i}$；
    2.  计算：$v_i = {M_i}^{-1} \pmod{m_i}$（[乘法逆元](https://www.cnblogs.com/RainPPR/p/linear-congruence-equation-and-inverse.html#%E4%B9%98%E6%B3%95%E9%80%86%E5%85%83)）；
    3.  计算：$c_i = M_iv_i$。
3.  方程组在 $0 \sim M - 1$ 范围内的唯一解为：$x = \sum\limits_{i = 1}^k a_ic_i \pmod M$。

### 证明

证明对于任意 $i \in [1, k]$，有 $x\equiv a_i \pmod {m_i}$。

当 $i\neq j$ 时，$M_j$ 中乘进去了 $m_i$，所以有 $M_j \equiv 0 \pmod {m_i}$，

所以 $c_j \equiv M_j \equiv 0 \pmod {m_i}$。

又有 $c_i \equiv M_i \cdot {M_i}^{-1} \pmod{m_i} \equiv 1 \pmod {m_i}$，所以我们有：

$$
\begin{array}{rll}
x &\equiv \sum\limits_{j=1}^k a_jc_j &\pmod {m_i} \\
  &\equiv a_ic_i &\pmod {m_i} \\
  &\equiv a_i &\pmod {m_i}
\end{array}
$$

即证明了解同余方程组的算法的正确性。

### 性质

1. 系数列表 $\{a_i\}$ 与解 $x$ 之间是一一映射关系，方程组总是有唯一解。  
	证明见：[https://oi-wiki.org/math/number-theory/crt/](https://oi-wiki.org/math/number-theory/crt/#%E8%AF%81%E6%98%8E "https://oi-wiki.org/math/number-theory/crt/")

2. 设模 $M$ 意义下的一个特解是 $x_0$，则通解为：$x = x_0 + kM$，其中 $k \in \mathbb N$.

## 实现

### 代码

题目：[P1495 中国剩余定理](https://www.luogu.com.cn/problem/P1495 "P1495 中国剩余定理")

<details>
<summary>点击查看代码</summary>

```cpp
const int N = 10;

ll exgcd(ll a, ll b, ll &x, ll &y, ll d = 0)
{
    if (b == 0)
        x = 1, y = 0, d = a;
    else
        d = exgcd(b, a % b, y, x), y -= a / b * x;
    return d;
}

ll inv(ll a, const ll m, ll x = 0, ll y = 0)
{
    exgcd(a, m, x, y);
    return (x % m + m) % m;
}

int a[N], m[N];

int main()
{
    int n = rr;

    ll mul = 1;
    for (int i = 1; i <= n; ++i)
        m[i] = rr, a[i] = rr, mul *= m[i];

    ll x = 0;
    for (int i = 1; i <= n; ++i)
    {
        ll t = mul / m[i], c = inv(t, m[i]);
        x = (x + a[i] * t % mul * c % mul) % mul;
    }

    printf("%lld\n", x);
    return 0;
}
```
</details>

### 应用

#### CRT 合并

若要求一个大数 $r \bmod m$ 的结果 $x$，即求解关于 $x$ 的线性同余方程 $x \equiv r \pmod m$；

则可以将模数分解为 $m = \sum\limits_{i = 1}^k p_i$（即质因数分解，$p$ 两两互质）；

然后去求解 $x$ 在模各个 $p_i$ 意义下的结果，最后用 CRT 合并；则求出来的答案一定是一一对应的。

即将 $x \equiv r \pmod m$ 转换为一个线性同余方程组：

$$
\left\{\begin{array}{c}
x \equiv r \pmod {m_1} \\
x \equiv r \pmod {m_2} \\
  \dots \\
x \equiv r \pmod {m_k}
\end{array}\right.
$$

例题：[P2480 古代猪文](https://www.luogu.com.cn/problem/P2480 "P2480 古代猪文")。

题面略...

求 $\dbinom{n}{m} \bmod 999911658$，即求 $x \equiv \dbinom{n}{m} \pmod{999911658}$.

根据上方的描述，因为 $999911658 = 2 \times 3 \times 4679 \times 35617$，原方程转化为：

$$\left\{\begin{align}
x &\equiv \dbinom{n}{m} \pmod {2} \\
x &\equiv \dbinom{n}{m} \pmod {3} \\
x &\equiv \dbinom{n}{m} \pmod {4679} \\
x &\equiv \dbinom{n}{m} \pmod {35617}
\end{align}\right.$$

使用 CRT 合并即可.

<details>
<summary>点击查看核心代码</summary>

```cpp
// ...
const int N = 35620;

const ll MOD1 = 999911659;
const ll MOD2 = 999911658;

const ll m[4] = {2, 3, 4679, 35617};
const ll r[4] = {499955829, 333303886, 289138806, 877424796};	// 即 c[i]

// ...
int main()
{
    int n = rr, g = rr;
    if (g % MOD1 == 0)
        printf("0\n"), exit(0);

    // 分解质因数至 dv 数组...
    ll x = 0;
    for (int i = 0; i < 4; ++i)
    {
        MOD = m[i];

        // 预处理模 MOD 意义下的逆元...
        for (int j : dv)
            x = (x + lucas(n, j) * r[i] % MOD2) % MOD2;
    }

    ll r = qpow(g, x, MOD1);
    printf("%lld\n", r);
    return 0;
}
```
</details>

## Reference

[1] <https://oi-wiki.org/math/number-theory/crt/>  
[2] <https://www.bilibili.com/video/BV1AN4y1N7Su/>  
[3] <https://numbermatics.com/n/999911658/>
