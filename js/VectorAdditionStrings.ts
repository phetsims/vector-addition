// Copyright 2021-2022, University of Colorado Boulder

/**
 * Auto-generated from modulify, DO NOT manually modify.
 */
/* eslint-disable */
import getStringModule from '../../chipper/js/getStringModule.js';
import LinkableProperty from '../../axon/js/LinkableProperty.js';
import vectorAddition from './vectorAddition.js';

type StringsType = {
  'vector-addition': {
    'title': string;
    'titleStringProperty': LinkableProperty<string>;
  };
  'screen': {
    'equations': string;
    'equationsStringProperty': LinkableProperty<string>;
    'explore1D': string;
    'explore1DStringProperty': LinkableProperty<string>;
    'explore2D': string;
    'explore2DStringProperty': LinkableProperty<string>;
    'lab': string;
    'labStringProperty': LinkableProperty<string>;
  };
  'sum': string;
  'sumStringProperty': LinkableProperty<string>;
  'values': string;
  'valuesStringProperty': LinkableProperty<string>;
  'components': string;
  'componentsStringProperty': LinkableProperty<string>;
  'noVectorSelected': string;
  'noVectorSelectedStringProperty': LinkableProperty<string>;
  'vectorValues': string;
  'vectorValuesStringProperty': LinkableProperty<string>;
  'symbol': {
    'x': string;
    'xStringProperty': LinkableProperty<string>;
    'y': string;
    'yStringProperty': LinkableProperty<string>;
  };
  'baseVectors': string;
  'baseVectorsStringProperty': LinkableProperty<string>;
  'equation': string;
  'equationStringProperty': LinkableProperty<string>;
};

const VectorAdditionStrings = getStringModule( 'VECTOR_ADDITION' ) as StringsType;

vectorAddition.register( 'VectorAdditionStrings', VectorAdditionStrings );

export default VectorAdditionStrings;
