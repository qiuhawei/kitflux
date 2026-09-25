# Fluxkit

免费在线工具站（Fluxkit），面向 AdSense 兼职变现：高搜索意图工具页 + 自动 SEO + AdSense 接入位。

## 本地运行

```bash
cp .env.example .env.local
npm install
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)。

## 上线前必填

在 `.env.local` / 部署环境变量中设置：

- `NEXT_PUBLIC_SITE_URL`：你的正式域名，例如 `https://fluxkit.com`
- `NEXT_PUBLIC_ADSENSE_CLIENT`：AdSense 发布商 ID，例如 `ca-pub-xxxxxxxxxxxxxxxx`

## 自动 SEO（已内置）

- 每个工具页独立 `title` / `description` / canonical / Open Graph
- `sitemap.xml`、`robots.txt` 由工具注册表自动生成
- FAQ + WebApplication JSON-LD 结构化数据
- 页脚与相关工具内链
- `/ads.txt` 自动输出（填好 publisher ID 后生效）

新增工具：改 `src/lib/tools.ts` + 在 `src/components/tools/` 加组件，sitemap/SEO 会跟着走。

## AdSense 接入步骤（降低拒审风险）

1. 买域名并部署（推荐 Vercel），填好 `NEXT_PUBLIC_SITE_URL` 和真实 `NEXT_PUBLIC_CONTACT_EMAIL`
2. **先不要**填 `NEXT_PUBLIC_ADSENSE_CLIENT`（审核前页面上不应出现空广告位）
3. AdSense 后台「添加网站」→ 验证所有权
4. 等站点审核通过
5. 再填 publisher ID、创建广告单元，把 `data-ad-slot` 传给 `AdSlot`（或开自动广告）后重新部署

审核员主要看：是否有实质内容、隐私/联系方式是否完整、是不是纯广告壳站。工具页已含说明、步骤、技巧与 FAQ。

## 流量怎么来（现实预期）

工具站靠搜索词吃饭，例如 `json formatter`、`password generator`。新站通常要几周到几个月才有稳定自然流量；一天约 $10 需要持续访问，不是上线当天保证。

合规提醒：原创有用、别刷量、别诱导点击，否则账号风险很大。
