
try{
  function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
  
  function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
  
  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
  
  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
  
  function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
  
  function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
  
  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
  
  (function () {
    var cTable = document.querySelector('#c_table');
    var cTableSortAnnouncer = document.querySelector('#sortAnnouncer');
  
    function removeNonNumberString(NumberString) {
      var result = NumberString.replaceAll(/[^\d]/g, '');
      return isNaN(result) ? 0 : result;
    }
  
    removeNonNumberString('2021-03-12') > removeNonNumberString('2021-03-13');
  
    var TableMapper = function TableMapper(Table) {
      var _Table = Table;
  
      var rows = _toConsumableArray(_Table.rows);
  
      var result = rows.map(function (el) {
        return _toConsumableArray(el.cells);
      });
      return result;
    };
  
    var getColumnOfAllRows = function getColumnOfAllRows(tableMap) {
      var Index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var StartingRowIndex = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
      var ColLinePerRows = [];
  
      for (var _i = StartingRowIndex; _i < tableMap.length; _i++) {
        var Col = tableMap[_i];
        ColLinePerRows.push(Col[Index]);
      }
  
      return ColLinePerRows;
    };
  
    var tableMap = TableMapper(cTable);
  
    var sortNumberCells = function sortNumberCells(map, idx) {
      var dir = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'ascending';
      var OriginArr = getColumnOfAllRows(map, idx);
      var SortedArr = [];
  
      if (dir === 'descending') {
        SortedArr = OriginArr.sort(function (A, B) {
          var a = removeNonNumberString(A.innerHTML);
          var b = removeNonNumberString(B.innerHTML);
  
          if (a > b) {
            return -1;
          } else if (a == b) {
            return 0;
          }
        });
      } else if (dir === 'ascending') {
        SortedArr = OriginArr.sort(function (A, B) {
          var a = removeNonNumberString(A.innerHTML);
          var b = removeNonNumberString(B.innerHTML);
  
          if (a < b) {
            return -1;
          } else if (a == b) {
            return 0;
          }
        });
      }
  
      return SortedArr;
    };
  
    var sortCharCells = function sortCharCells(map, idx) {
      var dir = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'ascending';
      var OriginArr = getColumnOfAllRows(map, idx);
      var SortedArr = [];
  
      if (dir === 'descending') {
        SortedArr = OriginArr.sort(function (A, B) {
          var a = A.innerHTML;
          var b = B.innerHTML;
  
          if (a[0] > b[0]) {
            return -1;
          } else if (a[0] == b[0]) {
            return 0;
          }
        });
      } else if (dir === 'ascending') {
        SortedArr = OriginArr.sort(function (A, B) {
          var a = A.innerHTML;
          var b = B.innerHTML;
  
          if (a[0] < b[0]) {
            return -1;
          } else if (a[0] == b[0]) {
            return 0;
          }
        });
      }
  
      return SortedArr;
    };
  
    var rowHeader = cTable.rows[0].querySelectorAll('th');
  
    function SortSelectManager(tg, Sib) {
      function highlightSelectedColumns(idx) {
        var tds = _toConsumableArray(cTable.querySelectorAll('tbody td,tbody th'));
  
        var _iterator = _createForOfIteratorHelper(tds),
            _step;
  
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var td = _step.value;
            td.classList.toggle('sorted', td.cellIndex === idx);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
  
      for (var _i2 = 0; _i2 < Sib.length; _i2++) {
        var sortValue = tg.getAttribute('aria-sort');
  
        if (Sib[_i2] === tg) {
          if (!sortValue || sortValue === 'descending') {
            cTableSortAnnouncer.innerHTML = "".concat(tg.innerText, " \uC140 \uAE30\uC900\uC73C\uB85C \uC624\uB984\uCC28\uC21C \uC815\uB82C\uB428");
            tg.setAttribute('aria-sort', 'ascending');
          } else {
            cTableSortAnnouncer.innerHTML = "".concat(tg.innerText, " \uC140 \uAE30\uC900\uC73C\uB85C \uB0B4\uB9BC\uCC28\uC21C \uC815\uB82C\uB428");
            tg.setAttribute('aria-sort', 'descending');
          }
  
          highlightSelectedColumns(tg.cellIndex);
        } else {
          Sib[_i2].removeAttribute('aria-sort');
  
          ;
        }
      }
    }
  
    function sortAndInsert(target, sortValue) {
      var TYPE = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'str';
      var rows = cTable.rows;
      var idx = target.cellIndex;
      var sorted = TYPE === 'num' ? sortNumberCells(tableMap, idx, sortValue) : sortCharCells(tableMap, idx, sortValue);
  
      for (i = 0; i < rows.length - 1; i++) {
        var cell = sorted[i];
        var c_row = cell.parentElement;
        var section = c_row.parentElement;
        section.appendChild(c_row);
      }
    }
  
    for (var _i3 = 0; _i3 < rowHeader.length; _i3++) {
      var sorter = rowHeader[_i3];
  
      if (_i3 == 3 || _i3 == 4) {
        sorter.addEventListener('click', function () {
          var sortVal = this.getAttribute('aria-sort');
          var send = !sortVal || sortVal === 'descending' ? 'ascending' : 'descending';
          SortSelectManager(this, rowHeader);
          sortAndInsert(this, send, 'num');
        });
      } else {
        sorter.addEventListener('click', function () {
          var sortVal = this.getAttribute('aria-sort');
          var send = !sortVal || sortVal === 'descending' ? 'ascending' : 'descending';
          SortSelectManager(this, rowHeader);
          sortAndInsert(this, send, 'str');
        });
      }
    };
  })();
}catch(err){  
  document.body.innerHTML = "\
  <div class=\"warning\">\
    <div class=\"angry ie\"></div>\
    <div class=\"content\">\
      <h1>이 브라우저는 지원하지 않는 예제입니다.</h1>\
      <p>이제 보안성이 높고 빠른 편리한 최신 브라우저를 이용해주세요!</p>\
      <div class=\"icons\">\
        <a class=\"meet-link\" href=\"https://www.google.com/chrome/\">\
          <div class=\"br-icon\">\
            <div class=\"smile chrome\"></div>\
          </div>\
          <div class=\"hint\">Chrome 만나러 가기</div>\
        </a>\
        <a class=\"meet-link\" href=\"https://www.microsoft.com/ko-kr/edge\">\
          <div class=\"br-icon\">\
            <div class=\"smile edge\"></div>\
          </div>\
          <div class=\"hint\">Edge 만나러 가기</div>\
        </a>\
        <a class=\"meet-link\" href=\"https://www.mozilla.org/ko/firefox/new/\">\
          <div class=\"br-icon\">\
            <div class=\"smile firefox\"></div>\
          </div>\
          <div class=\"hint\">Firefox 만나러 가기</div>\
        </a>\
        <a class=\"meet-link\" href=\"https://whale.naver.com/\">\
          <div class=\"br-icon\">\
            <div class=\"smile whale\"></div>\
          </div>\
          <div class=\"hint\">Whale 만나러 가기</div>\
        </a>\
      \</div>\
    </div>\
  </div>"
}