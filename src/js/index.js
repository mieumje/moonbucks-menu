import { menuMarkUpMessage } from "./markUpMessages.js";
import { $ } from "./utils/dom.js";
import store from "./store/index.js";
const BASE_URL = 'http://localhost:3000';

const MenuApi = {
    async getAllMenuByCategory(category) {
        const response = await fetch(`${BASE_URL}/api/category/${category}/menu`);
        return response.json();
    },
    async createMenu(category, name) {
        const response = await fetch(`${BASE_URL}/api/category/${category}/menu`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name }),
        });
        if (!response.ok) console.log("에러가 발생했습니다.");
    },
    async updateMenu(category, name, menuId) {
        const response = await fetch(`${BASE_URL}/api/category/${category}/menu/${menuId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name }),
        });
        if (!response.ok) console.log("에러가 발생했습니다.");
        return response.json()
    }
}

function App() {
    this.menu = {
        espresso: [],
        frappuccino: [],
        blended: [],
        teavana: [],
        desert: [],
    };
    this.currentCategory = 'espresso';
    this.init = async () => {
        this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(this.currentCategory);
        console.log(this.menu[this.currentCategory])
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
        await MenuApi.createMenu(this.currentCategory, menuName);

        this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(this.currentCategory);
        render();
        $('#menu-name').value = '';

    }
    const updateMenuCounts = () => {
        const menuCount = this.menu[this.currentCategory].length;
        $('.menu-count').innerText = `총 ${menuCount}개`;
    }
    const updateMenuName = async (e) => {
        const menuId = e.target.closest('li').dataset.menuId;
        const $menuName = e.target.closest('li').querySelector('.menu-name');
        const updatedMenuName = prompt('수정할 메뉴명을 입력하세요.', $menuName.innerText);
        if (updatedMenuName === "") {
            alert('메뉴명을 입력해주세요.');
            return
        }
        await MenuApi.updateMenu(this.currentCategory, updatedMenuName, menuId);
        this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(this.currentCategory);
        //this.menu[this.currentCategory][menuId].name = updatedMenuName;
        //store.setLocalStorage(this.menu);
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
        $('nav').addEventListener('click', async (e) => {
            const isCategoryName = e.target.classList.contains('cafe-category-name');
            if (isCategoryName) {
                const categoryName = e.target.dataset.categoryName;
                this.currentCategory = categoryName;
                this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(this.currentCategory);
                render();
                $('#category-title').innerText = `${e.target.innerText} 메뉴 관리`
            }

        });
    };


}

const app = new App();
app.init();