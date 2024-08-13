# DFS 序 LCA

## DFS 序

DFS 序指的是，DFS 过程中遇到的节点的序列。

DFN 时间戳对应为一个节点什么时候被访问的。

## 过程

考虑有点 $u,v$ 的 LCA，我们钦定 $\operatorname{dfn}(u)\le\operatorname{dfn}(v)$。

有性质：LCA 一定是 DFS 序上 $[\operatorname{dfn}(u)+1,\operatorname{dfn}(v)]$ 中深度最小的点的父亲。

考虑理解这个性质，

+ 我们知道在 DFS 序上面，父亲一定先于孩子遍历。

+ 若 $u$ 为 $v$ 的祖先，那么深度最小的点就是 $u$ 到 $v$ 的一个儿子，那么其父亲就是 $u$，正确。

+ 若 $u$ 不为 $v$ 的祖先，那么只有从 $u$ 的子树回到 LCA 后下去的路径（或者中间经过的路径）才会被记录，那么深度最小的点可以看成从 LCA 到 $v$ 的路径上的儿子，也正确。