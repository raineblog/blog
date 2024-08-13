# 扩展欧几里得算法

## 裴蜀定理

### 定义

若 $a$、$b$ 是不全为零的整数，则存在整数 $x$、$y$，使得 $ax + by = \gcd(a, b)$。

### 推广

若 $A[1 \sim n]$ 是非零整数序列，则整数序列 $X[1 \sim n]$ 一定满足：

$$
\sum_{i = 1}^n A_iX_i = k \times \gcd(A_1, A_2, \dots, A_n)
$$

，其中 $k$ 为正整数。

## 扩展欧几里得算法

扩展欧几里得算法（Extended Euclidean algorithm，EXGCD），常用于求 $ax + by = \gcd(a, b)$ 的一组可行解。

### 算法思路

对于 $ax + by = \gcd(a, b)$，考虑与欧几里得算法相似的思路：

| | 结论： |
| -: | :- |
| 求一组解 $x'$、$y'$，使得 | $bx' + (a \bmod b)y' = \gcd(b, a \bmod b)$ |
| （欧几里得定理）$\gcd(a, b) = \gcd(b, a \bmod b)$ | $bx' + (a \bmod b)y' = \gcd(a, b)$ |
| （模运算的定义）$a \bmod b = a - \lfloor \dfrac{a}{b} \rfloor \times b$ | $bx' + (a - \lfloor \dfrac{a}{b} \rfloor \times b)y' = \gcd(a, b)$ |
| 整理，得 | $ay' + b(x' - \lfloor \dfrac{a}{b} \rfloor \times y') = \gcd(a, b)$ |

我们要求一组解，使得 $ax + by = \gcd(a, b)$

因此有一组解为 $\left\{\begin{array}{l}  x = y' \\  y = x' - \lfloor \dfrac{a}{b} \rfloor \times y'\end{array}\right.$.

其边界值为 $b = 0$，这时有 $ax = \gcd(a, 0) = a$，既有 $x = 1$；

为了方便起见，我们取 $y = 0$。

即：若 $b = 0$，则取 $\left\{\begin{array}{l}  x = 1 \\  y = 0\end{array}\right.$.

### 代码

来自 OI-Wiki：

```cpp
int Exgcd(int a, int b, int &x, int &y) {
    if (!b) {
        x = 1;
        y = 0;
        return a;
    }
    int d = Exgcd(b, a % b, x, y);
    int t = x;
    x = y;
    y = t - (a / b) * y;
    return d;
}
```

简化后可以写作：

```cpp
int Exgcd(int a, int b, int &x, int &y) {
    if (!b) {
        x = 1, y = 0;
        return a;
    }
    int d = Exgcd(b, a % b, y, x);
    y -= a / b * x;
    return d;
}
```

### 特解到通解

假设我们现在求出了一组特解 $x_0$、$y_0$，使得 $ax_0 + by_0 = \gcd(a, b)$。

接下来：

$$
\begin{array}{rl}
ax_0 + by_0 &= \gcd(a, b) \\
(ax_0 + H) + (by_0 - H) &= \gcd(a, b) \\
a(x_0 + H / a) + b(y_0 - H / b) &= \gcd(a, b)
\end{array}
$$

可以看出 $H$ 即是 $a$ 的倍数，又是 $b$ 的倍数，

所以 $H = k \times \operatorname{lcm}(a, b)$，其中 $k$ 可以是任意整数。

即：

$$
\left\{\begin{array}{l}  x = x_0 + k \times \dfrac{\operatorname{lcm}(a, b)}{a} \\  y = y_0 + k \times \dfrac{\operatorname{lcm}(a, b)}{b}\end{array}\right
$$

其中 $k \in \mathbb{Z}$。

## Reference

[1] <https://oi-wiki.org/math/number-theory/bezouts/>

[2] <https://oi-wiki.org/math/number-theory/gcd/>
