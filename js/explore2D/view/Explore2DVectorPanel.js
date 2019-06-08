// Copyright 2019, University of Colorado Boulder

/**
 * View for the panel with vectors to drag into the screen. This class extends the common abstract vector panel.
 *
 * @author Brandon Li
 */
define( require => {
  'use strict';

  // modules
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const Vector2 = require( 'DOT/Vector2' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorPanel = require( 'VECTOR_ADDITION/common/view/VectorPanel' );

  // constants

  class Explore2DVectorPanel extends VectorPanel {
    /**
     * @abstract
     * @constructor
     * @param {ObservableArray.<Vector>} vectorArray - the observable array to add the vector's to.
     * @param {Property.<ModelViewTransform2>} modelViewTransformProperty - the property of the model - view coordinate transformation
     */
    constructor( vectorArray, modelViewTransformProperty ) {
      super( vectorArray, 3, modelViewTransformProperty, {
        labels: [ 'a', 'b', 'c' ]
      } );
    }

    /**
     * @abstract
     * Create an arrow node that is the vector icon
     * @param {number} slotNumber
     * @returns {ArrowNode}
     * @public
     */
    createVectorIcon( slotNumber ) {
      return new ArrowNode( 0, 0, 30, -30 );
    }

    /**
     * @abstract
     * Create an arrow node that is the arrow node when dragging onto the screen (vector representation arrow)
     * @returns {ArrowNode}
     * @public
     */
    createVectorRepresentationArrow() {
      return new ArrowNode( 0, 0, 12.5 * 5, -12.5 * 5 );
    }

    /**
     * @abstract
     * Get the default vector components for when the vector is released onto the graph (model coordinates)
     * @returns {Vector2}
     * @public
     */
    getDefaultVectorComponents() {
      return new Vector2( 5, 5 );
    }

  }

  return vectorAddition.register( 'Explore2DVectorPanel', Explore2DVectorPanel );
} );

