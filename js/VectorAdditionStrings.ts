// Copyright 2021-2025, University of Colorado Boulder

/* eslint-disable */
/* @formatter:off */

/**
 * Auto-generated from modulify, DO NOT manually modify.
 */

import getStringModule from '../../chipper/js/browser/getStringModule.js';
import type LocalizedStringProperty from '../../chipper/js/browser/LocalizedStringProperty.js';
import vectorAddition from './vectorAddition.js';

type StringsType = {
  'vector-addition': {
    'titleStringProperty': LocalizedStringProperty;
  };
  'screen': {
    'equationsStringProperty': LocalizedStringProperty;
    'explore1DStringProperty': LocalizedStringProperty;
    'explore2DStringProperty': LocalizedStringProperty;
    'labStringProperty': LocalizedStringProperty;
  };
  'sumStringProperty': LocalizedStringProperty;
  'valuesStringProperty': LocalizedStringProperty;
  'componentsStringProperty': LocalizedStringProperty;
  'noVectorSelectedStringProperty': LocalizedStringProperty;
  'vectorValuesStringProperty': LocalizedStringProperty;
  'symbol': {
    'xStringProperty': LocalizedStringProperty;
    'yStringProperty': LocalizedStringProperty;
  };
  'baseVectorsStringProperty': LocalizedStringProperty;
  'equationStringProperty': LocalizedStringProperty;
  'angleConventionStringProperty': LocalizedStringProperty;
  'angleConventionDescriptionStringProperty': LocalizedStringProperty;
  'signedPatternStringProperty': LocalizedStringProperty;
  'unsignedPatternStringProperty': LocalizedStringProperty;
};

const VectorAdditionStrings = getStringModule( 'VECTOR_ADDITION' ) as StringsType;

vectorAddition.register( 'VectorAdditionStrings', VectorAdditionStrings );

export default VectorAdditionStrings;
