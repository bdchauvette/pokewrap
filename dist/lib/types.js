'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Callback = exports.ResourceType = exports.ResourceList = exports.Resource = exports.OptionsObject = exports.NameOrIdList = exports.NameOrId = exports.Id = undefined;

var _tcomb = require('tcomb');

var _tcomb2 = _interopRequireDefault(_tcomb);

var _resourceTypes = require('./resource-types');

var _resourceTypes2 = _interopRequireDefault(_resourceTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Id = exports.Id = _tcomb2.default.refinement(_tcomb2.default.Number, function (n) {
  return n > 0 && Number.isInteger(n);
}, 'ID');
var NameOrId = exports.NameOrId = _tcomb2.default.union([_tcomb2.default.String, Id], 'Name|ID');
var NameOrIdList = exports.NameOrIdList = _tcomb2.default.list(NameOrId, 'List<Name|Id>');

var OptionsObject = exports.OptionsObject = _tcomb2.default.Object;

var Resource = exports.Resource = _tcomb2.default.union([NameOrId, OptionsObject], 'Resource');
var ResourceList = exports.ResourceList = _tcomb2.default.list(Resource, 'List<Resource>');
var ResourceType = exports.ResourceType = _tcomb2.default.enums.of(_resourceTypes2.default, 'ResourceType');

var Callback = exports.Callback = _tcomb2.default.Function;