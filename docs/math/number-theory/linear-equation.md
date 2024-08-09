# 线性同余方程

## 同余

### 定义

若 $a \bmod m = b \bmod m$，则称 $a$ 与 $b$ 关于模 $m$ 同余，记为 $a \equiv b \pmod m$.

### 同余的性质

1. 反身性：$a \equiv a \pmod m$；
2. 对称性：若 $a \equiv b \pmod m$，则 $b \equiv a \pmod m$；
3. 传递性：若 $a \equiv b \pmod m$、$b \equiv c \pmod m$，则 $a \equiv c \pmod m$；
4. 同余式相加：若 $a \equiv b \pmod m$、$c \equiv d \pmod m$，则 $a \pm c \equiv b \pm d \pmod m$；
5. 同余式相乘：若 $a \equiv b \pmod m$、$c \equiv d \pmod m$，则 $a \times c \equiv b \times d \pmod m$；
6. 乘方：若 $a \equiv b \pmod m$，则 $a^k \equiv b^k \pmod m$；
7. 除法１：若 $ka \equiv kb \pmod{km}$，则 $a \equiv b \pmod m$；
8. 除法２：若 $ka \equiv kb \pmod m$，则 $a \equiv b \pmod{m / \gcd(k, m)}$；

## 线性同余方程

### 形式

关于 $x$ 的方程，形如 $ax \equiv n \pmod b$，则称之为线性同余方程（Linear Congruence Equation）。

一般要求求出特解，或 $x \in [0, b - 1]$ 的通解。

### 求解方法

方程 $ax \equiv n \pmod b$ 可以理解为 $ax + by = n$，其中 $y$ 为一个整数。

* 证明如下：

	因为 $ax + by = n$，  
	所以 $(ax + by) \bmod b = n \bmod b$，

	即 $ax \bmod b + by \bmod b = n \bmod b$，  
	因为 $by \bmod b = 0$，

	所以 $ax \bmod b = n \bmod b$，  
	转换为同余方程的形式就是 $ax \equiv n \pmod b$.

因此原方程转化为 $ax + by = n$，接下来就是扩展欧几里得算法的事情了；

### 解的判断

扩展欧几里得算法只能求解 $ax + by = \gcd(a, b)$ 的情况，

所以只有当 $n = k \times \gcd(a, b)$ ，$k \in \mathbb{Z}^+$，才可以用扩展欧几里得算法求解。

* 证明如下：

	可以求出一组 $x_0$、$y_0$，使得 $ax_0 + by_0 = \gcd(a, b)$，  
	等式两边同时乘以 $k$，便得到：$akx_0 + bky_0 = k \times \gcd(a, b)$，

	因此可得到 $\left\{\begin{matrix}  x = kx_0 \\  y = ky_0\end{matrix}\right.$，

	此时便有 $ax + by = n$.

### 特解到通解

下面假设有解：

我们已经将 $ax \equiv n \pmod b$ 转化为 $ax + by = n$，并通过扩展欧几里得算法解出来一个通解 $x_0$.

设 $t = \dfrac{\operatorname{lcm}(a, b)}{a}$，则有通解 $x = x_0 + kt$，其中 $k \in \mathbb{Z}$。

### 特殊化的线性同余方程

考虑方程 $ax \equiv 1 \pmod b$，也就是上面的 $n = 1$。

此时存在解的条件为 $k \times \gcd(a, b) = n = 1$，也就是 $k = 1$ 时的情况：

$\gcd(a, b) = 1$，即 $a$ 与 $b$ 互质，这样就可以用扩展欧几里得算法求解 $ax + by = 1$ 了。

所以此时的通解公式也可以化简为 $x = x_0 + kb$：

证明：$t = \dfrac{\operatorname{lcm}(a, b)}{a}$，而 $\operatorname{lcm}(a, b) = ab$，所以就有 $t = b$。

### 代码实现

```cpp
// ax = 1 (mod b)
int lieu1(int a, int b)
{
    int x, y;
    int d = exgcd(a, b, x, y);
    if (d != 1)
        return -1;
    return (x % b + b) % b;
}
```

```cpp
// ax = n (mod b)
int lieu(int a, int b, int n)
{
    int x, y;
    int d = exgcd(a, b, x, y);
    if (n % d != 0)
        return -1;
    int t = b / d;
    return (x % t + t) % t;
}
```

## Reference

[1] <https://oi-wiki.org/math/number-theory/linear-equation/>
