import t from 'tcomb';

import resourceTypes from './resource-types';


export const Id = t.refinement(t.Number, (n) => (n > 0 && Number.isInteger(n)), 'ID');
export const NameOrId = t.union([t.String, Id], 'Name|ID');
export const NameOrIdList = t.list(NameOrId, 'List<Name|Id>');

export const OptionsObject = t.Object;

export const Resource = t.union([NameOrId, OptionsObject], 'Resource');
export const ResourceList = t.list(Resource, 'List<Resource>');
export const ResourceType = t.enums.of(resourceTypes, 'ResourceType');

export const Callback = t.Function;
