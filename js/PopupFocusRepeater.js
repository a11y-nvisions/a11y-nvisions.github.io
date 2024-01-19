/**
 * PopupFocusRepeater 함수는 aria-haspopup="dialog" 속성을 가진 버튼에 대한 접근성 개선을 위해 만들어졌습니다.
 * 이 함수는 DOMContentLoaded 이벤트가 발생한 후에 실행해야 하며, 대화상자(dialog)를 여는 버튼의 포커스 관리를 자동화합니다.
 * 버튼 클릭 시 대화상자로 포커스를 이동시키고, 대화상자가 닫힐 때 기존 버튼으로 포커스를 되돌립니다.
 * 안드로이드 디바이스를 제외하고 대화상자에 aria-label 속성을 추가합니다.
 */
function PopupFocusRepeater() {
    // aria-haspopup="dialog" 속성을 가진 모든 버튼을 찾습니다.
    const buttons = document.querySelectorAll('button[aria-expanded][aria-haspopup="dialog"][aria-controls], [role="button"][aria-expanded][aria-haspopup="dialog"][aria-controls]');
    const wait = (mils = 500) => new Promise(resolve => setTimeout(resolve, mils));
    const isAndroid = /Android/i.test(navigator.userAgent);

    buttons.forEach(button => {
        // 버튼 클릭 이벤트 리스너: 클릭 시 대화상자 관련 작업을 수행합니다.
        button.addEventListener('click', async function () {
            await wait(500); // 0.5초 대기

            // aria-expanded가 true일 경우 대화상자 관련 작업을 시작합니다.
            if (button.getAttribute('aria-expanded') === 'true') {
                const controlledElementId = button.getAttribute('aria-controls');
                const controlledElement = document.getElementById(controlledElementId);

                // 대화상자에 role="dialog" 속성이 없으면 추가합니다.
                if (!controlledElement.hasAttribute('role') || controlledElement.getAttribute('role') !== 'dialog') {
                    controlledElement.setAttribute('role', 'dialog');
                }

                // 안드로이드가 아닌 경우에만 대화상자에 aria-label 속성을 추가합니다.
                if (!isAndroid && !controlledElement.hasAttribute('aria-label')) {
                    let buttonLabel = button.textContent || button.getAttribute('aria-label');
                    controlledElement.setAttribute('aria-label', buttonLabel.trim());
                }

                // 대화상자에 tabindex 속성이 없으면 추가합니다. 이는 포커스를 보내기 위함입니다.
                if (!controlledElement.hasAttribute('tabindex') || controlledElement.getAttribute('tabindex') !== '-1') {
                    controlledElement.setAttribute('tabindex', '-1');
                }

                // 현재 버튼에 포커스가 있는 경우 대화상자로 포커스를 이동합니다.
                if (document.activeElement === button) {
                    controlledElement.focus();
                }

                // MutationObserver를 생성하여 aria-expanded 속성의 변경을 감지합니다.
                // 이는 대화상자가 닫히고 기존 버튼으로 포커스를 되돌리는 것을 감지하기 위함입니다.
                const observer = new MutationObserver((mutations) => {
                    for (const mutation of mutations) {
                        if (mutation.type === 'attributes' && mutation.attributeName === 'aria-expanded' && button.getAttribute('aria-expanded') === 'false') {
                            button.focus();
                            observer.disconnect(); // 대화상자가 닫힌 후에는 감시를 중단합니다.
                        }
                    }
                });

                observer.observe(button, { attributes: true });
            }
        });
    });
}
