// assets/script.js
document.addEventListener('DOMContentLoaded', function () {
    class AdaptiveMenu {
        constructor() {
            this.visibleList = document.querySelector('.header__list--visible');
            this.dropdownList = document.querySelector('.header__list--dropdown');
            this.allItems = document.querySelectorAll('.header__list--all .header__list-item');
            this.moreWrapper = document.querySelector('.header__more-wrapper');
            this.moreButton = document.querySelector('.header__more-button');
            this.navVisible = document.querySelector('.header__nav-visible');

            this.isExpanded = false;
            this.init();
        }

        init() {
            this.distributeItems();
            this.addEventListeners();

            window.addEventListener('resize', this.debounce(() => {
                this.distributeItems();
                this.closeDropdown();
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
            this.checkOverflow();
        }

        checkOverflow() {
            const visibleItems = this.visibleList.querySelectorAll('.header__list-item');
            const navRect = this.navVisible.getBoundingClientRect();
            const moreButtonWidth = 70; // Ширина кнопки "Ещё"

            if (visibleItems.length === 0) return;

            // Измеряем ширину всех элементов
            let totalWidth = 0;
            const itemWidths = [];

            visibleItems.forEach(item => {
                const itemRect = item.getBoundingClientRect();
                itemWidths.push(itemRect.width);
                totalWidth += itemRect.width;
            });
            console.log('navRect', navRect, moreButtonWidth)
            const availableWidth = navRect.width - moreButtonWidth - 20; // 20px для отступов
            console.log('availableWidth', availableWidth, 'totalWidth', totalWidth)
            // Если все элементы помещаются - скрываем кнопку "Ещё"
            if (totalWidth <= availableWidth) {
                this.moreWrapper.style.display = 'none';
                return;
            }

            // Показываем кнопку "Ещё"
            this.moreWrapper.style.display = 'block';

            // Находим, сколько элементов помещается справа
            let visibleCount = 0;
            let currentWidth = 0;

            // Идём с конца массива (справа налево)
            for (let i = 0; i < visibleItems.length; i++) {
                if (currentWidth + itemWidths[i] <= availableWidth) {
                    currentWidth += itemWidths[i];
                    console.log('visibleItems[i]', visibleItems[i].textContent)
                    visibleCount++;
                } else {
                    break;
                }
            }
            console.log('visibleCount', visibleCount, 'currentWidth', currentWidth)
            // Переносим элементы, которые не поместились справа, в выпадающий список
            // Это элементы с начала списка (слева)
            const dropdownStart = visibleCount;

            for (let i = dropdownStart; i < visibleItems.length; i++) {
                const clone = visibleItems[i].cloneNode(true);
                this.dropdownList.appendChild(clone);
            }

            // Удаляем перенесенные элементы из видимого списка
            for (let i = dropdownStart; i < visibleItems.length; i++) {

                visibleItems[i].remove();

            }
        }

        addEventListeners() {
            // Переключение выпадающего списка
            this.moreButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleDropdown();
            });

            // Закрытие при клике вне области
            document.addEventListener('click', (e) => {
                if (!this.moreWrapper.contains(e.target)) {
                    this.closeDropdown();
                }
            });

            // Закрытие при клике на ссылку в выпадающем списке
            this.dropdownList.addEventListener('click', (e) => {
                if (e.target.tagName === 'A') {
                    this.closeDropdown();
                }
            });

            // Закрытие при скролле
            window.addEventListener('scroll', () => {
                this.closeDropdown();
            });

            // Закрытие при изменении размера окна
            window.addEventListener('resize', () => {
                this.closeDropdown();
            });
        }

        toggleDropdown() {
            this.isExpanded = !this.isExpanded;

            if (this.isExpanded) {
                this.moreButton.classList.add('header__more-button--expanded');
            } else {
                this.moreButton.classList.remove('header__more-button--expanded');
            }
        }

        closeDropdown() {
            this.isExpanded = false;
            this.moreButton.classList.remove('header__more-button--expanded');
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

    // Инициализируем адаптивное меню
    new AdaptiveMenu();
});