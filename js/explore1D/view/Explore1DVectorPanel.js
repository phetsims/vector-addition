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
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );

  // constants
  const PANEL_OPTIONS = VectorAdditionConstants.VECTOR_BOX_OPTIONS;

  class Explore1DVectorPanel extends VectorPanel {
    /**
     * @abstract
     * @constructor
     * @param {ObservableArray.<Vector>} vectorArray - the observable array to add the vector's to.
     * @param {Property.<ModelViewTransform2>} modelViewTransformProperty - the property of the model - view coordinate transformation
     */
    constructor( vectorArray, modelViewTransformProperty ) {
      super( vectorArray, 3, modelViewTransformProperty, {
        labels: [ 'a', 'b', 'c' ],
        panelOptions: PANEL_OPTIONS
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
      return new ArrowNode( 0, 0, 30, 0 );
    }

    /**
     * @abstract
     * Create an arrow node that is the arrow node when dragging onto the screen (vector representation arrow)
     * @returns {ArrowNode}
     * @public
     */
    createVectorRepresentationArrow() {
      return new ArrowNode( 0, 0, 12.5 * 5, 0 );
    }

    /**
     * @abstract
     * Get the default vector components for when the vector is released onto the graph (model coordinates)
     * @returns {Vector2}
     * @public
     */
    getDefaultVectorComponents() {
      return new Vector2( 5, 0 );
    }

  }

  return vectorAddition.register( 'Explore1DVectorPanel', Explore1DVectorPanel );
} );

