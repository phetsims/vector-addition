// Copyright 2021-2022, University of Colorado Boulder

/**
 * Auto-generated from modulify, DO NOT manually modify.
 */
/* eslint-disable */
import getStringModule from '../../chipper/js/getStringModule.js';
import TReadOnlyProperty from '../../axon/js/TReadOnlyProperty.js';
import vectorAddition from './vectorAddition.js';

type StringsType = {
  'vector-addition': {
    'title': string;
    'titleProperty': TReadOnlyProperty<string>;
  };
  'screen': {
    'equations': string;
    'equationsProperty': TReadOnlyProperty<string>;
    'explore1D': string;
    'explore1DProperty': TReadOnlyProperty<string>;
    'explore2D': string;
    'explore2DProperty': TReadOnlyProperty<string>;
    'lab': string;
    'labProperty': TReadOnlyProperty<string>;
  };
  'sum': string;
  'sumProperty': TReadOnlyProperty<string>;
  'values': string;
  'valuesProperty': TReadOnlyProperty<string>;
  'components': string;
  'componentsProperty': TReadOnlyProperty<string>;
  'noVectorSelected': string;
  'noVectorSelectedProperty': TReadOnlyProperty<string>;
  'vectorValues': string;
  'vectorValuesProperty': TReadOnlyProperty<string>;
  'symbol': {
    'x': string;
    'xProperty': TReadOnlyProperty<string>;
    'y': string;
    'yProperty': TReadOnlyProperty<string>;
  };
  'baseVectors': string;
  'baseVectorsProperty': TReadOnlyProperty<string>;
  'equation': string;
  'equationProperty': TReadOnlyProperty<string>;
};

const vectorAdditionStrings = getStringModule( 'VECTOR_ADDITION' ) as StringsType;

vectorAddition.register( 'vectorAdditionStrings', vectorAdditionStrings );

export default vectorAdditionStrings;
