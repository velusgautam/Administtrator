(function (e) {
    var t;
    e(window).on("beforeunload", function () {
        t = true
    });
    e(window).on("unload", function () {
        t = false
    });
    e.widget("hik.jtable", {options: {actions: {}, fields: {}, animationsEnabled: true, defaultDateFormat: "yy-mm-dd", dialogShowEffect: "fade", dialogHideEffect: "fade", showCloseButton: false, loadingAnimationDelay: 500, saveUserPreferences: true, jqueryuiTheme: false, ajaxSettings: {type: "POST", dataType: "json"}, toolbar: {hoverAnimation: true, hoverAnimationDuration: 60, hoverAnimationEasing: undefined, items: []}, closeRequested: function (e, t) {
    }, formCreated: function (e, t) {
    }, formSubmitting: function (e, t) {
    }, formClosed: function (e, t) {
    }, loadingRecords: function (e, t) {
    }, recordsLoaded: function (e, t) {
    }, rowInserted: function (e, t) {
    }, rowsRemoved: function (e, t) {
    }, messages: {serverCommunicationError: "An error occured while communicating to the server.", loadingMessage: "Loading records...", noDataAvailable: "No data available!", areYouSure: "Are you sure?", save: "Save", saving: "Saving", cancel: "Cancel", error: "Error", close: "Close", cannotLoadOptionsFor: "Can not load options for field {0}"}}, _$mainContainer: null, _$titleDiv: null, _$toolbarDiv: null, _$table: null, _$tableBody: null, _$tableRows: null, _$busyDiv: null, _$busyMessageDiv: null, _$errorDialogDiv: null, _columnList: null, _fieldList: null, _keyField: null, _firstDataColumnOffset: 0, _lastPostData: null, _cache: null, _create: function () {
        this._normalizeFieldsOptions();
        this._initializeFields();
        this._createFieldAndColumnList();
        this._createMainContainer();
        this._createTableTitle();
        this._createToolBar();
        this._createTable();
        this._createBusyPanel();
        this._createErrorDialogDiv();
        this._addNoDataRow();
        this._cookieKeyPrefix = this._generateCookieKeyPrefix()
    }, _normalizeFieldsOptions: function () {
        var t = this;
        e.each(t.options.fields, function (e, n) {
            t._normalizeFieldOptions(e, n)
        })
    }, _normalizeFieldOptions: function (t, n) {
        if (n.listClass == undefined) {
            n.listClass = ""
        }
        if (n.inputClass == undefined) {
            n.inputClass = ""
        }
        if (n.dependsOn && e.type(n.dependsOn) === "string") {
            var r = n.dependsOn.split(",");
            n.dependsOn = [];
            for (var i = 0; i < r.length; i++) {
                n.dependsOn.push(e.trim(r[i]))
            }
        }
    }, _initializeFields: function () {
        this._lastPostData = {};
        this._$tableRows = [];
        this._columnList = [];
        this._fieldList = [];
        this._cache = []
    }, _createFieldAndColumnList: function () {
        var t = this;
        e.each(t.options.fields, function (e, n) {
            t._fieldList.push(e);
            if (n.key == true) {
                t._keyField = e
            }
            if (n.list != false && n.type != "hidden") {
                t._columnList.push(e)
            }
        })
    }, _createMainContainer: function () {
        this._$mainContainer = e("<div />").addClass("jtable-main-container").appendTo(this.element);
        this._jqueryuiThemeAddClass(this._$mainContainer, "ui-widget")
    }, _createTableTitle: function () {
        var t = this;
        if (!t.options.title) {
            return
        }
        var n = e("<div />").addClass("jtable-title").appendTo(t._$mainContainer);
        t._jqueryuiThemeAddClass(n, "ui-widget-header");
        e("<div />").addClass("jtable-title-text").appendTo(n).append(t.options.title);
        if (t.options.showCloseButton) {
            var r = e("<span />").html(t.options.messages.close);
            e("<button></button>").addClass("jtable-command-button jtable-close-button").attr("title", t.options.messages.close).append(r).appendTo(n).click(function (e) {
                e.preventDefault();
                e.stopPropagation();
                t._onCloseRequested()
            })
        }
        t._$titleDiv = n
    }, _createTable: function () {
        this._$table = e("<table></table>").addClass("jtable").appendTo(this._$mainContainer);
        if (this.options.tableId) {
            this._$table.attr("id", this.options.tableId)
        }
        this._jqueryuiThemeAddClass(this._$table, "ui-widget-content");
        this._createTableHead();
        this._createTableBody()
    }, _createTableHead: function () {
        var t = e("<thead></thead>").appendTo(this._$table);
        this._addRowToTableHead(t)
    }, _addRowToTableHead: function (t) {
        var n = e("<tr></tr>").appendTo(t);
        this._addColumnsToHeaderRow(n)
    }, _addColumnsToHeaderRow: function (e) {
        for (var t = 0; t < this._columnList.length; t++) {
            var n = this._columnList[t];
            var r = this._createHeaderCellForField(n, this.options.fields[n]);
            r.appendTo(e)
        }
    }, _createHeaderCellForField: function (t, n) {
        n.width = n.width || "10%";
        var r = e("<span />").addClass("jtable-column-header-text").html(n.title);
        var i = e("<div />").addClass("jtable-column-header-container").append(r);
        var s = e("<th></th>").addClass("jtable-column-header").addClass(n.listClass).css("width", n.width).data("fieldName", t).append(i);
        this._jqueryuiThemeAddClass(s, "ui-state-default");
        return s
    }, _createEmptyCommandHeader: function () {
        var t = e("<th></th>").addClass("jtable-command-column-header").css("width", "1%");
        this._jqueryuiThemeAddClass(t, "ui-state-default");
        return t
    }, _createTableBody: function () {
        this._$tableBody = e("<tbody></tbody>").appendTo(this._$table)
    }, _createBusyPanel: function () {
        this._$busyMessageDiv = e("<div />").addClass("jtable-busy-message").prependTo(this._$mainContainer);
        this._$busyDiv = e("<div />").addClass("jtable-busy-panel-background").prependTo(this._$mainContainer);
        this._jqueryuiThemeAddClass(this._$busyMessageDiv, "ui-widget-header");
        this._hideBusy()
    }, _createErrorDialogDiv: function () {
        var t = this;
        t._$errorDialogDiv = e("<div></div>").appendTo(t._$mainContainer);
        t._$errorDialogDiv.dialog({autoOpen: false, show: t.options.dialogShowEffect, hide: t.options.dialogHideEffect, modal: true, title: t.options.messages.error, buttons: [
            {text: t.options.messages.close, click: function () {
                t._$errorDialogDiv.dialog("close")
            }}
        ]})
    }, load: function (e, t) {
        this._lastPostData = e;
        this._reloadTable(t)
    }, reload: function (e) {
        this._reloadTable(e)
    }, getRowByKey: function (e) {
        for (var t = 0; t < this._$tableRows.length; t++) {
            if (e == this._getKeyValueOfRecord(this._$tableRows[t].data("record"))) {
                return this._$tableRows[t]
            }
        }
        return null
    }, destroy: function () {
        this.element.empty();
        e.Widget.prototype.destroy.call(this)
    }, _setOption: function (e, t) {
    }, _reloadTable: function (e) {
        var t = this;
        t._showBusy(t.options.messages.loadingMessage, t.options.loadingAnimationDelay);
        var n = t._createRecordLoadUrl();
        t._onLoadingRecords();
        t._ajax({url: n, data: t._lastPostData, success: function (n) {
            t._hideBusy();
            if (n.Result != "OK") {
                t._showError(n.Message);
                return
            }
            t._removeAllRows("reloading");
            t._addRecordsToTable(n.Records);
            t._onRecordsLoaded(n);
            if (e) {
                e()
            }
        }, error: function () {
            t._hideBusy();
            t._showError(t.options.messages.serverCommunicationError)
        }})
    }, _createRecordLoadUrl: function () {
        return this.options.actions.listAction
    }, _createRowFromRecord: function (t) {
        var n = e("<tr></tr>").addClass("jtable-data-row").attr("data-record-key", this._getKeyValueOfRecord(t)).data("record", t);
        this._addCellsToRowUsingRecord(n);
        return n
    }, _addCellsToRowUsingRecord: function (e) {
        var t = e.data("record");
        for (var n = 0; n < this._columnList.length; n++) {
            this._createCellForRecordField(t, this._columnList[n]).appendTo(e)
        }
    }, _createCellForRecordField: function (t, n) {
        return e("<td></td>").addClass(this.options.fields[n].listClass).append(this._getDisplayTextForRecordField(t, n))
    }, _addRecordsToTable: function (t) {
        var n = this;
        e.each(t, function (e, t) {
            n._addRow(n._createRowFromRecord(t))
        });
        n._refreshRowStyles()
    }, _addRowToTable: function (e, t, n, r) {
        var i = {index: this._normalizeNumber(t, 0, this._$tableRows.length, this._$tableRows.length)};
        if (n == true) {
            i.isNewRow = true
        }
        if (r == false) {
            i.animationsEnabled = false
        }
        this._addRow(e, i)
    }, _addRow: function (t, n) {
        n = e.extend({index: this._$tableRows.length, isNewRow: false, animationsEnabled: true}, n);
        if (this._$tableRows.length <= 0) {
            this._removeNoDataRow()
        }
        n.index = this._normalizeNumber(n.index, 0, this._$tableRows.length, this._$tableRows.length);
        if (n.index == this._$tableRows.length) {
            this._$tableBody.append(t);
            this._$tableRows.push(t)
        } else if (n.index == 0) {
            this._$tableBody.prepend(t);
            this._$tableRows.unshift(t)
        } else {
            this._$tableRows[n.index - 1].after(t);
            this._$tableRows.splice(n.index, 0, t)
        }
        this._onRowInserted(t, n.isNewRow);
        if (n.isNewRow) {
            this._refreshRowStyles();
            if (this.options.animationsEnabled && n.animationsEnabled) {
                this._showNewRowAnimation(t)
            }
        }
    }, _showNewRowAnimation: function (e) {
        var t = "jtable-row-created";
        if (this.options.jqueryuiTheme) {
            t = t + " ui-state-highlight"
        }
        e.addClass(t, "slow", "", function () {
            e.removeClass(t, 5e3)
        })
    }, _removeRowsFromTable: function (t, n) {
        var r = this;
        if (t.length <= 0) {
            return
        }
        t.addClass("jtable-row-removed").remove();
        t.each(function () {
            var t = r._findRowIndex(e(this));
            if (t >= 0) {
                r._$tableRows.splice(t, 1)
            }
        });
        r._onRowsRemoved(t, n);
        if (r._$tableRows.length == 0) {
            r._addNoDataRow()
        }
        r._refreshRowStyles()
    }, _findRowIndex: function (e) {
        return this._findIndexInArray(e, this._$tableRows, function (e, t) {
            return e.data("record") == t.data("record")
        })
    }, _removeAllRows: function (e) {
        if (this._$tableRows.length <= 0) {
            return
        }
        var t = this._$tableBody.find("tr.jtable-data-row");
        this._$tableBody.empty();
        this._$tableRows = [];
        this._onRowsRemoved(t, e);
        this._addNoDataRow()
    }, _addNoDataRow: function () {
        if (this._$tableBody.find(">tr.jtable-no-data-row").length > 0) {
            return
        }
        var t = e("<tr></tr>").addClass("jtable-no-data-row").appendTo(this._$tableBody);
        var n = this._$table.find("thead th").length;
        e("<td></td>").attr("colspan", n).html(this.options.messages.noDataAvailable).appendTo(t)
    }, _removeNoDataRow: function () {
        this._$tableBody.find(".jtable-no-data-row").remove()
    }, _refreshRowStyles: function () {
        for (var e = 0; e < this._$tableRows.length; e++) {
            if (e % 2 == 0) {
                this._$tableRows[e].addClass("jtable-row-even")
            } else {
                this._$tableRows[e].removeClass("jtable-row-even")
            }
        }
    }, _getDisplayTextForRecordField: function (e, t) {
        var n = this.options.fields[t];
        var r = e[t];
        if (n.display) {
            return n.display({record: e})
        }
        if (n.type == "date") {
            return this._getDisplayTextForDateRecordField(n, r)
        } else if (n.type == "checkbox") {
            return this._getCheckBoxTextForFieldByValue(t, r)
        } else if (n.options) {
            var i = this._getOptionsForField(t, {record: e, value: r, source: "list", dependedValues: this._createDependedValuesUsingRecord(e, n.dependsOn)});
            return this._findOptionByValue(i, r).DisplayText
        } else {
            return r
        }
    }, _createDependedValuesUsingRecord: function (e, t) {
        if (!t) {
            return{}
        }
        var n = {};
        for (var r = 0; r < t.length; r++) {
            n[t[r]] = e[t[r]]
        }
        return n
    }, _findOptionByValue: function (e, t) {
        for (var n = 0; n < e.length; n++) {
            if (e[n].Value == t) {
                return e[n]
            }
        }
        return{}
    }, _getDisplayTextForDateRecordField: function (t, n) {
        if (!n) {
            return""
        }
        var r = t.displayFormat || this.options.defaultDateFormat;
        var i = this._parseDate(n);
        return e.datepicker.formatDate(r, i)
    }, _getOptionsForField: function (t, n) {
        var r = this.options.fields[t];
        var i = r.options;
        if (e.isFunction(i)) {
            n = e.extend(true, {_cacheCleared: false, dependedValues: {}, clearCache: function () {
                this._cacheCleared = true
            }}, n);
            i = i(n)
        }
        var s;
        if (typeof i == "string") {
            var o = "options_" + t + "_" + i;
            if (n._cacheCleared || !this._cache[o]) {
                this._cache[o] = this._buildOptionsFromArray(this._downloadOptions(t, i));
                this._sortFieldOptions(this._cache[o], r.optionsSorting)
            } else {
                if (n.value != undefined) {
                    var u = this._findOptionByValue(this._cache[o], n.value);
                    if (u.DisplayText == undefined) {
                        this._cache[o] = this._buildOptionsFromArray(this._downloadOptions(t, i));
                        this._sortFieldOptions(this._cache[o], r.optionsSorting)
                    }
                }
            }
            s = this._cache[o]
        } else if (jQuery.isArray(i)) {
            s = this._buildOptionsFromArray(i);
            this._sortFieldOptions(s, r.optionsSorting)
        } else {
            s = this._buildOptionsArrayFromObject(i);
            this._sortFieldOptions(s, r.optionsSorting)
        }
        return s
    }, _downloadOptions: function (e, t) {
        var n = this;
        var r = [];
        n._ajax({url: t, async: false, success: function (e) {
            if (e.Result != "OK") {
                n._showError(e.Message);
                return
            }
            r = e.Options
        }, error: function () {
            var t = n._formatString(n.options.messages.cannotLoadOptionsFor, e);
            n._showError(t)
        }});
        return r
    }, _sortFieldOptions: function (t, n) {
        if (!t || !t.length || !n) {
            return
        }
        var r;
        if (n.indexOf("value") == 0) {
            r = function (e) {
                return e.Value
            }
        } else {
            r = function (e) {
                return e.DisplayText
            }
        }
        var i;
        if (e.type(r(t[0])) == "string") {
            i = function (e, t) {
                return r(e).localeCompare(r(t))
            }
        } else {
            i = function (e, t) {
                return r(e) - r(t)
            }
        }
        if (n.indexOf("desc") > 0) {
            t.sort(function (e, t) {
                return i(t, e)
            })
        } else {
            t.sort(function (e, t) {
                return i(e, t)
            })
        }
    }, _buildOptionsArrayFromObject: function (t) {
        var n = [];
        e.each(t, function (e, t) {
            n.push({Value: e, DisplayText: t})
        });
        return n
    }, _buildOptionsFromArray: function (t) {
        var n = [];
        for (var r = 0; r < t.length; r++) {
            if (e.isPlainObject(t[r])) {
                n.push(t[r])
            } else {
                n.push({Value: t[r], DisplayText: t[r]})
            }
        }
        return n
    }, _parseDate: function (e) {
        if (e.indexOf("Date") >= 0) {
            return new Date(parseInt(e.substr(6), 10))
        } else if (e.length == 10) {
            return new Date(parseInt(e.substr(0, 4), 10), parseInt(e.substr(5, 2), 10) - 1, parseInt(e.substr(8, 2), 10))
        } else if (e.length == 19) {
            return new Date(parseInt(e.substr(0, 4), 10), parseInt(e.substr(5, 2), 10) - 1, parseInt(e.substr(8, 2, 10)), parseInt(e.substr(11, 2), 10), parseInt(e.substr(14, 2), 10), parseInt(e.substr(17, 2), 10))
        } else {
            this._logWarn("Given date is not properly formatted: " + e);
            return"format error!"
        }
    }, _createToolBar: function () {
        this._$toolbarDiv = e("<div />").addClass("jtable-toolbar").appendTo(this._$titleDiv);
        for (var t = 0; t < this.options.toolbar.items.length; t++) {
            this._addToolBarItem(this.options.toolbar.items[t])
        }
    }, _addToolBarItem: function (t) {
        if (t == undefined || t.text == undefined && t.icon == undefined) {
            this._logWarn("Can not add tool bar item since it is not valid!");
            this._logWarn(t);
            return null
        }
        var n = e("<span></span>").addClass("jtable-toolbar-item").appendTo(this._$toolbarDiv);
        this._jqueryuiThemeAddClass(n, "ui-widget ui-state-default ui-corner-all", "ui-state-hover");
        if (t.cssClass) {
            n.addClass(t.cssClass)
        }
        if (t.tooltip) {
            n.attr("title", t.tooltip)
        }
        if (t.icon) {
            var r = e('<span class="jtable-toolbar-item-icon"></span>').appendTo(n);
            if (t.icon === true) {
            } else if (e.type(t.icon === "string")) {
                r.css("background", 'url("' + t.icon + '")')
            }
        }
        if (t.text) {
            e('<span class=""></span>').html(t.text).addClass("jtable-toolbar-item-text").appendTo(n)
        }
        if (t.click) {
            n.click(function () {
                t.click()
            })
        }
        var i = undefined;
        var s = undefined;
        if (this.options.toolbar.hoverAnimation) {
            i = this.options.toolbar.hoverAnimationDuration;
            s = this.options.toolbar.hoverAnimationEasing
        }
        n.hover(function () {
            n.addClass("jtable-toolbar-item-hover", i, s)
        }, function () {
            n.removeClass("jtable-toolbar-item-hover", i, s)
        });
        return n
    }, _showError: function (e) {
        this._$errorDialogDiv.html(e).dialog("open")
    }, _setBusyTimer: null, _showBusy: function (e, t) {
        var n = this;
        n._$busyDiv.width(n._$mainContainer.width()).height(n._$mainContainer.height()).addClass("jtable-busy-panel-background-invisible").show();
        var r = function () {
            n._$busyDiv.removeClass("jtable-busy-panel-background-invisible");
            n._$busyMessageDiv.html(e).show()
        };
        if (t) {
            if (n._setBusyTimer) {
                return
            }
            n._setBusyTimer = setTimeout(r, t)
        } else {
            r()
        }
    }, _hideBusy: function () {
        clearTimeout(this._setBusyTimer);
        this._setBusyTimer = null;
        this._$busyDiv.hide();
        this._$busyMessageDiv.html("").hide()
    }, _isBusy: function () {
        return this._$busyMessageDiv.is(":visible")
    }, _jqueryuiThemeAddClass: function (e, t, n) {
        if (!this.options.jqueryuiTheme) {
            return
        }
        e.addClass(t);
        if (n) {
            e.hover(function () {
                e.addClass(n)
            }, function () {
                e.removeClass(n)
            })
        }
    }, _performAjaxCall: function (e, t, n, r, i) {
        this._ajax({url: e, data: t, async: n, success: r, error: i})
    }, _ajax: function (n) {
        var r = e.extend({}, this.options.ajaxSettings, n);
        r.success = function (e) {
            if (n.success) {
                n.success(e)
            }
        };
        r.error = function (e, r, i) {
            if (t) {
                e.abort();
                return
            }
            if (n.error) {
                n.error(arguments)
            }
        };
        r.complete = function () {
            if (n.complete) {
                n.complete()
            }
        };
        e.ajax(r)
    }, _getKeyValueOfRecord: function (e) {
        return e[this._keyField]
    }, _setCookie: function (e, t) {
        e = this._cookieKeyPrefix + e;
        var n = new Date;
        n.setDate(n.getDate() + 30);
        document.cookie = encodeURIComponent(e) + "=" + encodeURIComponent(t) + "; expires=" + n.toUTCString()
    }, _getCookie: function (e) {
        e = this._cookieKeyPrefix + e;
        var t = document.cookie.split("; ");
        for (var n = 0; n < t.length; n++) {
            if (!t[n]) {
                continue
            }
            var r = t[n].split("=");
            if (r.length != 2) {
                continue
            }
            if (decodeURIComponent(r[0]) === e) {
                return decodeURIComponent(r[1] || "")
            }
        }
        return null
    }, _generateCookieKeyPrefix: function () {
        var e = function (e) {
            var t = 0;
            if (e.length == 0) {
                return t
            }
            for (var n = 0; n < e.length; n++) {
                var r = e.charCodeAt(n);
                t = (t << 5) - t + r;
                t = t & t
            }
            return t
        };
        var t = "";
        if (this.options.tableId) {
            t = t + this.options.tableId + "#"
        }
        t = t + this._columnList.join("$") + "#c" + this._$table.find("thead th").length;
        return"jtable#" + e(t)
    }, _onLoadingRecords: function () {
        this._trigger("loadingRecords", null, {})
    }, _onRecordsLoaded: function (e) {
        this._trigger("recordsLoaded", null, {records: e.Records, serverResponse: e})
    }, _onRowInserted: function (e, t) {
        this._trigger("rowInserted", null, {row: e, record: e.data("record"), isNewRow: t})
    }, _onRowsRemoved: function (e, t) {
        this._trigger("rowsRemoved", null, {rows: e, reason: t})
    }, _onCloseRequested: function () {
        this._trigger("closeRequested", null, {})
    }})
})(jQuery);
(function (e) {
    e.extend(true, e.hik.jtable.prototype, {_getPropertyOfObject: function (e, t) {
        if (t.indexOf(".") < 0) {
            return e[t]
        } else {
            var n = t.substring(0, t.indexOf("."));
            var r = t.substring(t.indexOf(".") + 1);
            return this._getPropertyOfObject(e[n], r)
        }
    }, _setPropertyOfObject: function (e, t, n) {
        if (t.indexOf(".") < 0) {
            e[t] = n
        } else {
            var r = t.substring(0, t.indexOf("."));
            var i = t.substring(t.indexOf(".") + 1);
            this._setPropertyOfObject(e[r], i, n)
        }
    }, _insertToArrayIfDoesNotExists: function (t, n) {
        if (e.inArray(n, t) < 0) {
            t.push(n)
        }
    }, _findIndexInArray: function (e, t, n) {
        if (!n) {
            n = function (e, t) {
                return e == t
            }
        }
        for (var r = 0; r < t.length; r++) {
            if (n(e, t[r])) {
                return r
            }
        }
        return-1
    }, _normalizeNumber: function (e, t, n, r) {
        if (e == undefined || e == null || isNaN(e)) {
            return r
        }
        if (e < t) {
            return t
        }
        if (e > n) {
            return n
        }
        return e
    }, _formatString: function () {
        if (arguments.length == 0) {
            return null
        }
        var e = arguments[0];
        for (var t = 1; t < arguments.length; t++) {
            var n = "{" + (t - 1) + "}";
            e = e.replace(n, arguments[t])
        }
        return e
    }, _logDebug: function (e) {
        if (!window.console) {
            return
        }
        console.log("jTable DEBUG: " + e)
    }, _logInfo: function (e) {
        if (!window.console) {
            return
        }
        console.log("jTable INFO: " + e)
    }, _logWarn: function (e) {
        if (!window.console) {
            return
        }
        console.log("jTable WARNING: " + e)
    }, _logError: function (e) {
        if (!window.console) {
            return
        }
        console.log("jTable ERROR: " + e)
    }});
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (e) {
            var t = this.length;
            var n = Number(arguments[1]) || 0;
            n = n < 0 ? Math.ceil(n) : Math.floor(n);
            if (n < 0)n += t;
            for (; n < t; n++) {
                if (n in this && this[n] === e)return n
            }
            return-1
        }
    }
})(jQuery);
(function (e) {
    e.extend(true, e.hik.jtable.prototype, {_submitFormUsingAjax: function (e, t, n, r) {
        this._ajax({url: e, data: t, success: n, error: r})
    }, _createInputLabelForRecordField: function (t) {
        return e("<div />").addClass("jtable-input-label").html(this.options.fields[t].inputTitle || this.options.fields[t].title)
    }, _createInputForRecordField: function (t) {
        var n = t.fieldName, r = t.value, i = t.record, s = t.formType, o = t.form;
        var u = this.options.fields[n];
        if (r == undefined || r == null) {
            r = u.defaultValue
        }
        if (u.input) {
            var a = e(u.input({value: r, record: i, formType: s, form: o}));
            if (!a.attr("id")) {
                a.attr("id", "Edit-" + n)
            }
            return e("<div />").addClass("jtable-input jtable-custom-input").append(a)
        }
        if (u.type == "date") {
            return this._createDateInputForField(u, n, r)
        } else if (u.type == "textarea") {
            return this._createTextAreaForField(u, n, r)
        } else if (u.type == "password") {
            return this._createPasswordInputForField(u, n, r)
        } else if (u.type == "checkbox") {
            return this._createCheckboxForField(u, n, r)
        } else if (u.options) {
            if (u.type == "radiobutton") {
                return this._createRadioButtonListForField(u, n, r, i, s)
            } else {
                return this._createDropDownListForField(u, n, r, i, s, o)
            }
        } else {
            return this._createTextInputForField(u, n, r)
        }
    }, _createInputForHidden: function (t, n) {
        if (n == undefined) {
            n = ""
        }
        return e('<input type="hidden" name="' + t + '" id="Edit-' + t + '"></input>').val(n)
    }, _createDateInputForField: function (t, n, r) {
        var i = e('<input class="' + t.inputClass + '" id="Edit-' + n + '" type="text" name="' + n + '"></input>');
        if (r != undefined) {
            i.val(r)
        }
        var s = t.displayFormat || this.options.defaultDateFormat;
        i.datepicker({dateFormat: s});
        return e("<div />").addClass("jtable-input jtable-date-input").append(i)
    }, _createTextAreaForField: function (t, n, r) {
        var i = e('<textarea class="' + t.inputClass + '" id="Edit-' + n + '" name="' + n + '"></textarea>');
        if (r != undefined) {
            i.val(r)
        }
        return e("<div />").addClass("jtable-input jtable-textarea-input").append(i)
    }, _createTextInputForField: function (t, n, r) {
        var i = e('<input class="' + t.inputClass + '" id="Edit-' + n + '" type="text" name="' + n + '"></input>');
        if (r != undefined) {
            i.val(r)
        }
        return e("<div />").addClass("jtable-input jtable-text-input").append(i)
    }, _createPasswordInputForField: function (t, n, r) {
        var i = e('<input class="' + t.inputClass + '" id="Edit-' + n + '" type="password" name="' + n + '"></input>');
        if (r != undefined) {
            i.val(r)
        }
        return e("<div />").addClass("jtable-input jtable-password-input").append(i)
    }, _createCheckboxForField: function (t, n, r) {
        var i = this;
        if (r == undefined) {
            r = i._getCheckBoxPropertiesForFieldByState(n, false).Value
        }
        var s = e("<div />").addClass("jtable-input jtable-checkbox-input");
        var o = e('<input class="' + t.inputClass + '" id="Edit-' + n + '" type="checkbox" name="' + n + '" />').appendTo(s);
        if (r != undefined) {
            o.val(r)
        }
        var u = e("<span>" + (t.formText || i._getCheckBoxTextForFieldByValue(n, r)) + "</span>").appendTo(s);
        if (i._getIsCheckBoxSelectedForFieldByValue(n, r)) {
            o.attr("checked", "checked")
        }
        var a = function () {
            var e = i._getCheckBoxPropertiesForFieldByState(n, o.is(":checked"));
            o.attr("value", e.Value);
            u.html(t.formText || e.DisplayText)
        };
        o.click(function () {
            a()
        });
        if (t.setOnTextClick != false) {
            u.addClass("jtable-option-text-clickable").click(function () {
                if (o.is(":checked")) {
                    o.attr("checked", false)
                } else {
                    o.attr("checked", true)
                }
                a()
            })
        }
        return s
    }, _createDropDownListForField: function (t, n, r, i, s, o) {
        var u = e("<div />").addClass("jtable-input jtable-dropdown-input");
        var a = e('<select class="' + t.inputClass + '" id="Edit-' + n + '" name="' + n + '"></select>').appendTo(u);
        var f = this._getOptionsForField(n, {record: i, source: s, form: o, dependedValues: this._createDependedValuesUsingForm(o, t.dependsOn)});
        this._fillDropDownListWithOptions(a, f, r);
        return u
    }, _fillDropDownListWithOptions: function (t, n, r) {
        t.empty();
        for (var i = 0; i < n.length; i++) {
            e("<option" + (n[i].Value == r ? ' selected="selected"' : "") + ">" + n[i].DisplayText + "</option>").val(n[i].Value).appendTo(t)
        }
    }, _createDependedValuesUsingForm: function (e, t) {
        if (!t) {
            return{}
        }
        var n = {};
        for (var r = 0; r < t.length; r++) {
            var i = t[r];
            var s = e.find("select[name=" + i + "]");
            if (s.length <= 0) {
                continue
            }
            n[i] = s.val()
        }
        return n
    }, _createRadioButtonListForField: function (t, n, r, i, s) {
        var o = e("<div />").addClass("jtable-input jtable-radiobuttonlist-input");
        var u = this._getOptionsForField(n, {record: i, source: s});
        e.each(u, function (i, s) {
            var u = e('<div class=""></div>').addClass("jtable-radio-input").appendTo(o);
            var a = e('<input type="radio" id="Edit-' + n + "-" + i + '" class="' + t.inputClass + '" name="' + n + '"' + (s.Value == r + "" ? ' checked="true"' : "") + " />").val(s.Value).appendTo(u);
            var f = e("<span></span>").html(s.DisplayText).appendTo(u);
            if (t.setOnTextClick != false) {
                f.addClass("jtable-option-text-clickable").click(function () {
                    if (!a.is(":checked")) {
                        a.attr("checked", true)
                    }
                })
            }
        });
        return o
    }, _getCheckBoxTextForFieldByValue: function (e, t) {
        return this.options.fields[e].values[t]
    }, _getIsCheckBoxSelectedForFieldByValue: function (e, t) {
        return this._createCheckBoxStateArrayForFieldWithCaching(e)[1].Value.toString() == t.toString()
    }, _getCheckBoxPropertiesForFieldByState: function (e, t) {
        return this._createCheckBoxStateArrayForFieldWithCaching(e)[t ? 1 : 0]
    }, _createCheckBoxStateArrayForFieldWithCaching: function (e) {
        var t = "checkbox_" + e;
        if (!this._cache[t]) {
            this._cache[t] = this._createCheckBoxStateArrayForField(e)
        }
        return this._cache[t]
    }, _createCheckBoxStateArrayForField: function (t) {
        var n = [];
        var r = 0;
        e.each(this.options.fields[t].values, function (e, t) {
            if (r++ < 2) {
                n.push({Value: e, DisplayText: t})
            }
        });
        return n
    }, _makeCascadeDropDowns: function (t, n, r) {
        var i = this;
        t.find("select").each(function () {
            var s = e(this);
            var o = s.attr("name");
            if (!o) {
                return
            }
            var u = i.options.fields[o];
            if (!u.dependsOn) {
                return
            }
            e.each(u.dependsOn, function (e, a) {
                var f = t.find("select[name=" + a + "]");
                f.change(function () {
                    var e = {record: n, source: r, form: t, dependedValues: {}};
                    e.dependedValues = i._createDependedValuesUsingForm(t, u.dependsOn);
                    var a = i._getOptionsForField(o, e);
                    i._fillDropDownListWithOptions(s, a, undefined);
                    s.change()
                })
            })
        })
    }, _updateRecordValuesFromForm: function (t, n) {
        for (var r = 0; r < this._fieldList.length; r++) {
            var i = this._fieldList[r];
            var s = this.options.fields[i];
            if (s.edit == false) {
                continue
            }
            var o = n.find('[name="' + i + '"]');
            if (o.length <= 0) {
                continue
            }
            if (s.type == "date") {
                var u = o.val();
                if (u) {
                    var a = s.displayFormat || this.options.defaultDateFormat;
                    try {
                        var f = e.datepicker.parseDate(a, u);
                        t[i] = "/Date(" + f.getTime() + ")/"
                    } catch (l) {
                        this._logWarn("Date format is incorrect for field " + i + ": " + u);
                        t[i] = undefined
                    }
                } else {
                    this._logDebug("Date is empty for " + i);
                    t[i] = undefined
                }
            } else if (s.options && s.type == "radiobutton") {
                var c = o.filter(":checked");
                if (c.length) {
                    t[i] = c.val()
                } else {
                    t[i] = undefined
                }
            } else {
                t[i] = o.val()
            }
        }
    }, _setEnabledOfDialogButton: function (e, t, n) {
        if (!e) {
            return
        }
        if (t != false) {
            e.removeAttr("disabled").removeClass("ui-state-disabled")
        } else {
            e.attr("disabled", "disabled").addClass("ui-state-disabled")
        }
        if (n) {
            e.find("span").text(n)
        }
    }})
})(jQuery);
(function (e) {
    var t = {_create: e.hik.jtable.prototype._create};
    e.extend(true, e.hik.jtable.prototype, {options: {recordAdded: function (e, t) {
    }, messages: {addNewRecord: "Add New Entry"}}, _$addRecordDiv: null, _create: function () {
        t._create.apply(this, arguments);
        if (!this.options.actions.createAction) {
            return
        }
        this._createAddRecordDialogDiv()
    }, _createAddRecordDialogDiv: function () {
        var t = this;
        t._$addRecordDiv = e("<div />").appendTo(t._$mainContainer);
        t._$addRecordDiv.dialog({autoOpen: false, show: t.options.dialogShowEffect, hide: t.options.dialogHideEffect, width: "auto", minWidth: "360", modal: true, title: t.options.messages.addNewRecord, buttons: [
            {text: t.options.messages.cancel, addClass: "btn", click: function () {
                t._$addRecordDiv.dialog("close")
            }},
            {id: "AddRecordDialogSaveButton", addClass: "btn btn-success", text: t.options.messages.save, click: function () {
                t._onSaveClickedOnCreateForm()
            }}
        ], close: function () {
            var n = t._$addRecordDiv.find("form").first();
            var r = e("#AddRecordDialogSaveButton");
            t._trigger("formClosed", null, {form: n, formType: "create"});
            t._setEnabledOfDialogButton(r, true, t.options.messages.save);
            n.remove()
        }});
        if (t.options.addRecordButton) {
            t.options.addRecordButton.click(function (e) {
                e.preventDefault();
                t._showAddRecordForm()
            })
        } else {
            t._addToolBarItem({icon: true, cssClass: "jtable-toolbar-item-add-record", text: t.options.messages.addNewRecord, click: function () {
                t._showAddRecordForm()
            }})
        }
    }, _onSaveClickedOnCreateForm: function () {
        var t = this;
        var n = e("#AddRecordDialogSaveButton");
        var r = t._$addRecordDiv.find("form");
        if (t._trigger("formSubmitting", null, {form: r, formType: "create"}) != false) {
            t._setEnabledOfDialogButton(n, false, t.options.messages.saving);
            t._saveAddRecordForm(r, n)
        }
    }, showCreateForm: function () {
        this._showAddRecordForm()
    }, addRecord: function (t) {
        var n = this;
        t = e.extend({clientOnly: false, animationsEnabled: n.options.animationsEnabled, url: n.options.actions.createAction, success: function () {
        }, error: function () {
        }}, t);
        if (!t.record) {
            n._logWarn("options parameter in addRecord method must contain a record property.");
            return
        }
        if (t.clientOnly) {
            n._addRow(n._createRowFromRecord(t.record), {isNewRow: true, animationsEnabled: t.animationsEnabled});
            t.success();
            return
        }
        n._submitFormUsingAjax(t.url, e.param(t.record), function (e) {
            if (e.Result != "OK") {
                n._showError(e.Message);
                t.error(e);
                return
            }
            if (!e.Record) {
                n._logError("Server must return the created Record object.");
                t.error(e);
                return
            }
            n._onRecordAdded(e);
            n._addRow(n._createRowFromRecord(e.Record), {isNewRow: true, animationsEnabled: t.animationsEnabled});
            t.success(e)
        }, function () {
            n._showError(n.options.messages.serverCommunicationError);
            t.error()
        })
    }, _showAddRecordForm: function () {
        var t = this;
        var n = e('<form id="jtable-create-form" class="jtable-dialog-form jtable-create-form"></form>');
        for (var r = 0; r < t._fieldList.length; r++) {
            var i = t._fieldList[r];
            var s = t.options.fields[i];
            if (s.key == true && s.create != true) {
                continue
            }
            if (s.create == false) {
                continue
            }
            if (s.type == "hidden") {
                n.append(t._createInputForHidden(i, s.defaultValue));
                continue
            }
            var o = e("<div />").addClass("jtable-input-field-container").appendTo(n);
            o.append(t._createInputLabelForRecordField(i));
            o.append(t._createInputForRecordField({fieldName: i, formType: "create", form: n}))
        }
        t._makeCascadeDropDowns(n, undefined, "create");
        n.submit(function () {
            t._onSaveClickedOnCreateForm();
            return false
        });
        t._$addRecordDiv.append(n).dialog("open");
        t._trigger("formCreated", null, {form: n, formType: "create"})
    }, _saveAddRecordForm: function (e, t) {
        var n = this;
        e.data("submitting", true);
        n._submitFormUsingAjax(n.options.actions.createAction, e.serialize(), function (e) {
            if (e.Result != "OK") {
                n._showError(e.Message);
                n._setEnabledOfDialogButton(t, true, n.options.messages.save);
                return
            }
            if (!e.Record) {
                n._logError("Server must return the created Record object.");
                n._setEnabledOfDialogButton(t, true, n.options.messages.save);
                return
            }
            n._onRecordAdded(e);
            n._addRow(n._createRowFromRecord(e.Record), {isNewRow: true});
            n._$addRecordDiv.dialog("close")
        }, function () {
            n._showError(n.options.messages.serverCommunicationError);
            n._setEnabledOfDialogButton(t, true, n.options.messages.save)
        })
    }, _onRecordAdded: function (e) {
        this._trigger("recordAdded", null, {record: e.Record, serverResponse: e})
    }})
})(jQuery);
(function (e) {
    var t = {_create: e.hik.jtable.prototype._create, _addColumnsToHeaderRow: e.hik.jtable.prototype._addColumnsToHeaderRow, _addCellsToRowUsingRecord: e.hik.jtable.prototype._addCellsToRowUsingRecord};
    e.extend(true, e.hik.jtable.prototype, {options: {recordUpdated: function (e, t) {
    }, rowUpdated: function (e, t) {
    }, messages: {editRecord: "Edit Record"}}, _$editDiv: null, _$editingRow: null, _create: function () {
        t._create.apply(this, arguments);
        if (!this.options.actions.updateAction) {
            return
        }
        this._createEditDialogDiv()
    }, _createEditDialogDiv: function () {
        var t = this;
        t._$editDiv = e("<div></div>").appendTo(t._$mainContainer);
        t._$editDiv.dialog({autoOpen: false, show: t.options.dialogShowEffect, hide: t.options.dialogHideEffect, minWidth: "360", modal: true, title: t.options.messages.editRecord, buttons: [
            {addClass: "btn-danger btn", text: t.options.messages.cancel, click: function () {
                t._$editDiv.dialog("close")
            }},
            {id: "EditDialogSaveButton", addClass: "btn-primary btn", text: t.options.messages.save, click: function () {
                t._onSaveClickedOnEditForm()
            }}
        ], close: function () {
            var n = t._$editDiv.find("form:first");
            var r = e("#EditDialogSaveButton");
            t._trigger("formClosed", null, {form: n, formType: "edit", row: t._$editingRow});
            t._setEnabledOfDialogButton(r, true, t.options.messages.save);
            n.remove()
        }})
    }, _onSaveClickedOnEditForm: function () {
        var t = this;
        if (t._$editingRow.hasClass("jtable-row-removed")) {
            t._$editDiv.dialog("close");
            return
        }
        var n = e("#EditDialogSaveButton");
        var r = t._$editDiv.find("form");
        if (t._trigger("formSubmitting", null, {form: r, formType: "edit", row: t._$editingRow}) != false) {
            t._setEnabledOfDialogButton(n, false, t.options.messages.saving);
            t._saveEditForm(r, n)
        }
    }, updateRecord: function (t) {
        var n = this;
        t = e.extend({clientOnly: false, animationsEnabled: n.options.animationsEnabled, url: n.options.actions.updateAction, success: function () {
        }, error: function () {
        }}, t);
        if (!t.record) {
            n._logWarn("options parameter in updateRecord method must contain a record property.");
            return
        }
        var r = n._getKeyValueOfRecord(t.record);
        if (r == undefined || r == null) {
            n._logWarn("options parameter in updateRecord method must contain a record that contains the key field property.");
            return
        }
        var i = n.getRowByKey(r);
        if (i == null) {
            n._logWarn("Can not found any row by key: " + r);
            return
        }
        if (t.clientOnly) {
            e.extend(i.data("record"), t.record);
            n._updateRowTexts(i);
            n._onRecordUpdated(i, null);
            if (t.animationsEnabled) {
                n._showUpdateAnimationForRow(i)
            }
            t.success();
            return
        }
        n._submitFormUsingAjax(t.url, e.param(t.record), function (r) {
            if (r.Result != "OK") {
                n._showError(r.Message);
                t.error(r);
                return
            }
            e.extend(i.data("record"), t.record);
            n._updateRecordValuesFromServerResponse(i.data("record"), r);
            n.load(i.data("record"), r);
            n._updateRowTexts(i);
            n._onRecordUpdated(i, r);
            if (t.animationsEnabled) {
                n._showUpdateAnimationForRow(i)
            }
            t.success(r)
        }, function () {
            n._showError(n.options.messages.serverCommunicationError);
            t.error()
        })
    }, _addColumnsToHeaderRow: function (e) {
        t._addColumnsToHeaderRow.apply(this, arguments);
        if (this.options.actions.updateAction != undefined) {
            e.append(this._createEmptyCommandHeader())
        }
    }, _addCellsToRowUsingRecord: function (n) {
        var r = this;
        t._addCellsToRowUsingRecord.apply(this, arguments);
        if (r.options.actions.updateAction != undefined) {
            var i = e("<span></span>").html(r.options.messages.editRecord);
            var s = e('<button title="' + r.options.messages.editRecord + '"></button>').addClass("jtable-command-button jtable-edit-command-button").append(i).click(function (e) {
                e.preventDefault();
                e.stopPropagation();
                r._showEditForm(n)
            });
            e("<td></td>").addClass("jtable-command-column").append(s).appendTo(n)
        }
    }, _showEditForm: function (t) {
        var n = this;
        var r = t.data("record");
        var i = e('<form id="jtable-edit-form" class="jtable-dialog-form jtable-edit-form"></form>');
        for (var s = 0; s < n._fieldList.length; s++) {
            var o = n._fieldList[s];
            var u = n.options.fields[o];
            var a = r[o];
            if (u.key == true) {
                if (u.edit != true) {
                    i.append(n._createInputForHidden(o, a));
                    continue
                } else {
                    i.append(n._createInputForHidden("jtRecordKey", a))
                }
            }
            if (u.edit == false) {
                continue
            }
            if (u.type == "hidden") {
                i.append(n._createInputForHidden(o, a));
                continue
            }
            var f = e('<div class="jtable-input-field-container"></div>').appendTo(i);
            f.append(n._createInputLabelForRecordField(o));
            var l = n._getValueForRecordField(r, o);
            f.append(n._createInputForRecordField({fieldName: o, value: l, record: r, formType: "edit", form: i}))
        }
        n._makeCascadeDropDowns(i, r, "edit");
        i.submit(function () {
            n._onSaveClickedOnEditForm();
            return false
        });
        n._$editingRow = t;
        n._$editDiv.append(i).dialog("open");
        n._trigger("formCreated", null, {form: i, formType: "edit", record: r, row: t})
    }, _saveEditForm: function (e, t) {
        var n = this;
        n._submitFormUsingAjax(n.options.actions.updateAction, e.serialize(), function (r) {
            if (r.Result != "OK") {
                n._showError(r.Message);
                n._setEnabledOfDialogButton(t, true, n.options.messages.save);
                return
            }
            var i = n._$editingRow.data("record");
            n._updateRecordValuesFromForm(i, e);
            n._updateRecordValuesFromServerResponse(i, r);
            n._updateRowTexts(n._$editingRow);
            n._$editingRow.attr("data-record-key", n._getKeyValueOfRecord(i));
            n._onRecordUpdated(n._$editingRow, r);
            if (n.options.animationsEnabled) {
                n._showUpdateAnimationForRow(n._$editingRow)
            }
            n._$editDiv.dialog("close")
        }, function () {
            n._showError(n.options.messages.serverCommunicationError);
            n._setEnabledOfDialogButton(t, true, n.options.messages.save)
        })
    }, _updateRecordValuesFromServerResponse: function (t, n) {
        if (!n || !n.Record) {
            return
        }
        e.extend(true, t, n.Record)
    }, _getValueForRecordField: function (e, t) {
        var n = this.options.fields[t];
        var r = e[t];
        if (n.type == "date") {
            return this._getDisplayTextForDateRecordField(n, r)
        } else {
            return r
        }
    }, _updateRowTexts: function (e) {
        var t = e.data("record");
        var n = e.find("td");
        for (var r = 0; r < this._columnList.length; r++) {
            var i = this._getDisplayTextForRecordField(t, this._columnList[r]);
            if (i == 0)i = "0";
            n.eq(this._firstDataColumnOffset + r).html(i || "")
        }
        this._onRowUpdated(e)
    }, _showUpdateAnimationForRow: function (e) {
        var t = "jtable-row-updated";
        if (this.options.jqueryuiTheme) {
            t = t + " ui-state-highlight"
        }
        e.stop(true, true).addClass(t, "slow", "", function () {
            e.removeClass(t, 5e3)
        })
    }, _onRowUpdated: function (e) {
        this._trigger("rowUpdated", null, {row: e, record: e.data("record")})
    }, _onRecordUpdated: function (e, t) {
        this._trigger("recordUpdated", null, {record: e.data("record"), row: e, serverResponse: t})
    }})
})(jQuery);
(function (e) {
    var t = {_create: e.hik.jtable.prototype._create, _addColumnsToHeaderRow: e.hik.jtable.prototype._addColumnsToHeaderRow, _addCellsToRowUsingRecord: e.hik.jtable.prototype._addCellsToRowUsingRecord};
    e.extend(true, e.hik.jtable.prototype, {options: {deleteConfirmation: true, recordDeleted: function (e, t) {
    }, messages: {deleteConfirmation: "This record will be deleted. Are you sure?", deleteText: "Delete", deleting: "Deleting", canNotDeletedRecords: "Can not delete {0} of {1} records!", deleteProggress: "Deleting {0} of {1} records, processing..."}}, _$deleteRecordDiv: null, _$deletingRow: null, _create: function () {
        t._create.apply(this, arguments);
        this._createDeleteDialogDiv()
    }, _createDeleteDialogDiv: function () {
        var t = this;
        if (!t.options.actions.deleteAction) {
            return
        }
        t._$deleteRecordDiv = e('<div><p><span class="ui-icon ui-icon-alert" style="float:left; margin:0 7px 20px 0;"></span><span class="jtable-delete-confirm-message"></span></p></div>').appendTo(t._$mainContainer);
        t._$deleteRecordDiv.dialog({autoOpen: false, show: t.options.dialogShowEffect, hide: t.options.dialogHideEffect, modal: true, title: t.options.messages.areYouSure, buttons: [
            {text: t.options.messages.cancel, addClass: "btn", click: function () {
                t._$deleteRecordDiv.dialog("close")
            }},
            {id: "DeleteDialogButton", addClass: "btn btn-danger", text: t.options.messages.deleteText, click: function () {
                if (t._$deletingRow.hasClass("jtable-row-removed")) {
                    t._$deleteRecordDiv.dialog("close");
                    return
                }
                var n = e("#DeleteDialogButton");
                t._setEnabledOfDialogButton(n, false, t.options.messages.deleting);
                t._deleteRecordFromServer(t._$deletingRow, function () {
                    t._removeRowsFromTableWithAnimation(t._$deletingRow);
                    t._$deleteRecordDiv.dialog("close")
                }, function (e) {
                    t._showError(e);
                    t._setEnabledOfDialogButton(n, true, t.options.messages.deleteText)
                })
            }}
        ], close: function () {
            var n = e("#DeleteDialogButton");
            t._setEnabledOfDialogButton(n, true, t.options.messages.deleteText)
        }})
    }, deleteRows: function (t) {
        var n = this;
        if (t.length <= 0) {
            n._logWarn("No rows specified to jTable deleteRows method.");
            return
        }
        if (n._isBusy()) {
            n._logWarn("Can not delete rows since jTable is busy!");
            return
        }
        if (t.length == 1) {
            n._deleteRecordFromServer(t, function () {
                n._removeRowsFromTableWithAnimation(t)
            }, function (e) {
                n._showError(e)
            });
            return
        }
        n._showBusy(n._formatString(n.options.messages.deleteProggress, 0, t.length));
        var r = 0;
        var i = function () {
            return r >= t.length
        };
        var s = function () {
            var e = t.filter(".jtable-row-ready-to-remove");
            if (e.length < t.length) {
                n._showError(n._formatString(n.options.messages.canNotDeletedRecords, t.length - e.length, t.length))
            }
            if (e.length > 0) {
                n._removeRowsFromTableWithAnimation(e)
            }
            n._hideBusy()
        };
        var o = 0;
        t.each(function () {
            var u = e(this);
            n._deleteRecordFromServer(u, function () {
                ++o;
                ++r;
                u.addClass("jtable-row-ready-to-remove");
                n._showBusy(n._formatString(n.options.messages.deleteProggress, o, t.length));
                if (i()) {
                    s()
                }
            }, function () {
                ++r;
                if (i()) {
                    s()
                }
            })
        })
    }, deleteRecord: function (t) {
        var n = this;
        t = e.extend({clientOnly: false, animationsEnabled: n.options.animationsEnabled, url: n.options.actions.deleteAction, success: function () {
        }, error: function () {
        }}, t);
        if (t.key == undefined) {
            n._logWarn("options parameter in deleteRecord method must contain a key property.");
            return
        }
        var r = n.getRowByKey(t.key);
        if (r == null) {
            n._logWarn("Can not found any row by key: " + t.key);
            return
        }
        if (t.clientOnly) {
            n._removeRowsFromTableWithAnimation(r, t.animationsEnabled);
            t.success();
            return
        }
        n._deleteRecordFromServer(r, function (e) {
            n._removeRowsFromTableWithAnimation(r, t.animationsEnabled);
            t.success(e)
        }, function (e) {
            n._showError(e);
            t.error(e)
        }, t.url)
    }, _addColumnsToHeaderRow: function (e) {
        t._addColumnsToHeaderRow.apply(this, arguments);
        if (this.options.actions.deleteAction != undefined) {
            e.append(this._createEmptyCommandHeader())
        }
    }, _addCellsToRowUsingRecord: function (n) {
        t._addCellsToRowUsingRecord.apply(this, arguments);
        var r = this;
        if (r.options.actions.deleteAction != undefined) {
            var i = e("<span></span>").html(r.options.messages.deleteText);
            var s = e('<button title="' + r.options.messages.deleteText + '"></button>').addClass("jtable-command-button jtable-delete-command-button").append(i).click(function (e) {
                e.preventDefault();
                e.stopPropagation();
                r._deleteButtonClickedForRow(n)
            });
            e("<td></td>").addClass("jtable-command-column").append(s).appendTo(n)
        }
    }, _deleteButtonClickedForRow: function (t) {
        var n = this;
        var r;
        var i = n.options.messages.deleteConfirmation;
        if (e.isFunction(n.options.deleteConfirmation)) {
            var s = {row: t, record: t.data("record"), deleteConfirm: true, deleteConfirmMessage: i, cancel: false, cancelMessage: null};
            n.options.deleteConfirmation(s);
            if (s.cancel) {
                if (s.cancelMessage) {
                    n._showError(s.cancelMessage)
                }
                return
            }
            i = s.deleteConfirmMessage;
            r = s.deleteConfirm
        } else {
            r = n.options.deleteConfirmation
        }
        if (r != false) {
            n._$deleteRecordDiv.find(".jtable-delete-confirm-message").html(i);
            n._showDeleteDialog(t)
        } else {
            n._deleteRecordFromServer(t, function () {
                n._removeRowsFromTableWithAnimation(t)
            }, function (e) {
                n._showError(e)
            })
        }
    }, _showDeleteDialog: function (e) {
        this._$deletingRow = e;
        this._$deleteRecordDiv.dialog("open")
    }, _deleteRecordFromServer: function (e, t, n, r) {
        var i = this;
        if (e.data("deleting") == true) {
            return
        }
        e.data("deleting", true);
        var s = {};
        s[i._keyField] = i._getKeyValueOfRecord(e.data("record"));
        this._ajax({url: r || i.options.actions.deleteAction, data: s, success: function (r) {
            if (r.Result != "OK") {
                e.data("deleting", false);
                if (n) {
                    n(r.Message)
                }
                return
            }
            i._trigger("recordDeleted", null, {record: e.data("record"), row: e, serverResponse: r});
            if (t) {
                t(r)
            }
        }, error: function () {
            e.data("deleting", false);
            if (n) {
                n(i.options.messages.serverCommunicationError)
            }
        }})
    }, _removeRowsFromTableWithAnimation: function (e, t) {
        var n = this;
        if (t == undefined) {
            t = n.options.animationsEnabled
        }
        if (t) {
            var r = "jtable-row-deleting";
            if (this.options.jqueryuiTheme) {
                r = r + " ui-state-disabled"
            }
            e.stop(true, true).addClass(r, "slow", "").promise().done(function () {
                n._removeRowsFromTable(e, "deleted")
            })
        } else {
            n._removeRowsFromTable(e, "deleted")
        }
    }})
})(jQuery);
(function (e) {
    var t = {_create: e.hik.jtable.prototype._create, _addColumnsToHeaderRow: e.hik.jtable.prototype._addColumnsToHeaderRow, _addCellsToRowUsingRecord: e.hik.jtable.prototype._addCellsToRowUsingRecord, _onLoadingRecords: e.hik.jtable.prototype._onLoadingRecords, _onRecordsLoaded: e.hik.jtable.prototype._onRecordsLoaded, _onRowsRemoved: e.hik.jtable.prototype._onRowsRemoved};
    e.extend(true, e.hik.jtable.prototype, {options: {selecting: false, multiselect: false, selectingCheckboxes: false, selectOnRowClick: true, selectionChanged: function (e, t) {
    }}, _selectedRecordIdsBeforeLoad: null, _$selectAllCheckbox: null, _shiftKeyDown: false, _create: function () {
        if (this.options.selecting && this.options.selectingCheckboxes) {
            ++this._firstDataColumnOffset;
            this._bindKeyboardEvents()
        }
        t._create.apply(this, arguments)
    }, _bindKeyboardEvents: function () {
        var t = this;
        e(document).keydown(function (e) {
            switch (e.which) {
                case 16:
                    t._shiftKeyDown = true;
                    break
            }
        }).keyup(function (e) {
            switch (e.which) {
                case 16:
                    t._shiftKeyDown = false;
                    break
            }
        })
    }, selectedRows: function () {
        return this._getSelectedRows()
    }, selectRows: function (e) {
        this._selectRows(e);
        this._onSelectionChanged()
    }, _addColumnsToHeaderRow: function (e) {
        if (this.options.selecting && this.options.selectingCheckboxes) {
            if (this.options.multiselect) {
                e.append(this._createSelectAllHeader())
            } else {
                e.append(this._createEmptyCommandHeader())
            }
        }
        t._addColumnsToHeaderRow.apply(this, arguments)
    }, _addCellsToRowUsingRecord: function (e) {
        if (this.options.selecting) {
            this._makeRowSelectable(e)
        }
        t._addCellsToRowUsingRecord.apply(this, arguments)
    }, _onLoadingRecords: function () {
        if (this.options.selecting) {
            this._storeSelectionList()
        }
        t._onLoadingRecords.apply(this, arguments)
    }, _onRecordsLoaded: function () {
        if (this.options.selecting) {
            this._restoreSelectionList()
        }
        t._onRecordsLoaded.apply(this, arguments)
    }, _onRowsRemoved: function (e, n) {
        if (this.options.selecting && n != "reloading" && e.filter(".jtable-row-selected").length > 0) {
            this._onSelectionChanged()
        }
        t._onRowsRemoved.apply(this, arguments)
    }, _createSelectAllHeader: function () {
        var t = this;
        var n = e('<th class=""></th>').addClass("jtable-command-column-header jtable-column-header-selecting");
        this._jqueryuiThemeAddClass(n, "ui-state-default");
        var r = e("<div />").addClass("jtable-column-header-container").appendTo(n);
        t._$selectAllCheckbox = e('<input type="checkbox" />').appendTo(r).click(function () {
            if (t._$tableRows.length <= 0) {
                t._$selectAllCheckbox.attr("checked", false);
                return
            }
            var e = t._$tableBody.find(">tr.jtable-data-row");
            if (t._$selectAllCheckbox.is(":checked")) {
                t._selectRows(e)
            } else {
                t._deselectRows(e)
            }
            t._onSelectionChanged()
        });
        return n
    }, _storeSelectionList: function () {
        var t = this;
        if (!t.options.selecting) {
            return
        }
        t._selectedRecordIdsBeforeLoad = [];
        t._getSelectedRows().each(function () {
            t._selectedRecordIdsBeforeLoad.push(t._getKeyValueOfRecord(e(this).data("record")))
        })
    }, _restoreSelectionList: function () {
        var t = this;
        if (!t.options.selecting) {
            return
        }
        var n = 0;
        for (var r = 0; r < t._$tableRows.length; ++r) {
            var i = t._getKeyValueOfRecord(t._$tableRows[r].data("record"));
            if (e.inArray(i, t._selectedRecordIdsBeforeLoad) > -1) {
                t._selectRows(t._$tableRows[r]);
                ++n
            }
        }
        if (t._selectedRecordIdsBeforeLoad.length > 0 && t._selectedRecordIdsBeforeLoad.length != n) {
            t._onSelectionChanged()
        }
        t._selectedRecordIdsBeforeLoad = [];
        t._refreshSelectAllCheckboxState()
    }, _getSelectedRows: function () {
        return this._$tableBody.find(">tr.jtable-row-selected")
    }, _makeRowSelectable: function (t) {
        var n = this;
        if (n.options.selectOnRowClick) {
            t.click(function () {
                n._invertRowSelection(t)
            })
        }
        if (n.options.selectingCheckboxes) {
            var r = e("<td></td>").addClass("jtable-selecting-column");
            var i = e('<input type="checkbox" />').appendTo(r);
            if (!n.options.selectOnRowClick) {
                i.click(function () {
                    n._invertRowSelection(t)
                })
            }
            t.append(r)
        }
    }, _invertRowSelection: function (e) {
        if (e.hasClass("jtable-row-selected")) {
            this._deselectRows(e)
        } else {
            if (this._shiftKeyDown) {
                var t = this._findRowIndex(e);
                var n = this._findFirstSelectedRowIndexBeforeIndex(t) + 1;
                if (n > 0 && n < t) {
                    this._selectRows(this._$tableBody.find("tr").slice(n, t + 1))
                } else {
                    var r = this._findFirstSelectedRowIndexAfterIndex(t) - 1;
                    if (r > t) {
                        this._selectRows(this._$tableBody.find("tr").slice(t, r + 1))
                    } else {
                        this._selectRows(e)
                    }
                }
            } else {
                this._selectRows(e)
            }
        }
        this._onSelectionChanged()
    }, _findFirstSelectedRowIndexBeforeIndex: function (e) {
        for (var t = e - 1; t >= 0; --t) {
            if (this._$tableRows[t].hasClass("jtable-row-selected")) {
                return t
            }
        }
        return-1
    }, _findFirstSelectedRowIndexAfterIndex: function (e) {
        for (var t = e + 1; t < this._$tableRows.length; ++t) {
            if (this._$tableRows[t].hasClass("jtable-row-selected")) {
                return t
            }
        }
        return-1
    }, _selectRows: function (e) {
        if (!this.options.multiselect) {
            this._deselectRows(this._getSelectedRows())
        }
        e.addClass("jtable-row-selected");
        this._jqueryuiThemeAddClass(e, "ui-state-highlight");
        if (this.options.selectingCheckboxes) {
            e.find(">td.jtable-selecting-column >input").prop("checked", true)
        }
        this._refreshSelectAllCheckboxState()
    }, _deselectRows: function (e) {
        e.removeClass("jtable-row-selected ui-state-highlight");
        if (this.options.selectingCheckboxes) {
            e.find(">td.jtable-selecting-column >input").prop("checked", false)
        }
        this._refreshSelectAllCheckboxState()
    }, _refreshSelectAllCheckboxState: function () {
        if (!this.options.selectingCheckboxes || !this.options.multiselect) {
            return
        }
        var e = this._$tableRows.length;
        var t = this._getSelectedRows().length;
        if (t == 0) {
            this._$selectAllCheckbox.prop("indeterminate", false);
            this._$selectAllCheckbox.attr("checked", false)
        } else if (t == e) {
            this._$selectAllCheckbox.prop("indeterminate", false);
            this._$selectAllCheckbox.attr("checked", true)
        } else {
            this._$selectAllCheckbox.attr("checked", false);
            this._$selectAllCheckbox.prop("indeterminate", true)
        }
    }, _onSelectionChanged: function () {
        this._trigger("selectionChanged", null, {})
    }})
})(jQuery);
(function (e) {
    var t = {load: e.hik.jtable.prototype.load, _create: e.hik.jtable.prototype._create, _setOption: e.hik.jtable.prototype._setOption, _createRecordLoadUrl: e.hik.jtable.prototype._createRecordLoadUrl, _addRowToTable: e.hik.jtable.prototype._addRowToTable, _addRow: e.hik.jtable.prototype._addRow, _removeRowsFromTable: e.hik.jtable.prototype._removeRowsFromTable, _onRecordsLoaded: e.hik.jtable.prototype._onRecordsLoaded};
    e.extend(true, e.hik.jtable.prototype, {options: {paging: false, pageList: "normal", pageSize: 10, pageSizes: [10, 25, 50, 100, 250, 500], pageSizeChangeArea: true, gotoPageArea: "combobox", messages: {pagingInfo: "Showing {0}-{1} of {2}", pageSizeChangeLabel: "Row count", gotoPageLabel: "Go to page"}}, _$bottomPanel: null, _$pagingListArea: null, _$pageSizeChangeArea: null, _$pageInfoSpan: null, _$gotoPageArea: null, _$gotoPageInput: null, _totalRecordCount: 0, _currentPageNo: 1, _create: function () {
        t._create.apply(this, arguments);
        if (this.options.paging) {
            this._loadPagingSettings();
            this._createBottomPanel();
            this._createPageListArea();
            this._createGotoPageInput();
            this._createPageSizeSelection()
        }
    }, _loadPagingSettings: function () {
        if (!this.options.saveUserPreferences) {
            return
        }
        var e = this._getCookie("page-size");
        if (e) {
            this.options.pageSize = this._normalizeNumber(e, 1, 1e6, this.options.pageSize)
        }
    }, _createBottomPanel: function () {
        this._$bottomPanel = e("<div />").addClass("jtable-bottom-panel").insertAfter(this._$table);
        this._jqueryuiThemeAddClass(this._$bottomPanel, "ui-state-default");
        e("<div />").addClass("jtable-left-area").appendTo(this._$bottomPanel);
        e("<div />").addClass("jtable-right-area").appendTo(this._$bottomPanel)
    }, _createPageListArea: function () {
        this._$pagingListArea = e("<span></span>").addClass("jtable-page-list").appendTo(this._$bottomPanel.find(".jtable-left-area"));
        this._$pageInfoSpan = e("<span></span>").addClass("jtable-page-info").appendTo(this._$bottomPanel.find(".jtable-right-area"))
    }, _createPageSizeSelection: function () {
        var t = this;
        if (!t.options.pageSizeChangeArea) {
            return
        }
        if (t._findIndexInArray(t.options.pageSize, t.options.pageSizes) < 0) {
            t.options.pageSizes.push(parseInt(t.options.pageSize));
            t.options.pageSizes.sort(function (e, t) {
                return e - t
            })
        }
        t._$pageSizeChangeArea = e("<span></span>").addClass("jtable-page-size-change").appendTo(t._$bottomPanel.find(".jtable-left-area"));
        t._$pageSizeChangeArea.append("<span>" + t.options.messages.pageSizeChangeLabel + ": </span>");
        var n = e("<select></select>").addClass("reset-this").appendTo(t._$pageSizeChangeArea);
        for (var r = 0; r < t.options.pageSizes.length; r++) {
            n.append('<option value="' + t.options.pageSizes[r] + '">' + t.options.pageSizes[r] + "</option>")
        }
        n.val(t.options.pageSize);
        n.change(function () {
            t._changePageSize(parseInt(e(this).val()))
        })
    }, _createGotoPageInput: function () {
        var t = this;
        if (!t.options.gotoPageArea || t.options.gotoPageArea == "none") {
            return
        }
        this._$gotoPageArea = e("<span></span>").addClass("jtable-goto-page").appendTo(t._$bottomPanel.find(".jtable-left-area"));
        this._$gotoPageArea.append("<span>" + t.options.messages.gotoPageLabel + ": </span>");
        if (t.options.gotoPageArea == "combobox") {
            t._$gotoPageInput = e("<select></select>").addClass("reset-this").appendTo(this._$gotoPageArea).data("pageCount", 1).change(function () {
                t._changePage(parseInt(e(this).val()))
            });
            t._$gotoPageInput.append('<option value="1">1</option>')
        } else {
            t._$gotoPageInput = e('<input type="text" maxlength="10" value="' + t._currentPageNo + '" />').appendTo(this._$gotoPageArea).keypress(function (e) {
                if (e.which == 13) {
                    e.preventDefault();
                    t._changePage(parseInt(t._$gotoPageInput.val()))
                } else if (e.which == 43) {
                    e.preventDefault();
                    t._changePage(parseInt(t._$gotoPageInput.val()) + 1)
                } else if (e.which == 45) {
                    e.preventDefault();
                    t._changePage(parseInt(t._$gotoPageInput.val()) - 1)
                } else {
                    var n = 47 < e.keyCode && e.keyCode < 58 && e.shiftKey == false && e.altKey == false || e.keyCode == 8 || e.keyCode == 9;
                    if (!n) {
                        e.preventDefault()
                    }
                }
            })
        }
    }, _refreshGotoPageInput: function () {
        if (!this.options.gotoPageArea || this.options.gotoPageArea == "none") {
            return
        }
        if (this._totalRecordCount <= 0) {
            this._$gotoPageArea.hide()
        } else {
            this._$gotoPageArea.show()
        }
        if (this.options.gotoPageArea == "combobox") {
            var e = this._$gotoPageInput.data("pageCount");
            var t = this._calculatePageCount();
            if (e != t) {
                this._$gotoPageInput.empty();
                var n = 1;
                if (t > 1e4) {
                    n = 100
                } else if (t > 5e3) {
                    n = 10
                } else if (t > 2e3) {
                    n = 5
                } else if (t > 1e3) {
                    n = 2
                }
                for (var r = n; r <= t; r += n) {
                    this._$gotoPageInput.append('<option value="' + r + '">' + r + "</option>")
                }
                this._$gotoPageInput.data("pageCount", t)
            }
        }
        this._$gotoPageInput.val(this._currentPageNo)
    }, load: function () {
        this._currentPageNo = 1;
        t.load.apply(this, arguments)
    }, _setOption: function (e, n) {
        t._setOption.apply(this, arguments);
        if (e == "pageSize") {
            this._changePageSize(parseInt(n))
        }
    }, _changePageSize: function (e) {
        if (e == this.options.pageSize) {
            return
        }
        this.options.pageSize = e;
        var t = this._calculatePageCount();
        if (this._currentPageNo > t) {
            this._currentPageNo = t
        }
        if (this._currentPageNo <= 0) {
            this._currentPageNo = 1
        }
        var n = this._$bottomPanel.find(".jtable-page-size-change select");
        if (n.length > 0) {
            if (parseInt(n.val()) != e) {
                var r = n.find("option[value=" + e + "]");
                if (r.length > 0) {
                    n.val(e)
                }
            }
        }
        this._savePagingSettings();
        this._reloadTable()
    }, _savePagingSettings: function () {
        if (!this.options.saveUserPreferences) {
            return
        }
        this._setCookie("page-size", this.options.pageSize)
    }, _createRecordLoadUrl: function () {
        var e = t._createRecordLoadUrl.apply(this, arguments);
        e = this._addPagingInfoToUrl(e, this._currentPageNo);
        return e
    }, _addRowToTable: function (e, n, r) {
        if (r && this.options.paging) {
            this._reloadTable();
            return
        }
        t._addRowToTable.apply(this, arguments)
    }, _addRow: function (e, n) {
        if (n && n.isNewRow && this.options.paging) {
            this._reloadTable();
            return
        }
        t._addRow.apply(this, arguments)
    }, _removeRowsFromTable: function (e, n) {
        t._removeRowsFromTable.apply(this, arguments);
        if (this.options.paging) {
            if (this._$tableRows.length <= 0 && this._currentPageNo > 1) {
                --this._currentPageNo
            }
            this._reloadTable()
        }
    }, _onRecordsLoaded: function (e) {
        if (this.options.paging) {
            this._totalRecordCount = e.TotalRecordCount;
            this._createPagingList();
            this._createPagingInfo();
            this._refreshGotoPageInput()
        }
        t._onRecordsLoaded.apply(this, arguments)
    }, _addPagingInfoToUrl: function (e, t) {
        if (!this.options.paging) {
            return e
        }
        var n = (t - 1) * this.options.pageSize;
        var r = this.options.pageSize;
        return e + (e.indexOf("?") < 0 ? "?" : "&") + "jtStartIndex=" + n + "&jtPageSize=" + r
    }, _createPagingList: function () {
        if (this.options.pageSize <= 0) {
            return
        }
        this._$pagingListArea.empty();
        if (this._totalRecordCount <= 0) {
            return
        }
        var e = this._calculatePageCount();
        this._createFirstAndPreviousPageButtons();
        if (this.options.pageList == "normal") {
            this._createPageNumberButtons(this._calculatePageNumbers(e))
        }
        this._createLastAndNextPageButtons(e);
        this._bindClickEventsToPageNumberButtons()
    }, _createFirstAndPreviousPageButtons: function () {
        var t = e("<span></span>").addClass("jtable-page-number-first").html("&lt&lt").data("pageNumber", 1).appendTo(this._$pagingListArea);
        var n = e("<span></span>").addClass("jtable-page-number-previous").html("&lt").data("pageNumber", this._currentPageNo - 1).appendTo(this._$pagingListArea);
        this._jqueryuiThemeAddClass(t, "ui-button ui-state-default", "ui-state-hover");
        this._jqueryuiThemeAddClass(n, "ui-button ui-state-default", "ui-state-hover");
        if (this._currentPageNo <= 1) {
            t.addClass("jtable-page-number-disabled");
            n.addClass("jtable-page-number-disabled");
            this._jqueryuiThemeAddClass(t, "ui-state-disabled");
            this._jqueryuiThemeAddClass(n, "ui-state-disabled")
        }
    }, _createLastAndNextPageButtons: function (t) {
        var n = e("<span></span>").addClass("jtable-page-number-next").html("&gt").data("pageNumber", this._currentPageNo + 1).appendTo(this._$pagingListArea);
        var r = e("<span></span>").addClass("jtable-page-number-last").html("&gt&gt").data("pageNumber", t).appendTo(this._$pagingListArea);
        this._jqueryuiThemeAddClass(n, "ui-button ui-state-default", "ui-state-hover");
        this._jqueryuiThemeAddClass(r, "ui-button ui-state-default", "ui-state-hover");
        if (this._currentPageNo >= t) {
            n.addClass("jtable-page-number-disabled");
            r.addClass("jtable-page-number-disabled");
            this._jqueryuiThemeAddClass(n, "ui-state-disabled");
            this._jqueryuiThemeAddClass(r, "ui-state-disabled")
        }
    }, _createPageNumberButtons: function (t) {
        var n = 0;
        for (var r = 0; r < t.length; r++) {
            if (t[r] - n > 1) {
                e("<span></span>").addClass("jtable-page-number-space").html("...").appendTo(this._$pagingListArea)
            }
            this._createPageNumberButton(t[r]);
            n = t[r]
        }
    }, _createPageNumberButton: function (t) {
        var n = e("<span></span>").addClass("jtable-page-number").html(t).data("pageNumber", t).appendTo(this._$pagingListArea);
        this._jqueryuiThemeAddClass(n, "ui-button ui-state-default", "ui-state-hover");
        if (this._currentPageNo == t) {
            n.addClass("jtable-page-number-active jtable-page-number-disabled");
            this._jqueryuiThemeAddClass(n, "ui-state-active")
        }
    }, _calculatePageCount: function () {
        var e = Math.floor(this._totalRecordCount / this.options.pageSize);
        if (this._totalRecordCount % this.options.pageSize != 0) {
            ++e
        }
        return e
    }, _calculatePageNumbers: function (e) {
        if (e <= 4) {
            var t = [];
            for (var n = 1; n <= e; ++n) {
                t.push(n)
            }
            return t
        } else {
            var r = [1, 2, e - 1, e];
            var i = this._normalizeNumber(this._currentPageNo - 1, 1, e, 1);
            var s = this._normalizeNumber(this._currentPageNo + 1, 1, e, 1);
            this._insertToArrayIfDoesNotExists(r, i);
            this._insertToArrayIfDoesNotExists(r, this._currentPageNo);
            this._insertToArrayIfDoesNotExists(r, s);
            r.sort(function (e, t) {
                return e - t
            });
            return r
        }
    }, _createPagingInfo: function () {
        if (this._totalRecordCount <= 0) {
            this._$pageInfoSpan.empty();
            return
        }
        var e = (this._currentPageNo - 1) * this.options.pageSize + 1;
        var t = this._currentPageNo * this.options.pageSize;
        t = this._normalizeNumber(t, e, this._totalRecordCount, 0);
        if (t >= e) {
            var n = this._formatString(this.options.messages.pagingInfo, e, t, this._totalRecordCount);
            this._$pageInfoSpan.html(n)
        }
    }, _bindClickEventsToPageNumberButtons: function () {
        var t = this;
        t._$pagingListArea.find(".jtable-page-number,.jtable-page-number-previous,.jtable-page-number-next,.jtable-page-number-first,.jtable-page-number-last").not(".jtable-page-number-disabled").click(function (n) {
            n.preventDefault();
            t._changePage(e(this).data("pageNumber"))
        })
    }, _changePage: function (e) {
        e = this._normalizeNumber(e, 1, this._calculatePageCount(), 1);
        if (e == this._currentPageNo) {
            this._refreshGotoPageInput();
            return
        }
        this._currentPageNo = e;
        this._reloadTable()
    }})
})(jQuery);
(function (e) {
    var t = {_initializeFields: e.hik.jtable.prototype._initializeFields, _normalizeFieldOptions: e.hik.jtable.prototype._normalizeFieldOptions, _createHeaderCellForField: e.hik.jtable.prototype._createHeaderCellForField, _createRecordLoadUrl: e.hik.jtable.prototype._createRecordLoadUrl};
    e.extend(true, e.hik.jtable.prototype, {options: {sorting: false, multiSorting: false, defaultSorting: ""}, _lastSorting: null, _initializeFields: function () {
        t._initializeFields.apply(this, arguments);
        this._lastSorting = [];
        if (this.options.sorting) {
            this._buildDefaultSortingArray()
        }
    }, _normalizeFieldOptions: function (e, n) {
        t._normalizeFieldOptions.apply(this, arguments);
        n.sorting = n.sorting != false
    }, _createHeaderCellForField: function (e, n) {
        var r = t._createHeaderCellForField.apply(this, arguments);
        if (this.options.sorting && n.sorting) {
            this._makeColumnSortable(r, e)
        }
        return r
    }, _createRecordLoadUrl: function () {
        var e = t._createRecordLoadUrl.apply(this, arguments);
        e = this._addSortingInfoToUrl(e);
        return e
    }, _buildDefaultSortingArray: function () {
        var t = this;
        e.each(t.options.defaultSorting.split(","), function (n, r) {
            e.each(t.options.fields, function (e, n) {
                if (n.sorting) {
                    var i = r.indexOf(e);
                    if (i > -1) {
                        if (r.toUpperCase().indexOf(" DESC", i) > -1) {
                            t._lastSorting.push({fieldName: e, sortOrder: "DESC"})
                        } else {
                            t._lastSorting.push({fieldName: e, sortOrder: "ASC"})
                        }
                    }
                }
            })
        })
    }, _makeColumnSortable: function (t, n) {
        var r = this;
        t.addClass("jtable-column-header-sortable").click(function (e) {
            e.preventDefault();
            if (!r.options.multiSorting || !e.ctrlKey) {
                r._lastSorting = []
            }
            r._sortTableByColumn(t)
        });
        e.each(this._lastSorting, function (e, r) {
            if (r.fieldName == n) {
                if (r.sortOrder == "DESC") {
                    t.addClass("jtable-column-header-sorted-desc")
                } else {
                    t.addClass("jtable-column-header-sorted-asc")
                }
            }
        })
    }, _sortTableByColumn: function (e) {
        if (this._lastSorting.length == 0) {
            e.siblings().removeClass("jtable-column-header-sorted-asc jtable-column-header-sorted-desc")
        }
        for (var t = 0; t < this._lastSorting.length; t++) {
            if (this._lastSorting[t].fieldName == e.data("fieldName")) {
                this._lastSorting.splice(t--, 1)
            }
        }
        if (e.hasClass("jtable-column-header-sorted-asc")) {
            e.removeClass("jtable-column-header-sorted-asc").addClass("jtable-column-header-sorted-desc");
            this._lastSorting.push({fieldName: e.data("fieldName"), sortOrder: "DESC"})
        } else {
            e.removeClass("jtable-column-header-sorted-desc").addClass("jtable-column-header-sorted-asc");
            this._lastSorting.push({fieldName: e.data("fieldName"), sortOrder: "ASC"})
        }
        this._reloadTable()
    }, _addSortingInfoToUrl: function (t) {
        if (!this.options.sorting || this._lastSorting.length == 0) {
            return t
        }
        var n = [];
        e.each(this._lastSorting, function (e, t) {
            n.push(t.fieldName + " " + t.sortOrder)
        });
        return t + (t.indexOf("?") < 0 ? "?" : "&") + "jtSorting=" + n.join(",")
    }})
})(jQuery);
(function (e) {
    var t = {_create: e.hik.jtable.prototype._create, _normalizeFieldOptions: e.hik.jtable.prototype._normalizeFieldOptions, _createHeaderCellForField: e.hik.jtable.prototype._createHeaderCellForField, _createCellForRecordField: e.hik.jtable.prototype._createCellForRecordField};
    e.extend(true, e.hik.jtable.prototype, {options: {tableId: undefined, columnResizable: true, columnSelectable: true}, _$columnSelectionDiv: null, _$columnResizeBar: null, _cookieKeyPrefix: null, _currentResizeArgs: null, _create: function () {
        t._create.apply(this, arguments);
        this._createColumnResizeBar();
        this._createColumnSelection();
        if (this.options.saveUserPreferences) {
            this._loadColumnSettings()
        }
        this._normalizeColumnWidths()
    }, _normalizeFieldOptions: function (e, n) {
        t._normalizeFieldOptions.apply(this, arguments);
        if (this.options.columnResizable) {
            n.columnResizable = n.columnResizable != false
        }
        if (!n.visibility) {
            n.visibility = "visible"
        }
    }, _createHeaderCellForField: function (e, n) {
        var r = t._createHeaderCellForField.apply(this, arguments);
        if (this.options.columnResizable && n.columnResizable && e != this._columnList[this._columnList.length - 1]) {
            this._makeColumnResizable(r)
        }
        if (n.visibility == "hidden") {
            r.hide()
        }
        return r
    }, _createCellForRecordField: function (e, n) {
        var r = t._createCellForRecordField.apply(this, arguments);
        var i = this.options.fields[n];
        if (i.visibility == "hidden") {
            r.hide()
        }
        return r
    }, changeColumnVisibility: function (e, t) {
        this._changeColumnVisibilityInternal(e, t);
        this._normalizeColumnWidths();
        if (this.options.saveUserPreferences) {
            this._saveColumnSettings()
        }
    }, _changeColumnVisibilityInternal: function (e, t) {
        var n = this._columnList.indexOf(e);
        if (n < 0) {
            this._logWarn('Column "' + e + '" does not exist in fields!');
            return
        }
        if (["visible", "hidden", "fixed"].indexOf(t) < 0) {
            this._logWarn('Visibility value is not valid: "' + t + '"! Options are: visible, hidden, fixed.');
            return
        }
        var r = this.options.fields[e];
        if (r.visibility == t) {
            return
        }
        var i = this._firstDataColumnOffset + n + 1;
        if (r.visibility != "hidden" && t == "hidden") {
            this._$table.find(">thead >tr >th:nth-child(" + i + "),>tbody >tr >td:nth-child(" + i + ")").hide()
        } else if (r.visibility == "hidden" && t != "hidden") {
            this._$table.find(">thead >tr >th:nth-child(" + i + "),>tbody >tr >td:nth-child(" + i + ")").show().css("display", "table-cell")
        }
        r.visibility = t
    }, _createColumnSelection: function () {
        var t = this;
        this._$columnSelectionDiv = e("<div />").addClass("jtable-column-selection-container").appendTo(t._$mainContainer);
        this._$table.children("thead").bind("contextmenu", function (n) {
            if (!t.options.columnSelectable) {
                return
            }
            n.preventDefault();
            e("<div />").addClass("jtable-contextmenu-overlay").click(function () {
                e(this).remove();
                t._$columnSelectionDiv.hide()
            }).bind("contextmenu",function () {
                return false
            }).appendTo(document.body);
            t._fillColumnSelection();
            var r = t._$mainContainer.offset();
            var i = n.pageY - r.top;
            var s = n.pageX - r.left;
            var o = 100;
            var u = t._$mainContainer.width();
            if (u > o && s > u - o) {
                s = u - o
            }
            t._$columnSelectionDiv.css({left: s, top: i, "min-width": o + "px"}).show()
        })
    }, _fillColumnSelection: function () {
        var t = this;
        var n = e("<ul></ul>").addClass("jtable-column-select-list");
        for (var r = 0; r < this._columnList.length; r++) {
            var i = this._columnList[r];
            var s = this.options.fields[i];
            var o = e("<li></li>").appendTo(n);
            var u = e('<label for="' + i + '"></label>').append(e("<span>" + (s.title || i) + "</span>")).appendTo(o);
            var a = e('<input type="checkbox" name="' + i + '">').prependTo(u).click(function () {
                var n = e(this);
                var r = n.attr("name");
                var i = t.options.fields[r];
                if (i.visibility == "fixed") {
                    return
                }
                t.changeColumnVisibility(r, n.is(":checked") ? "visible" : "hidden")
            });
            if (s.visibility != "hidden") {
                a.attr("checked", "checked")
            }
            if (s.visibility == "fixed") {
                a.attr("disabled", "disabled")
            }
        }
        this._$columnSelectionDiv.html(n)
    }, _createColumnResizeBar: function () {
        this._$columnResizeBar = e("<div />").addClass("jtable-column-resize-bar").appendTo(this._$mainContainer).hide()
    }, _makeColumnResizable: function (t) {
        var n = this;
        e("<div />").addClass("jtable-column-resize-handler").appendTo(t.find(".jtable-column-header-container")).mousedown(function (r) {
            r.preventDefault();
            r.stopPropagation();
            var i = n._$mainContainer.offset();
            var s = t.nextAll("th.jtable-column-header:visible:first");
            if (!s.length) {
                return
            }
            var o = 10;
            n._currentResizeArgs = {currentColumnStartWidth: t.outerWidth(), minWidth: o, maxWidth: t.outerWidth() + s.outerWidth() - o, mouseStartX: r.pageX, minResizeX: function () {
                return this.mouseStartX - (this.currentColumnStartWidth - this.minWidth)
            }, maxResizeX: function () {
                return this.mouseStartX + (this.maxWidth - this.currentColumnStartWidth)
            }};
            var u = function (e) {
                if (!n._currentResizeArgs) {
                    return
                }
                var t = n._normalizeNumber(e.pageX, n._currentResizeArgs.minResizeX(), n._currentResizeArgs.maxResizeX());
                n._$columnResizeBar.css("left", t - i.left + "px")
            };
            var a = function (r) {
                if (!n._currentResizeArgs) {
                    return
                }
                e(document).unbind("mousemove", u);
                e(document).unbind("mouseup", a);
                n._$columnResizeBar.hide();
                var i = r.pageX - n._currentResizeArgs.mouseStartX;
                var o = n._normalizeNumber(n._currentResizeArgs.currentColumnStartWidth + i, n._currentResizeArgs.minWidth, n._currentResizeArgs.maxWidth);
                var f = s.outerWidth() + (n._currentResizeArgs.currentColumnStartWidth - o);
                var l = t.data("width-in-percent") / n._currentResizeArgs.currentColumnStartWidth;
                t.data("width-in-percent", o * l);
                s.data("width-in-percent", f * l);
                t.css("width", t.data("width-in-percent") + "%");
                s.css("width", s.data("width-in-percent") + "%");
                n._normalizeColumnWidths();
                n._currentResizeArgs = null;
                if (n.options.saveUserPreferences) {
                    n._saveColumnSettings()
                }
            };
            n._$columnResizeBar.show().css({top: t.offset().top - i.top + "px", left: r.pageX - i.left + "px", height: n._$table.outerHeight() + "px"});
            e(document).bind("mousemove", u);
            e(document).bind("mouseup", a)
        })
    }, _normalizeColumnWidths: function () {
        var t = this._$table.find(">thead th.jtable-command-column-header").data("width-in-percent", 1).css("width", "1%");
        var n = this._$table.find(">thead th.jtable-column-header");
        var r = 0;
        n.each(function () {
            var t = e(this);
            if (t.is(":visible")) {
                r += t.outerWidth()
            }
        });
        var i = {};
        var s = 100 - t.length;
        n.each(function () {
            var t = e(this);
            if (t.is(":visible")) {
                var n = t.data("fieldName");
                var o = t.outerWidth() * s / r;
                i[n] = o
            }
        });
        n.each(function () {
            var t = e(this);
            if (t.is(":visible")) {
                var n = t.data("fieldName");
                t.data("width-in-percent", i[n]).css("width", i[n] + "%")
            }
        })
    }, _saveColumnSettings: function () {
        var t = this;
        var n = "";
        this._$table.find(">thead >tr >th.jtable-column-header").each(function () {
            var r = e(this);
            var i = r.data("fieldName");
            var s = r.data("width-in-percent");
            var o = t.options.fields[i].visibility;
            var u = i + "=" + o + ";" + s;
            n = n + u + "|"
        });
        this._setCookie("column-settings", n.substr(0, n.length - 1))
    }, _loadColumnSettings: function () {
        var t = this;
        var n = this._getCookie("column-settings");
        if (!n) {
            return
        }
        var r = {};
        e.each(n.split("|"), function (e, t) {
            var n = t.split("=");
            var i = n[0];
            var s = n[1].split(";");
            r[i] = {columnVisibility: s[0], columnWidth: s[1]}
        });
        var i = this._$table.find(">thead >tr >th.jtable-column-header");
        i.each(function () {
            var n = e(this);
            var i = n.data("fieldName");
            var s = t.options.fields[i];
            if (r[i]) {
                if (s.visibility != "fixed") {
                    t._changeColumnVisibilityInternal(i, r[i].columnVisibility)
                }
                n.data("width-in-percent", r[i].columnWidth).css("width", r[i].columnWidth + "%")
            }
        })
    }})
})(jQuery);
(function (e) {
    var t = {_removeRowsFromTable: e.hik.jtable.prototype._removeRowsFromTable};
    e.extend(true, e.hik.jtable.prototype, {options: {openChildAsAccordion: false}, openChildTable: function (t, n, r) {
        var i = this;
        if (n.jqueryuiTheme == undefined) {
            n.jqueryuiTheme = i.options.jqueryuiTheme
        }
        n.showCloseButton = n.showCloseButton != false;
        if (n.showCloseButton && !n.closeRequested) {
            n.closeRequested = function () {
                i.closeChildTable(t)
            }
        }
        if (i.options.openChildAsAccordion) {
            t.siblings(".jtable-data-row").each(function () {
                i.closeChildTable(e(this))
            })
        }
        i.closeChildTable(t, function () {
            var s = i.getChildRow(t).children("td").empty();
            var o = e("<div />").addClass("jtable-child-table-container").appendTo(s);
            s.data("childTable", o);
            o.jtable(n);
            i.openChildRow(t);
            o.hide().slideDown("fast", function () {
                if (r) {
                    r({childTable: o})
                }
            })
        })
    }, closeChildTable: function (e, t) {
        var n = this;
        var r = this.getChildRow(e).children("td");
        var i = r.data("childTable");
        if (!i) {
            if (t) {
                t()
            }
            return
        }
        r.data("childTable", null);
        i.slideUp("fast", function () {
            i.jtable("destroy");
            i.remove();
            n.closeChildRow(e);
            if (t) {
                t()
            }
        })
    }, isChildRowOpen: function (e) {
        return this.getChildRow(e).is(":visible")
    }, getChildRow: function (e) {
        return e.data("childRow") || this._createChildRow(e)
    }, openChildRow: function (e) {
        var t = this.getChildRow(e);
        if (!t.is(":visible")) {
            t.show()
        }
        return t
    }, closeChildRow: function (e) {
        var t = this.getChildRow(e);
        if (t.is(":visible")) {
            t.hide()
        }
    }, _removeRowsFromTable: function (n, r) {
        if (r == "deleted") {
            n.each(function () {
                var t = e(this);
                var n = t.data("childRow");
                if (n) {
                    n.remove()
                }
            })
        }
        t._removeRowsFromTable.apply(this, arguments)
    }, _createChildRow: function (t) {
        var n = this._$table.find("thead th").length;
        var r = e("<tr></tr>").addClass("jtable-child-row").append('<td colspan="' + n + '"></td>');
        t.after(r);
        t.data("childRow", r);
        r.hide();
        return r
    }})
})(jQuery)