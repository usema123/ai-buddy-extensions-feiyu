// 鱼鱼仪表盘 · AI 酱插件（扁平结构版）
// 只读：从本机状态桥 http://127.0.0.1:8765/status 拉数据，展示器官 / 插件 / 记忆状况。
const BRIDGE = "http://127.0.0.1:8765/status";

async function pull() {
  const res = await fetch(BRIDGE, { cache: "no-store" });
  if (!res.ok) throw new Error("状态桥返回 " + res.status);
  return res.json();
}

function summarize(s) {
  const up = s.organs.filter((o) => o.up).length;
  const loaded = s.plugins.filter((p) => p.loaded).length;
  return {
    at: s.at,
    organs: `${up}/${s.organs.length} 在线`,
    plugins: `${loaded}/${s.plugins.length} 已加载`,
    memory: s.memory?.total ?? "?",
    qq: s.qq?.last ?? "未知",
  };
}

export async function activate(api) {
  api.commands.register(
    {
      id: "feiyu-dashboard.status",
      title: "看看鱼鱼家里怎么样了",
      description: "拉一次器官 / 插件 / 记忆状态",
    },
    async () => {
      const s = await pull();
      return summarize(s);
    }
  );

  api.ui.registerPanel({
    id: "feiyu-dashboard",
    title: "鱼鱼仪表盘",
    async load() {
      const s = await pull();
      return {
        summary: summarize(s),
        organs: s.organs,
        plugins: s.plugins,
      };
    },
  });
}
