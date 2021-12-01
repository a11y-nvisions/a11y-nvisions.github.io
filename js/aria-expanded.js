var expandButtons = document.querySelectorAll('[role="button"][aria-expanded][aria-controls], button[aria-expanded][aria-controls]');
expandButtons.forEach(function (expandButton) {
    expandedEvent(expandButton);
});

function expandedEvent(btn) {
	if (btn.expandEvent) {
		return false;
	}
	btn.expandEvent = true;
	btn.addEventListener("click", function () {
		setTimeout(function() {
			var expandEl = document.querySelector("#" + btn.getAttribute("aria-controls"));
			if (!expandEl) return;
			expandButtons.forEach(function (expandButton) {
				var ariaControls = expandButton.getAttribute("aria-controls")
				var expandEls = document.querySelector("#" + ariaControls);
				if (window.getComputedStyle(expandEls).display === 'none') {
					expandButton.setAttribute("aria-expanded", false);
				} else if (expandEls.getAttribute('aria-hidden') === true) {
					expandButton.setAttribute("aria-expanded", false);
				}
								});
			if (btn.getAttribute("aria-expanded") === 'true' && window.getComputedStyle(expandEl).display === 'none') {
				expandedClose(btn, expandEl);
			} else if (btn.getAttribute("aria-expanded") === 'false' && window.getComputedStyle(expandEl).display === 'block') {
				expandedOpen(btn, expandEl);
			} else if (btn.getAttribute("aria-expanded") === 'true' && expandEl.getAttribute('aria-hidden') === 'true') {
				expandedClose(btn, expandEl);
			} else if (btn.getAttribute('aria-expanded') === 'false' && expandEl.getAttribute('aria-hidden') === 'false') {
				expandedOpen(btn, expandEl);
			};

			if (expandEl) {
				expandEl.addEventListener('click', function() {
					setTimeout(function() {
						if (window.getComputedStyle(expandEl).display === 'none') {
							expandedClose(btn, expandEl);
							btn.focus();
						}
					}, 200);
				})
			}
		}, 500);
	});
}
function expandedClose(btn, expandEl) {
	btn.setAttribute("aria-expanded", false);
}
function expandedOpen(btn, expandEl) {
	btn.setAttribute("aria-expanded", true);
}