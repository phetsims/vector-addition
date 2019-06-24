// Copyright 2019, University of Colorado Boulder

/**
 * View for a vector sum.
 *
 * @author Brandon Li
 */
define( require => {
  'use strict';

  // modules
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorGroups = require( 'VECTOR_ADDITION/common/model/VectorGroups' );
  const VectorNode = require( 'VECTOR_ADDITION/common/view/VectorNode' );

  // constants
  const VECTOR_GROUP_1_SUM = _.extend( {}, VectorAdditionConstants.VECTOR_OPTIONS, {
    fill: VectorAdditionColors.VECTOR_GROUP_1_COLORS.sum,
    lineWidth: 1
  } );
  const VECTOR_GROUP_2_SUM = _.extend( {}, VectorAdditionConstants.VECTOR_OPTIONS, {
    fill: VectorAdditionColors.VECTOR_GROUP_2_COLORS.sum,
    lineWidth: 1
  } );

  class VectorSumNode extends VectorNode {
    /**
     * @constructor
     * @param {VectorModel} vectorModel- the vector model
     * @param {Bounds2} graphModelBounds - the bounds to the graph
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty - property for the different component styles
     * @param {BooleanProperty} angleVisibleProperty - property for when the angle is visible
     * @param {GraphOrientations} graphOrientation - Orientation mode of the vectors
     * @param {Property.<ModelViewTransform2>} modelViewTransformProperty - property for the coordinate transform
     * between model coordinates and view coordinates
     * @param {BooleanProperty} valuesVisibleProperty
     */
    constructor( vectorModel,
                 graphModelBounds,
                 componentStyleProperty,
                 angleVisibleProperty,
                 graphOrientation,
                 modelViewTransformProperty,
                 valuesVisibleProperty
    ) {

      let arrowOptions;
      switch( vectorModel.vectorGroup ) {
        case VectorGroups.ONE: {
          arrowOptions = VECTOR_GROUP_1_SUM;
          break;
        }
        case VectorGroups.TWO: {
          arrowOptions = VECTOR_GROUP_2_SUM;
          break;
        }
        default: {
          throw new Error( `Vector Group : ${vectorModel.vectorGroup} not handled` );
        }
      }
      super( vectorModel,
        graphModelBounds,
        componentStyleProperty,
        angleVisibleProperty,
        graphOrientation,
        modelViewTransformProperty,
        valuesVisibleProperty,
        arrowOptions );

    }
  }

  return vectorAddition.register( 'VectorSumNode', VectorSumNode );
} );