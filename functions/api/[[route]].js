export async function onRequest(context) {
  const { env, request } = context
  const url = new URL(request.url)
  
  // 检查是否使用 KV 数据库
  const useKV = !!env.KV_NAMESPACE
  const db = useKV ? env.KV_NAMESPACE : await connectToDatabase(env.DATABASE_URL)
  
  // API 路由处理
  if (url.pathname === '/api') {
    return await handleGetLink(db, useKV)
  }
  
  if (url.pathname === '/api/auth') {
    return await handleAuth(request, env.ADMIN_PASSWORD)
  }
  
  if (url.pathname === '/api/links') {
    if (request.method === 'POST') {
      return await handleAddLink(request, db, useKV)
    }
  }
  
  if (url.pathname.startsWith('/api/links/')) {
    if (request.method === 'DELETE') {
      const id = url.pathname.split('/').pop()
      return await handleDeleteLink(id, db, useKV)
    }
  }
  
  return new Response('Not Found', { status: 404 })
}

async function handleGetLink(db, useKV) {
  if (useKV) {
    const links = await db.get('links', { type: 'json' }) || []
    const settings = await db.get('settings', { type: 'json' }) || { displayMode: 1 }
    return new Response(selectLink(links, settings))
  } else {
    // 使用外部数据库的实现
    const links = await db.query('SELECT * FROM links')
    const settings = await db.query('SELECT * FROM settings LIMIT 1')
    return new Response(selectLink(links, settings[0]))
  }
}

function selectLink(links, settings) {
  const now = new Date()
  let filteredLinks = links
  
  switch (settings.displayMode) {
    case 4: // 节日模式
      filteredLinks = links.filter(link => isHolidayMatch(link, now))
      if (filteredLinks.length) break
    case 3: // 周模式
      filteredLinks = links.filter(link => link.weekTag === now.getDay() + 1)
      if (filteredLinks.length) break
    case 2: // 月模式
      filteredLinks = links.filter(link => link.monthTag === now.getMonth() + 1)
      if (filteredLinks.length) break
    case 1: // 随机模式
    default:
      filteredLinks = links
  }
  
  if (!filteredLinks.length) return ''
  
  // 根据权重随机选择
  const totalWeight = filteredLinks.reduce((sum, link) => sum + (link.weight || 1), 0)
  let random = Math.random() * totalWeight
  
  for (const link of filteredLinks) {
    random -= (link.weight || 1)
    if (random <= 0) return link.url
  }
  
  return filteredLinks[0].url
} 