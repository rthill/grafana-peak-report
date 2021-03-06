'use strict';

System.register(['lodash', 'app/core/utils/kbn', 'app/core/utils/file_export', 'app/plugins/sdk', './util/builder', './util/sorter', './util/exporter'], function (_export, _context) {
  "use strict";

  var _, kbn, fileExport, MetricsPanelCtrl, Builder, Sorter, Exporter, _createClass, panelDefaults, Ctrl;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  return {
    setters: [function (_lodash) {
      _ = _lodash.default;
    }, function (_appCoreUtilsKbn) {
      kbn = _appCoreUtilsKbn.default;
    }, function (_appCoreUtilsFile_export) {
      fileExport = _appCoreUtilsFile_export;
    }, function (_appPluginsSdk) {
      MetricsPanelCtrl = _appPluginsSdk.MetricsPanelCtrl;
    }, function (_utilBuilder) {
      Builder = _utilBuilder.Builder;
    }, function (_utilSorter) {
      Sorter = _utilSorter.Sorter;
    }, function (_utilExporter) {
      Exporter = _utilExporter.Exporter;
    }],
    execute: function () {
      _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      panelDefaults = {
        defaultColor: 'rgb(117, 117, 117)',
        decimals: 2,
        nameComponents: '1,2,3',
        columns: [],
        sortColumn: -1,
        sortMultiplier: 1
      };

      _export('PanelCtrl', Ctrl = function (_MetricsPanelCtrl) {
        _inherits(Ctrl, _MetricsPanelCtrl);

        function Ctrl($scope, $injector) {
          _classCallCheck(this, Ctrl);

          var _this = _possibleConstructorReturn(this, (Ctrl.__proto__ || Object.getPrototypeOf(Ctrl)).call(this, $scope, $injector));

          _.defaults(_this.panel, panelDefaults);

          _this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
          _this.events.on('data-received', _this.onDataReceived.bind(_this));
          _this.events.on('render', _this.onRender.bind(_this));
          _this.events.on('init-panel-actions', _this.onInitPanelActions.bind(_this));

          _this.builder = new Builder(_this.panel);
          _this.sorter = new Sorter(_this.panel);
          _this.exporter = new Exporter(_this.panel.columns);
          _this.rows = [];
          return _this;
        }

        _createClass(Ctrl, [{
          key: 'onInitEditMode',
          value: function onInitEditMode() {
            this.addEditorTab('Options', 'public/plugins/btplc-peak-report-panel/editor.html');
            this.unitFormats = kbn.getUnitFormats();
          }
        }, {
          key: 'onDataReceived',
          value: function onDataReceived(seriesList) {
            this.seriesList = seriesList;
            this.render();
          }
        }, {
          key: 'onRender',
          value: function onRender() {
            this.rows = this.builder.call(this.seriesList);
            this.rows = this.sorter.sort(this.rows);
          }
        }, {
          key: 'onInitPanelActions',
          value: function onInitPanelActions(actions) {
            actions.push({ text: 'Export CSV', click: 'ctrl.exportCSV()' });
          }
        }, {
          key: 'onEditorAddColumnClick',
          value: function onEditorAddColumnClick() {
            this.panel.columns.push({ title: '', regex: '', format: 'none', showDate: false });
            this.render();
          }
        }, {
          key: 'onEditorRemoveColumnClick',
          value: function onEditorRemoveColumnClick(index) {
            this.panel.columns.splice(index, 1);
            this.render();
          }
        }, {
          key: 'onEditorFormatSelect',
          value: function onEditorFormatSelect(format, column) {
            column.format = format.value;
            this.render();
          }
        }, {
          key: 'onColumnClick',
          value: function onColumnClick(index) {
            this.sorter.toggle(index);
            this.render();
          }
        }, {
          key: 'format',
          value: function format(value, index) {
            var column = this.panel.columns[index];
            return kbn.valueFormats[column.format](value, this.panel.decimals, null);
          }
        }, {
          key: 'sortIcon',
          value: function sortIcon(index) {
            return this.sorter.icon(index);
          }
        }, {
          key: 'exportCSV',
          value: function exportCSV() {
            fileExport.saveSaveBlob(this.exporter.call(this.rows), 'grafana_data_export');
          }
        }]);

        return Ctrl;
      }(MetricsPanelCtrl));

      Ctrl.templateUrl = 'module.html';

      _export('PanelCtrl', Ctrl);
    }
  };
});
//# sourceMappingURL=module.js.map
