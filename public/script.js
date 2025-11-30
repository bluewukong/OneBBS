// 全局变量
let currentUser = null;
let token = null;
let posts = [];
let currentPage = 1;
const postsPerPage = 20;
let currentLanguage = 'en';

// 语言配置
const translations = {
    en: {
        app: {
            title: 'Sticky Notes BBS',
            logo: '📝 Sticky Notes BBS'
        },
        auth: {
            login: 'Login',
            register: 'Register',
            logout: 'Logout',
            username: 'Username',
            email: 'Email',
            password: 'Password',
            submit: 'Submit',
            loginTitle: 'Login',
            registerTitle: 'Register',
            loginSuccess: 'Login successful!',
            loginFailed: 'Login failed',
            loginError: 'Login error',
            registerSuccess: 'Registration successful!',
            registerFailed: 'Registration failed',
            registerError: 'Registration error',
            logoutSuccess: 'Logout successful!',
            settings: 'Settings',
            changePassword: 'Change Password',
            editProfile: 'Edit Profile',
            currentPassword: 'Current Password',
            newPassword: 'New Password',
            confirmPassword: 'Confirm Password',
            updatePassword: 'Update Password',
            updateProfile: 'Update Profile',
            passwordsNotMatch: 'New passwords do not match',
            passwordChangeSuccess: 'Password changed successfully!',
            passwordChangeFailed: 'Failed to change password',
            passwordChangeError: 'Error changing password',
            profileUpdateSuccess: 'Profile updated successfully!',
            profileUpdateFailed: 'Failed to update profile',
            profileUpdateError: 'Error updating profile'
        },
        posts: {
            createPost: 'Create New Note',
            title: 'Title',
            content: 'Content',
            color: 'Color',
            publish: 'Publish',
            viewCount: 'Views',
            replyCount: 'Replies',
            likeCount: 'Likes',
            createdAt: 'Created',
            loadMore: 'Load More',
            empty: 'No posts yet. Be the first to create one!',
            delete: 'Delete',
            deleteConfirm: 'Are you sure you want to delete this post?',
            deleteSuccess: 'Post deleted successfully!',
            createSuccess: 'Post created successfully!',
            createFailed: 'Failed to create post',
            createError: 'Error creating post',
            loadFailed: 'Failed to load posts',
            loadError: 'Error loading posts',
            detailLoadFailed: 'Failed to load post details',
            detailLoadError: 'Error loading post details'
        },
        replies: {
            title: 'Replies',
            addReply: 'Add Reply',
            reply: 'Reply',
            uploadImage: 'Upload Image',
            publish: 'Publish',
            loginToReply: 'Login to Reply',
            replyImage: 'Reply Image',
            empty: 'No replies yet. Be the first to reply!',
            createSuccess: 'Reply added successfully!',
            createFailed: 'Failed to add reply',
            createError: 'Error creating reply'
        },
        errors: {
            general: 'Something went wrong!',
            notFound: 'Not Found',
            unauthorized: 'Please login first',
            validation: 'Please check your input'
        },
        messages: {
            welcome: 'Welcome to Sticky Notes BBS!',
            loading: 'Loading...',
            success: 'Operation completed successfully!'
        },
        time: {
            minutesAgo: ' minutes ago',
            hoursAgo: ' hours ago',
            daysAgo: ' days ago'
        }
    },
    zh: {
        app: {
            title: '便签纸BBS',
            logo: '📝 便签纸BBS'
        },
        auth: {
            login: '登录',
            register: '注册',
            logout: '退出',
            username: '用户名',
            email: '邮箱',
            password: '密码',
            submit: '提交',
            loginTitle: '登录',
            registerTitle: '注册',
            loginSuccess: '登录成功！',
            loginFailed: '登录失败',
            loginError: '登录错误',
            registerSuccess: '注册成功！',
            registerFailed: '注册失败',
            registerError: '注册错误',
            logoutSuccess: '退出成功！',
            settings: '设置',
            changePassword: '修改密码',
            editProfile: '编辑资料',
            currentPassword: '当前密码',
            newPassword: '新密码',
            confirmPassword: '确认密码',
            updatePassword: '更新密码',
            updateProfile: '更新资料',
            passwordsNotMatch: '新密码不匹配',
            passwordChangeSuccess: '密码修改成功！',
            passwordChangeFailed: '密码修改失败',
            passwordChangeError: '修改密码时出错',
            profileUpdateSuccess: '资料更新成功！',
            profileUpdateFailed: '资料更新失败',
            profileUpdateError: '更新资料时出错'
        },
        posts: {
            createPost: '创建新便签',
            title: '标题',
            content: '内容',
            color: '颜色',
            publish: '发布',
            viewCount: '浏览',
            replyCount: '回复',
            likeCount: '点赞',
            createdAt: '创建时间',
            loadMore: '加载更多',
            empty: '还没有帖子，快来创建第一个吧！',
            delete: '删除',
            deleteConfirm: '确定要删除这个帖子吗？',
            deleteSuccess: '帖子删除成功！',
            createSuccess: '帖子创建成功！',
            createFailed: '帖子创建失败',
            createError: '创建帖子时出错',
            loadFailed: '加载帖子失败',
            loadError: '加载帖子时出错',
            detailLoadFailed: '加载帖子详情失败',
            detailLoadError: '加载帖子详情时出错'
        },
        replies: {
            title: '回复',
            addReply: '添加回复',
            reply: '回复',
            uploadImage: '上传图片',
            publish: '发布',
            loginToReply: '登录后回复',
            replyImage: '回复图片',
            empty: '还没有回复，快来发表第一个回复吧！',
            createSuccess: '回复添加成功！',
            createFailed: '回复添加失败',
            createError: '创建回复时出错'
        },
        errors: {
            general: '出错了！',
            notFound: '未找到',
            unauthorized: '请先登录',
            validation: '请检查输入内容'
        },
        messages: {
            welcome: '欢迎来到便签纸BBS！',
            loading: '加载中...',
            success: '操作成功！'
        },
        time: {
            minutesAgo: ' 分钟前',
            hoursAgo: ' 小时前',
            daysAgo: ' 天前'
        }
    }
};

// 获取翻译文本
function t(key) {
    const keys = key.split('.');
    let value = translations[currentLanguage];
    
    for (const k of keys) {
        if (value && value[k] !== undefined) {
            value = value[k];
        } else {
            return key; // 返回键名作为备用
        }
    }
    return value;
}

// 切换语言
function changeLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    updateUI();
    loadPosts(); // 重新加载帖子以更新界面
}

// 初始化语言设置
function initLanguage() {
    const savedLanguage = localStorage.getItem('language') || 'en';
    changeLanguage(savedLanguage);
    
    // 设置语言选择器
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        languageSelect.value = currentLanguage;
        languageSelect.addEventListener('change', (e) => {
            changeLanguage(e.target.value);
        });
    }
}

// DOM元素
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modalBody');
const closeModal = document.querySelector('.modal .close');
const postDetailModal = document.getElementById('postDetailModal');
const postDetailBody = document.getElementById('postDetailBody');
const closePostDetailModal = document.querySelector('#postDetailModal .close');
const postsContainer = document.getElementById('postsContainer');
const createPostBtn = document.getElementById('createPostBtn');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const logoutBtn = document.getElementById('logoutBtn');
const authSection = document.getElementById('authSection');
const userSection = document.getElementById('userSection');
const usernameElement = document.getElementById('username');

// 初始化应用
function init() {
    // 初始化语言设置
    initLanguage();
    
    // 检查本地存储中的用户信息
    checkAuth();
    
    // 加载帖子
    loadPosts();
    
    // 设置事件监听器
    setupEventListeners();
}

// 检查认证状态
function checkAuth() {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
        currentUser = JSON.parse(storedUser);
        token = storedToken;
        updateUI();
    }
}

// 更新UI
function updateUI() {
    // 更新页面标题和logo
    document.title = t('app.title');
    document.querySelector('.logo').textContent = t('app.logo');
    
    // 更新按钮文本
    loginBtn.textContent = t('auth.login');
    registerBtn.textContent = t('auth.register');
    logoutBtn.textContent = t('auth.logout');
    createPostBtn.textContent = t('posts.createPost');
    
    if (currentUser) {
        // 显示用户信息
        authSection.style.display = 'none';
        userSection.style.display = 'flex';
        usernameElement.textContent = currentUser.username;
        createPostBtn.style.display = 'block';
    } else {
        // 显示登录注册按钮
        authSection.style.display = 'flex';
        userSection.style.display = 'none';
        createPostBtn.style.display = 'none';
    }
}

// 设置事件监听器
function setupEventListeners() {
    // 关闭模态框
    closeModal.addEventListener('click', closeModalHandler);
    closePostDetailModal.addEventListener('click', closePostDetailModalHandler);
    
    // 点击模态框外部关闭
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModalHandler();
        } else if (e.target === postDetailModal) {
            closePostDetailModalHandler();
        }
    });
    
    // 登录按钮
    loginBtn.addEventListener('click', () => {
        showLoginModal();
    });
    
    // 注册按钮
    registerBtn.addEventListener('click', () => {
        showRegisterModal();
    });
    
    // 退出按钮
    logoutBtn.addEventListener('click', logout);
    
    // 创建帖子按钮
    createPostBtn.addEventListener('click', () => {
        showCreatePostModal();
    });
    
    // 设置按钮
    const settingsBtn = document.getElementById('settingsBtn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', showSettingsModal);
    }
}

// 显示通知
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="closeNotification(this.parentElement.parentElement)">✕</button>
        </div>
    `;
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 自动移除（2秒后关闭）
    setTimeout(() => {
        closeNotification(notification);
    }, 2000);
}

// 关闭通知
function closeNotification(notification) {
    if (notification && notification.parentElement) {
        notification.classList.add('hiding');
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 500);
    }
}

// 关闭模态框
function closeModalHandler() {
    modal.style.display = 'none';
    modalBody.innerHTML = '';
}

// 关闭帖子详情模态框
function closePostDetailModalHandler() {
    postDetailModal.style.display = 'none';
    postDetailBody.innerHTML = '';
}

// 显示登录模态框
function showLoginModal() {
    modalBody.innerHTML = `
        <h2>${t('auth.loginTitle')}</h2>
        <form id="loginForm">
            <div class="form-group">
                <label for="loginEmail">${t('auth.email')}:</label>
                <input type="email" id="loginEmail" name="email" required>
            </div>
            <div class="form-group">
                <label for="loginPassword">${t('auth.password')}:</label>
                <input type="password" id="loginPassword" name="password" required>
            </div>
            <div class="form-actions">
                <button type="submit" class="btn btn-primary btn-large">${t('auth.login')}</button>
            </div>
        </form>
    `;
    
    modal.style.display = 'block';
    
    // 添加表单提交事件
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
}

// 显示注册模态框
function showRegisterModal() {
    modalBody.innerHTML = `
        <h2>${t('auth.registerTitle')}</h2>
        <form id="registerForm">
            <div class="form-group">
                <label for="registerUsername">${t('auth.username')}:</label>
                <input type="text" id="registerUsername" name="username" required minlength="3" maxlength="20">
            </div>
            <div class="form-group">
                <label for="registerEmail">${t('auth.email')}:</label>
                <input type="email" id="registerEmail" name="email" required>
            </div>
            <div class="form-group">
                <label for="registerPassword">${t('auth.password')}:</label>
                <input type="password" id="registerPassword" name="password" required minlength="6">
            </div>
            <div class="form-actions">
                <button type="submit" class="btn btn-primary btn-large">${t('auth.register')}</button>
            </div>
        </form>
    `;
    
    modal.style.display = 'block';
    
    // 添加表单提交事件
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
}

// 显示创建帖子模态框
function showCreatePostModal() {
    modalBody.innerHTML = `
        <h2>${t('posts.createPost')}</h2>
        <form id="createPostForm">
            <div class="form-group">
                <label for="postTitle">${t('posts.title')}:</label>
                <input type="text" id="postTitle" name="title" required maxlength="100">
            </div>
            <div class="form-group">
                <label for="postContent">${t('posts.content')}:</label>
                <textarea id="postContent" name="content" required minlength="1"></textarea>
            </div>
            <div class="form-group">
                <label for="postColor">${t('posts.color')}:</label>
                <input type="color" id="postColor" name="color" value="#FFEB3B">
            </div>
            <div class="form-actions">
                <button type="submit" class="btn btn-primary btn-large">${t('posts.publish')}</button>
            </div>
        </form>
    `;
    
    modal.style.display = 'block';
    
    // 添加表单提交事件
    document.getElementById('createPostForm').addEventListener('submit', handleCreatePost);
}

// 显示设置模态框
function showSettingsModal() {
    modalBody.innerHTML = `
        <h2>⚙️ ${t('auth.settings')}</h2>
        <div class="settings-tabs">
            <button type="button" class="settings-tab active" data-tab="changePassword">${t('auth.changePassword')}</button>
            <button type="button" class="settings-tab" data-tab="editProfile">${t('auth.editProfile')}</button>
        </div>
        
        <!-- 修改密码表单 -->
        <div id="changePassword" class="settings-tab-content active">
            <form id="changePasswordForm" class="settings-form">
                <div class="form-group">
                    <label for="currentPassword">${t('auth.currentPassword')}:</label>
                    <input type="password" id="currentPassword" name="currentPassword" required>
                </div>
                <div class="form-group">
                    <label for="newPassword">${t('auth.newPassword')}:</label>
                    <input type="password" id="newPassword" name="newPassword" required minlength="6">
                </div>
                <div class="form-group">
                    <label for="confirmPassword">${t('auth.confirmPassword')}:</label>
                    <input type="password" id="confirmPassword" name="confirmPassword" required minlength="6">
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">${t('auth.updatePassword')}</button>
                </div>
            </form>
        </div>
        
        <!-- 修改用户信息表单 -->
        <div id="editProfile" class="settings-tab-content">
            <form id="editProfileForm" class="settings-form">
                <div class="form-group">
                    <label for="editUsername">${t('auth.username')}:</label>
                    <input type="text" id="editUsername" name="username" value="${currentUser.username}" required minlength="3" maxlength="20">
                </div>
                <div class="form-group">
                    <label for="editEmail">${t('auth.email')}:</label>
                    <input type="email" id="editEmail" name="email" value="${currentUser.email}" required>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">${t('auth.updateProfile')}</button>
                </div>
            </form>
        </div>
    `;
    
    modal.style.display = 'block';
    
    // 添加标签页切换事件
    setupTabSwitching();
    
    // 添加表单提交事件
    document.getElementById('changePasswordForm').addEventListener('submit', handleChangePassword);
    document.getElementById('editProfileForm').addEventListener('submit', handleEditProfile);
}

// 设置标签页切换
function setupTabSwitching() {
    const tabBtns = document.querySelectorAll('.settings-tab');
    const tabContents = document.querySelectorAll('.settings-tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 移除所有激活状态
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // 激活当前标签页
            btn.classList.add('active');
            const tabId = btn.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// 处理登录
async function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // 保存用户信息
            currentUser = data.user;
            token = data.token;
            localStorage.setItem('user', JSON.stringify(currentUser));
            localStorage.setItem('token', token);
            
            // 更新UI
            updateUI();
            closeModalHandler();
            showNotification(t('auth.loginSuccess'), 'success');
        } else {
            showNotification(data.message || t('auth.loginFailed'), 'error');
        }
    } catch (error) {
        showNotification(t('auth.loginError'), 'error');
    }
}

// 处理注册
async function handleRegister(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const username = formData.get('username');
    const email = formData.get('email');
    const password = formData.get('password');
    
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // 保存用户信息
            currentUser = data.user;
            token = data.token;
            localStorage.setItem('user', JSON.stringify(currentUser));
            localStorage.setItem('token', token);
            
            // 更新UI
            updateUI();
            closeModalHandler();
            showNotification(t('auth.registerSuccess'), 'success');
        } else {
            showNotification(data.message || t('auth.registerFailed'), 'error');
        }
    } catch (error) {
        showNotification(t('auth.registerError'), 'error');
    }
}

// 处理创建帖子
async function handleCreatePost(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const title = formData.get('title');
    const content = formData.get('content');
    const color = formData.get('color');
    
    try {
        const response = await fetch('/api/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, content, color })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // 关闭模态框
            closeModalHandler();
            
            // 显示更明确的成功信息
            showNotification(`🎉 ${t('posts.createSuccess')} 帖子已成功发布！`, 'success');
            
            // 延迟重新加载帖子列表，让用户看到成功信息
            setTimeout(() => {
                loadPosts();
            }, 1000);
        } else {
            showNotification(`❌ ${data.message || t('posts.createFailed')}`, 'error');
        }
    } catch (error) {
        showNotification(`❌ ${t('posts.createError')}`, 'error');
    }
}

// 处理修改密码
async function handleChangePassword(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const currentPassword = formData.get('currentPassword');
    const newPassword = formData.get('newPassword');
    const confirmPassword = formData.get('confirmPassword');
    
    // 验证新密码和确认密码是否一致
    if (newPassword !== confirmPassword) {
        showNotification(t('auth.passwordsNotMatch'), 'error');
        return;
    }
    
    try {
        const response = await fetch('/api/auth/change-password', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ currentPassword, newPassword })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // 关闭模态框
            closeModalHandler();
            
            // 显示成功信息
            showNotification(`✅ ${t('auth.passwordChangeSuccess')}`, 'success');
            
            // 清空表单
            e.target.reset();
        } else {
            showNotification(`❌ ${data.message || t('auth.passwordChangeFailed')}`, 'error');
        }
    } catch (error) {
        showNotification(`❌ ${t('auth.passwordChangeError')}`, 'error');
    }
}

// 处理修改用户信息
async function handleEditProfile(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const username = formData.get('username');
    const email = formData.get('email');
    
    try {
        const response = await fetch('/api/auth/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ username, email })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // 更新本地存储的用户信息
            currentUser = data.user;
            localStorage.setItem('user', JSON.stringify(currentUser));
            
            // 更新UI显示的用户名
            usernameElement.textContent = currentUser.username;
            
            // 关闭模态框
            closeModalHandler();
            
            // 显示成功信息
            showNotification(`✅ ${t('auth.profileUpdateSuccess')}`, 'success');
        } else {
            showNotification(`❌ ${data.message || t('auth.profileUpdateFailed')}`, 'error');
        }
    } catch (error) {
        showNotification(`❌ ${t('auth.profileUpdateError')}`, 'error');
    }
}

// 退出登录
function logout() {
    // 清除本地存储
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // 重置全局变量
    currentUser = null;
    token = null;
    
    // 更新UI
    updateUI();
    showNotification(t('auth.logoutSuccess'), 'info');
}

// 加载帖子
async function loadPosts() {
    try {
        // 显示加载状态
        postsContainer.innerHTML = `<div class="loading">${t('app.loading')}</div>`;
        
        const response = await fetch('/api/posts');
        const data = await response.json();
        
        if (response.ok) {
            posts = data;
            renderPosts();
        } else {
            showNotification(t('posts.loadFailed'), 'error');
            postsContainer.innerHTML = `<div class="empty-state"><div class="empty-state-icon">📭</div><div class="empty-state-text">${t('posts.loadError')}</div></div>`;
        }
    } catch (error) {
        showNotification(t('posts.loadError'), 'error');
        postsContainer.innerHTML = `<div class="empty-state"><div class="empty-state-icon">📭</div><div class="empty-state-text">${t('posts.loadError')}</div></div>`;
    }
}

// 渲染帖子
function renderPosts() {
    if (posts.length === 0) {
        postsContainer.innerHTML = `<div class="empty-state"><div class="empty-state-icon">📭</div><div class="empty-state-text">${t('posts.empty')}</div></div>`;
        return;
    }
    
    postsContainer.innerHTML = '';
    
    posts.forEach(post => {
        const postElement = createPostElement(post);
        postsContainer.appendChild(postElement);
    });
    
    // 同步本地点赞状态到UI
    syncLikeStatesToUI();
}

// 创建单个帖子元素
function createPostElement(post) {
    const postDiv = document.createElement('div');
    postDiv.className = 'post';
    postDiv.style.backgroundColor = post.color;
    
    // 帖子HTML结构
    postDiv.innerHTML = `
        <div class="post-header">
            <h3 class="post-title">${escapeHtml(post.title)}</h3>
            <div class="post-meta">
                <span class="post-author">${escapeHtml(post.author.username)}</span> · 
                <span class="post-time">${formatDate(post.created_at)}</span>
            </div>
        </div>
        <div class="post-content">${escapeHtml(post.content)}</div>
        <div class="post-footer">
            <div class="post-stats">
                <div class="stat-item">👁️ ${post.view_count}</div>
                <div class="stat-item">💬 ${post.reply_count}</div>
                <div class="stat-item">
                    <button class="like-btn ${post.user_liked ? 'liked' : ''}" data-post-id="${post.id}">
                        ❤️ <span class="like-count">${post.like_count}</span>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // 添加点赞按钮点击事件
    const likeBtn = postDiv.querySelector('.like-btn');
    likeBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // 防止触发帖子详情点击事件
        handleLike(post.id);
    });
    
    // 添加帖子点击事件
    postDiv.addEventListener('click', () => {
        showPostDetail(post.id);
    });
    
    return postDiv;
}

// 处理点赞/取消点赞
async function handleLike(postId) {
    // 检查用户是否已登录
    if (!currentUser) {
        showNotification('请先登录后再点赞', 'error');
        showLoginModal();
        return;
    }
    
    // 获取点赞按钮和计数元素
    const likeBtn = document.querySelector(`.like-btn[data-post-id="${postId}"]`);
    const likeCountSpan = likeBtn.querySelector('.like-count');
    
    // 立即更新UI（乐观更新）
    const currentLiked = likeBtn.classList.contains('liked');
    const currentCount = parseInt(likeCountSpan.textContent);
    
    if (currentLiked) {
        // 取消点赞
        likeBtn.classList.remove('liked');
        likeCountSpan.textContent = Math.max(0, currentCount - 1);
    } else {
        // 点赞
        likeBtn.classList.add('liked');
        likeCountSpan.textContent = currentCount + 1;
    }
    
    // 保存当前状态到本地存储（用于错误恢复）
    saveLikeStateToLocalStorage(postId, !currentLiked, currentLiked ? currentCount - 1 : currentCount + 1);
    
    try {
        const response = await fetch(`/api/posts/${postId}/like`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // 更新UI为服务器返回的实际值
            if (data.action === 'liked') {
                likeBtn.classList.add('liked');
                likeCountSpan.textContent = data.like_count;
                showNotification('👍 点赞成功！', 'success');
            } else if (data.action === 'unliked') {
                likeBtn.classList.remove('liked');
                likeCountSpan.textContent = data.like_count;
                showNotification('👎 取消点赞', 'info');
            }
            
            // 更新本地存储
            saveLikeStateToLocalStorage(postId, data.action === 'liked', data.like_count);
        } else {
            // 服务器错误，恢复之前的状态
            if (currentLiked) {
                likeBtn.classList.add('liked');
                likeCountSpan.textContent = currentCount;
            } else {
                likeBtn.classList.remove('liked');
                likeCountSpan.textContent = currentCount;
            }
            showNotification(`❌ ${data.message || '操作失败'}`, 'error');
        }
    } catch (error) {
        // 网络错误，恢复之前的状态
        if (currentLiked) {
            likeBtn.classList.add('liked');
            likeCountSpan.textContent = currentCount;
        } else {
            likeBtn.classList.remove('liked');
            likeCountSpan.textContent = currentCount;
        }
        showNotification('❌ 网络错误，请稍后重试', 'error');
    }
}

// 保存点赞状态到本地存储
function saveLikeStateToLocalStorage(postId, isLiked, likeCount) {
    if (!currentUser) return;
    
    const key = `like_state_${currentUser.id}`;
    let likeStates = JSON.parse(localStorage.getItem(key) || '{}');
    
    likeStates[postId] = {
        isLiked: isLiked,
        likeCount: likeCount,
        timestamp: Date.now()
    };
    
    // 清理过期的记录（超过1天的记录）
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
    Object.keys(likeStates).forEach(postId => {
        if (likeStates[postId].timestamp < oneDayAgo) {
            delete likeStates[postId];
        }
    });
    
    localStorage.setItem(key, JSON.stringify(likeStates));
}

// 从本地存储加载点赞状态
function loadLikeStateFromLocalStorage(postId) {
    if (!currentUser) return null;
    
    const key = `like_state_${currentUser.id}`;
    const likeStates = JSON.parse(localStorage.getItem(key) || '{}');
    
    return likeStates[postId] || null;
}

// 同步本地点赞状态到UI（在页面加载时调用）
function syncLikeStatesToUI() {
    if (!currentUser) return;
    
    const key = `like_state_${currentUser.id}`;
    const likeStates = JSON.parse(localStorage.getItem(key) || '{}');
    
    Object.keys(likeStates).forEach(postId => {
        const likeBtn = document.querySelector(`.like-btn[data-post-id="${postId}"]`);
        if (likeBtn) {
            const state = likeStates[postId];
            const likeCountSpan = likeBtn.querySelector('.like-count');
            
            if (state.isLiked) {
                likeBtn.classList.add('liked');
            } else {
                likeBtn.classList.remove('liked');
            }
            likeCountSpan.textContent = state.likeCount;
        }
    });
}

// 显示帖子详情
async function showPostDetail(postId) {
    try {
        // 显示加载状态
        postDetailBody.innerHTML = `<div class="loading">${t('app.loading')}</div>`;
        postDetailModal.style.display = 'block';
        
        const response = await fetch(`/api/posts/${postId}`);
        const post = await response.json();
        
        if (response.ok) {
            renderPostDetail(post);
        } else {
            showNotification(t('posts.detailLoadFailed'), 'error');
            closePostDetailModalHandler();
        }
    } catch (error) {
        showNotification(t('posts.detailLoadError'), 'error');
        closePostDetailModalHandler();
    }
}

// 渲染帖子详情
function renderPostDetail(post) {
    // 渲染帖子内容
    postDetailBody.innerHTML = `
        <div class="post-detail">
            <h2 class="post-detail-title">${escapeHtml(post.title)}</h2>
            <div class="post-detail-meta">
                <span class="post-author">${escapeHtml(post.author.username)}</span> · 
                <span class="post-time">${formatDate(post.created_at)}</span>
            </div>
            <div class="post-detail-content">${escapeHtml(post.content)}</div>
        </div>
        
        <!-- 回复列表 -->
        <div class="replies-section">
            <h3 class="replies-title">💬 ${t('replies.title')} (${post.replies.length})</h3>
            <div class="replies-list" id="repliesList">
                ${renderReplies(post.replies)}
            </div>
            
            <!-- 回复表单 -->
            <div class="reply-form">
                <h4 class="reply-form-title">${t('replies.addReply')}</h4>
                <form id="replyForm">
                    <input type="hidden" name="post_id" value="${post.id}">
                    <div class="form-group">
                        <textarea id="replyContent" name="content" required minlength="1"></textarea>
                    </div>
                    <div class="form-group">
                        <div class="image-upload">
                            <label for="replyImage">📷 ${t('replies.uploadImage')}</label>
                            <input type="file" id="replyImage" name="image" accept="image/*">
                        </div>
                    </div>
                    <div class="form-actions">
                        ${currentUser ? 
                            `<button type="submit" class="btn btn-primary">${t('replies.publish')}</button>` : 
                            `<button type="button" class="btn btn-primary" onclick="showLoginModal()">${t('replies.loginToReply')}</button>`
                        }
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // 添加回复表单提交事件
    if (currentUser) {
        document.getElementById('replyForm').addEventListener('submit', handleCreateReply);
    }
}

// 渲染回复列表
function renderReplies(replies) {
    if (replies.length === 0) {
        return `<div class="empty-state"><div class="empty-state-text">${t('replies.empty')}</div></div>`;
    }
    
    return replies.map(reply => `
        <div class="reply">
            <div class="reply-header">
                <span class="reply-author">${escapeHtml(reply.author.username)}</span>
                <span class="reply-time">${formatDate(reply.created_at)}</span>
            </div>
            <div class="reply-content">${escapeHtml(reply.content)}</div>
            ${reply.image_url ? `<img src="${reply.image_url}" alt="${t('replies.replyImage')}" class="reply-image">` : ''}
        </div>
    `).join('');
}

// 处理创建回复
async function handleCreateReply(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    try {
        const response = await fetch('/api/replies', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // 清空回复表单
            form.reset();
            
            // 显示更明确的成功信息
            showNotification(`💬 ${t('replies.createSuccess')} 回复已成功添加！`, 'success');
            
            // 延迟重新加载帖子详情，让用户看到成功信息
            setTimeout(() => {
                const postId = formData.get('post_id');
                showPostDetail(postId);
            }, 1000);
        } else {
            showNotification(`❌ ${data.message || t('replies.createFailed')}`, 'error');
        }
    } catch (error) {
        showNotification(`❌ ${t('replies.createError')}`, 'error');
    }
}

// 工具函数：格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    // 计算时间差
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 60) {
        return `${minutes}${t('time.minutesAgo')}`;
    } else if (hours < 24) {
        return `${hours}${t('time.hoursAgo')}`;
    } else if (days < 30) {
        return `${days}${t('time.daysAgo')}`;
    } else {
        return date.toLocaleDateString();
    }
}

// 工具函数：转义HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', init);