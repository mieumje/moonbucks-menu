import { menuMarkUpMessage } from "./markUpMessages.js";
const $ = (selector) => document.querySelector(selector);

const store = {
    setLocalStorage(menu) {
        localStorage.setItem("menu", JSON.stringify(menu));
    },
    getLocalStorage() {
        localStorage.getItem("menu");
    }
}

function App() {
    this.menu = [];
    const addMenuName = () => {
        if ($('#espresso-menu-name').value === "") {
            alert('메뉴이름을 입력해주세요.');
            return
        }

        const espressoMenuName = $('#espresso-menu-name').value;
        this.menu.push({ name: espressoMenuName });
        store.setLocalStorage(this.menu);
        const template = this.menu.map((Item) => {
            return `
            <li class="menu-list-item d-flex items-center py-2">
                <span class="w-100 pl-2 menu-name">${Item.name}</span>
                <button
                    type="button"
                    class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
                >
                    수정
                </button>
                <button
                    type="button"
                    class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
                >
                    삭제
                </button>
            </li>`
        }).join("");
        // const menuItemTemplate = (espressoMenuName) => {
        //     return menuMarkUpMessage(espressoMenuName)
        // };
        //$('#espresso-menu-list').insertAdjacentHTML('beforeend', menuItemTemplate(espressoMenuName));
        $('#espresso-menu-list').innerHTML = template;
        updateMenuCounts();
        $('#espresso-menu-name').value = '';
    }
    const updateMenuCounts = () => {
        const menuCount = $('#espresso-menu-list').querySelectorAll('li').length;
        $('.menu-count').innerText = `총 ${menuCount}개`;
    }
    const updateMenuName = (e) => {
        const $menuName = e.target.closest('li').querySelector('.menu-name');
        const updatedMenuName = prompt('수정할 메뉴명을 입력하세요.', $menuName.innerText);
        if (updatedMenuName === "") {
            alert('메뉴명을 입력해주세요.');
            return
        }
        $menuName.innerText = updatedMenuName;
    }
    const removeMenuName = (e) => {
        if (confirm('정말 삭제하시겠습니까?')) {
            e.target.closest('li').remove();
            updateMenuCounts();
        }
    }
    $('#espresso-menu-form').addEventListener('submit', (e) => {
        e.preventDefault();
    });
    $('#espresso-menu-submit-button').addEventListener('click', addMenuName);

    $('#espresso-menu-name').addEventListener('keypress', (e) => {
        if (e.key !== 'Enter') return
        addMenuName();
    });

    $('#espresso-menu-list').addEventListener('click', (e) => {
        if (e.target.classList.contains('menu-edit-button')) {
            updateMenuName(e);
        }

        if (e.target.classList.contains('menu-remove-button')) {
            removeMenuName(e);
        }
    })
}

App();