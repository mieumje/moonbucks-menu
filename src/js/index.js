import { menuMarkUpMessage } from "./markUpMessages.js";
import { $ } from "./utils/dom.js";
import store from "./store/index.js";
const BASE_URL = 'http://localhost:3000';

function App() {
    this.menu = {
        espresso: [],
        frappuccino: [],
        blended: [],
        teavana: [],
        desert: [],
    };
    this.currentCategory = 'espresso';
    this.init = () => {
        if (store.getLocalStorage()) {
            this.menu = store.getLocalStorage();
        }
        initEventListener();
        render();
    }

    const render = () => {
        const menuTemplate = this.menu[this.currentCategory].map((Item, index) => {
            return menuMarkUpMessage(Item, index);
        }).join("");

        $('#menu-list').innerHTML = menuTemplate;
        updateMenuCounts();
    }
    const addMenuName = async () => {
        if ($('#menu-name').value === "") {
            alert('메뉴이름을 입력해주세요.');
            return
        }

        const menuName = $('#menu-name').value;
        //this.menu[this.currentCategory].push({ name: menuName });
        await fetch(`${BASE_URL}/api/category/${this.currentCategory}/menu`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: menuName }),
        }).then(response => {
            return response.json()
        }).then(data => {
            console.log(data);
        });

        await fetch(`${BASE_URL}/api/category/${this.currentCategory}/menu`)
            .then(response => {
                return response.json()
            }).then(data => {
                this.menu[this.currentCategory] = data;
                render();
                $('#menu-name').value = '';
            });
    }
    const updateMenuCounts = () => {
        const menuCount = this.menu[this.currentCategory].length;
        $('.menu-count').innerText = `총 ${menuCount}개`;
    }
    const updateMenuName = (e) => {
        const menuId = e.target.closest('li').dataset.menuId;
        const $menuName = e.target.closest('li').querySelector('.menu-name');
        const updatedMenuName = prompt('수정할 메뉴명을 입력하세요.', $menuName.innerText);
        if (updatedMenuName === "") {
            alert('메뉴명을 입력해주세요.');
            return
        }
        this.menu[this.currentCategory][menuId].name = updatedMenuName;
        store.setLocalStorage(this.menu);
        render();
    }
    const removeMenuName = (e) => {
        if (confirm('정말 삭제하시겠습니까?')) {
            const menuId = e.target.closest('li').dataset.menuId;
            this.menu[this.currentCategory].splice(menuId, 1);
            store.setLocalStorage(this.menu);
            render();
        }
    }
    const soldOutMenu = (e) => {
        const menuId = e.target.closest('li').dataset.menuId;
        this.menu[this.currentCategory][menuId].soldOut = !this.menu[this.currentCategory][menuId].soldOut;
        store.setLocalStorage(this.menu);
        render();
    }

    const initEventListener = () => {
        $('#menu-form').addEventListener('submit', (e) => {
            e.preventDefault();
        });
        $('#menu-submit-button').addEventListener('click', addMenuName);

        $('#menu-name').addEventListener('keypress', (e) => {
            if (e.key !== 'Enter') return
            addMenuName();
        });

        $('#menu-list').addEventListener('click', (e) => {
            if (e.target.classList.contains('menu-edit-button')) {
                updateMenuName(e);
                return
            }

            if (e.target.classList.contains('menu-remove-button')) {
                removeMenuName(e);
                return
            }
            if (e.target.classList.contains('menu-sold-out-button')) {
                soldOutMenu(e);
                return
            }
        });
        $('nav').addEventListener('click', (e) => {
            const isCategoryName = e.target.classList.contains('cafe-category-name');
            if (isCategoryName) {
                const categoryName = e.target.dataset.categoryName;
                this.currentCategory = categoryName;
                render();
                $('#category-title').innerText = `${e.target.innerText} 메뉴 관리`
            }

        });
    };


}

const app = new App();
app.init();