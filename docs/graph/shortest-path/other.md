# 其他最短路算法

## 对于 DAG：拓扑排序

### 思想

每次删去入边的时候，更新最短路即可，这样可以访问到每一个路径，正确性显然可以通过归纳法证明。

### 实现



## 对于常数边权：BFS

### 思想

正确性容易证明，BFS 最先扫到的点一定是距离近的，这就是 BFS 的分层性。

### 实现



## 对于 $0 / 1$ 边权：双端队列 BFS

### 思想

每次遇到边权为 $0$ 的点放入队列前端、边权为 $1$ 的点放入后端，从前端取进行 BFS。

正确性：放入前端类似于，将距离为 $0$ 的点连为一块，如果一个点最短路确定了，那么这个块都确定了。

### 实现

???+ note
    ```cpp
    struct edge {
        int v, w;
        edge() = default;
        edge(int v, int w): v(v), w(w) {}
    };

    vector<edge> G[N];

    int dis[N];

    int get_dis(int W) {
        memset(dis, 0x3f, sizeof(int) * (n + 1));
        deque<int> q;
        q.push_back(1);
        dis[1] = 0;
        while (!q.empty()) {
            int u = q.front();
            q.pop_front();
            for (auto t : G[u]) {
                int v = t.v, w = t.w > W;
                if (dis[v] > dis[u] + w) {
                    dis[v] = dis[u] + w;
                    if (w == 0)
                        q.push_front(v);
                    else
                        q.push_back(v);
                }
            }
        }
        return dis[n];
    }
    ```