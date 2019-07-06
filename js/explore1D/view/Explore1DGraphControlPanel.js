// Copyright 2019, University of Colorado Boulder

/**
 * View for the Panel that appears on the upper-right corner of the 'Explore1D' screen.
 *
 * Explore 1D has 2 scenes: a horizontal and a vertical scene. Both scenes share a single sum visible property.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Checkbox = require( 'SUN/Checkbox' );
  const Panel = require( 'SUN/Panel' );
  const SumCheckbox = require( 'VECTOR_ADDITION/common/view/SumCheckbox' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionIconFactory = require( 'VECTOR_ADDITION/common/view/VectorAdditionIconFactory' );
  const VectorGroups = require( 'VECTOR_ADDITION/common/model/VectorGroups' );

  // strings
  const valuesString = require( 'string!VECTOR_ADDITION/values' );

  // constants
  const CHECKBOX_OPTIONS = VectorAdditionConstants.CHECKBOX_OPTIONS;
  const PANEL_OPTIONS = VectorAdditionConstants.PANEL_OPTIONS;
  const PANEL_FONT = VectorAdditionConstants.PANEL_FONT;
  const CONTROL_PANEL_LAYOUT_BOX_OPTIONS = VectorAdditionConstants.CONTROL_PANEL_LAYOUT_BOX_OPTIONS;


  class Explore1DGraphControlPanel extends Panel {
    /**
     * @constructor
     * @param {BooleanProperty} sumVisibleProperty
     * @param {BooleanProperty} valuesVisibleProperty
     * @param {BooleanProperty} gridVisibleProperty
     * @param {VectorGroups} vectorGroup
     * @param {Object} [options]
     */
    constructor( sumVisibleProperty, valuesVisibleProperty, gridVisibleProperty, vectorGroup, options ) {

      // Type check arguments
      assert && assert( sumVisibleProperty instanceof BooleanProperty,
        `invalid sumVisibleProperty: ${sumVisibleProperty}` );
      assert && assert( valuesVisibleProperty instanceof BooleanProperty,
        `invalid valuesVisibleProperty: ${valuesVisibleProperty}` );
      assert && assert( gridVisibleProperty instanceof BooleanProperty,
        `invalid gridVisibleProperty: ${gridVisibleProperty}` );
      assert && assert( VectorGroups.includes( vectorGroup ), `invalid vectorGroup: ${vectorGroup}` );

      //----------------------------------------------------------------------------------------

      options = _.extend( {}, PANEL_OPTIONS, options );

      const panelContent = new VBox( _.extend( {}, CONTROL_PANEL_LAYOUT_BOX_OPTIONS, {
        children: [
          new SumCheckbox( sumVisibleProperty, vectorGroup ),

          // Values checkbox
          new Checkbox( new Text( valuesString, { font: PANEL_FONT } ),
            valuesVisibleProperty,
            CHECKBOX_OPTIONS ),

          // Grid checkbox
          new Checkbox( VectorAdditionIconFactory.createGridIcon(),
            gridVisibleProperty,
            CHECKBOX_OPTIONS )
        ]
      } ) );

      super( panelContent, options );
    }
  }

  return vectorAddition.register( 'Explore1DGraphControlPanel', Explore1DGraphControlPanel );
} );