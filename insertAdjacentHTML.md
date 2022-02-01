# Element.insertAdjacentHTML()

insertAdjacentHTML() 메서드는 HTML or XML 같은 특정 텍스트를 파싱하고, 특정 위치에 DOM tree 안에 원하는 node들을 추가 한다.  이미 사용중인 element 는 다시 파싱하지 않는다. 그러므로 element 안에 존재하는 element를 건드리지 않는다. (innerHtml은 과 좀 다름). innerHtml보다 작업이 덜 드므로 빠르다.
<br>
## 구문
```
element.insertAdjacentHTML(position, text);
```
position은 아래 있는 단어만 사용 가능하다.

'beforebegin'<br>
element 앞에 <br>
'afterbegin'<br>
element 안에 가장 첫번째 child<br>
'beforeend'<br>
element 안에 가장 마지막 child<br>
'afterend'<br>
element 뒤에<br>

text(인자)는 HTML 또는 XML로 해석될 수 있는 문자열이고(html code), (DOM) tree에 삽입할 수 있다.

<br>
메뉴를 추가하고 마크업 언어를 작성할 때 위치를 조정하기 위해 사용한다.

---

## Postion의 예시
```
<!-- beforebegin -->
<p>
<!-- afterbegin -->
foo
<!-- beforeend -->
</p>
<!-- afterend -->
```

## 사용 예시
```js
// <div id="one">one</div>
var d1 = document.getElementById('one');
d1.insertAdjacentHTML('afterend', '<div id="two">two</div>');

// At this point, the new structure is:
// <div id="one">one</div><div id="two">two</div>
```

# 링크
+ [insertAdjacentHTML](https://developer.mozilla.org/ko/docs/Web/API/Element/insertAdjacentHTML)