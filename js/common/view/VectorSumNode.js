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
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorNode = require( 'VECTOR_ADDITION/common/view/VectorNode' );
  const VectorTypes = require( 'VECTOR_ADDITION/common/model/VectorTypes' );

  // constants
  const VECTOR_GROUP_1_SUM = VectorAdditionConstants.VECTOR_GROUP_1.sumOptions;
  const VECTOR_GROUP_2_SUM = VectorAdditionConstants.VECTOR_GROUP_2.sumOptions;

  class VectorSumNode extends VectorNode {
    /**
     * @constructor
     * @param {VectorModel} vectorModel- the vector model
     * @param {Bounds2} graphModelBounds - the bounds to the graph
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty - property for the different component styles
     * @param {BooleanProperty} angleVisibleProperty - property for when the angle is visible
     * @param {VectorOrientations} vectorOrientation - Orientation mode of the vectors
     * @param {Property.<ModelViewTransform2>} modelViewTransformProperty - property for the coordinate transform
     * between model coordinates and view coordinates
     */
    constructor( vectorModel, 
                 graphModelBounds,
                 componentStyleProperty,
                 angleVisibleProperty,
                 vectorOrientation,
                 modelViewTransformProperty
                 ) {

      let arrowOptions;
      switch( vectorModel.vectorType ) {
        case VectorTypes.ONE: {
          arrowOptions = VECTOR_GROUP_1_SUM;
          break;
        }
        case VectorTypes.TWO: {
          arrowOptions = VECTOR_GROUP_2_SUM;
          break;
        }
        default: {
          throw new Error( `Vector Type : ${ vectorModel.vectorType } not handled` );
        }
      }
      super( vectorModel, 
             graphModelBounds,
             componentStyleProperty,
             angleVisibleProperty,
             vectorOrientation,
             modelViewTransformProperty,
             arrowOptions ); 
      

    }
  }

  return vectorAddition.register( 'VectorSumNode', VectorSumNode );
} );