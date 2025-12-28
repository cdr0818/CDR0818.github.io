
        // 图书对象构造函数
        function Book(id, title, author, price, rating, inStock, image, category) {
            this.id = id;
            this.title = title;
            this.author = author;
            this.price = price;
            this.rating = rating;
            this.inStock = inStock;
            this.image = image;
            this.category = category;
        }
        
        // 用户对象字面量
        const User = {
            username: '',
            email: '',
            isLoggedIn: false,
            cart: [],
            
            login: function(username) {
                this.username = username;
                this.isLoggedIn = true;
                console.log(`${this.username} 已登录`);
            },
            
            logout: function() {
                this.username = '';
                this.isLoggedIn = false;
                this.cart = [];
                console.log('用户已退出登录');
            },
            
            addToCart: function(book) {
                this.cart.push(book);
                console.log(`《${book.title}》已加入购物车`);
            },
            
            getCartCount: function() {
                return this.cart.length;
            }
        };
        
        // 图书数据（使用构造函数创建对象）
        const booksData = [
            new Book(1, "《三体》", "刘慈欣", 59.9, 4.8, true, "https://cdr0818.github.io/image/三体.jpg", "科幻"),
            new Book(2, "《太阳的阴影》", "雷沙德·卡普希钦斯基", 39.8, 4.9, true, "https://cdr0818.github.io/image/太阳的阴影.jpg", "文学"),
            new Book(3, "《百年孤独》", "加西亚·马尔克斯", 45.5, 4.7, false, "https://cdr0818.github.io/image/百年孤独.jpg", "文学"),
            new Book(4, "《人类简史》", "尤瓦尔·赫拉利", 68.0, 4.6, true, "https://cdr0818.github.io/image/人类简史.jpg", "历史"),
            new Book(5, "《哲学家的最后一课》", "朱锐", 128.0, 4.5, true, "https://cdr0818.github.io/image/哲学家的最后一课.jpg", "科技"),
            new Book(6, "《格外的活法》", "吉井忍", 29.9, 4.4, true, "https://cdr0818.github.io/image/格外的活法.jpg", "历史"),
            new Book(7, "《人生解忧》", "成庆", 89.0, 4.3, false, "https://cdr0818.github.io/image/人生解忧.jpg", "经管"),
            new Book(8, "《九诗心》", "黄晓丹", 35.0, 4.7, true, "https://cdr0818.github.io/image/九诗心.jpg", "文学"),
            new Book(9, "《撒旦探戈》", "克拉斯诺霍尔卡伊·拉斯洛", 32.8, 4.5, true, "https://cdr0818.github.io/image/撒旦探戈.jpg", "推理"),
            new Book(10, "《闪亮的水环》", "成克拉斯诺霍尔卡伊·拉斯洛", 89.0, 4.3, false, "https://cdr0818.github.io/image/闪亮的水环.jpg", "经管"),
            new Book(11, "《沙丘1》", "弗兰克•赫伯特", 35.0, 4.7, true, "https://cdr0818.github.io/image/沙丘1.jpg", "文学"),
            new Book(12, "《反抗的忧郁》", "克拉斯诺霍尔卡伊·拉斯洛", 32.8, 4.5, true, "https://cdr0818.github.io/image/反抗的忧郁.jpg", "推理"),
            
        ];

        // 全局变量
        let currentBooks = [...booksData];
        let cartItemCount = 0;
        let countdownInterval;
        let timeUpdateInterval;
        let currentUser = Object.create(User); // 使用Object.create创建用户实例

        // 初始化页面
        document.addEventListener('DOMContentLoaded', function() {
            // 显示当前时间
            updateTime();
            timeUpdateInterval = setInterval(updateTime, 1000);
            
            // 设置倒计时
            startCountdown();
            
            // 显示随机推荐图书
            showRandomRecommendations();
            
            // 渲染图书列表
            renderBookList(currentBooks);
            
            // 绑定事件监听器
            document.getElementById('refreshRecommendations').addEventListener('click', showRandomRecommendations);
            document.getElementById('sortByPriceAsc').addEventListener('click', () => sortBooks('price', 'asc'));
            document.getElementById('sortByPriceDesc').addEventListener('click', () => sortBooks('price', 'desc'));
            document.getElementById('sortByRating').addEventListener('click', () => sortBooks('rating', 'desc'));
            document.getElementById('inStockOnly').addEventListener('change', filterInStock);
            
            // 智能搜索功能
            const searchInput = document.getElementById('smartSearchInput');
            searchInput.addEventListener('input', handleSmartSearch);
            
            // 登录表单验证
            setupLoginFormValidation();
            setupRegisterFormValidation();
        });

        // 更新时间显示
        function updateTime() {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            
            // 获取星期几
            const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
            const weekday = weekdays[now.getDay()];
            
            document.getElementById('timeDisplay').textContent = 
                `${year}年${month}月${day}日 ${weekday} ${hours}:${minutes}:${seconds}`;
        }

        // 启动倒计时
        function startCountdown() {
            // 设置活动结束时间为明天同一时间
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + 1);
            
            clearInterval(countdownInterval);
            
            updateCountdown(endDate);
            countdownInterval = setInterval(() => updateCountdown(endDate), 1000);
        }

        // 更新倒计时显示
        function updateCountdown(endDate) {
            const now = new Date();
            const diff = endDate - now;
            
            if (diff <= 0) {
                document.getElementById('countdownDisplay').textContent = "活动已结束";
                clearInterval(countdownInterval);
                return;
            }
            
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            document.getElementById('countdownDisplay').textContent = 
                `${days}天 ${hours.toString().padStart(2, '0')}小时 ${minutes.toString().padStart(2, '0')}分钟 ${seconds.toString().padStart(2, '0')}秒`;
        }

        // 显示随机推荐图书
        function showRandomRecommendations() {
            // 创建图书副本以避免修改原数组
            const booksCopy = [...booksData];
            const recommendedBooks = [];
            
            // 随机选择5本书
            for (let i = 0; i < 5; i++) {
                if (booksCopy.length === 0) break;
                
                const randomIndex = Math.floor(Math.random() * booksCopy.length);
                recommendedBooks.push(booksCopy[randomIndex]);
                booksCopy.splice(randomIndex, 1); // 移除已选择的图书
            }
            
            // 渲染推荐图书
            const container = document.getElementById('bookRecommendations');
            container.innerHTML = '';
            
            recommendedBooks.forEach(book => {
                const bookCard = document.createElement('div');
                bookCard.className = 'book-card-small';
                bookCard.innerHTML = `
                    <img src="${book.image}" alt="${book.title}" class="book-cover-small">
                    <div class="book-info-small">
                        <div class="book-title-small">${book.title}</div>
                        <div class="book-author-small">${book.author}</div>
                        <div class="book-price-small">¥${book.price.toFixed(2)}</div>
                    </div>
                `;
                container.appendChild(bookCard);
            });
        }

        // 渲染图书列表
        function renderBookList(books) {
            const container = document.getElementById('bookList');
            container.innerHTML = '';
            
            books.forEach(book => {
                const bookItem = document.createElement('div');
                bookItem.className = `book-item ${book.inStock ? '' : 'out-of-stock'}`;
                bookItem.innerHTML = `
                    <img src="${book.image}" alt="${book.title}" class="book-cover-main">
                    <div class="book-details">
                        <div class="book-title-main">${book.title}</div>
                        <div class="book-author-main">${book.author}</div>
                        <div class="book-rating">
                            ${'★'.repeat(Math.floor(book.rating))}
                            ${'☆'.repeat(5 - Math.floor(book.rating))}
                            (${book.rating})
                        </div>
                        <div class="book-price-main">¥${book.price.toFixed(2)}</div>
                        <div class="stock-status">${book.inStock ? '有货' : '缺货'}</div>
                    </div>
                `;
                container.appendChild(bookItem);
            });
        }

        // 排序图书
        function sortBooks(field, order) {
            currentBooks.sort((a, b) => {
                if (order === 'asc') {
                    return a[field] - b[field];
                } else {
                    return b[field] - a[field];
                }
            });
            renderBookList(currentBooks);
        }

        // 筛选有货图书
        function filterInStock() {
            const inStockOnly = document.getElementById('inStockOnly').checked;
            
            if (inStockOnly) {
                const filteredBooks = currentBooks.filter(book => book.inStock);
                renderBookList(filteredBooks);
            } else {
                renderBookList(currentBooks);
            }
        }

        // 智能搜索功能
        function handleSmartSearch(event) {
            const query = event.target.value.trim().toLowerCase();
            const resultsContainer = document.getElementById('smartSearchResults');
            
            if (query === '') {
                resultsContainer.style.display = 'none';
                return;
            }
            
            // 搜索匹配的图书
            const matchedBooks = booksData.filter(book => 
                book.title.toLowerCase().includes(query) || 
                book.author.toLowerCase().includes(query) ||
                book.category.toLowerCase().includes(query)
            );
            
            // 渲染搜索结果
            if (matchedBooks.length > 0) {
                resultsContainer.innerHTML = '';
                matchedBooks.slice(0, 5).forEach(book => {
                    const resultItem = document.createElement('div');
                    resultItem.className = 'search-result-item';
                    resultItem.innerHTML = `
                        <div class="search-result-title">${book.title}</div>
                        <div class="search-result-meta">作者: ${book.author} | 分类: ${book.category}</div>
                    `;
                    resultItem.addEventListener('click', () => {
                        // 点击搜索结果跳转到对应图书
                        document.getElementById('smartSearchInput').value = book.title;
                        resultsContainer.style.display = 'none';
                        // 这里可以添加跳转逻辑
                    });
                    resultsContainer.appendChild(resultItem);
                });
                resultsContainer.style.display = 'block';
            } else {
                resultsContainer.innerHTML = '<div class="search-result-item">未找到相关图书</div>';
                resultsContainer.style.display = 'block';
            }
        }

        // 设置登录表单验证
        function setupLoginFormValidation() {
            const usernameInput = document.getElementById('username');
            const passwordInput = document.getElementById('password');
            const loginBtn = document.getElementById('loginBtn');
            
            // 用户名验证
            usernameInput.addEventListener('input', function() {
                const value = this.value;
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                const phoneRegex = /^1[3-9]\d{9}$/;
                
                const errorEl = document.getElementById('usernameError');
                const successEl = document.getElementById('usernameSuccess');
                
                if (value === '') {
                    errorEl.style.display = 'none';
                    successEl.style.display = 'none';
                    loginBtn.disabled = true;
                } else if (emailRegex.test(value) || phoneRegex.test(value)) {
                    errorEl.style.display = 'none';
                    successEl.textContent = '格式正确';
                    successEl.style.display = 'block';
                    checkLoginFormValidity();
                } else {
                    errorEl.textContent = '请输入有效的邮箱或手机号';
                    errorEl.style.display = 'block';
                    successEl.style.display = 'none';
                    loginBtn.disabled = true;
                }
            });
            
            // 密码强度检测
            passwordInput.addEventListener('input', function() {
                const value = this.value;
                const strengthMeter = document.getElementById('passwordStrength');
                const errorEl = document.getElementById('passwordError');
                const successEl = document.getElementById('passwordSuccess');
                
                if (value === '') {
                    strengthMeter.className = 'strength-meter';
                    errorEl.style.display = 'none';
                    successEl.style.display = 'none';
                    loginBtn.disabled = true;
                    return;
                }
                
                let strength = 0;
                if (value.length >= 8) strength++;
                if (/[a-z]/.test(value)) strength++;
                if (/[A-Z]/.test(value)) strength++;
                if (/\d/.test(value)) strength++;
                if (/[^a-zA-Z0-9]/.test(value)) strength++;
                
                if (strength < 3) {
                    strengthMeter.className = 'strength-meter strength-weak';
                    errorEl.textContent = '密码强度较弱';
                    errorEl.style.display = 'block';
                    successEl.style.display = 'none';
                } else if (strength < 5) {
                    strengthMeter.className = 'strength-meter strength-medium';
                    errorEl.style.display = 'none';
                    successEl.textContent = '密码强度中等';
                    successEl.style.display = 'block';
                } else {
                    strengthMeter.className = 'strength-meter strength-strong';
                    errorEl.style.display = 'none';
                    successEl.textContent = '密码强度很强';
                    successEl.style.display = 'block';
                }
                
                checkLoginFormValidity();
            });
            
            // 检查登录表单有效性
            function checkLoginFormValidity() {
                const isUsernameValid = document.getElementById('usernameSuccess').style.display === 'block';
                const isPasswordValid = document.getElementById('passwordSuccess').style.display === 'block';
                
                loginBtn.disabled = !(isUsernameValid && isPasswordValid);
            }
            
            // 登录表单提交
            document.querySelector('#login-modal').addEventListener('submit', function(e) {
                e.preventDefault();
                const username = usernameInput.value;
                const password = passwordInput.value;
                
                // 模拟登录过程
                currentUser.login(username);
                document.getElementById('cartCount').textContent = currentUser.getCartCount();
                
                showToast(`欢迎回来，${username}！`);
                // 关闭模态框
                window.location.hash = '';
            });
        }

        // 设置注册表单验证
        function setupRegisterFormValidation() {
            const regUsernameInput = document.getElementById('regUsername');
            const regEmailInput = document.getElementById('regEmail');
            const regPasswordInput = document.getElementById('regPassword');
            const regConfirmPasswordInput = document.getElementById('regConfirmPassword');
            const registerBtn = document.getElementById('registerBtn');
            
            // 用户名验证
            regUsernameInput.addEventListener('input', function() {
                const value = this.value;
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                const phoneRegex = /^1[3-9]\d{9}$/;
                
                const errorEl = document.getElementById('regUsernameError');
                const successEl = document.getElementById('regUsernameSuccess');
                
                if (value === '') {
                    errorEl.style.display = 'none';
                    successEl.style.display = 'none';
                    registerBtn.disabled = true;
                } else if (emailRegex.test(value) || phoneRegex.test(value)) {
                    errorEl.style.display = 'none';
                    successEl.textContent = '格式正确';
                    successEl.style.display = 'block';
                    checkRegisterFormValidity();
                } else {
                    errorEl.textContent = '请输入有效的邮箱或手机号';
                    errorEl.style.display = 'block';
                    successEl.style.display = 'none';
                    registerBtn.disabled = true;
                }
            });
            
            // 邮箱验证
            regEmailInput.addEventListener('input', function() {
                const value = this.value;
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                
                const errorEl = document.getElementById('regEmailError');
                const successEl = document.getElementById('regEmailSuccess');
                
                if (value === '') {
                    errorEl.style.display = 'none';
                    successEl.style.display = 'none';
                    registerBtn.disabled = true;
                } else if (emailRegex.test(value)) {
                    errorEl.style.display = 'none';
                    successEl.textContent = '邮箱格式正确';
                    successEl.style.display = 'block';
                    checkRegisterFormValidity();
                } else {
                    errorEl.textContent = '请输入有效的邮箱地址';
                    errorEl.style.display = 'block';
                    successEl.style.display = 'none';
                    registerBtn.disabled = true;
                }
            });
            
            // 密码强度检测
            regPasswordInput.addEventListener('input', function() {
                const value = this.value;
                const strengthMeter = document.getElementById('regPasswordStrength');
                const errorEl = document.getElementById('regPasswordError');
                const successEl = document.getElementById('regPasswordSuccess');
                
                if (value === '') {
                    strengthMeter.className = 'strength-meter';
                    errorEl.style.display = 'none';
                    successEl.style.display = 'none';
                    registerBtn.disabled = true;
                    return;
                }
                
                let strength = 0;
                if (value.length >= 8) strength++;
                if (/[a-z]/.test(value)) strength++;
                if (/[A-Z]/.test(value)) strength++;
                if (/\d/.test(value)) strength++;
                if (/[^a-zA-Z0-9]/.test(value)) strength++;
                
                if (strength < 3) {
                    strengthMeter.className = 'strength-meter strength-weak';
                    errorEl.textContent = '密码强度较弱';
                    errorEl.style.display = 'block';
                    successEl.style.display = 'none';
                } else if (strength < 5) {
                    strengthMeter.className = 'strength-meter strength-medium';
                    errorEl.style.display = 'none';
                    successEl.textContent = '密码强度中等';
                    successEl.style.display = 'block';
                } else {
                    strengthMeter.className = 'strength-meter strength-strong';
                    errorEl.style.display = 'none';
                    successEl.textContent = '密码强度很强';
                    successEl.style.display = 'block';
                }
                
                checkRegisterFormValidity();
            });
            
            // 确认密码验证
            regConfirmPasswordInput.addEventListener('input', function() {
                const password = regPasswordInput.value;
                const confirmPassword = this.value;
                
                const errorEl = document.getElementById('regConfirmPasswordError');
                const successEl = document.getElementById('regConfirmPasswordSuccess');
                
                if (confirmPassword === '') {
                    errorEl.style.display = 'none';
                    successEl.style.display = 'none';
                    registerBtn.disabled = true;
                } else if (confirmPassword === password) {
                    errorEl.style.display = 'none';
                    successEl.textContent = '两次密码一致';
                    successEl.style.display = 'block';
                    checkRegisterFormValidity();
                } else {
                    errorEl.textContent = '两次输入的密码不一致';
                    errorEl.style.display = 'block';
                    successEl.style.display = 'none';
                    registerBtn.disabled = true;
                }
            });
            
            // 检查注册表单有效性
            function checkRegisterFormValidity() {
                const isUsernameValid = document.getElementById('regUsernameSuccess').style.display === 'block';
                const isEmailValid = document.getElementById('regEmailSuccess').style.display === 'block';
                const isPasswordValid = document.getElementById('regPasswordSuccess').style.display === 'block';
                const isConfirmPasswordValid = document.getElementById('regConfirmPasswordSuccess').style.display === 'block';
                
                registerBtn.disabled = !(isUsernameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid);
            }
            
            // 注册表单提交
            document.querySelector('#register-modal').addEventListener('submit', function(e) {
                e.preventDefault();
                const username = regUsernameInput.value;
                
                // 模拟注册过程
                currentUser.login(username);
                document.getElementById('cartCount').textContent = currentUser.getCartCount();
                
                showToast(`注册成功，欢迎 ${username}！`);
                // 关闭模态框
                window.location.hash = '';
            });
        }

        // 添加到购物车功能
        function addToCart(bookName) {
            cartItemCount++;
            document.getElementById('cartCount').textContent = cartItemCount;
            showToast(`《${bookName}》已加入购物车！`);
        }

        // 显示提示消息
        function showToast(message) {
            const toast = document.getElementById('toast');
            toast.textContent = message;
            toast.classList.add('show');
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }

        // 返回顶部功能
        function scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }

        // 滚动监听
        window.addEventListener('scroll', function() {
            const backToTop = document.getElementById('backToTop');
            if (window.pageYOffset > 200) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        });

        // 表单验证
        function validateInput() {
            const inputVal = document.getElementById('user-input').value;
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            
            if (inputVal.includes('@') && !emailRegex.test(inputVal)) {
                alert('邮箱格式错误，请重新输入');
                return false;
            }
            return true;
        }
        
        // 使用多种DOM获取方法示例
        function demonstrateDOMMethods() {
            // 1. getElementById
            const timeDisplay = document.getElementById('timeDisplay');
            
            // 2. getElementsByClassName
            const bookCards = document.getElementsByClassName('book-card');
            
            // 3. getElementsByTagName
            const allDivs = document.getElementsByTagName('div');
            
            // 4. querySelector
            const firstBookTitle = document.querySelector('.book-title');
            
            // 5. querySelectorAll
            const allBookTitles = document.querySelectorAll('.book-title');
            
            // 动态创建元素
            const newElement = document.createElement('div');
            newElement.textContent = '这是动态创建的元素';
            newElement.className = 'dynamic-element';
            
            // 动态添加元素
            if (timeDisplay) {
                timeDisplay.appendChild(newElement);
            }
            
            // 修改元素样式
            if (firstBookTitle) {
                firstBookTitle.style.color = '#1976d2';
                firstBookTitle.style.fontWeight = 'bold';
            }
            
            // 删除元素
            setTimeout(() => {
                if (newElement.parentNode) {
                    newElement.parentNode.removeChild(newElement);
                }
            }, 3000);
        }
        
        // 页面加载完成后演示DOM方法
        window.addEventListener('load', demonstrateDOMMethods);
    