# 扩展中国剩余定理

## 理论

求解线性同余方程组

$$
\left\{\begin{matrix}
x \equiv a_1 \pmod {m_1} \\
x \equiv a_2 \pmod {m_2} \\
  \dots \\
x \equiv a_k \pmod {m_k}
\end{matrix}\right.
$$

但是模数 $m_i$ 不一定两两互质。

此时因为 $m_i$ 不一定与 $m_j$ 互质，故不一定存在乘法逆元，即无法使用中国剩余定理。

## 做法

### 公式变形

先考虑前两个方程：$x\equiv a_1 \pmod {m_1}$、$x\equiv a_2 \pmod {m_2}$.

将它们转化为不定方程：$x=m_1p+a_1=m_2q+a_2$，$p, q \in \mathbb Z$.

则有 $m_1p-m_2q=a_2-a_1$.

### 解的情况

由[裴蜀定理](https://www.cnblogs.com/RainPPR/p/gcd-bezouts-exgcd.html#%E8%A3%B4%E8%9C%80%E5%AE%9A%E7%90%86)：

+ 当 $\gcd(m_1,m_2) \nmid a_2-a_1$ 时，无解；

+ 当 $\gcd(m_1,m_2) \mid a_2-a_1$ 时，有解。

### 求解不定方程

现在考虑如何使用[扩展欧几里得算法](https://www.cnblogs.com/RainPPR/p/gcd-bezouts-exgcd.html#%E6%89%A9%E5%B1%95%E6%AC%A7%E5%87%A0%E9%87%8C%E5%BE%97%E7%AE%97%E6%B3%95)求出一组可行解：

考虑方程：$m_1p-m_2q=a_2-a_1$.

因为 $\gcd(m_1,m_2) \mid a_2-a_1$，所以方程两边可以同时除去 $\gcd(m_1,m_2)$，同时设：

$$
\left \{ \begin{array}{rl}
k_1 &= \dfrac{m_1}{\gcd(m_1,m_2)} \\\\
k_2 &= \dfrac{m_2}{\gcd(m_1,m_2)} \\\\
z &= \dfrac{a_2-a_1}{\gcd(m_1,m_2)}
\end{array} \right.
$$


得 $k_1p - k_2q = z$，且 $k_1 \perp k_2$；所以可以用扩展欧几里得算出：

方程 $k_1s + k_2t = 1$ 的一组解 $(s, t)$；因此有：

$$
\left\{\begin{array}{l}
p = zs \\
q = -zt \\
\end{array}\right.
$$

回看刚开始的方程 $x\equiv a_1 \pmod {m_1}$，即可得出一个特解：

$$
\begin{array}{rl}
x_0 & = m_1p+a_1 \\\\
  &= m_1 \cdot zs + a_1 \\\\
  & = \dfrac{m_1s\times(a_2-a_1)}{\gcd(m_1,m_2)} + a_1
\end{array}
$$

手模一下可知新的方程是模 $\operatorname{lcm}(m_1, m_2)$ 意义下的。

然后再考虑将特解转为通解，这一点很简单，在此引用 rxz 的一句话：从线性代数的角度讲，这个通解的构造方式是十分平凡的。对 $\operatorname{lcm}(m_1, m_2)$ 取模的结果，将整个整数集划分成了 $\operatorname{lcm}(m_1, m_2)$ 个等价类，哪个等价类里面有特解，那整个等价类肯定全都是解。

也就是通解 $x' = x_0 + k\times\operatorname{lcm}(m_1, m_2)$，其中 $k \in \mathbb Z$.

然后就可以得出合并后的方程：$x \equiv x' \pmod{\operatorname{lcm}(m_1, m_2)}$.

> 如果你没看懂，可以再看看 rxz 的 <https://www.luogu.com.cn/article/lr8vtpzl>

代码（此处的乘法比较容易溢出，一般开大一点，`long long` 不行就 `int128`）：

```cpp
void merge(ll &a1, ll &m1, ll a2, ll m2)
{
    ll g = gcd(m1, m2), m = m1 / g * m2;

    ll p, q;
    exgcd(m1 / g, m2 / g, p, q);

    p = p * m1 % m;
    p = p * ((a2 - a1) / g) % m;

    a1 = (a1 + p + m) % m;
    m1 = m;
}
```

## 例题

题目：[P4777 扩展中国剩余定理](https://www.luogu.com.cn/problem/P4777 "P4777 扩展中国剩余定理")

??? note "点击查看代码"
    这道题很坑，数很大，我开到了 `int128`...

    ```cpp
    typedef __int128_t vl;

    const int N = 1e5 + 10;

    ll gcd(ll a, ll b) { return b ? gcd(b, a % b) : a; }

    ll exgcd(ll a, ll b, vl &x, vl &y)
    {
        if (b == 0)
        {
            x = 1, y = 0;
            return a;
        }
        ll d = exgcd(b, a % b, y, x);
        y -= a / b * x;
        return d;
    }

    void merge(ll &a1, ll &m1, ll a2, ll m2)
    {
        ll g = gcd(m1, m2), m = m1 / g * m2;

        vl p, q;
        exgcd(m1 / g, m2 / g, p, q);

        p = p * m1 % m;
        p = p * ((a2 - a1) / g) % m;

        a1 = (a1 + p + m) % m;
        m1 = m;
    }

    int main()
    {
        int n = rr;

        ll mm = rr, aa = rr;
        for (int i = 1; i < n; ++i)
        {
            ll m = rr, a = rr;
            merge(aa, mm, a, m);
        }

        printf("%lld\n", aa % mm);
        return 0;
    }
    ```

## Reference

[1] <https://www.bilibili.com/video/BV1Ut4y1F7HG/>  
[2] <https://www.luogu.com.cn/blog/blue/kuo-zhan-zhong-guo-sheng-yu-ding-li>
