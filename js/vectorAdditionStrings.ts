// Copyright 2021-2022, University of Colorado Boulder

/**
 * Auto-generated from modulify, DO NOT manually modify.
 */
/* eslint-disable */
import getStringModule from '../../chipper/js/getStringModule.js';
import vectorAddition from './vectorAddition.js';

type StringsType = {
  'vector-addition': {
    'title': string;
  };
  'screen': {
    'equations': string;
    'explore1D': string;
    'explore2D': string;
    'lab': string;
  };
  'sum': string;
  'values': string;
  'components': string;
  'noVectorSelected': string;
  'vectorValues': string;
  'symbol': {
    'x': string;
    'y': string;
  };
  'baseVectors': string;
  'equation': string;
};

const vectorAdditionStrings = getStringModule( 'VECTOR_ADDITION' ) as StringsType;

vectorAddition.register( 'vectorAdditionStrings', vectorAdditionStrings );

export default vectorAdditionStrings;
