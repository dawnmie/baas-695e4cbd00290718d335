import { useState, useEffect } from 'react'
import { account, Query } from './appwrite'

const getInitials = (name) => {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

function App() {
  const [user, setUser] = useState(null)
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAlibabaLoading, setIsAlibabaLoading] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    // 检查是否是 OAuth2 回调
    const urlParams = new URLSearchParams(window.location.search)
    const secret = urlParams.get('secret')
    const userId = urlParams.get('userId')
    
    if (secret && userId) {
      // OAuth2 回调，创建会话
      handleOAuthCallback(secret, userId)
    } else {
      checkUser()
    }
  }, [])

  // 获取用户头像
  useEffect(() => {
    if (user) {
      loadAvatar()
    } else {
      setAvatarUrl(null)
    }
  }, [user])

  const loadAvatar = async () => {
    try {
      // 检查缓存
      const cacheKey = 'alibaba_avatar_cache'
      const cached = localStorage.getItem(cacheKey)
      if (cached) {
        const { userId, avatarUrl, timestamp } = JSON.parse(cached)
        if (userId === user.$id && Date.now() - timestamp < 24 * 60 * 60 * 1000) {
          setAvatarUrl(avatarUrl)
          return
        }
      }

      // 获取 Alibaba 身份信息
      // 注意：在 Appwrite SDK v15 中，listIdentities 方法可能需要不同的参数格式
      // 如果该方法不存在，可以尝试使用其他方式获取身份信息
      try {
        const identities = await account.listIdentities([
          Query.equal('provider', 'alibaba')
        ])
        const empId = identities.identities?.[0]?.providerUid
        if (empId) {
          const url = `https://work.alibaba-inc.com/photo/${empId}.220x220.jpg`
          setAvatarUrl(url)
          localStorage.setItem(cacheKey, JSON.stringify({
            userId: user.$id,
            avatarUrl: url,
            timestamp: Date.now()
          }))
        }
      } catch (err) {
        console.error('Failed to fetch identities:', err)
      }
    } catch (error) {
      console.error('Failed to load avatar:', error)
    }
  }

  const handleOAuthCallback = async (secret, userId) => {
    try {
      await account.createSession(userId, secret)
      await checkUser()
      // 清除 URL 参数
      window.history.replaceState({}, document.title, window.location.pathname)
    } catch (error) {
      alert('OAuth2 登录失败: ' + error.message)
      setLoading(false)
    }
  }

  const checkUser = async () => {
    try {
      const currentUser = await account.get()
      setUser(currentUser)
    } catch (error) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const handleAlibabaLogin = async () => {
    setIsAlibabaLoading(true)
    try {
      const successUrl = window.location.origin + window.location.pathname
      const failureUrl = window.location.origin + window.location.pathname
      
      const url = await account.createOAuth2Session('alibaba', successUrl, failureUrl, ['read:user', 'user:email'])
      if (url && typeof url === 'string') {
        window.location.href = url
      }
    } catch (error) {
      alert('Alibaba 登录失败: ' + error.message)
      setIsAlibabaLoading(false)
    }
  }

  const logout = async () => {
    await account.deleteSession('current')
    setUser(null)
    setAvatarUrl(null)
    setIsMenuOpen(false)
    localStorage.removeItem('alibaba_avatar_cache')
  }

  // 点击外部区域关闭菜单
  useEffect(() => {
    if (!isMenuOpen) return
    const handleClickOutside = (e) => {
      if (!e.target.closest('.user-menu')) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isMenuOpen])

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="loading-dot"></div>
          <span>Initializing...</span>
        </div>
      </div>
    )
  }

  if (user) {
    const userName = user.name || user.email || 'User'
    const userInitials = getInitials(userName)
    
    return (
      <div className="app-wrapper">
        <div className="user-menu">
          <button 
            className="avatar-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={userName}
                className="avatar"
                onError={() => setAvatarUrl(null)}
              />
            ) : (
              <div className="avatar avatar-placeholder">
                {userInitials}
              </div>
            )}
          </button>
          {isMenuOpen && (
            <div className="menu-dropdown">
              <div className="user-info">
                <div className="user-name">{userName}</div>
                <div className="user-email">{user.email || ''}</div>
              </div>
              <div className="menu-divider"></div>
              <button className="btn-logout" onClick={logout}>
                <span>&gt;</span> Logout
              </button>
            </div>
          )}
        </div>
        <div className="welcome-section">
          <div className="status-indicator active"></div>
          <h1>&gt; Welcome, {userName}</h1>
          <p className="info-text">Session active</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="header">
        <div className="logo">
          <span className="bracket">&lt;</span>
          <span className="tag">App</span>
          <span className="bracket">/&gt;</span>
        </div>
        <p className="subtitle">React + Appwrite</p>
      </div>
      
      <div className="form">
        <button 
          type="button" 
          className="btn-oauth"
          onClick={handleAlibabaLogin}
          disabled={isAlibabaLoading}
        >
          {isAlibabaLoading ? (
            <>
              <div className="loading-spinner"></div>
              <span>Connecting...</span>
            </>
          ) : (
            <>
              <svg className="oauth-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <span>Login with Alibaba</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default App
