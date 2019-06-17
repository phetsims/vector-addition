// Copyright 2019, University of Colorado Boulder

/**
 * View for the panel with vectors to drag into the screen. This class extends the common abstract vectorCreator panel.
 *
 * @author Brandon Li
 */
define( require => {
  'use strict';

  // modules
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const Vector2 = require( 'DOT/Vector2' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorTypes = require( 'VECTOR_ADDITION/common/model/VectorTypes' );
  const VectorCreatorPanel = require( 'VECTOR_ADDITION/common/view/VectorCreatorPanel' );

  // constants
  const BLUE_ICON_OPTIONS = { // this should be in constants file
    fill: 'blue',
    lineWidth: 0,
    tailWidth: 4,
    headWidth: 10.5,
    headHeight: 6,
    cursor: 'pointer'
  };
  const RED_ICON_OPTIONS = {
    fill: 'red',
    lineWidth: 0,
    tailWidth: 4,
    headWidth: 10.5,
    headHeight: 6,
    cursor: 'pointer'
  };
  const PANEL_OPTIONS = VectorAdditionConstants.VECTOR_BOX_OPTIONS;
  const VECTOR_TYPES = [ VectorTypes.ONE, VectorTypes.TWO ];

  class LabVectorCreatorPanel extends VectorCreatorPanel {
    /**
     * @abstract
     * @constructor
     * @param {ObservableArray.<VectorModel>} vectorArray1 - the observable array for vector1.
     * @param {ObservableArray.<VectorModel>} vectorArray2 - the observable array for vector2
     * @param {Property.<ModelViewTransform2>} modelViewTransformProperty - the property of the model - view coordinate transformation
     */
    constructor( vectorArray1, vectorArray2, modelViewTransformProperty, componentStyleProperty ) {

      super( _, 2, modelViewTransformProperty,componentStyleProperty, _, {
        panelOptions: PANEL_OPTIONS,
        observableArrays: [ vectorArray1, vectorArray2 ],
        includeLabelsNextToIcons: false,
        isVectorSlotInfinite: true,
        vectorTypes: VECTOR_TYPES
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
      // TODO find a better way to do this
      if ( slotNumber === 0 ) {
        return new ArrowNode( 0, 0, 30, -30, BLUE_ICON_OPTIONS );
      }
      else {
        return new ArrowNode( 0, 0, 30, -30, RED_ICON_OPTIONS );
      }
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

  return vectorAddition.register( 'LabVectorCreatorPanel', LabVectorCreatorPanel );
} );

