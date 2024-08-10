# 最短路简介

## 定义

- 单源最短路：从一个点 $q$ 出发，到其他所有点的最短路。
- 全源最短路：任意两点见最短路。

## 算法对比

| 算法 | Floyd | Johnson | Bellman–Ford | SPFA | Dijkstra |
| :-: | - | - | - | - | - |
| 类型 | *全源* | *全源* | 单源 | 单源 | 单源 |
| 作用于 | 任意图 | 任意图 | 任意图 | 任意图 | *非负权图* |
| 检测负环 | 能 | 能 | 能 | 能 | *不能* |
| 时间复杂度 | $\mathcal{O}(n^3)$ | $\mathcal{O}(nm \log m)$ | $\mathcal{O}(nm)$ | $\mathcal{O}(m)$－$\mathcal{O}(nm)$ | $\mathcal{O}(n^2)$－$\mathcal{O}(m \log n)$ |

总结：

- 有负环优先用 SPFA，即使她被卡也比 BF 快一点。
- 多源用 Floyd，因为不会 Johnson。

如果是 DAG 也可以跑拓扑，速度更快。
