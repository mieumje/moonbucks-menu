function App() {
    // form 태그가 자동으로 전송되는걸 막기(제출시 새로고침 되는 현상)
    document.querySelector('#espresso-menu-form').addEventListener('submit', (e) => {
        e.preventDefault();
    })
    // 메뉴의 이름을 입력 받기
    document.querySelector('#espresso-menu-name').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            console.log(document.querySelector('#espresso-menu-name').value);
        }
    });
}

App();