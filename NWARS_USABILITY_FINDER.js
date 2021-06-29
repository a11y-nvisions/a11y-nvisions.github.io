const SearchingStart = () => {
  function wait(ms) {
    return new Promise(resolve => setTimeout(() => resolve(`Promise Test`), ms));
  };
  async function clickIt(el) {
    await wait(50).then(_ => {
      el.click();
    });
    return el;
  }
  async function find(el, idx) {
    await wait(100);
    const _f = [...el.querySelectorAll('.showIssues td:nth-child(3)')].filter((e) => {
      return e.innerHTML == idx;
    });
    if (_f.length === 1) {
      return [el, _f[0]];
    }
  }
  async function findIssue(num) {
    const Expands = [...document.querySelectorAll('[data-task]')];
    let rst2;
    for (const e of Expands) {
      const rst = await clickIt(e);
      rst2 = await find(document.querySelector(`#task-${rst.getAttribute('data-task')}`), num);
      if (rst2) {
        await rst2[0].querySelector('a.showDetail');
        return rst2;
      }
    }
  }
  const goTo = prompt('찾고자 하는 이슈 번호를 입력하세요.', '');
  findIssue(goTo).then((result) => {
    if (!result) {
      alert('유효하지 않은 이슈번호를 입력한 것 같습니다.');
    } else {
      const cells = [...result[1].parentElement.cells];
      const table = result[1].parentElement.parentElement.parentElement;
      const headers = [...table.querySelectorAll('thead th')];
      let HeadersMap = headers.map(e => {
        return e.innerText;
      });
      let BodyMap = cells.map((e, i) => {
        return e.innerText;
      });
      const GoneOrEnter = confirm('아래와 같은 이슈를 찾았습니다.\n' + `${HeadersMap[0]}: ${BodyMap[0]}\n` + `${HeadersMap[1]}: ${BodyMap[1]}\n` + `${HeadersMap[2]}: ${BodyMap[2]}\n` + `${HeadersMap[3]}: ${BodyMap[3]}\n` + `${HeadersMap[4]}: ${BodyMap[4]}\n` + `${HeadersMap[5]}: ${BodyMap[5]}\n` + `${HeadersMap[6]}: ${BodyMap[6]}\n` + '페이지로 바로 이동하시겠습니까? 아니오를 누르면 초점만 이동됩니다. 예를 누르면 새로운 창으로 열립니다. 승인된 이슈에는 초점만 이동됩니다.');
      if (GoneOrEnter) {
        const issueDetail = document.querySelector(`#${result[1].parentElement.querySelector('.showDetail').getAttribute('aria-controls')}`);
        const editLink = issueDetail.querySelector('a.btns.btn-green');
        if (editLink) {
          window.open(editLink.href, '_blank', "menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes");
        } else {
          result[1].parentElement.querySelector('.showDetail').focus();
        }
      } else {
        result[1].parentElement.querySelector('.showDetail').focus();
      }
    }
    return;
  });
}