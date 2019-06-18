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
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorTypes = require( 'VECTOR_ADDITION/common/model/VectorTypes' );
  const VectorCreatorPanel = require( 'VECTOR_ADDITION/common/view/VectorCreatorPanel' );

  // constants
  const PANEL_OPTIONS = VectorAdditionConstants.VECTOR_BOX_OPTIONS;
  const ICON_ARROW_OPTIONS = {
    fill: 'black',
    lineWidth: 0,
    tailWidth: 4,
    headWidth: 10.5,
    headHeight: 6,
    cursor: 'pointer'
  };

  class Explore1DVectorCreatorPanels {
    /**
     * @constructor
     * @param {ObservableArray.<VectorModel>} horizontalVectors - the observable array to add the horizontal vector's to.
     * @param {Property.<ModelViewTransform2>} horizontalModelViewTransformProperty - the property of the model - view coordinate transformation
     * @param {ObservableArray.<VectorModel>} verticalVectors - the observable array to add the vertical vector's to.
     * @param {Property.<ModelViewTransform2>} verticalModelViewTransformProperty - the property of the model - view coordinate transformation
     */
    constructor( horizontalVectors,
                 horizontalModelViewTransformProperty,
                 verticalVectors,
                 verticalModelViewTransformProperty,
                 componentStyleProperty ) {

      this.horizontalVectorCreatorPanel = new HorizontalVectorCreatorPanel( horizontalVectors,
        horizontalModelViewTransformProperty, componentStyleProperty );

      this.verticalVectorCreatorPanel = new VerticalVectorCreatorPanel( verticalVectors,
        verticalModelViewTransformProperty, componentStyleProperty );
    }

  }

  class HorizontalVectorCreatorPanel extends VectorCreatorPanel {
    /**
     * @abstract
     * @constructor
     * @param {ObservableArray.<VectorModel>} vectors - the observable array to add the vector's to.
     * @param {Property.<ModelViewTransform2>} modelViewTransformProperty - the property of the model - view coordinate transformation
     * @param {Property.<ComponentStyles>} componentStyleProperty
     */
    constructor( vectors, modelViewTransformProperty, componentStyleProperty ) {

      super( vectors, 3, modelViewTransformProperty, componentStyleProperty, VectorTypes.ONE, {
        labels: [ 'a', 'b', 'c' ],
        panelOptions: PANEL_OPTIONS
      } );
    }

    createVectorIcon( slotNumber ) { return new ArrowNode( 0, 0, 30, 0, ICON_ARROW_OPTIONS ); }

    createVectorRepresentationArrow() {return new ArrowNode( 0, 0, 12.5 * 5, 0 ); }

    getDefaultVectorComponents() { return new Vector2( 5, 0 ); }

  }

  class VerticalVectorCreatorPanel extends VectorCreatorPanel {
    /**
     * @abstract
     * @constructor
     * @param {ObservableArray.<VectorModel>} vectors - the observable array to add the vector's to.
     * @param {Property.<ModelViewTransform2>} modelViewTransformProperty - the property of the model - view coordinate transformation
     * @param {Property.<ComponentStyles>} componentStyleProperty
     */
    constructor( vectors, modelViewTransformProperty, componentStyleProperty ) {

      super( vectors, 3, modelViewTransformProperty, componentStyleProperty, VectorTypes.ONE, {
        labels: [ 'd', 'e', 'f' ],
        panelOptions: PANEL_OPTIONS
      } );
    }

    createVectorIcon( slotNumber ) { return new ArrowNode( 0, 0, 0, -30, ICON_ARROW_OPTIONS ); }

    createVectorRepresentationArrow() {return new ArrowNode( 0, 0, 0, -12.5 * 5, ); }

    getDefaultVectorComponents() { return new Vector2( 0, 5 ); }

  }

  return vectorAddition.register( 'Explore1DVectorCreatorPanels', Explore1DVectorCreatorPanels );
} );

