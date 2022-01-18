
//wai-aria checkbox

	var checkBoxes = document.querySelectorAll('[role="checkbox"]');

	checkBoxes.forEach(function (checkBox) {
		checkBox.tabIndex = 0;

		checkBox.addEventListener("click", function () {
			checkBoxEvent(checkBox);
		});

		checkBox.addEventListener("keydown", function (e) {
			if (e.keyCode === 32) {
				// space, enter
				checkBox.click();
				e.preventDefault();
			}
		});
	});

	function checkBoxEvent(target) {
		if (target.hasAttribute("aria-controls")) {
			var restBoxes = target.getAttribute("aria-controls").split(" ");
			var checkedBoxes = 0;
			var allChecked = false;
			for (var i = 0; i < restBoxes.length; i++) {
				var singleBox = document.getElementById(restBoxes[i]);
				checkedBoxes = singleBox.getAttribute("aria-checked") == "true" ? checkedBoxes = checkedBoxes + 1 : checkedBoxes;
				allChecked = checkedBoxes == restBoxes.length ? "true" : "false";
			}
			if (allChecked === 'true') {
				for (var _i = 0; _i < restBoxes.length; _i++) {
					var _singleBox = document.getElementById(restBoxes[_i]);
					_singleBox.setAttribute("aria-checked", false);
				}
				target.setAttribute("aria-checked", false);
			} else {
				for (var _i2 = 0; _i2 < restBoxes.length; _i2++) {
					var _singleBox2 = document.getElementById(restBoxes[_i2]);
					_singleBox2.setAttribute("aria-checked", true);
				}
				target.setAttribute("aria-checked", true);
			}
		} else {
			if (target.getAttribute("aria-checked") === 'true') {
				target.setAttribute("aria-checked", false);
			} else {
				target.setAttribute("aria-checked", true);
			}
		}
	}
