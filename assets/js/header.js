document.addEventListener('DOMContentLoaded', function() {
    class AdaptiveMenu {
        constructor() {
            this.visibleList = document.querySelector('.header__list--visible');
            this.dropdownList = document.querySelector('.header__list--dropdown');
            this.allItems = document.querySelectorAll('.header__list--all .header__list-item');
            this.moreWrapper = document.querySelector('.header__more-wrapper');
            this.moreButton = document.querySelector('.header__more-button');
            this.navVisible = document.querySelector('.header__nav-visible');
            
            this.init();
        }
        
        init() {
            this.distributeItems();
            this.addEventListeners();
            
            // Перераспределяем при изменении размера окна
            window.addEventListener('resize', this.debounce(() => {
                this.distributeItems();
            }, 250));
        }
        
        distributeItems() {
            // Очищаем списки
            this.visibleList.innerHTML = '';
            this.dropdownList.innerHTML = '';
            
            // Сначала добавляем все элементы в видимый список
            this.allItems.forEach(item => {
                const clone = item.cloneNode(true);
                this.visibleList.appendChild(clone);
            });
            
            // Проверяем, какие элементы не помещаются
            this.hideOverflowingItems();
        }
        
        hideOverflowingItems() {
            const visibleItems = this.visibleList.querySelectorAll('.header__list-item');
            const navRect = this.navVisible.getBoundingClientRect();
            const moreButtonWidth = 80; // Примерная ширина кнопки "Ещё"
            const availableWidth = navRect.width - moreButtonWidth;
            
            let visibleCount = 0;
            let totalWidth = 0;
            
            // Находим сколько элементов помещается
            for (let i = 0; i < visibleItems.length; i++) {
                const item = visibleItems[i];
                const itemRect = item.getBoundingClientRect();
                
                if (totalWidth + itemRect.width <= availableWidth) {
                    totalWidth += itemRect.width;
                    visibleCount++;
                } else {
                    break;
                }
            }
            
            // Если все элементы помещаются - скрываем кнопку "Ещё"
            if (visibleCount === visibleItems.length) {
                this.moreWrapper.style.display = 'none';
                return;
            }
            
            // Показываем кнопку "Ещё"
            this.moreWrapper.style.display = 'flex';
            
            // Переносим непоместившиеся элементы в выпадающий список
            for (let i = visibleCount; i < visibleItems.length; i++) {
                const item = visibleItems[i];
                const clone = item.cloneNode(true);
                this.dropdownList.appendChild(clone);
            }
            
            // Удаляем непоместившиеся элементы из видимого списка
            for (let i = visibleItems.length - 1; i >= visibleCount; i--) {
                visibleItems[i].remove();
            }
        }
        
        addEventListeners() {
            // Для мобильных устройств - переключение по клику
            if (window.innerWidth <= 768) {
                this.moreButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.moreWrapper.classList.toggle('header__more-wrapper--expanded');
                });
                
                // Закрываем при клике вне области
                document.addEventListener('click', () => {
                    this.moreWrapper.classList.remove('header__more-wrapper--expanded');
                });
                
                // Не закрываем при клике внутри выпадашки
                this.dropdownList.addEventListener('click', (e) => {
                    e.stopPropagation();
                });
            }
            
            // Закрываем выпадашку при скролле
            window.addEventListener('scroll', () => {
                this.moreWrapper.classList.remove('header__more-wrapper--expanded');
            });
        }
        
        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }
    }
    
    // Инициализируем меню
    new AdaptiveMenu();
});