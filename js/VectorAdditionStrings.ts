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
    'titleStringProperty': TReadOnlyProperty<string>;
  };
  'screen': {
    'equations': string;
    'equationsStringProperty': TReadOnlyProperty<string>;
    'explore1D': string;
    'explore1DStringProperty': TReadOnlyProperty<string>;
    'explore2D': string;
    'explore2DStringProperty': TReadOnlyProperty<string>;
    'lab': string;
    'labStringProperty': TReadOnlyProperty<string>;
  };
  'sum': string;
  'sumStringProperty': TReadOnlyProperty<string>;
  'values': string;
  'valuesStringProperty': TReadOnlyProperty<string>;
  'components': string;
  'componentsStringProperty': TReadOnlyProperty<string>;
  'noVectorSelected': string;
  'noVectorSelectedStringProperty': TReadOnlyProperty<string>;
  'vectorValues': string;
  'vectorValuesStringProperty': TReadOnlyProperty<string>;
  'symbol': {
    'x': string;
    'xStringProperty': TReadOnlyProperty<string>;
    'y': string;
    'yStringProperty': TReadOnlyProperty<string>;
  };
  'baseVectors': string;
  'baseVectorsStringProperty': TReadOnlyProperty<string>;
  'equation': string;
  'equationStringProperty': TReadOnlyProperty<string>;
};

const VectorAdditionStrings = getStringModule( 'VECTOR_ADDITION' ) as StringsType;

vectorAddition.register( 'VectorAdditionStrings', VectorAdditionStrings );

export default VectorAdditionStrings;
