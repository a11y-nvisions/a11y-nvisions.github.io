/**
 * PopupFocusRepeater 함수는 aria-haspopup="dialog" 속성을 가진 버튼 및 input[type="button"]에 대한 접근성 개선을 위해 만들어졌습니다.
 * 이 함수는 DOMContentLoaded 이벤트가 발생한 후에 실행해야 하며, 대화상자(dialog)를 여는 요소의 포커스 관리를 자동화합니다.
 * 요소 클릭 시 대화상자로 포커스를 이동시키고, 대화상자가 닫힐 때 기존 요소로 포커스를 되돌립니다.
 * 안드로이드 디바이스를 제외하고 대화상자에 aria-label 속성을 추가합니다.
 */
function PopupFocusRepeater() {
    const elements = document.querySelectorAll('button[aria-expanded][aria-haspopup="dialog"][aria-controls], input[type="button"][aria-expanded][aria-haspopup="dialog"][aria-controls], [role="button"][aria-expanded][aria-haspopup="dialog"][aria-controls]');
    const wait = (mils = 500) => new Promise(resolve => setTimeout(resolve, mils));
    const isAndroid = /Android/i.test(navigator.userAgent);

    elements.forEach(element => {
        element.addEventListener('click', async function () {
            await wait(500); // 0.5초 대기

            if (element.getAttribute('aria-expanded') === 'true') {
                const controlledElementId = element.getAttribute('aria-controls');
                const controlledElement = document.getElementById(controlledElementId);

                if (!controlledElement.hasAttribute('role') || controlledElement.getAttribute('role') !== 'dialog') {
                    controlledElement.setAttribute('role', 'dialog');
                }

                if (!isAndroid && !controlledElement.hasAttribute('aria-label')) {
                    let elementLabel = element.textContent || element.getAttribute('aria-label');
                    controlledElement.setAttribute('aria-label', elementLabel.trim());
                }

                if (!controlledElement.hasAttribute('tabindex') || controlledElement.getAttribute('tabindex') !== '-1') {
                    controlledElement.setAttribute('tabindex', '-1');
                }

                if (document.activeElement === element) {
                    controlledElement.focus();
                }

                // Element의 상태 변화를 감지하는 Observer 생성
                const elementObserver = new MutationObserver(mutations => {
                    mutations.forEach(mutation => {
                        if (mutation.type === 'attributes' && mutation.attributeName === 'aria-expanded' && element.getAttribute('aria-expanded') === 'false') {
                            element.focus();
                            elementObserver.disconnect();
                        } else if (mutation.type === 'childList' && !document.body.contains(element)) {
                            // 요소가 DOM에서 제거된 경우
                            elementObserver.disconnect();
                        }
                    });
                });

                elementObserver.observe(document.body, { attributes: true, childList: true, subtree: true });
                element.observer = elementObserver;
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', PopupFocusRepeater);
