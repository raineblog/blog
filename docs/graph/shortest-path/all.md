# 全源最短路

## Floyd-Warshall

一个很实用的全源最短路解法，特点是好写，容易拓展。

时间复杂度：$\mathcal O(n^3)$。

代码：

```cpp
for (k = 1; k <= n; k++)
	for (x = 1; x <= n; x++)
		for (y = 1; y <= n; y++)
			f[x][y] = min(f[x][y], f[x][k] + f[k][y]);
```

注意顺序一定是先 $k$。

## Johnson

不会，现阶段不打算学。
