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
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );

  // constants
  const PANEL_OPTIONS = VectorAdditionConstants.VECTOR_BOX_OPTIONS;
  const ICON_ARROW_OPTIONS = {
    fill: VectorAdditionColors.LIGHT_BLUE_VECTOR_COLOR,
    lineWidth: 0,
    tailWidth: 4,
    headWidth: 10.5,
    headHeight: 6,
    cursor: 'pointer'
  };

  class Explore1DVectorPanels {
    /**
     * @constructor
     * @param {ObservableArray.<Vector>} vectorArray - the observable array to add the vector's to.
     * @param {Property.<ModelViewTransform2>} modelViewTransformProperty - the property of the model - view coordinate transformation
     */
    constructor( horizontalVectorArray, horizontalModelViewTransformProperty, verticalVectorArray, verticalModelViewTransformProperty  ) {
      this.horizontalVectorPanel = new HorizontalVectorPanel( horizontalVectorArray, horizontalModelViewTransformProperty );
      this.verticalVectorPanel = new VerticalVectorPanel( verticalVectorArray, verticalModelViewTransformProperty );
    }

  }
  class HorizontalVectorPanel extends VectorPanel {
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
    createVectorIcon( slotNumber ) { return new ArrowNode( 0, 0, 30, 0, ICON_ARROW_OPTIONS ); }
    createVectorRepresentationArrow() {return new ArrowNode( 0, 0, 12.5 * 5, 0 ); }
    getDefaultVectorComponents() { return new Vector2( 5, 0 ); }

  }
  class VerticalVectorPanel extends VectorPanel {
    /**
     * @abstract
     * @constructor
     * @param {ObservableArray.<Vector>} vectorArray - the observable array to add the vector's to.
     * @param {Property.<ModelViewTransform2>} modelViewTransformProperty - the property of the model - view coordinate transformation
     */
    constructor( vectorArray, modelViewTransformProperty ) {

      super( vectorArray, 3, modelViewTransformProperty, {
        labels: [ 'd', 'e', 'f' ],
        panelOptions: PANEL_OPTIONS
      } );
    }
    createVectorIcon( slotNumber ) { return new ArrowNode( 0, 0, 0, -30, ICON_ARROW_OPTIONS ); }
    createVectorRepresentationArrow() {return new ArrowNode( 0, 0, 0, -12.5 * 5, ); }
    getDefaultVectorComponents() { return new Vector2( 0, 5 ); }

  }
  return vectorAddition.register( 'Explore1DVectorPanels', Explore1DVectorPanels );
} );

