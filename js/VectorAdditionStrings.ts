// Copyright 2021-2024, University of Colorado Boulder

/* eslint-disable */
/* @formatter:off */

/**
 * Auto-generated from modulify, DO NOT manually modify.
 */

import getStringModule from '../../chipper/js/getStringModule.js';
import type LocalizedStringProperty from '../../chipper/js/LocalizedStringProperty.js';
import vectorAddition from './vectorAddition.js';

type StringsType = {
  'vector-addition': {
    'title': string;
    'titleStringProperty': LocalizedStringProperty;
  };
  'screen': {
    'equations': string;
    'equationsStringProperty': LocalizedStringProperty;
    'explore1D': string;
    'explore1DStringProperty': LocalizedStringProperty;
    'explore2D': string;
    'explore2DStringProperty': LocalizedStringProperty;
    'lab': string;
    'labStringProperty': LocalizedStringProperty;
  };
  'sum': string;
  'sumStringProperty': LocalizedStringProperty;
  'values': string;
  'valuesStringProperty': LocalizedStringProperty;
  'components': string;
  'componentsStringProperty': LocalizedStringProperty;
  'noVectorSelected': string;
  'noVectorSelectedStringProperty': LocalizedStringProperty;
  'vectorValues': string;
  'vectorValuesStringProperty': LocalizedStringProperty;
  'symbol': {
    'x': string;
    'xStringProperty': LocalizedStringProperty;
    'y': string;
    'yStringProperty': LocalizedStringProperty;
  };
  'baseVectors': string;
  'baseVectorsStringProperty': LocalizedStringProperty;
  'equation': string;
  'equationStringProperty': LocalizedStringProperty;
};

const VectorAdditionStrings = getStringModule( 'VECTOR_ADDITION' ) as StringsType;

vectorAddition.register( 'VectorAdditionStrings', VectorAdditionStrings );

export default VectorAdditionStrings;
